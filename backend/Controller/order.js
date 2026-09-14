const express = require("express");
const router = express.Router();
const ErrorHandler = require("../Utils/ErrorHandler");
const catchAsyncErrors = require("../Middleware/catchAsyncErrors");
const { isAuthenticated, isShop, isAdmin } = require("../Middleware/auth");
const Order = require("../Model/order");
const Shop = require("../Model/shop");
const Product = require("../Model/product");
const sendMail = require("../Utils/sendMail");

// create new order
router.post(
  "/create-order",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;

      //   group cart items by shopId
      const shopItemsMap = new Map();

      for (const item of cart) {
        const shopId = item.shopId;
        if (!shopItemsMap.has(shopId)) {
          shopItemsMap.set(shopId, []);
        }
        shopItemsMap.get(shopId).push(item);
      }

      // create an order for each shop
      const orders = [];

      for (const [shopId, items] of shopItemsMap) {
        const order = await Order.create({
          cart: items,
          shippingAddress,
          user,
          totalPrice,
          paymentInfo,
        });
        orders.push(order);
      }

      // Send confirmation email
      try {
        const orderListHtml = cart.map(item => `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.qty}</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.discountPrice}</td>
          </tr>
        `).join("");

        const mailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="text-align: center; color: #8a11cb;">Order Placed Successfully!</h2>
            <p>Dear ${user.name},</p>
            <p>Thank you for shopping with us! Your order has been successfully placed. Here are the details of your purchase:</p>
            
            <h3 style="border-bottom: 2px solid #8a11cb; padding-bottom: 5px;">Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f2f2f2;">
                  <th style="padding: 10px; text-align: left;">Item</th>
                  <th style="padding: 10px; text-align: center;">Qty</th>
                  <th style="padding: 10px; text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${orderListHtml}
              </tbody>
            </table>
            
            <p style="text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px;">Total Amount: ₹${totalPrice}</p>
            
            <h3 style="border-bottom: 2px solid #8a11cb; padding-bottom: 5px; margin-top: 30px;">Shipping Address</h3>
            <p style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; line-height: 1.6;">
              <strong>${user.name}</strong><br/>
              ${shippingAddress.address1}, ${shippingAddress.address2 || ""}<br/>
              ${shippingAddress.city}, ${shippingAddress.country}<br/>
              Zip Code: ${shippingAddress.zipCode}
            </p>
            
            <p style="color: #777; font-size: 12px; text-align: center; margin-top: 40px; border-top: 1px solid #eee; padding-top: 10px;">
              If you have any questions regarding your order, feel free to contact our support.
            </p>
          </div>
        `;

        await sendMail({
          email: user.email,
          subject: "Order Confirmation - DivineSoul",
          html: mailHtml,
        });
        console.log(`📧 Order confirmation email sent to ${user.email}`);
      } catch (mailError) {
        console.log("❌ Error sending order confirmation email:", mailError.message);
      }

      res.status(201).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get all orders of user
router.get(
  "/get-all-orders/:userId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find({ "user._id": req.params.userId }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get all orders of seller
router.get(
  "/get-seller-all-orders/:shopId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find({
        "cart.shopId": req.params.shopId,
      }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update order status for admin
router.put(
  "/update-order-status/:id",
  isAuthenticated,
  isAdmin("admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }
      // Decrement stock only once when status advances to delivery phase
      const deliveryStatuses = ["Transferred to delivery partner", "Shipping", "Out for Delivery", "Delivered"];
      if (deliveryStatuses.includes(req.body.status) && !order.stockDecremented) {
        order.cart.forEach(async (o) => {
          await updateOrder(o._id, o.qty);
        });
        order.stockDecremented = true;
      }

      order.status = req.body.status;

      if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
        order.paymentInfo.status = "Succeeded";
        const serviceCharge = order.totalPrice * .10;
        await updateSellerInfo(order.totalPrice - serviceCharge);
      }

      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
      });

      // ── Send status update email to customer ─────────────────────────────
      try {
        const statusMessages = {
          "Processing": {
            emoji: "🔄",
            headline: "Your Order is Being Processed",
            message: "Great news! We've received your order and our team is currently processing it. You'll receive another update once your order is shipped.",
            color: "#f59e0b",
          },
          "Transferred to delivery partner": {
            emoji: "🚚",
            headline: "Your Order Has Been Shipped!",
            message: "Your order is on its way! It has been handed over to our delivery partner and will reach you soon. Track your order using the order ID below.",
            color: "#7c3aed",
          },
          "Out for Delivery": {
            emoji: "📦",
            headline: "Out for Delivery Today!",
            message: "Your order is out for delivery and will arrive today. Please ensure someone is available to receive the package.",
            color: "#0ea5e9",
          },
          "Delivered": {
            emoji: "✅",
            headline: "Order Delivered Successfully!",
            message: "Your order has been delivered! We hope you love your purchase. If you have any issues, please contact our support team.",
            color: "#16a34a",
          },
          "Processing refund": {
            emoji: "💸",
            headline: "Refund is Being Processed",
            message: "We've received your refund request and are processing it. You'll receive the amount back within 5-7 business days.",
            color: "#ef4444",
          },
          "Refund Success": {
            emoji: "🎉",
            headline: "Refund Successful!",
            message: "Your refund has been successfully processed. The amount will reflect in your account within 2-3 business days.",
            color: "#16a34a",
          },
          "Refund Rejected": {
            emoji: "❌",
            headline: "Refund Request Rejected",
            message: "Your refund request has been reviewed and rejected by our team. Please check order details or contact support for more information.",
            color: "#dc2626",
          },
        };

        const statusInfo = statusMessages[req.body.status] || {
          emoji: "📋",
          headline: `Order Status Updated: ${req.body.status}`,
          message: `Your order status has been updated to: ${req.body.status}.`,
          color: "#6b7280",
        };

        const productListHtml = order.cart.map(item => `
          <tr>
            <td style="padding:10px 8px; border-bottom:1px solid #f0f0f0; font-size:13px; color:#374151;">${item.name}</td>
            <td style="padding:10px 8px; border-bottom:1px solid #f0f0f0; text-align:center; font-size:13px; color:#374151;">×${item.qty}</td>
            <td style="padding:10px 8px; border-bottom:1px solid #f0f0f0; text-align:right; font-size:13px; font-weight:600; color:#111827;">₹${item.discountPrice || item.originalPrice}</td>
          </tr>
        `).join("");

        const emailHtml = `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
          <body style="margin:0; padding:0; background-color:#f8fafc; font-family:'Segoe UI', Arial, sans-serif;">
            <div style="max-width:600px; margin:32px auto; background:white; border-radius:12px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">
              
              <!-- Header -->
              <div style="background:#0a0a0a; padding:28px 32px; text-align:center;">
                <div style="width:40px; height:40px; background:#7c3aed; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; margin-bottom:12px;">
                  <span style="color:white; font-weight:900; font-size:18px;">D</span>
                </div>
                <h1 style="margin:0; color:white; font-size:20px; font-weight:700; letter-spacing:-0.5px;">DivineSoul</h1>
              </div>

              <!-- Status Banner -->
              <div style="background:${statusInfo.color}15; border-left:4px solid ${statusInfo.color}; padding:20px 32px; margin:0;">
                <div style="font-size:28px; margin-bottom:8px;">${statusInfo.emoji}</div>
                <h2 style="margin:0 0 6px; color:${statusInfo.color}; font-size:18px; font-weight:700;">${statusInfo.headline}</h2>
                <p style="margin:0; color:#6b7280; font-size:13px; line-height:1.6;">${statusInfo.message}</p>
              </div>

              <!-- Content -->
              <div style="padding:24px 32px;">
                <p style="margin:0 0 20px; color:#374151; font-size:14px;">
                  Hi <strong>${order.user?.name || "Customer"}</strong>, here's your order update:
                </p>

                <!-- Order Info -->
                <div style="background:#f9fafb; border-radius:8px; padding:16px; margin-bottom:20px;">
                  <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                    <span style="font-size:12px; color:#9ca3af; font-weight:600; text-transform:uppercase; letter-spacing:0.05em;">Order Status</span>
                    <span style="font-size:13px; font-weight:700; color:${statusInfo.color};">${req.body.status}</span>
                  </div>
                  <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                    <span style="font-size:12px; color:#9ca3af; font-weight:600; text-transform:uppercase; letter-spacing:0.05em;">Order Total</span>
                    <span style="font-size:13px; font-weight:700; color:#111827;">₹${order.totalPrice}</span>
                  </div>
                  <div style="display:flex; justify-content:space-between;">
                    <span style="font-size:12px; color:#9ca3af; font-weight:600; text-transform:uppercase; letter-spacing:0.05em;">Order Date</span>
                    <span style="font-size:13px; color:#374151;">${new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                </div>

                <!-- Products -->
                <h3 style="margin:0 0 12px; font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:#9ca3af;">Items Ordered</h3>
                <table style="width:100%; border-collapse:collapse; margin-bottom:20px;">
                  <thead>
                    <tr style="background:#f9fafb;">
                      <th style="padding:10px 8px; text-align:left; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:#9ca3af;">Product</th>
                      <th style="padding:10px 8px; text-align:center; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:#9ca3af;">Qty</th>
                      <th style="padding:10px 8px; text-align:right; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:#9ca3af;">Price</th>
                    </tr>
                  </thead>
                  <tbody>${productListHtml}</tbody>
                </table>

                <!-- Shipping Address -->
                <h3 style="margin:0 0 10px; font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:#9ca3af;">Shipping To</h3>
                <div style="background:#f9fafb; border-radius:8px; padding:14px; font-size:13px; color:#374151; line-height:1.7;">
                  <strong>${order.shippingAddress?.address1 || ""}</strong>
                  ${order.shippingAddress?.address2 ? ", " + order.shippingAddress.address2 : ""}<br/>
                  ${order.shippingAddress?.city || ""}, ${order.shippingAddress?.country || ""} - ${order.shippingAddress?.zipCode || ""}
                </div>

                <!-- CTA -->
                <div style="text-align:center; margin-top:28px;">
                  <a href="${process.env.FRONTEND_URL}/user/order/${order._id}"
                     style="display:inline-block; background:#7c3aed; color:white; text-decoration:none; padding:12px 28px; border-radius:6px; font-size:13px; font-weight:700; letter-spacing:0.04em; text-transform:uppercase;">
                    View Order Details →
                  </a>
                </div>
              </div>

              <!-- Footer -->
              <div style="background:#f9fafb; padding:20px 32px; text-align:center; border-top:1px solid #f0f0f0;">
                <p style="margin:0 0 6px; font-size:12px; color:#9ca3af;">Questions? Reply to this email or visit our support chat.</p>
                <p style="margin:0; font-size:11px; color:#d1d5db;">© ${new Date().getFullYear()} DivineSoul. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `;

        await sendMail({
          email: order.user?.email,
          subject: `${statusInfo.emoji} Order Update — ${req.body.status} | DivineSoul`,
          html: emailHtml,
        });
        console.log(`📧 Status email [${req.body.status}] sent to ${order.user?.email}`);
      } catch (mailErr) {
        console.log("❌ Status email failed:", mailErr.message);
      }
      // ────────────────────────────────────────────────────────────────────

      async function updateOrder(id, qty) {
        const product = await Product.findById(id);

        product.stock -= qty;
        product.sold_out += qty;

        await product.save({ validateBeforeSave: false });
      }

      async function updateSellerInfo(amount) {
        // Resolve shop from order cart (admin routes don't have req.shop)
        const shopId = order.cart?.[0]?.shopId;
        if (!shopId) return;
        const shop = await Shop.findById(shopId);
        if (shop) {
          shop.availableBalance = (shop.availableBalance || 0) + amount;
          await shop.save();
        }
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


// give a refund ----- user
const upload = require("../multer");
router.put(
  "/order-refund/:id",
  upload.array("refundImages", 3),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }

      order.status = "Processing refund";
      order.refundReason = req.body.refundReason;
      order.refundExplanation = req.body.refundExplanation;

      if (req.files && req.files.length > 0) {
        const imagePaths = req.files.map((file) => file.filename);
        order.refundImages = imagePaths;
      }

      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
        message: "Order Refund requested successfully!",
      });

      // Send refund request email notice to user
      try {
        const emailHtml = `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8"></head>
          <body style="font-family:sans-serif; background:#f4f4f5; padding:20px;">
            <div style="max-width:550px; margin:0 auto; background:white; padding:30px; border-radius:10px; box-shadow:0 2px 10px rgba(0,0,0,0.05);">
              <h2 style="color:#ef4444; margin-top:0;">🔄 Refund Request Initiated</h2>
              <p>Hi ${order.user?.name || "Customer"},</p>
              <p>We have successfully received your refund request for <strong>Order #${order._id.slice(-8)}</strong>.</p>
              
              <div style="background:#f9fafb; padding:15px; border-radius:6px; border-left:4px solid #ef4444; margin:20px 0;">
                <p style="margin:0 0 5px 0; font-size:13px; color:#6b7280; font-weight:600; text-transform:uppercase;">Reason for Return</p>
                <p style="margin:0 0 10px 0; font-size:14px; font-weight:600; color:#111827;">${req.body.refundReason}</p>
                <p style="margin:0 0 5px 0; font-size:13px; color:#6b7280; font-weight:600; text-transform:uppercase;">Explanation</p>
                <p style="margin:0; font-size:14px; color:#374151;">${req.body.refundExplanation || "No additional explanation provided."}</p>
              </div>

              <p style="font-size:13px; color:#6b7280; line-height:1.5;">
                Our support team is reviewing your request. We may contact you shortly. Once the admin changes the status, you will receive an automated update.
              </p>
              
              <hr style="border:none; border-top:1px solid #e4e4e7; margin:20px 0;" />
              <p style="font-size:11px; color:#a1a1aa; text-align:center;">DivineSoul</p>
            </div>
          </body>
          </html>
        `;

        await sendMail({
          email: order.user?.email,
          subject: `🔄 Refund Request Initiated — Order #${order._id.slice(-8)} | DivineSoul`,
          html: emailHtml,
        });
      } catch (mailErr) {
        console.log("❌ Refund email notice failed:", mailErr.message);
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// accept the refund ---- seller
router.put(
  "/order-refund-success/:id",
  isShop,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }

      order.status = req.body.status;

      await order.save();

      res.status(200).json({
        success: true,
        message: "Order Refund successfully!",
      });

      if (req.body.status === "Refund Success") {
        order.cart.forEach(async (o) => {
          await updateOrder(o._id, o.qty);
        });
      }

      async function updateOrder(id, qty) {
        const product = await Product.findById(id);

        product.stock += qty;
        product.sold_out -= qty;

        await product.save({ validateBeforeSave: false });
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// all orders --- for admin
router.get(
  "/admin-all-orders",
  isAuthenticated,
  isAdmin("admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find().sort({
        deliveredAt: -1,
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
