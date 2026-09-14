import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {deleteEvent} from "../../redux/Actions/event.js";

const CountDown = ({ data }) => {
    const dispatch = useDispatch();
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    const [deleted, setDeleted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        if (!deleted &&
            typeof timeLeft.days === "undefined" &&
            typeof timeLeft.hours === "undefined" &&
            typeof timeLeft.minutes === "undefined" &&
            typeof timeLeft.seconds === "undefined"
        ) {
            dispatch(deleteEvent(data._id))
                .then(() => {
                    setDeleted(true);
                })
                .catch((error) => {
                    console.error("Delete event failed:", error);
                });
        }

        return () => clearTimeout(timer);
    }, [timeLeft, deleted, dispatch, data._id]);

    function calculateTimeLeft() {
        const difference = +new Date(data.endDate) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }

        return timeLeft;
    }

    return (
        <div className="flex gap-2 lg:gap-3">
            {Object.keys(timeLeft).map((interval) => (
                <div
                    key={interval}
                    className="flex flex-col items-center bg-gradient-to-b from-gray-50 to-white p-3 rounded-xl w-20 shadow-md border border-gray-100"
                >
          <span
              className="text-2xl lg:text-3xl font-bold mb-1 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {timeLeft[interval]?.toString().padStart(2, "0") || "00"}
          </span>
                    <span className="text-xs uppercase tracking-wider font-semibold text-gray-500">
            {interval}
          </span>
                </div>
            ))}
        </div>
    );
};

export default CountDown;