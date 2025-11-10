import React, { useState } from 'react'
import ReactModal from "react-modal"
import { useEffect } from 'react';
import "../css/modal.css"

ReactModal.setAppElement("#root");

export default function UpdateUserInfo({ userInfo, fetchUser, setOpenDropdown }) {
  const [modelOpen, setModelOpen] = useState(false);
  const [updateUser, setUpdateUser] = useState({ name: "", email: "" });
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (userInfo) {
      setUpdateUser({
        name: userInfo.name || '',
        email: userInfo.email || '',
      });
    }
  }, [userInfo]);

  const handleChange = (e) => {
    setUpdateUser({ ...updateUser, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/auth/updateUserInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({
          name: updateUser.name,
          email: updateUser.email
        })
      });
      const json = await response.json();
      
      if (json.success) {
        alert(json.message);
        setModelOpen(false);
        setOpenDropdown(false);
        fetchUser();
      } else {
        alert(json.message || "Invalid credentials!");
      }
    } catch (error) {
      alert("Something went wrong. Please try again!");
    }
  }

  function handleClick() {
    setModelOpen(true);
  }

  return (
    <div>

      {userInfo &&
        <>
          <button className='editInfo' onClick={handleClick} title="Edit">🖊️</button>
          <ReactModal isOpen={modelOpen} onRequestClose={() => setModelOpen(false)}>
            <form onSubmit={handleSubmit}>
              <label htmlFor="name">Name</label>
              <input type="text" name='name' value={updateUser.name} onChange={handleChange} />
              <label htmlFor="email">Email</label>
              <input type="email" name='email' value={updateUser.email} onChange={handleChange} />
              <button>Update Details</button>
            </form>
          </ReactModal>
        </>
      }
    </div>
  )
}
