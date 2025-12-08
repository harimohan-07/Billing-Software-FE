import React, { useState, useEffect } from "react";

export default function CustomerVendor() {
  const url = process.env.REACT_APP_URL

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("userdata") || "{}");
  const companyId = user.companyId;

  const [activeTab, setActiveTab] = useState("customer");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    address: "",
    gst: "",
  });

  const [error, setError] = useState({});
  const [customers, setCustomers] = useState([]);
  const [vendors, setVendors] = useState([]);


  const loadData = () => {
    if (!companyId) {
      console.log("Missing companyId in localStorage");
      return;
    }

    fetch(`${url}/customervendor/${companyId}/customer`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,   
      },
    })
      .then((res) => res.json())
      .then((data) => setCustomers(data.data || []))
      .catch((err) => console.log("Customer fetch error:", err));

    fetch(`${url}/customervendor/${companyId}/vendor`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,   
      },
    })
      .then((res) => res.json())
      .then((data) => setVendors(data.data || []))
      .catch((err) => console.log("Vendor fetch error:", err));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError({ ...error, [e.target.name]: "" });
  };

  const clearForm = () => {
    setFormData({
      name: "",
      contact: "",
      email: "",
      address: "",
      gst: "",
    });
    setEditId(null);
    setError({});
  };

  const validateForm = () => {
    let errors = {};
    let valid = true;

    if (!formData.name.trim()) {
      errors.name = "Name required";
      valid = false;
    }
    if (!formData.contact.trim()) {
      errors.contact = "Contact required";
      valid = false;
    }
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "Email required";
      valid = false;
    } else if (!emailReg.test(formData.email)) {
      errors.email = "Invalid email";
      valid = false;
    }
    if (!formData.address.trim()) {
      errors.address = "Address required";
      valid = false;
    }
    if (activeTab === "vendor" && !formData.gst.trim()) {
      errors.gst = "GST required";
      valid = false;
    }

    setError(errors);
    return valid;
  };

  
  const handleSave = () => {
    if (!validateForm()) return;

    const payload = {
      companyId,        
      type: activeTab,
      ...formData,
    };

    const endpoint =
      editId === null
        ? `${url}/customervendor`
        : `${url}/customervendor/${companyId}/${editId}`;

    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,  
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Save/Update:", data);
        loadData();
        clearForm();
      })
      .catch((err) => console.log("Save error:", err));
  };

  const handleEdit = (entry) => {
    setEditId(entry.id);
    setFormData({
      name: entry.name,
      contact: entry.contact,
      email: entry.email,
      address: entry.address,
      gst: entry.gst || "",
    });
  };

 
  const handleDelete = () => {
    if (editId === null) return;

    fetch(`${url}/customervendor/${companyId}/${editId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,   
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Deleted:", data);
        loadData();
        clearForm();
      })
      .catch((err) => console.log("Delete error:", err));
  };

  const list = activeTab === "customer" ? customers : vendors;

  const filteredList = list.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 pt-28 px-4 pb-10 flex justify-center">
      <div className="w-full max-w-4xl bg-white/80 p-6 md:p-8 rounded-2xl shadow-2xl">

        <h1 className="text-2xl text-center font-bold mb-6">
          Customer / Vendor Management
        </h1>

        <div className="flex justify-center border-b mb-8 py-3">
          {["customer", "vendor"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                clearForm();
              }}
              className="mx-4 py-2 font-semibold"
            >
              <span
                className={`pb-1 ${
                  activeTab === tab
                    ? "border-b-2 border-blue-600 text-blue-700"
                    : "text-gray-600"
                }`}
              >
                {tab === "customer" ? "Customers" : "Vendors"}
              </span>
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="🔍 Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2 mt-2 mb-8 px-4 py-3 border-2 border-gray-500 rounded-lg"
        />

        <div className="bg-white/90 p-6 rounded-2xl shadow-sm border mb-10">
          <h2 className="text-lg font-semibold mb-4">
            {editId !== null ? "Edit Details" : "Add New Entry"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg"
              />
              {error.name && <p className="text-red-500 text-sm">{error.name}</p>}
            </div>

            <div>
              <input
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Contact"
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg"
              />
              {error.contact && (
                <p className="text-red-500 text-sm">{error.contact}</p>
              )}
            </div>

            <div>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg"
              />
              {error.email && (
                <p className="text-red-500 text-sm">{error.email}</p>
              )}
            </div>

             <div>
                <input
                  name="gst"
                  value={formData.gst}
                  onChange={handleChange}
                  placeholder="GST Number"
                  className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg"
                />
                {error.gst && (
                  <p className="text-red-500 text-sm">{error.gst}</p>
                )}
              </div>
            
          </div>

          <div>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full mt-8 px-4 py-3 border-2 border-gray-500 rounded-lg"
            />
            {error.address && (
              <p className="text-red-500 text-sm">{error.address}</p>
            )}
          </div>

          <div className="px-8 py-4 flex gap-3 justify-center mt-4">
            <button
              onClick={handleSave}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow"
            >
              {editId !== null ? "Update" : "Save"}
            </button>

            {editId !== null && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow"
              >
                Delete
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow border overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-center">Contact</th>
                <th className="px-4 py-3 text-center">Email</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">
                    No records found.
                  </td>
                </tr>
              ) : (
                filteredList.map((entry) => (
                  <tr key={entry.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{entry.name}</td>
                    <td className="px-4 py-3 text-center">{entry.contact}</td>
                    <td className="px-4 py-3 text-center">{entry.email}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleEdit(entry)}
                        className="text-blue-600 hover:underline"
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
  );
}
