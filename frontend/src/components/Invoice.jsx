import React, { useEffect, useState } from 'react'
import "../css/allInvoice.css";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

export default function Invoice({ setIsActive }) {

  const [invoice, setInvoice] = useState([]);
  const token = localStorage.getItem('token')
  const navigate = useNavigate();

  useEffect(() => {
    const shouldOpen = localStorage.getItem("openCreate");

    if (shouldOpen === "true") {
      setIsActive('create_invoice');
      localStorage.removeItem("openCreate");
    }
  }, []);


  async function fetchInvoice() {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_API}/invoice/fetchInvoice`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });
      const json = await response.json();
      if (json.success) {
        setInvoice(json.invoices);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again!");
      console.log(error)
    }
  }

  useEffect(() => {
    fetchInvoice();
  }, []);

  function handleClick(inv) {
    navigate("/invoicePreview", { state: { invoice: inv } });
  }


  function handleShare(inv, e) {
    e.stopPropagation();
    const encodedId = encodeURIComponent(inv.invoiceNumber);
    const shareUrl = `${window.location.origin}/invoice/${encodedId}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Invoice link copied!");
  }

  return (
    <>
      <div className='div-main'>
        <div className='div-main-head'>
          <h2>All Invoices</h2>
          <p>Next Generation Invoicing.</p>
        </div>
        <div>
          <button onClick={() => setIsActive("create_invoice")}>Create Invoice</button>
        </div>
      </div>

      <div className='table-div' >
        <table>
          <thead>
            <tr>
              <th>Invoice Number</th>
              <th>Client</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {invoice.length > 0 ? (
              invoice.map((inv, i) => (
                <tr id='tr' key={i} onClick={() => handleClick(inv)}>

                  <td>{inv.invoiceNumber}</td>
                  <td>{inv.business_name}</td>
                  <td>{inv.grand_total.toFixed(2)}</td>
                  <td>
                    <button onClick={(e) => handleShare(inv, e)}>Share</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td>
                  No Invoices Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
