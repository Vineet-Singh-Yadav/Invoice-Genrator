import React, { useEffect, useState } from 'react'
import "../css/allInvoice.css";
import { useNavigate } from 'react-router-dom';

export default function Invoice() {

  const [invoice, setInvoice] = useState([]);
  const token = localStorage.getItem('token')
  const navigate = useNavigate();

  async function fetchInvoice() {
    try {
      const response = await fetch("http://localhost:3000/invoice/fetchInvoice", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });
      const json = await response.json();
      if (json.success) {
        setInvoice(json.invoices);
      } else {
        alert("No Invoice Found")
      }
    } catch (error) {
      alert("Something went wrong. Please try again!");
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
    e.stopPropagation();// prevents opening preview
    const encodedId = encodeURIComponent(inv.invoiceNumber);// to make it collective in url not seprated by "/"
    const shareUrl = `${window.location.origin}/invoice/${encodedId}`;
    navigator.clipboard.writeText(shareUrl);
    alert("Invoice link copied!");
  }

  return (
    <>
      <div className='div-main'>
        <div className='div-main-head'>
          <h2>All Invoices</h2>
          <p>Next Generation Invoicing.</p>
        </div>
        <div>
          <button>Create Invoice</button>
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
                <tr key={i} onClick={() => handleClick(inv)}>

                  <td>{inv.invoiceNumber}</td>
                  <td>{inv.business_name}</td>
                  <td>{inv.grand_total}</td>
                  <td>
                    <button onClick={() => handleEdit(inv)}>Edit</button>
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
