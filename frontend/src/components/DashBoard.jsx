import React, { useState, useEffect } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import MainArea from './MainArea'
import '../css/dashboard.css'
import Profile from './Profile'
import CreateInvoice from './CreateInvoice'
import Invoice from './Invoice'
import Items from './Items'


export default function DashBoard() {
  const [isActive, setIsActive] = useState("mainarea");


  return (
    <>
      <Header />
      <main>
        <div className='dashboard'>
          <div className='sidebar'>
            <Sidebar setIsActive={setIsActive} />
          </div>
          <div className='mainarea'>
            {isActive === "mainarea" && <MainArea />}
            {isActive === "profile" && <Profile />}
            {isActive === "invoice" && <Invoice />}
            {isActive === "create_invoice" && <CreateInvoice setIsActive={setIsActive} />}
            {isActive === "add_product" && <Items />}
          </div>
        </div>
      </main>
    </>
  )
}
