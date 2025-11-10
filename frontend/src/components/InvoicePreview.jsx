import React, { useContext, useEffect, useRef, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import InvoiceContext from './contextApi/InvoiceContext';
import '../css/invoicePreview.css'
import logo from "../assets/invoicelogo.png";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


export default function InvoicePreview() {
  const location = useLocation();
  const [invoicePreview, setInvoicePreview] = useState(location.state?.invoice || null);
  const { fetchOwnerDetails, ownerPreview } = useContext(InvoiceContext);//contextApi
  const invoiceRef = useRef();
  const { invNum } = useParams();
  const decodedId = invNum ? decodeURIComponent(invNum) : null;

  const { invoiceNumber, business_name, gst, address, email, phone, items, sub_total, total_discount, total_gst, grand_total, createdAt } = invoicePreview;
  const { business } = ownerPreview;
  const date = new Date(createdAt).toLocaleDateString();

  async function fetchInvoice() {
    try {
      const encodedId = encodeURIComponent(decodedId);
      const response = await fetch(`http://localhost:3000/invoice/getInvoice/${encodedId}`, {
        method: "GET"
      });
      const json = await response.json();

      if (json.success) {
        setInvoicePreview(json.invoice);
      } else {
        alert("Invoice not found!");
      }
    } catch (error) {
      alert("Failed to load invoice");
    }
  }

  useEffect(() => {
    fetchOwnerDetails();

    if (!invoicePreview && invNum) {
      fetchInvoice();
    }
  }, [invNum]);


  if (!invoicePreview) {
    return <p>Loading invoice...</p>;
  }

  const downloadPDF = () => {
    const input = invoiceRef.current;
    html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice_${invoiceNumber}.pdf`);
    });
  };


  const shareInvoice = () => {
    const encodedId = encodeURIComponent(invoiceNumber);
    const shareUrl = `${window.location.origin}/invoice/${encodedId}`;
    navigator.clipboard.writeText(shareUrl);
    alert(" Shareable link copied!");
  };

  return (
    <div className='prv-inv-wrapper'>

      <div style={{ textAlign: 'right', marginBottom: '10px' }}>
        <button onClick={downloadPDF} className="btn btn-primary">
          Download Invoice
        </button>
        <button onClick={shareInvoice} className="btn btn-secondary" style={{ marginLeft: '10px' }}>Copy Share Link</button>
      </div>

      <div className='prv-inv' ref={invoiceRef}>

        <div className='header-style'>
          <div className='prv-header-inv'>
            <img className='logo-img' src={logo} alt="img" />
            <h1>INVOICE</h1>
          </div>
          <div className='div-inv-num'>
            <div>
              <span>Invoice Number : </span>
              <strong>{invoiceNumber}</strong>
            </div>
            <div>
              <span>Date of Issue : </span>
              <strong>{date}</strong>
            </div>
          </div>
        </div>
        <hr />

        <div className='inv-content'>

          <div className='inv details'>
            <div className='inv-owr-name'>
              <span>{business}</span>
              <p>GSTIN : {ownerPreview?.gst?.toUpperCase() || "-"}</p>
            </div>
            <div className='para-div'>
              <div className='inv-ctm-name'>
                <p>Invoice To:</p>
                <hr style={{ backgroundColor: "black", width: '100%' }} />
                <strong>{business_name}</strong>
                <p>GSTIN : {gst.toUpperCase()}</p>
                <p><i className="bi bi-geo-alt-fill"></i> {address}</p>
                <p><i className="bi bi-envelope-fill"></i> {email}</p>
                <p><i className="bi bi-telephone-fill"></i> {phone}</p>
              </div>
            </div>
          </div>

          <table className='inv-table'>
            <thead>
              <tr>
                <th>Item</th>
                <th>Unit Price (₹)</th>
                <th>Quantity</th>
                <th>GST (%)</th>
                <th>Discount (%)</th>
                <th>Total Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((itm, i) => {
                const base = itm.unit_price * itm.quantity;
                const gstAmount = (base * itm.gst_per) / 100;
                const discountAmount = (base * itm.discount) / 100;
                const total = base + gstAmount - discountAmount;

                return (
                  <tr key={i}>
                    <td>{itm.item_name}</td>
                    <td>{itm.unit_price.toFixed(2)}</td>
                    <td>{itm.quantity}</td>
                    <td>{itm.gst_per || "-"}</td>
                    <td>{itm.discount || "-"}</td>
                    <td>{total.toFixed(2)}</td>
                  </tr>
                );
              })}

            </tbody>
          </table>

          <div className='overAll'>
            <div className='overAll-grand'>
              <h2>Net Payable Amount</h2>
              <span>₹ {grand_total.toFixed(2)}</span>
            </div>
            <div className='overAll-div'>
              <div>
                <span>Subtotal (Before Tax & Discount) :</span> <span>₹ {sub_total.toFixed(2)}</span>
              </div>
              <div>
                <span>Total Discount :</span> <span> ₹ {total_gst.toFixed(2)}</span>
              </div>
              <div>
                <span>Total Tax (GST) :</span> <span> ₹ {total_discount.toFixed(2)}</span>
              </div>
              <div>
                <span>Grand Total (₹) :</span> <span> ₹ {grand_total.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>

        <div className='footer'>
          <strong style={{ fontSize: "15px" }}>Have a great day and stay connected!</strong>
          <hr style={{ backgroundColor: "black", height: "1px", border: "none" }} />

          <div>
            <p><i className="bi bi-geo-alt-fill"></i> {ownerPreview.address}</p>
            <p><i className="bi bi-envelope-fill"></i> {ownerPreview.email}</p>
            <p><i className="bi bi-telephone-fill"></i> {ownerPreview.phone}</p>
          </div>
        </div>

      </div>
    </div>
  )
}
