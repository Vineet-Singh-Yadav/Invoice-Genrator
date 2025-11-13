import React from 'react'
import { useState } from 'react'
import ReactModal from 'react-modal'
import "../css/modal.css"
import { toast } from "react-toastify";

export default function ChnagePassword({setOpenDropdown}) {
    const [modalOpen, setModalOpen] = useState(false)
    const [password, setPassword] = useState({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
    const token = localStorage.getItem("token");
    const [showPassword, setShowPassword] = useState(false);

    function handleChange(e) {
        setPassword({ ...password, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (password.newPassword !== password.confirmNewPassword) {
            toast.error( "Passwords do not match!");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_API}/auth/updatePassword`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token,
                },
                body: JSON.stringify({
                    oldPassword: password.oldPassword,
                    password: password.newPassword
                })
            });

            const json = await response.json();
            
            if (json.success) {
                toast.success(json.message);
                setModalOpen(false);
                setOpenDropdown(false);
            } else {
                toast.error( json.message ||"Invalid credentials!");
            }
        } catch (error) {
            toast.error( "Something went wrong. Please try again!");
        }
    }

    

    return (
        <div>
            <button className='editPassword' onClick={() => setModalOpen(true)}>Reset Password</button>
            <ReactModal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)}>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="oldPassword">Current Password</label>
                    <input type={showPassword ? 'text' : 'password'} name="oldPassword" onChange={handleChange} required />
                    <label htmlFor="newPassword">New Password</label>
                    <input type={showPassword ? 'text' : 'password'} minLength={6} name="newPassword" onChange={handleChange} required />
                    <label htmlFor="confirmNewPassword">Re-Enter New Password</label>
                    <input type={showPassword ? 'text' : 'password'} minLength={6} name="confirmNewPassword" onChange={handleChange} required />
                    {showPassword ? <i onClick={()=>setShowPassword(false)} className="bi bi-eye-slash"> Hide Password</i>:<i onClick={()=>setShowPassword(true)} className="bi bi-eye"> Show Password</i> }
                    <button>Reset Password</button>
                </form>
            </ReactModal>
        </div>
    )
}
