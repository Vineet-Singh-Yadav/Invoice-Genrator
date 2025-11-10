import React from 'react'
import { useState } from 'react'
import logo from "../assets/invoicelogo.png"
import '../css/login.css'
import { useNavigate } from 'react-router-dom'


export default function Signup() {
    const navigate = useNavigate();
    const [credential, setCredential] = useState({ name: "", email: "", password: "", cpassword: "" });
    const [showPassword, setShowPassword] = useState(false);

    function handleChange(e) {
        setCredential({ ...credential, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (credential.password !== credential.cpassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/auth/register", { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: credential.name,
                    email: credential.email,
                    password: credential.password
                }),
            });

            const json = await response.json();

            if (json.success) {
                localStorage.setItem('token', json.authToken);
                alert(json.message);
                navigate("/");
            } else {
                alert(json.message || "Invalid credentials!");
            }
            
        } catch (error) {
            alert("Something went wrong. Please try again!");
        }

    }

    return (
        <main>
        <div className='auth'>
            <div className='heading'>
            <img className='logo siteLogo' src={logo} alt="Logo"/>
            <h2>Create Account</h2>
            <p>join invonex today</p>
            </div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name"><i className="bi bi-person"></i> Full Name</label>
                <input type="text" name='name' onChange={handleChange} placeholder='Enter your full name' required />
                <label htmlFor="email"><i className="bi bi-envelope"></i> Email</label>
                <input type="email" name='email' onChange={handleChange} placeholder='Enter your email' required />
                <label htmlFor="password"><i className="bi bi-lock"></i> Password</label>
                <input type={showPassword ? 'text' : 'password'} minLength={6} name='password' onChange={handleChange} placeholder='Create a password' required/>
                <label htmlFor="cpassword"><i className="bi bi-lock"></i> Confirm Password</label>
                <input type={showPassword ? 'text' : 'password'} minLength={6} name='cpassword' onChange={handleChange} placeholder='Confirm password' required/>
                {showPassword ? <i onClick={()=>setShowPassword(false)} className="bi bi-eye-slash"> Hide Password</i>:<i onClick={()=>setShowPassword(true)} className="bi bi-eye"> Show Password</i> }
                <button>Create Account</button>
            </form>
            <hr/>
            <p>Already have an account? <span className='logIn' onClick={()=>navigate("/login")}>Sign in</span></p>
        </div>
        </main>
    )
}
