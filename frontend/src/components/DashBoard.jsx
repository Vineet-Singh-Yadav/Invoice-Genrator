import React, { useState, useEffect } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import '../css/dashboard.css'
import Profile from './Profile'
import CreateInvoice from './CreateInvoice'
import Invoice from './Invoice'
import Items from './Items'


export default function DashBoard() {
  const [isActive, setIsActive] = useState("invoice");
  const [openDropdown, setOpenDropdown] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <Header setIsActive={setIsActive} setOpenDropdown={setOpenDropdown} openDropdown={openDropdown} showSidebar={showSidebar} setShowSidebar={setShowSidebar}/>
      <main>
        <div className='dashboard'>
          <div className='sidebar'onClick={()=>setOpenDropdown(false)} >
            <Sidebar setIsActive={setIsActive} />
          </div>
          <div className='mainarea' onClick={()=>{setOpenDropdown(false), setShowSidebar(false)}}>
            {isActive === "profile" && <Profile setIsActive={setIsActive}/>}
            {isActive === "invoice" && <Invoice setIsActive={setIsActive} />}
            {isActive === "create_invoice" && <CreateInvoice setIsActive={setIsActive} />}
            {isActive === "add_product" && <Items />}
          </div>
        </div>
      </main>
    </> 
  )
}

