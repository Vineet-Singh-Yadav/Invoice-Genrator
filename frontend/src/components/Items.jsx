import React, { useEffect, useState } from 'react'
import "../css/product_service.css"
import { toast } from "react-toastify";

export default function Items() {
  const token = localStorage.getItem('token');
  const [item, setItem] = useState({ item_name: "", unit_price: "", gst: "", discount: "" });
  const [editItem, setEditItem] = useState(null);// for conditional rendering of form button
  const [showItem, setShowItem] = useState([]);

  async function fetchItems() {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_API}/business/getSavedItem`, {
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
        toast.error(json.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    fetchItems();
  }, [])


  const handleEdit = (itm) => {
    setEditItem(itm);
    setItem({//for placeholder value
      item_name: itm.item_name,
      unit_price: itm.unit_price,
      gst: itm.gst,
      discount: itm.discount,
    });
  };

  function handleChange(e) {
    setItem({ ...item, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_API}/business/saveItem`, {
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
        toast.success(json.message);
        fetchItems();
        setEditItem(null);
        setItem({ item_name: "", unit_price: "", gst: "", discount: "" });
      } else
        toast.error(json.message)
    } catch (error) {
      toast.error("Something went wrong. Please try again!");
    }
  }

  async function deleteItem(id) {

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_API}/business/deleteItem/${id}`, {
        method: "DELETE",
        headers: { "auth-token": token }
      });

      const json = await response.json();

      if (json.success) {
        toast.success(json.message);
        fetchItems();
      } else {
        toast.error(json.message);
      }
    } catch (error) {
      toast.error("Something went wrong while deleting!");
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
            <button className='btn-profile' type="submit">{editItem ? 'Update Product/Service' : 'Add Product/Service'}</button>
          </div>
        </form>
      </div>

      <div className='note'>“You can update these items anytime. If any details such as name, price, quantity, GST, or discount change, make sure to update them here to keep your records accurate.”</div>

      <div className='show-itm-upper' >
        <h2>All Your Products/ Services</h2>

        <table className='item-table'>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Unit Price (₹)</th>
              <th>GST (%)</th>
              <th>Discount (%)</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {showItem.length > 0 ? (
              showItem.map((itm, index) => (
                <tr key={index}>
                  <td>{itm.item_name}</td>
                  <td>{itm.unit_price}</td>
                  <td>{itm.gst}</td>
                  <td>{itm.discount}</td>
                  <td id='itm-action'>
                    <button className='edit-btn' onClick={() => handleEdit(itm)}><i className="bi bi-pencil-square"></i></button>
                    <button className='edit-btn' onClick={() => deleteItem(itm._id)}><i className="bi bi-trash3"></i></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "10px" }}>
                  No products or services added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </>
  )
};
