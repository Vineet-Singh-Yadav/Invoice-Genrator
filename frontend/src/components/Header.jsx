import React, { useEffect, useState } from 'react'
import logo from "../assets/invoicelogo.png";
import UpdateUserInfo from './updateUserInfo'
import ChnagePassword from './ChnagePassword';
import '../css/header.css';
import { useNavigate } from "react-router-dom"

export default function Header() {
  const navigate =useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [openDropdown, setOpenDropdown] = useState(false); 
  const token = localStorage.getItem('token');

  const fetchUser = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/getUser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        }
      });

      const json = await response.json();
      setUserInfo(json.user);
    } catch (error) {
      alert("Something went wrong. Please try again!");
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  const firstName = userInfo?.name ? userInfo.name.split(" ")[0] : "";
  const firstLetter = userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : "";
  const fullName = userInfo?.name ? userInfo.name.toUpperCase() : '';

  const handleLogout = ()=>{
    localStorage.removeItem("token"); 
    alert("Logged out successfully!"); 
    navigate("/landing");
    setOpenDropdown(false);
  }

  return (
    <>
      <div className='header'>
        <div className='logo'>
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
          <div><button >{openDropdown ? "▲" : "▼"}</button></div>
        </div>

        {openDropdown &&
          <div className='dropDownMenu'>
            <div className='item-menu item'>
              <div>
                <h4>{fullName}</h4>
                <p>{userInfo.email}</p>
              </div>
              <UpdateUserInfo userInfo={userInfo} fetchUser={fetchUser} setOpenDropdown={setOpenDropdown}/>
            </div>
            <div className='item-menu'>Business Profile</div>
            <div className='item-menu'> <ChnagePassword setOpenDropdown={setOpenDropdown}/> </div>
            <div className='logout' onClick={handleLogout}>Logout</div>
          </div>
        }

      </div>
    </>
  )
}

