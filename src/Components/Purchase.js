import React, { useState, useEffect } from "react";

export default function Purchase() {
  const [data, setData] = useState({
    productname: "",
    vendorName: "",
    contactno: "",
    invoiceNumber: "",
    orderdate: "",
    deliverydate: "",
    stockrecieved: "",
    stockpending: "",
    gst: "",
    totalAmount: "",
    paymentType: "",
  });

  const [error, setError] = useState({
    productname: "",
    vendorName: "",
    contactno: "",
    invoiceNumber: "",
    orderdate: "",
    deliverydate: "",
    stockrecieved: "",
    stockpending: "",
    gst: "",
    totalAmount: "",
    paymentType: "",
  });

  const [purchaseList, setPurchaseList] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("purchases")) || [];
    setPurchaseList(stored);
  }, []);

  const saveToStorage = (list) => {
    localStorage.setItem("purchases", JSON.stringify(list));
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    setError({ ...error, [name]: "" });
  }

  function handleSubmit(e) {
    e.preventDefault();

    let errors = {};
    let isValid = true;


    if (!data.productname.trim()) {
      errors.productname = "Product Name is required";
      isValid = false;
    }
    if (!data.vendorName.trim()) {
      errors.vendorName = "Vendor Name is required";
      isValid = false;
    }
    if (!data.contactno.trim()) {
      errors.contactno = "Contact Number is required";
      isValid = false;
    }
    if (!data.invoiceNumber.trim()) {
      errors.invoiceNumber = "Invoice Number is required";
      isValid = false;
    }
    if (!data.orderdate.trim()) {
      errors.orderdate = "Order date is required";
      isValid = false;
    }
    if (!data.deliverydate.trim()) {
      errors.deliverydate = "Delivery date is required";
      isValid = false;
    }

    if (!data.stockrecieved.trim()) {
      errors.stockrecieved = "Recieved Stock is required";
      isValid = false;
    }
    if (!data.stockpending.trim()) {
      errors.stockpending = "Pending Stock is required";
      isValid = false;
    }


    if (!data.gst.trim()) {
      errors.gst = "GST is required";
      isValid = false;
    }
    if (!data.totalAmount.trim()) {
      errors.totalAmount = "Total Amount is required";
      isValid = false;
    }
    if (!data.paymentType.trim()) {
      errors.paymentType = "Payment Type is required";
      isValid = false;
    }

    if (!isValid) {
      setError(errors);
      return;
    }

    const base = Number(data.totalAmount);
    const gstPercent = Number(data.gst);
    const gstAmount = (base * gstPercent) / 100;
    const finalAmount = base + gstAmount;

    const entry = {
      ...data,
      gstAmount: gstAmount.toFixed(2),
      finalAmount: finalAmount.toFixed(2),
    };

    let updated = [...purchaseList];

    if (editIndex !== null) {
      updated[editIndex] = entry;
    } else {
      updated.push(entry);
    }

    setPurchaseList(updated);
    saveToStorage(updated);

    setData({
      productname: "",
      vendorName: "",
      contactno: "",
      invoiceNumber: "",
      orderdate: "",
      deliverydate: "",
      stockrecieved: "",
      stockpending: "",
      gst: "",
      totalAmount: "",
      paymentType: "",
    });

    setEditIndex(null);
  }

  function handleEdit(index) {
    setEditIndex(index);
    setData(purchaseList[index]);
  }

  function handleDelete(index) {
    const updated = purchaseList.filter((_, i) => i !== index);
    setPurchaseList(updated);
    saveToStorage(updated);

    if (editIndex === index) {
      setEditIndex(null);
      setData({
        productname: "",
        vendorName: "",
        contactno: "",
       invoiceNumber: "",
        orderdate: "",
        deliverydate: "",
        stockrecieved: "",
        stockpending: "",
        gst: "",
        totalAmount: "",
        paymentType: "",
      });
    }
  }

  const filtered = purchaseList.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.productname.toLowerCase().includes(q) ||
      item.vendorName.toLowerCase().includes(q) ||
      item.invoiceNumber.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 pt-28 px-4 pb-10  flex justify-center">

      <div className="w-full max-w-4xl bg-white/80 justify-center p-6 md:p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">
            Purchase Management
          </h1>
          <p className="text-gray-600 text-sm md:text-base mt-1">
            Enter purchase details for inventory and billing sync
          </p>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search past invoices..."
          className=" w-full sm:w-1/2 lg:w-3/6 mt-2 mb-8 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white focus:border-blue-500 outline-none" />

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

            <div>
              <label className="font-semibold">Product Name</label>
              <input
                name="productname"
                value={data.productname}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white focus:border-blue-500 outline-none" placeholder="Product name"
              />
              <p className="text-red-500 text-sm">{error.productname}</p>

            </div>

            <div>
              <label className="font-semibold">Vendor Name</label>
              <input
                name="vendorName"
                value={data.vendorName}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white focus:border-blue-500 outline-none" 
                placeholder="Vendor name"
              />
              <p className="text-red-500 text-sm">{error.vendorName}</p>
            </div>

               <div>
              <label className="font-semibold">Contact Number</label>
              <input
                name="contactno"
                value={data.contactno}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white focus:border-blue-500 outline-none" 
                placeholder="Contact Number"
              />
              <p className="text-red-500 text-sm">{error.contactno}</p>
            </div>

            <div>
              <label className="font-semibold">Invoice Number</label>
              <input
                name="invoiceNumber"
                value={data.invoiceNumber}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white focus:border-blue-500 outline-none" placeholder="Invoice number"
              />
              <p className="text-red-500 text-sm">{error.invoiceNumber}</p>
            </div>

            <div>
              <label className="font-semibold">Order Date</label>
              <input
                type="date"
                name="orderdate"
                value={data.orderdate}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white focus:border-blue-500 outline-none" />
              <p className="text-red-500 text-sm">{error.orderdate}</p>
            </div>

            <div>
              <label className="font-semibold">Delivery Date</label>
              <input
                type="date"
                name="deliverydate"
                value={data.deliverydate}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white focus:border-blue-500 outline-none" />
              <p className="text-red-500 text-sm">{error.deliverydate}</p>
            </div>

            <div>
              <label className="font-semibold">Stock Recieved</label>
              <input
                type="number"
                name="stockrecieved"
                value={data.stockrecieved}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white focus:border-blue-500 outline-none" placeholder="Stock Recieved"
              />
              <p className="text-red-500 text-sm">{error.stockrecieved}</p>

            </div>

            <div>
              <label className="font-semibold">Stock Pending</label>
              <input
                type="number"
                name="stockpending"
                value={data.stockpending}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white focus:border-blue-500 outline-none" placeholder="Stock Pending"
              />
              <p className="text-red-500 text-sm">{error.stockpending}</p>

            </div>

            <div>
              <label className="font-semibold">GST (%)</label>
              <input
                type="number"
                name="gst"
                value={data.gst}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white focus:border-blue-500 outline-none" placeholder="GST %"
              />
              <p className="text-red-500 text-sm">{error.gst}</p>
            </div>

            <div>
              <label className="font-semibold">Total Amount</label>
              <input
                type="number"
                name="totalAmount"
                value={data.totalAmount}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white focus:border-blue-500 outline-none" placeholder="Enter amount"
              />
              <p className="text-red-500 text-sm">{error.totalAmount}</p>
            </div>

            <div>
              <label className="font-semibold">Payment Type</label>
              <select
                name="paymentType"
                value={data.paymentType}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white focus:border-blue-500 outline-none"              >
                <option value="">Select Payment Type</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
                <option value="bank">Bank Transfer</option>
              </select>
              <p className="text-red-500 text-sm">{error.paymentType}</p>
            </div>

          </div>

          <div className="px-8 py-4 flex flex-col sm:flex-row gap-3 mt-4 justify-center">
            <button
              type="button"
              onClick={() => {
                if (editIndex !== null) handleDelete(editIndex);
              }}
              className={`px-6 py-3 rounded-xl  text-white shadow ${editIndex !== null
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-600 hover:bg-gray-700"
                }`}
            >
              {editIndex !== null ? "Delete" : "Add Purchase"}
            </button>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow"
            >
              {editIndex !== null ? "Update" : "Save"}
            </button>
          </div>

        </form>

        <div className="mt-12 bg-white rounded-xl shadow border overflow-x-auto">
          <h2 className="text-xl font-bold p-4 border-b bg-gray-100">
            Saved Purchases
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">

              <thead className="bg-gray-300 border-gray-500">
                <tr>
                  <th className="p-3 text-left">Product</th>
                  <th className="p-3 text-left">Vendor</th>
                  <th className="p-3 text-left">Contact Number</th>
                  <th className="p-3 text-left">Invoice</th>
                  <th className="p-3 text-center">Order</th>
                  <th className="p-3 text-center">Delivery</th>
                  <th className="p-3 text-center">Received</th>
                  <th className="p-3 text-center">Pending</th>
                  <th className="p-3 text-center">Base</th>
                  <th className="p-3 text-center">GST</th>
                  <th className="p-3 text-center">Final</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="min-h-[250px]">
                {filtered.length === 0 ? (
                  <tr className="h-14">
                    <td
                      colSpan="7"
                      className="p-4 text-center text-gray-500"
                    >
                      No purchases found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item, index) => (
                    <tr key={index} className="border-t border-gray-500 hover:bg-gray-50 h-14">
                      <td className="p-3">{item.productname}</td>
                      <td className="p-3">{item.vendorName}</td>
                      <td className="p-3">{item.contactno}</td>
                      <td className="p-3">{item.invoiceNumber}</td>
                      <td className="p-3 text-center">{item.orderdate}</td>
                      <td className="p-3 text-center">{item.deliverydate}</td>
                      <td className="p-3 text-center">{item.stockrecieved}</td>
                      <td className="p-3 text-center">{item.stockpending}</td>
                      <td className="p-3 text-center">₹ {item.totalAmount}</td>
                      <td className="p-3 text-center">₹ {item.gstAmount}</td>
                      <td className="p-3 text-center font-bold">
                        ₹ {item.finalAmount}
                      </td>

                      <td className="p-5 text-center flex justify-center gap-3">
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
