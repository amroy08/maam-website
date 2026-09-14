import axios from "axios";
import {useEffect, useState, useRef} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {server} from "../server.jsx";
import {toast} from "react-toastify";
import Header from "../Components/Layout/Header.jsx";
import Footer from "../Components/Layout/Footer.jsx";

const ActivationPage = () => {
    const {activation_token} = useParams();
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(20);
    const activationSent = useRef(false);
    const timerRef = useRef(null); // Ref to store timer interval

    useEffect(() => {
        if (activation_token && !activationSent.current) {
            activationSent.current = true;
            const sendRequest = async () => {
                try {
                    const res = await axios.get(`${server}/user/activation/${activation_token}`);
                    toast.success("Account Activated Successfully! 🎉", {
                        position: "top-right",
                        autoClose: 3000,
                    });

                    // Start countdown timer
                    timerRef.current = setInterval(() => {
                        setCountdown((prev) => {
                            if (prev <= 1) {
                                clearInterval(timerRef.current);
                                navigate("/login");
                                return 0;
                            }
                            return prev - 1;
                        });
                    }, 1000);

                } catch (err) {
                    setError(true);
                    toast.error("Token Expired! ❌", {
                        position: "top-right",
                        autoClose: 3000,
                    });
                }
            };
            sendRequest();
        }

        // Cleanup interval on component unmount
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [activation_token, navigate]);

    return (
        <>
            <Header/>
            <div className="w-full min-h-screen flex flex-col items-center justify-center bg-white text-center p-4">
                <img
                    src="https://img.freepik.com/free-vector/email-campaign-concept-illustration_114360-1681.jpg"
                    alt="Success Animation"
                    className="w-[20rem] h-[20rem] sm:w-[18rem] sm:h-[18rem] md:w-[23rem] md:h-[23rem] lg:w-[30rem] lg:h-[30rem] mx-auto mb-6"
                />
                <div
                    className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-4 sm:p-6 w-full max-w-md md:max-w-lg lg:max-w-xl">
                    {error ? (
                        <div className="font-semibold text-red-600 dark:text-red-400">
                            <p className="text-lg">Your token has expired! ❌</p>
                        </div>
                    ) : (
                        <div className="font-semibold text-green-600 dark:text-green-400">
                            <p className="text-lg">Your account has been created successfully! 🎉</p>
                            <br/>
                            <p className="text-lg">😁😁Login to continue..🎊🎊</p>
                        </div>
                    )}
                    {!error && (
                        <>
                            <p className="mt-4 text-gray-600 dark:text-gray-400">
                                Redirecting to login in{" "}
                                <span className="text-blue-500 font-bold">{countdown}</span> seconds...
                            </p>
                            <button
                                onClick={() => {
                                    navigate("/login");
                                    if (timerRef.current) clearInterval(timerRef.current);
                                }}
                                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2"
                            >
                                Go to Login Now
                            </button>
                        </>
                    )}
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default ActivationPage;