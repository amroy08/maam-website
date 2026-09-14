import Lottie from "react-lottie";
import animationData from "./../../Assets/Loader.json";

const Loader = () => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    return (
        <div className="w-full h-screen flex items-center justify-center">
            <Lottie options={defaultOptions} style={{width: "80%", maxWidth: 700, height: "auto"}}/>
        </div>
    );
};

export default Loader;
