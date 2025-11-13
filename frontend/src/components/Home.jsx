import React, { useEffect } from 'react'
import DashBoard from './DashBoard.jsx'
import { useNavigate } from 'react-router-dom';


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
