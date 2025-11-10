import React, { useEffect, useState } from 'react'
import "../css/product_service.css"

export default function Items() {
  const token = localStorage.getItem('token');
  const [item, setItem] = useState({ item_name: "", unit_price: "", gst: "", discount: "" });
  const [showItem, setShowItem] = useState([]);

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

  function handleChange(e) {
    setItem({ ...item, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/business/saveItem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token
        },
        body: JSON.stringify({
          item_name: item.item_name,
          unit_price: item.unit_price,
          gst: item.gst,
          discount: item.discount
        })
      });

      const json = await response.json();

      if (json.success) {
        alert(json.message);
        fetchItems();
        setItem({ item_name: "", unit_price: "", gst: "", discount: "" });
      } else
        alert(json.message)
    } catch (error) {
      alert("Something went wrong. Please try again!");
    }
  }


  return (
    <>
      <div className='profile'>
        <h2>Add Your Products/ Services</h2>

        <form onSubmit={handleSubmit}>
          <div className='profile-form'>

            <label htmlFor="item_name">Product/ Service Name</label>
            <input type="text" name='item_name' value={item.item_name} onChange={handleChange} />

            <label htmlFor="unit_price">Unit Price(₹)</label>
            <input type="text" name='unit_price' value={item.unit_price} onChange={handleChange} />

            <label htmlFor="gst">GST(%)</label>
            <input type="text" name="gst" value={item.gst} onChange={handleChange} />

            <label htmlFor="discount">Discount(%)</label>
            <input type="text" name="discount" value={item.discount} onChange={handleChange} />
          </div>
          <div className='btn-div'>
            <button className='btn-profile'>Add Product/Service</button>
          </div>
        </form>
      </div>

      <div className='note'>“You can update these items anytime. If any details such as name, price, quantity, GST, or discount change, make sure to update them here to keep your records accurate.”</div>

      <div className='show-itm-upper' >
        <h2>All Your Products/ Services</h2>
        <div className='show-itm-head'>
          <p>Sr. No.</p>
          <p>Item Name</p>
          <p>Unit Price</p>
          <p>GST</p>
          <p>Discount</p>
        </div>
        {showItem.map((itm, index) => (
          <div key={index} className='show-itm' >
            <p>{index + 1}.</p>
            <p>{itm.item_name}</p>
            <p>{itm.unit_price}</p>
            <p>{itm.gst}</p>
            <p>{itm.discount}</p>
          </div>
        ))}

      </div>


    </>
  )
};
