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


  return (
    <>
      <Header setIsActive={setIsActive}/>
      <main>
        <div className='dashboard'>
          <div className='sidebar'>
            <Sidebar setIsActive={setIsActive} />
          </div>
          <div className='mainarea'>
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

