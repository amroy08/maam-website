import {useEffect} from 'react'
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import Signup from "../Components/Signup/Signup.jsx";
import Header from "../Components/Layout/Header.jsx";
import Footer from "../Components/Layout/Footer.jsx";

const SignupPage = () => {
    const navigate = useNavigate();
    const {isAuthenticated} = useSelector((state) => state.user);

    useEffect(() => {
        if (isAuthenticated === true) {
            navigate(`/`);
        }
    });


    return (
        <div>
            <Header activeHeading={0}/>
            <Signup/>
            <Footer/>
        </div>
    )
}

export default SignupPage