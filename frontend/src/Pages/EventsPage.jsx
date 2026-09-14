import {useSelector} from "react-redux";
import EventCard from "../Components/Events/EventCard";
import Header from "../Components/Layout/Header";
import Footer from "../Components/Layout/Footer.jsx";
import styles from "../Styles/Styles.jsx";
import Loader from "../Components/Layout/Loader";
import {useEffect} from "react";
import {Link} from "react-router-dom";

const EventsPage = () => {
    const {allEvents, isLoading} = useSelector((state) => state.events);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            {isLoading ? (
                <Loader/>
            ) : (
                <div>
                    <Header activeHeading={4}/>
                    <div className={`${styles.section} my-8`}>
                        {/* Breadcrumbs */}
                        <nav className="flex mb-4" aria-label="Breadcrumb">
                            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                                <li className="inline-flex items-center">
                                    <Link
                                        to={"/"}
                                        className="inline-flex items-center text-xl font-semibold text-gray-400 hover:text-pink-700"
                                    >
                                        <svg
                                            className="me-2.5 h-4 w-4"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                                        </svg>
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <div className="flex items-center">
                                        <svg
                                            className="h-5 w-5 text-gray-400 rtl:rotate-180"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="m9 5 7 7-7 7"
                                            />
                                        </svg>
                                        <Link
                                            to={"/events"}
                                            className="ms-1 text-xl font-semibold text-gray-600 hover:text-pink-700 md:ms-2"
                                        >
                                            Events
                                        </Link>
                                    </div>
                                </li>
                            </ol>
                        </nav>

                        {/* Events Grid */}
                        <div className="w-full grid gap-6">
                            {allEvents && allEvents.length > 0 ? (
                                allEvents.map((event, index) => (
                                    <EventCard key={event._id} active={index === 0} data={event}/>
                                ))
                            ) : (
                                <h1 className="text-center w-full pb-[75px] text-[20px]">
                                    No Events Available!
                                </h1>
                            )}
                        </div>
                    </div>
                    <Footer/>
                </div>
            )}
        </>
    );
};

export default EventsPage;