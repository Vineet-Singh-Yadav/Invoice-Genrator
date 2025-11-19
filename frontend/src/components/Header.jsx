import React, { useEffect, useState } from 'react'
import logo from "../assets/invoicelogo.png";
import UpdateUserInfo from './UpdateUserInfo'
import ChnagePassword from './ChnagePassword';
import '../css/header.css';
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify";

export default function Header({ setIsActive }) {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [openDropdown, setOpenDropdown] = useState(false);
  const token = localStorage.getItem('token');

  const fetchUser = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_API}/auth/getUser`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        }
      });

      const json = await response.json();
      if (json.success) {
        setUserInfo(json.user);
      } else {
        toast.error(json.message);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again!");
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  const firstName = userInfo?.name ? userInfo.name.split(" ")[0] : "";
  const firstLetter = userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : "";
  const fullName = userInfo?.name ? userInfo.name.toUpperCase() : '';

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    navigate("/landing");
    setOpenDropdown(false);
  }

  return (
    <>
      <div className='header'>

        <i class="bi bi-list"></i>
        
        <div className='logo logo-mobile'>
          <img src={logo} alt="logo" />
          <h1>Invonex</h1>
        </div>

        <div className='userInfo'>
          <h4>Welcome back, {firstName}!</h4>
          <p>Here's your invoice overview.</p>
        </div>

        <div className='userDropDown' onClick={() => setOpenDropdown(!openDropdown)}>
          <div className='userDropInfo'>
            <div className='avtar'>{firstLetter}</div>
            <div className='userDropDownInfo'>
              <h4>{fullName}</h4>
              <p>{userInfo.email}</p>
            </div>
          </div>
          <div><button>{openDropdown ? "▲" : "▼"}</button></div>
        </div>

        {openDropdown &&
          <div className='dropDownMenu'>
            <div className='item-menu item'>
              <div>
                <h4>{fullName}</h4>
                <p>{userInfo.email}</p>
              </div>
              <UpdateUserInfo userInfo={userInfo} fetchUser={fetchUser} setOpenDropdown={setOpenDropdown} />
            </div>
            <div className='item-menu' onClick={() => setIsActive('profile')}>Business Profile</div>
            <div className='item-menu'> <ChnagePassword setOpenDropdown={setOpenDropdown} /> </div>
            <div className='logout' onClick={handleLogout}>Logout</div>
          </div>
        }

      </div>
    </>
  )
}


