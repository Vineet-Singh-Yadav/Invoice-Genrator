import React from 'react'
import "../css/slidebar.css"

export default function Sidebar({setIsActive}) {
    const handleLogout = ()=>{
      localStorage.removeItem("token"); 
      toast.success("Logged out successfully!"); 
      navigate("/landing");
      setOpenDropdown(false);
    }
  return (
    <>
      <div className='SI'> 
      <div className='slidebar-item' onClick={()=> setIsActive("invoice")}>Invoices</div>
      <div className='slidebar-item' onClick={()=> setIsActive("profile")}>Business Profile</div>
      <div className='slidebar-item' onClick={()=> setIsActive("create_invoice")}>Create Invoice</div>
      <div className='slidebar-item' onClick={()=> setIsActive("add_product")}>Products/ Services</div>
    </div>  
    <div className='SI'>
      <div className='slidebar-item slide-logout' onClick={handleLogout}>Logout <i className="bi bi-box-arrow-right bi-lg"></i></div>
    </div>
    </>
  )
}
