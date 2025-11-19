import React from 'react'
import "../css/slidebar.css"
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

export default function Sidebar({setIsActive, setShowSidebar}) {
  const navigate = useNavigate();


    const handleLogout = ()=>{
      localStorage.removeItem("token"); 
      toast.success("Logged out successfully!"); 
      navigate("/landing");
    }
  return (
    <>
      <div className='SI'> 
      <div className='slidebar-item' onClick={()=> {setIsActive("invoice"), setShowSidebar(false)}}>Invoices</div>
      <div className='slidebar-item' onClick={()=> {setIsActive("profile"), setShowSidebar(false)}}>Business Profile</div>
      <div className='slidebar-item' onClick={()=> {setIsActive("create_invoice"), setShowSidebar(false)}}>Create Invoice</div>
      <div className='slidebar-item slideItem' onClick={()=> {setIsActive("add_product"), setShowSidebar(false)}}>Products/ Services</div>
    </div>  
    <div className='SI'>
      <div className='slidebar-item slide-logout' onClick={handleLogout}>Logout <i className="bi bi-box-arrow-right bi-lg"></i></div>
    </div>
    </>
  )
}
