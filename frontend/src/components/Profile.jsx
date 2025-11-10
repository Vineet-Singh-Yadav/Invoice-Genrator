import React, { useState } from 'react'
import "../css/profile.css"

export default function Profile() {
  const [profile, setProfile] = useState({business: "", gst:"", address: "", email: "", phone: ""});

  function handleChange(e){
    setProfile({...profile,[e.target.name]: e.target.value});
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const respone = await fetch("http://localhost:3000/business/businessDetails",{
         method:"POST",
         headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
         body:JSON.stringify({
          business: profile.business,
          address: profile.address,
          gst: profile.gst,
          email: profile.email,
          phone: profile.phone,
          logo: profile.logo
         })
      });

      const json = await respone.json();
      console.log(json);
      alert("Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  }
  return (
    <div className='profile'>
      <h2>My Profile</h2>

      <form onSubmit={handleSubmit} >
        <div className='profile-form'>

          <div className='bus-cls'>
            <h3>Business Information</h3>
            <p>This will be used to pre-fill the "Bill Form" section of your invoices.</p>
          </div>

          <label htmlFor="business"><i className="bi bi-building"></i> Bussiness Name</label>
          <input type="text" placeholder='Enter your business name' name='business' onChange={handleChange} required />

          <label htmlFor="gst"><i className="bi bi-cash-coin"></i> GSTIN</label>
          <input type="text" minLength={15} maxLength={15} placeholder='Enter GST number' name='gst' onChange={handleChange}/>

          <label htmlFor="address"><i className="bi bi-geo"></i> Address</label>
          <textarea name="address"  placeholder='xyz, Street- abc, district, state, pincode' onChange={handleChange} required></textarea>

          <label htmlFor="email"><i className="bi bi-envelope"></i> Email Address</label>
          <input type="email" placeholder='Enter your email' name='email' onChange={handleChange} required/>
           
          {/* <div className='pro-last'>
          <div> */}
          <label htmlFor="phone"><i className="bi bi-telephone"></i> Phone</label>
          <input type="tel" maxLength={10} name='phone' placeholder='Enter your phone number' onChange={handleChange} required />
           {/* </div>
           <div>
          <label htmlFor="logo"><i className="bi bi-browser-edge"></i> Logo</label>
          <input type="file" name='logo'/>
          </div>
          </div> */}

        </div>
        <div className='btn-div'>
          <button type='submit' className='btn-profile'>Save Profile</button>
        </div>
      </form>
    </div>
  )
}
