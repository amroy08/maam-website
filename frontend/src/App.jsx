import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {
    ActivationPage,
    LoginPage,
    SignupPage,
    HomePage,
    FAQPage,
    ProductsPage,
    BestSellingPage,
    EventsPage,
    CheckoutPage,
    PaymentPage,
    OrderSuccessPage,
    ProductDetailsPage,
    ProfilePage,
    ShopCreatePage,
    SellerActivationPage,
    ShopLoginPage,
    OrderDetailsPage,
    TrackOrderPage,
    UserInbox

} from './Routes/Routes';
import ProtectedRoute from "./ProtectedRoutes/ProtectedRoute.jsx";
import {ToastContainer} from "react-toastify";
import {useEffect, useState} from "react";
import {loadShop, loadUser} from "./redux/Actions/user.js";
import Store from "./redux/store.js";
import {
    ShopAllCoupons,
    ShopAllEvents,
    ShopAllOrders,
    ShopAllProducts,
    ShopAllRefunds,
    ShopCreateEvents,
    ShopCreateProduct,
    ShopDashboardPage,
    ShopHomePage,
    ShopOrderDetails,
    ShopPreviewPage,
    ShopSettingsPage,
    ShopWithDrawMoneyPage,
    ShopInboxPage

} from "./Routes/ShopRoutes.js";
import ShopProtectedRoute from "./ProtectedRoutes/ShopProtectedRoute.jsx";
import {getAllProducts} from "./redux/Actions/product.js";
import {getAllEvents} from "./redux/Actions/event.js";
import {
    AdminDashboardPage,
    AdminDashboardSellers,
    AdminDashboardUsers,
    AdminDashboardOrders,
    AdminDashboardProducts,
    AdminDashboardEvents,
    AdminDashboardWithdraw,
    AdminDashboardCategories

} from "./Routes/AdminRoutes.js";
import AdminSupportInbox from "./Pages/Admin/AdminSupportInbox.jsx";
import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
import {server} from "./server.jsx";
import axios from "axios";
import AdminProtectedRoute from "./ProtectedRoutes/AdminProtectedRoute.jsx";
import FloatingButtons from "./Components/Layout/FloatingButtons.jsx";
import AdminDashboardHero from "./Pages/Admin/AdminDashboardHero.jsx";
import ForgotPassword from "./Pages/ForgotPassword.jsx";
import ResetPassword from "./Pages/ResetPassword.jsx";

function App() {
    const [stripeApikey, setStripeApikey] = useState("");

    async function getStripeApikey() {
        const {data} = await axios.get(`${server}/payment/stripeApikey`);
        setStripeApikey(data.stripeApikey);
    }

    useEffect(() => {
        Store.dispatch(loadUser());
        Store.dispatch(loadShop());
        Store.dispatch(getAllProducts());
        Store.dispatch(getAllEvents());
        getStripeApikey();
    }, []);

    return (<>
        <Router>
            {stripeApikey && (<Elements stripe={loadStripe(stripeApikey)}>
                <Routes>
                    <Route path="/payment" element={<ProtectedRoute>
                        <PaymentPage/>
                    </ProtectedRoute>}/>
                </Routes>
            </Elements>)}
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/sign-up" element={<SignupPage/>}/>
                <Route path="/forgot-password" element={<ForgotPassword/>}/>
                <Route path="/reset-password/:token" element={<ResetPassword/>}/>
                <Route path="/activation/:activation_token" element={<ActivationPage/>}/>
                <Route path="/shop/activation/:activation_token" element={<SellerActivationPage/>}/>
                <Route path="/best-selling" element={<BestSellingPage/>}/>
                <Route path="/events" element={<EventsPage/>}/>
                <Route path="/faq" element={<FAQPage/>}/>
                <Route path="/products" element={<ProductsPage/>}/>
                <Route path="/product/:id" element={<ProductDetailsPage/>}/>
                <Route path="/checkout" element={<ProtectedRoute>
                    <CheckoutPage/>
                </ProtectedRoute>}/>
                <Route path="/order/success" element={<OrderSuccessPage/>}/>
                <Route
                    path="/profile"
                    element={<ProtectedRoute>
                        <ProfilePage/>
                    </ProtectedRoute>}/>

                <Route
                    path="/inbox"
                    element={
                        <ProtectedRoute>
                            <UserInbox/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/user/order/:id"
                    element={<ProtectedRoute>
                        <OrderDetailsPage/>
                    </ProtectedRoute>}
                />

                <Route
                    path="/user/track/order/:id"
                    element={
                        <ProtectedRoute>
                            <TrackOrderPage/>
                        </ProtectedRoute>
                    }
                />


                {/* _________________________Admin Store Management Routes_______________________ */}
                {/* These are all protected by AdminProtectedRoute - no shop login needed */}

                <Route path="/admin-create-product"
                       element={<AdminProtectedRoute>
                           <ShopCreateProduct/>
                       </AdminProtectedRoute>}/>

                <Route
                    path="/admin-create-event"
                    element={<AdminProtectedRoute>
                        <ShopCreateEvents/>
                    </AdminProtectedRoute>}
                />

                <Route path="/admin-manage-coupons"
                       element={<AdminProtectedRoute>
                           <ShopAllCoupons/>
                       </AdminProtectedRoute>}/>

                <Route
                    path="/admin-refunds"
                    element={
                        <AdminProtectedRoute>
                            <ShopAllRefunds/>
                        </AdminProtectedRoute>
                    }
                />

                {/* _____________________Admin Routes________________________ */}
                <Route
                    path="/admin/dashboard"
                    element={
                        <AdminProtectedRoute>
                            <AdminDashboardPage/>
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/admin-users"
                    element={
                        <AdminProtectedRoute>
                            <AdminDashboardUsers/>
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/admin-sellers"
                    element={
                        <AdminProtectedRoute>
                            <AdminDashboardSellers/>
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/admin-orders"
                    element={
                        <AdminProtectedRoute>
                            <AdminDashboardOrders/>
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/admin-products"
                    element={
                        <AdminProtectedRoute>
                            <AdminDashboardProducts/>
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/admin-events"
                    element={
                        <AdminProtectedRoute>
                            <AdminDashboardEvents/>
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/admin-withdraw-request"
                    element={
                        <AdminProtectedRoute>
                            <AdminDashboardWithdraw/>
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/admin-categories"
                    element={
                        <AdminProtectedRoute>
                            <AdminDashboardCategories/>
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/admin-support-inbox"
                    element={
                        <AdminProtectedRoute>
                            <AdminSupportInbox/>
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/admin-hero-settings"
                    element={
                        <AdminProtectedRoute>
                            <AdminDashboardHero/>
                        </AdminProtectedRoute>
                    }
                />


            </Routes>
            <ToastContainer
                position="top-right"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <FloatingButtons />
        </Router>
    </>);
}

export default App;
