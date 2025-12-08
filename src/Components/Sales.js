import React, { useState, useEffect } from "react";

export default function Sales() {
    const url = process.env.REACT_APP_URL;
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("userdata") || "{}");
  const companyId = user?.companyId;

  const [data, setData] = useState({
    customerName: "",
    contact: "",
    product: "",
    quantity: "",
    price: "",
    discount: "",
    gst: "",
    totalAmount: "",
    paymentMode: "",
    availableStock: "",
  });

  const [error, setError] = useState({
    customerName: "",
    contact: "",
    product: "",
    quantity: "",
    price: "",
    discount: "",
    gst: "",
    paymentMode: "",
  });

  const [salesList, setSalesList] = useState([]);
  const [editIndex, setEditIndex] = useState(null);


  useEffect(() => {
    if (!token) return;

    fetch(`${url}/sales`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((result) => setSalesList(result.data || []))
      .catch(() => {});
  }, [token]);

  function fetchProductDetails(productName, prevState) {
    if (!productName.trim()) return;

    fetch(`${url}/product/lookup/${encodeURIComponent(productName)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.success || !res.data) return;

        const p = res.data;

        setData((prev) => {
          const merged = {
            ...prev,
            product: p.name,
            price: String(p.price ?? prev.price),
            gst: String(p.gst ?? prev.gst),
            availableStock: Number(p.stock ?? 0),
          };

          return {
            ...merged,
            totalAmount: calculateTotal(merged),
          };
        });
      })
      .catch(() => {});
  }

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "contact" && value.length === 10) {
      fetch(`${url}/customervendor/contact/${companyId}/${value}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success && res.data) {
            setData((prev) => ({
              ...prev,
              customerName: res.data.name || prev.customerName,
            }));
          }
        })
        .catch(() => {});
    }

    if (name === "product" && value.trim().length >= 2) {
      fetchProductDetails(value, data);
    }

    const next = {
      ...data,
      [name]: value,
    };

    next.totalAmount = calculateTotal(next);

    setData(next);
    setError((prev) => ({ ...prev, [name]: "" }));
  }

  function calculateTotal(values) {
    const qty = parseFloat(values.quantity) || 0;
    const price = parseFloat(values.price) || 0;
    const discount = parseFloat(values.discount) || 0;
    const gst = parseFloat(values.gst) || 0;

    let subtotal = qty * price - discount;
    if (subtotal < 0) subtotal = 0;

    let gstAmount = subtotal * (gst / 100);
    return (subtotal + gstAmount).toFixed(2);
  }

  function handleSubmit(e) {
    e.preventDefault();

    let errors = {};
    let isValid = true;

    if (!data.customerName.trim()) {
      errors.customerName = "Customer Name is required";
      isValid = false;
    }
    if (!data.contact.trim()) {
      errors.contact = "Contact is required";
      isValid = false;
    }
    if (!data.product.trim()) {
      errors.product = "Product is required";
      isValid = false;
    }
    if (!data.quantity.trim()) {
      errors.quantity = "Quantity is required";
      isValid = false;
    }
    if (!data.price.trim()) {
      errors.price = "Price is required";
      isValid = false;
    }
    if (!data.discount.trim()) {
      errors.discount = "Discount is required";
      isValid = false;
    }
    if (!data.gst.trim()) {
      errors.gst = "GST is required";
      isValid = false;
    }
    if (!data.paymentMode.trim()) {
      errors.paymentMode = "Payment Mode is required";
      isValid = false;
    }

    const qty = Number(data.quantity) || 0;
    const available = Number(data.availableStock || 0);
    if (available > 0 && qty > available) {
      errors.quantity = `Only ${available} in stock`;
      isValid = false;
    }

    if (!isValid) {
      setError(errors);
      return;
    }

    const payload = { ...data, companyId };

    
    if (editIndex === null) {
      fetch(`${url}/sales`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then(() => {
          refreshSales();
          resetForm();
        });
      return;
    }

    const saleId = salesList[editIndex].id;

    fetch(`${url}/sales/${saleId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(() => {
        refreshSales();
        resetForm();
      });
  }

  
  function refreshSales() {
    fetch(`${url}/sales`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setSalesList(data.data || []));
  }

 
  function handleEdit(index) {
    const item = salesList[index];

    setData({
      customerName: item.customerName || "",
      contact: item.contact || "",
      product: item.product || "",
      quantity: String(item.quantity ?? ""),
      price: String(item.price ?? ""),
      discount: String(item.discount ?? ""),
      gst: String(item.gst ?? ""),
      totalAmount: String(item.totalAmount ?? ""),
      paymentMode: item.paymentMode || "",
      availableStock: "",
    });

    setEditIndex(index);
  }


  function handleDelete(index) {
    if (index === null || index === undefined) return;
    const saleId = salesList[index]?.id;
    if (!saleId) return;

    fetch(`${url}/sales/${saleId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(() => {
        refreshSales();
        if (editIndex === index) resetForm();
      });
  }

  function resetForm() {
    setData({
      customerName: "",
      contact: "",
      product: "",
      quantity: "",
      price: "",
      discount: "",
      gst: "",
      totalAmount: "",
      paymentMode: "",
      availableStock: "",
    });
    setEditIndex(null);
  }


  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex justify-center items-start px-4 pt-28 pb-10">
      <div className="w-full max-w-4xl bg-white/80 p-6 md:p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">
            Sales Management
          </h1>
          <p className="text-gray-600 text-sm mt-2">
            Auto-calculating GST & totals
          </p>
        </div>

        <input
          type="text"
          placeholder="🔍 Search invoices..."
          className=" w-full sm:w-1/2 lg:w-3/6 mt-2 mb-8 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white focus:border-blue-500 outline-none"
        />

        <form onSubmit={handleSubmit} className=" space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="font-semibold">Customer Name</label>
              <input
                name="customerName"
                value={data.customerName}
                placeholder="Customer Name"
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white focus:border-blue-500 outline-none"
              />
              {error.customerName && (
                <p className="text-red-500 text-sm">{error.customerName}</p>
              )}
            </div>

            <div>
              <label className="font-semibold">Contact</label>
              <input
                name="contact"
                value={data.contact}
                onChange={handleChange}
                placeholder="Contact Number"
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg  bg-white focus:border-blue-500 outline-none"
              />
              {error.contact && (
                <p className="text-red-500 text-sm">{error.contact}</p>
              )}
            </div>

            <div>
              <label className="font-semibold">Product Name</label>
              <input
                name="product"
                value={data.product}
                placeholder="Product Name"
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white focus:border-blue-500 outline-none"
              />
              {error.product && (
                <p className="text-red-500 text-sm">{error.product}</p>
              )}
              {data.availableStock !== "" && (
                <p className="text-xs text-gray-600 mt-1">
                  Available stock: {data.availableStock}
                </p>
              )}
            </div>

            <div>
              <label className="font-semibold">Quantity</label>
              <input
                name="quantity"
                type="number"
                value={data.quantity}
                placeholder="Quantity"
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white focus:border-blue-500 outline-none"
              />
              {error.quantity && (
                <p className="text-red-500 text-sm">{error.quantity}</p>
              )}
            </div>

            <div>
              <label className="font-semibold">Price</label>
              <input
                name="price"
                type="number"
                value={data.price}
                placeholder="Price"
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white focus:border-blue-500 outline-none"
              />
              {error.price && (
                <p className="text-red-500 text-sm">{error.price}</p>
              )}
            </div>

            <div>
              <label className="font-semibold">Discount</label>
              <input
                name="discount"
                type="number"
                value={data.discount}
                placeholder="Discount"
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white focus:border-blue-500 outline-none"
              />
              {error.discount && (
                <p className="text-red-500 text-sm">{error.discount}</p>
              )}
            </div>

            <div>
              <label className="font-semibold">Tax (GST %)</label>
              <input
                name="gst"
                type="number"
                value={data.gst}
                placeholder="GST"
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white focus:border-blue-500 outline-none"
              />
              {error.gst && (
                <p className="text-red-500 text-sm">{error.gst}</p>
              )}
            </div>

            <div>
              <label className="font-semibold">Payment Mode</label>
              <select
                name="paymentMode"
                value={data.paymentMode}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white focus:border-blue-500 outline-none"
              >
                <option value="">Select Payment Mode</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
                <option value="credit">Credit</option>
              </select>
              {error.paymentMode && (
                <p className="text-red-500 text-sm">{error.paymentMode}</p>
              )}
            </div>

            <div>
              <label className="font-semibold">Total Amount</label>
              <input
                readOnly
                value={data.totalAmount}
                placeholder="Total Amount"
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="px-8 py-4 flex flex-col sm:flex-row gap-3 mt-4 justify-center">
            <button
              type="button"
              onClick={() => handleDelete(editIndex)}
              className={`px-6 py-3 rounded-xl text-white shadow transition 
              ${
                editIndex !== null
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-gray-600 hover:bg-gray-700"
              }
    `}
            >
              {editIndex !== null ? "Delete" : "Generate Invoice"}
            </button>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow"
            >
              {editIndex !== null ? "Update" : "Save"}
            </button>
          </div>
        </form>

        <div className="mt-12 bg-white/90 rounded-xl shadow border overflow-hidden">
          <h2 className="text-xl font-bold p-4 border-b bg-gray-100">
            Saved Sales
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 text-left">Customer</th>
                  <th className="p-3 text-left">Product</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-center">Price</th>
                  <th className="p-3 text-center">GST%</th>
                  <th className="p-3 text-center">Total</th>
                  <th className="p-3 text-center">Payment</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {salesList.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="p-4 text-center text-gray-500"
                    >
                      No sales entries yet.
                    </td>
                  </tr>
                ) : (
                  salesList.map((item, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="p-3">{item.customerName}</td>
                      <td className="p-3">{item.product}</td>
                      <td className="p-3 text-center">{item.quantity}</td>
                      <td className="p-3 text-center">₹ {item.price}</td>
                      <td className="p-3 text-center">{item.gst}%</td>
                      <td className="p-3 text-center font-bold">
                        ₹ {item.totalAmount}
                      </td>
                      <td className="p-3 text-center">{item.paymentMode}</td>

                      <td className="p-3 text-center flex justify-center gap-3">
                        <button
                          onClick={() => handleEdit(index)}
                          className="text-blue-600 underline"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
