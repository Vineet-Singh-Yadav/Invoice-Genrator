import { useState } from "react"
import logo from "../assets/invoicelogo.png"
import '../css/login.css'
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify";

export default function Login() {
    const navigate = useNavigate();
    const [credential, setCredential] = useState({ email: "", password: "" })
    const [showPassword, setShowPassword] = useState(false);

    function handleChange(e) {
        setCredential({ ...credential, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_API}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: credential.email,
                    password: credential.password
                })
            })

            const json = await response.json();

            if (json.success) {
                localStorage.setItem('token', json.authToken);
                toast.success(json.message);
                navigate("/");
            } else {
                toast.error( json.message ||"Invalid credentials!");
            }

        } catch (error) {
            toast.error( "Something went wrong. Please try again!");
        }
    }

    return (
        <>
            <main>
                <div className='auth'>
                    <div className='heading'>
                        <img className='logo siteLogo' src={logo} alt="Logo" />
                        <h2>Login to Your Account</h2>
                        <p>Welcome back to invonex</p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="email"><i className="bi bi-envelope"></i> Email</label>
                        <input type="email" name="email" onChange={handleChange} placeholder='Enter your email' required />
                        <label htmlFor="password"><i className="bi bi-lock"></i> Password</label>

                        <input type={showPassword ? 'text' : 'password'} minLength={6} name="password" onChange={handleChange} placeholder='Enter your password' required />
                        {showPassword ? <i onClick={() => setShowPassword(false)} className="bi bi-eye-slash"> Hide Password</i> : <i onClick={() => setShowPassword(true)} className="bi bi-eye"> Show Password</i>}

                        <button>Submit</button>
                    </form>
                    <hr />
                    <p>Don't have an account? <span className='logIn' onClick={() => navigate("/signup")}>Sign up</span></p>
                </div>
            </main>
        </>
    )
}