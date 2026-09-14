const Messages = require("../Model/messages");
const ErrorHandler = require("../Utils/ErrorHandler");
const catchAsyncErrors = require("../Middleware/catchAsyncErrors");
const express = require("express");
const upload = require("../multer");
const router = express.Router();

// create new message
router.post(
  "/create-new-message",
  upload.array("images"),
  catchAsyncErrors(async (req, res, next) => {
    try {

      const messageData = req.body;

      if (req.files) {
        const files = req.files;
        const imageUrls = files.map((file) => `${file.fileName}`);
        messageData.images = imageUrls;
      }

      messageData.conversationId = req.body.conversationId;
      messageData.sender = req.body.sender;
      messageData.text = req.body.text;

      const message = new Messages({
        conversationId: messageData.conversationId,
        text: messageData.text,
        sender: messageData.sender,
        images: messageData.images ? messageData.images : undefined,
      });

      await message.save();

      // Send email alert to user if sender is admin
      const ADMIN_ID = process.env.ADMIN_USER_ID;
      if (messageData.sender === ADMIN_ID) {
        try {
          const Conversation = require("../Model/conversation");
          const User = require("../Model/user");
          const sendMail = require("../Utils/sendMail");
          
          const conv = await Conversation.findById(messageData.conversationId);
          const userId = conv?.members.find(m => m !== ADMIN_ID);
          const recipient = await User.findById(userId);

          if (recipient?.email) {
            await sendMail({
              email: recipient.email,
              subject: "New Message from DivineSoul Support",
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                  <h2 style="color: #7c3aed; text-align: center;">New Message from DivineSoul Support</h2>
                  <p>Dear ${recipient.name},</p>
                  <p>You have received a new response regarding your support request:</p>
                  
                  <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; border-left: 4px solid #7c3aed; margin: 20px 0;">
                    <p style="margin: 0; font-style: italic; color: #374151;">"${messageData.text}"</p>
                  </div>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL}/inbox" style="background-color: #7c3aed; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block;">Reply to Support</a>
                  </div>
                  
                  <p style="color: #777; font-size: 11px; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
                    This is an automated notification. Please log in to your account to reply.
                  </p>
                </div>
              `
            });
            console.log(`📧 Support message email sent to ${recipient.email}`);
          }
        } catch (mailErr) {
          console.error("❌ Failed to send support reply email:", mailErr.message);
        }
      }

      res.status(201).json({
        success: true,
        message,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message), 500);
    }
  })
);

// get all messages with conversation id
router.get(
  "/get-all-messages/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const messages = await Messages.find({
        conversationId: req.params.id,
      });

      res.status(201).json({
        success: true,
        messages,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message), 500);
    }
  })
);

module.exports = router;
