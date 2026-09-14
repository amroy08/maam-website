import {Link} from "react-router-dom";

const CheckoutSteps = ({active}) => {
    return (
        <>
            <div className="mx-auto max-w-screen-xl my-4 md:mt-12 px-4 2xl:px-0">
                <div
                    className="flex w-full max-w-2xl items-center text-center text-sm font-medium text-gray-500 sm:text-base">
                    <div className={`relative flex flex-1 items-center after:mx-6 after:hidden after:h-1 after:w-full ${
                        active >= 1
                            ? "text-purple-600 after:border-b-2 after:border-purple-300"
                            : "text-gray-400 after:border-b-2 after:border-gray-200"
                    }  sm:after:inline-block xl:after:mx-10`}>
                        <div className={`flex items-center gap-2 rounded-full px-3 py-2 sm:px-4 sm:py-3 ${
                            active >= 1 ? "bg-purple-100" : "bg-gray-100"
                        }`}>
                            <Link to={"/checkout"} className={`flex items-center gap-2 rounded-full`}>
                                <svg className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg"
                                     width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                </svg>
                                <span className="text-sm font-semibold sm:text-base">Shipping</span>
                            </Link>
                        </div>
                    </div>

                    <div className={`relative flex flex-1 items-center after:mx-6 after:hidden after:h-1 after:w-full ${
                        active > 1
                            ? "text-purple-600 after:border-b-2 after:border-purple-300"
                            : "text-gray-400 after:border-b-2 after:border-gray-200"
                    }  sm:after:inline-block xl:after:mx-10`}>
                        <div className={`flex items-center gap-2 rounded-full px-3 py-2 sm:px-4 sm:py-3 ${
                            active > 1 ? "bg-purple-100" : "bg-gray-100"
                        }`}>
                            <Link to={"#"} className={`flex items-center gap-2 rounded-full`}>
                                <svg className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                     viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                </svg>
                                <span className="text-sm font-semibold sm:text-base">Payment</span>
                            </Link>
                        </div>
                    </div>

                    <div className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 sm:px-5 sm:py-3 cursor-pointer ${
                        active > 2 ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-400"
                    }`}>
                        <svg className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                             viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                        </svg>
                        <span className="text-sm font-semibold sm:text-base">Success</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CheckoutSteps;