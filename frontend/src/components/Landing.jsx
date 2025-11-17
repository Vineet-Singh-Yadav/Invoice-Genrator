import logo from "../assets/invoicelogo.png";
import "../css/landing.css"
import { useNavigate } from 'react-router-dom';
import inv from "../assets/invoice.jpg";


export default function Landing() {
    const navigate = useNavigate();

    return (
        <>
            <div className='landing'>
                <div className='logo'>
                    <img src={logo} alt="logo" />
                    <h1>Invonex</h1>
                </div>

                <div className='authBtn'>
                    <span onClick={() => navigate("/login")}>login</span>
                    <button onClick={() => navigate("/signup")}>Sign Up</button>
                </div>
            </div>

            <div className='centerDiv'>
                <h1>Next Generation Invoicing</h1>
                <div className='subHeading'>
                    <p>Automate your biling, Stay organized and get paid faster</p>
                    <p> -with the power of Invonex</p>
                </div>
                <div className='btn'>
                    <button onClick={() => navigate("/signup")}>Get Started</button>
                    <button onClick={() => navigate("/learnMore")}>Learn More</button>
                </div>
            </div>
            <div className='limg'>
                <img src={inv} alt="Invoice Template" />
            </div>
        </>
    )
}
