import React from 'react'
import InvoiceContext from './InvoiceContext.jsx'
import { useState } from 'react';

export default function InvoiceFunctions(props) {
    const token = localStorage.getItem('token');
     const [ownerPreview, setOwner] = useState({});

      async function fetchOwnerDetails() {
        try {
          const response = await fetch("http://localhost:3000/business/ownerDetails", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": token
            }
          });
    
          const json = await response.json();
    
          if (json.success) {
            setOwner(json.user);
            return (json.user); 
          } else {
            alert(json.message);
          }
    
        } catch (error) {
          alert("Something went wrong. Please try again!");
        }
      }
  return (
    <InvoiceContext.Provider value ={{fetchOwnerDetails, ownerPreview}}>
        {props.children}
    </InvoiceContext.Provider>
  )
}
