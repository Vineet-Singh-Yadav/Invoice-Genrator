import { useState } from 'react';
import './App.css'
import DashBoard from './components/DashBoard';
import Landing from './components/Landing';
import LearnMore from './components/LearnMore';
import Login from './components/Login'
import Signup from './components/Signup'
import Home from './components/Home.jsx'
import "bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import InvoicePreview from './components/InvoicePreview';
import InvoiceFunctions from './components/contextApi/InvoiceFunctions.jsx';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {

  return (
    <BrowserRouter>
      <>
        <ToastContainer
          position="top-center"
          autoClose={2000}
          theme="light"
          hideProgressBar={true}
          closeOnClick
          pauseOnHover={false}
          draggable={false}
        />

        <InvoiceFunctions>
          <Routes>

            <Route path="/" element={<Home />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/dashboard" element={<DashBoard />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/learnMore" element={<LearnMore />} />
            <Route path='/invoicePreview' element={<InvoicePreview />} />
            {/* New route for shared URL */}
            <Route path='/invoice/:invNum' element={<InvoicePreview />} />

          </Routes>
        </InvoiceFunctions>
      </>
    </BrowserRouter>
  )
}

export default App
