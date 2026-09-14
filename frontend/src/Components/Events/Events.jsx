import {useSelector} from "react-redux";
import styles from "../../Styles/Styles";
import EventCard from "./EventCard";
import {Link} from "react-router-dom";
import Loader from "../Layout/Loader"; // Import the Loader component

const Events = () => {
    const {allEvents, isLoading} = useSelector((state) => state.events);

    // Slice the first 2 events
    const firstEvent = allEvents && allEvents.slice(0, 1);

    return (
        <div>
            <div className={`${styles.section}`}>
                <div className={`${styles.heading} flex justify-between items-end`}>
                    <h1>Popular Events</h1>
                    <div className="flex items-center">
                        <Link
                            to={"/events"}
                            className="ms-1 text-[16px] font-semibold mr-1 text-gray-600 hover:text-teal-500 md:ms-2"
                        >
                            View more
                        </Link>
                        <svg className={"h-7 w-7"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path
                                fill={"teal"}
                                d="m18.707 12.707-3 3a1 1 0 0 1-1.414-1.414L15.586 13H6a1 1 0 0 1 0-2h9.586l-1.293-1.293a1 1 0 0 1 1.414-1.414l3 3a1 1 0 0 1 0 1.414z"
                                data-name="Right"
                            />
                        </svg>
                    </div>
                </div>
                {isLoading ? ( // Show loader if data is loading
                    <Loader/>
                ) : (
                    <div className="w-full grid">
                        {firstEvent && firstEvent.length > 0 ? (
                            firstEvent.map((event, index) => (
                                <EventCard key={event._id} active={index === 0} data={event}/>
                            ))
                        ) : (
                            <p className="text-center text-gray-600">No events available.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Events;