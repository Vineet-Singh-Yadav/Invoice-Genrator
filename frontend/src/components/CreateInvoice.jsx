import React, { useContext, useEffect, useState } from 'react'
import "../css/createInvoive.css"
import { Await, useNavigate } from 'react-router-dom';
import InvoiceContext from './contextApi/InvoiceContext';

export default function CreateInvoice({ setIsActive }) {
  const token = localStorage.getItem('token');
  const [showItem, setShowItem] = useState([]);
  const navigate = useNavigate();
  const [suggestion, setSuggestion] = useState([]);

  async function fetchItems() {
    try {
      const response = await fetch("http://localhost:3000/business/getSavedItem", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token
        },
      });

      const json = await response.json();

      if (json.success) {
        setShowItem(json.item);
      } else {
        alert(json.message);
      }
    } catch (error) {
      alert("Something went wrong");
    }
  };

  useEffect(() => {
    fetchItems();
  }, [])


  const [customer, setCustomer] = useState({
    business_name: "",
    gst: "",
    address: "",
    email: "",
    phone: "",
    items: [{
      item_name: "",
      unit_price: "",
      quantity: "1",
      gst_per: "",
      discount: ""
    }]
  })

  function addItem() {
    const newItem = {
      item_name: "",
      unit_price: "",
      quantity: "1",
      gst_per: "",
      discount: ""
    }

    setCustomer({ ...customer, items: [...customer.items, newItem] });
  }

  function deleteItem(index) {
    const updatedItem = customer.items.filter((_, i) => i !== index);
    setCustomer({ ...customer, items: updatedItem });
  }

  function handleChange(e) {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  }



  function handleChangeItem(e, index) {
    const updatedItem = customer.items.map((item, i) => {
      return i === index ?
        { ...item, [e.target.name]: e.target.value } :
        item
    });

    setCustomer({ ...customer, items: updatedItem });

    if (e.target.name === "item_name") {
      handleSuggestion(e.target.value, index);
    }

    if (e.target.name !== "item_name") {
      setSuggestion([]);
    }
  }

  function handleSuggestion(input, index) {
    if (!input) {
      setSuggestion([]);
      return;
    }

    const matched = showItem.filter(item =>
      item.item_name.toLowerCase().includes(input.toLowerCase()),
    )

    setSuggestion(matched.map(m => ({ ...m, index })));
  }

  function handleSelectSuggestion(suggestion, i) {
    const updatedItems = [...customer.items];
    updatedItems[i] = {
      ...updatedItems[i],
      item_name: suggestion.item_name,
      unit_price: suggestion.unit_price,
      gst_per: suggestion.gst_per,
      discount: suggestion.discount
    };
    setCustomer({ ...customer, items: updatedItems });
    setSuggestion([]);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/invoice/createInvoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token
        },
        body: JSON.stringify({
          business_name: customer.business_name,
          gst: customer.gst,
          address: customer.address,
          email: customer.email,
          phone: customer.phone,
          items: customer.items
        })
      });

      const json = await response.json();

      if (json.success) {
        alert(json.message);
        navigate("/invoicePreview", { state: { invoice: json.invoice, } });
      } else {
        alert(json.message);
      }
    } catch (error) {
      alert("Something went wrong. Please try again!");
    }
  }

  const [owner, setOwner] = useState({});

  const { fetchOwnerDetails } = useContext(InvoiceContext);

  const ownerDetails = async () => {
    const getOwner = await fetchOwnerDetails();
    if (getOwner) setOwner(getOwner);
  }

  useEffect(() => {
    ownerDetails(); 
  }, [])


  return (
    <>
      <div className='div-main crt-inv'>
        <div className='div-main-head'>
          <h2 className='createInvoiceHead'>Create Invoice</h2>
          <p>Next Generation Invoicing.</p>
        </div>
        <div>
          <button onClick={() => setIsActive("invoice")}>See All Invoice</button>
        </div>
      </div>

      <div className='crt-invoice-owner'>
        <div>
          <h4>Your Business Profile</h4>
          <hr/>
          <div>
            <p>Business Name: {owner.business}</p>
            <p>GST Number : {owner.gst}</p>
            <p>Address : {owner.address}</p>
            <p>Email: {owner.email}</p>
            <p>Phone: {owner.phone}</p>
          </div>
          <hr id="hr"/>
          <div className='upd-bus-btn'>
            <p>Note:- If your business details are not updated, please update them first.</p>
            <button onClick={() => setIsActive("profile")}>Update Business Profile</button>
          </div>
        </div>
      </div>

      <div className='inv-frm'>
        <form onSubmit={handleSubmit}>
          <div className='customer-frm'>
            <div>
              <h4>Add Invoice Details</h4>
              <hr />
            </div>

            <label htmlFor="business_name"><i className="bi bi-building"></i> Customer's Business Name</label>
            <input type="text" placeholder='Enter your business name' name='business_name' value={customer.business_name} onChange={handleChange} required />

            <label htmlFor="gst"><i className="bi bi-cash-coin"></i> Customer's GSTIN</label>
            <input type="text" minLength={15} maxLength={15} placeholder='Enter GST number' name='gst' value={customer.gst} onChange={handleChange} />

            <label htmlFor="address"><i className="bi bi-geo"></i> Customer's Address</label>
            <textarea name="address" placeholder='xyz, Street- abc, district, state, pincode' value={customer.address} onChange={handleChange} required></textarea>

            <label htmlFor="email"><i className="bi bi-envelope"></i> Customer's Email Address</label>
            <input type="email" placeholder='Enter your email' name='email' value={customer.email} onChange={handleChange} required />

            <label htmlFor="phone"><i className="bi bi-telephone"></i> Customer's Phone</label>
            <input type="tel" maxLength={10} name='phone' placeholder='Enter your phone number' value={customer.phone} onChange={handleChange} required />

          </div>
          <hr />

          <div>
            {customer.items.map((item, i) => (
              <div className='inv-itm' key={i}>
                <div className='inv-item-name-suggestion'>
                  <div className='inv-itm-tn'>
                    <label htmlFor="item_name">Item Name:</label>
                    <input type="text" name="item_name" value={item.item_name} onChange={(e) => handleChangeItem(e, i)} />
                  </div>
                  <div>
                    {suggestion.length > 0 && suggestion[0].index === i && (
                      <ul className="suggestion-list">
                        {suggestion.map((sug, idx) => (
                          <li
                            key={sug.item_name + idx}
                            onClick={() => handleSelectSuggestion(sug, i)}
                            className="suggestion-item"
                          >
                            {sug.item_name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className='inv-itm-uq'>
                  <label htmlFor="unit_price">Unit Price(₹) :</label>
                  <input type="number" name='unit_price' value={item.unit_price} onChange={(e) => handleChangeItem(e, i)} />

                  <label htmlFor="quantity"> Quantity :</label>
                  <input type="number" name='quantity' value={item.quantity} onChange={(e) => handleChangeItem(e, i)} />

                  <label htmlFor="gst_per">GST(%) :</label>
                  <input type="number" name='gst_per' value={item.gst_per} onChange={(e) => handleChangeItem(e, i)} />

                  <label htmlFor="discount">Discount(%) :</label>
                  <input type="number" name='discount' value={item.discount} onChange={(e) => handleChangeItem(e, i)} />
                </div>

              </div>
            ))}

            <div className='inv-itm-btn'>
              <button type='button' onClick={addItem}>Add More Item</button>
              <button type="button" onClick={() => deleteItem(customer.items.length - 1)}>Delete Last Item</button>
            </div>
          </div>

          <hr />
          <div className='create-invoice-btn'>
            <button type='submit' className='btn-profile'>Generate Invoice</button>
          </div>
        </form>
      </div>
    </>
  )
}


