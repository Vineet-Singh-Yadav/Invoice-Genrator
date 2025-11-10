import React, { useEffect } from 'react'
import DashBoard from './DashBoard.jsx'
import { useNavigate } from 'react-router-dom';
import logo from "../assets/invoicelogo.png";


export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
     if (!token) {
      navigate("/landing");
     }
  }, [navigate]);

  return (
    <div>
      {token?<DashBoard />: null}
    </div>
  )
}
