import React, { useState, useEffect } from "react";

export default function CustomerVendor() {
  const [activeTab, setActiveTab] = useState("customer");
  const [search, setSearch] = useState("");
  const [editIndex, setEditIndex] = useState(null);

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

  useEffect(() => {
    setCustomers(JSON.parse(localStorage.getItem("customers")) || []);
    setVendors(JSON.parse(localStorage.getItem("vendors")) || []);
  }, []);

  const saveToStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

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
    setEditIndex(null);
    setError({});
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    }

    if (!formData.contact.trim()) {
      errors.contact = "Contact Number is required";
      isValid = false;
    }

    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!emailReg.test(formData.email)) {
      errors.email = "Invalid email format";
      isValid = false;
    }

    if (!formData.address.trim()) {
      errors.address = "Address is required";
      isValid = false;
    }

    if (activeTab === "vendor" && !formData.gst.trim()) {
      errors.gst = "GST Number is required";
      isValid = false;
    }

    setError(errors);
    return isValid;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const listType = activeTab === "customer" ? customers : vendors;
    const updatedList = [...listType];

    const entry = {
      ...formData,
      lastTransaction: new Date().toISOString().slice(0, 10),
    };

    if (editIndex !== null) updatedList[editIndex] = entry;
    else updatedList.push(entry);

    if (activeTab === "customer") {
      setCustomers(updatedList);
      saveToStorage("customers", updatedList);
    } else {
      setVendors(updatedList);
      saveToStorage("vendors", updatedList);
    }

    clearForm();
  };

  const handleEdit = (index) => {
    const list = activeTab === "customer" ? customers : vendors;
    setFormData(list[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const listType = activeTab === "customer" ? customers : vendors;
    const updated = listType.filter((_, i) => i !== index);

    if (activeTab === "customer") {
      setCustomers(updated);
      saveToStorage("customers", updated);
    } else {
      setVendors(updated);
      saveToStorage("vendors", updated);
    }

    clearForm();
  };

  const filteredList =
    (activeTab === "customer" ? customers : vendors).filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 pt-28 px-4 pb-10 flex justify-center">

      <div className="w-full max-w-4xl bg-white/80 p-6 md:p-8 rounded-2xl shadow-2xl">

        <h1 className="text-2xl text-center font-bold mb-6 text-gray-900">
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
              className="mx-4 py-2 font-semibold text-center"
            >
              <span
                className={`pb-1 leading-none ${activeTab === tab
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
          className="w-full sm:w-1/2 lg:w-3/6 mt-2 mb-8 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white focus:border-blue-500 outline-none"
        />

        <div className="bg-white/90 p-6 rounded-2xl shadow-sm border mb-10">
          <h2 className="text-lg font-semibold mb-4">
            {editIndex !== null ? "Edit Details" : "Add New Entry"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg  bg-white focus:border-blue-500 outline-none"
              />
              {error.name && <p className="text-red-500 text-sm">{error.name}</p>}
            </div>

            <div>
              <input
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Contact Number"
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg  bg-white focus:border-blue-500 outline-none"
              />
              {error.contact && 
                <p className="text-red-500 text-sm">{error.contact}</p>
              }
            </div>

            <div>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg  bg-white focus:border-blue-500 outline-none"
              />
              {error.email && 
                <p className="text-red-500 text-sm">{error.email}</p>
              }
            </div>

            {activeTab === "vendor" && (
              <div>
                <input
                  name="gst"
                  value={formData.gst}
                  onChange={handleChange}
                  placeholder="GST Number"
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg  bg-white focus:border-blue-500 outline-none"
                />
                {error.gst && 
                  <p className="text-red-500 text-sm">{error.gst}</p>
                }
              </div>
            )}
          </div>

          <div>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
                className="w-full mt-8 px-4 py-3 border-2 border-gray-500 rounded-lg  bg-white focus:border-blue-500 outline-none"
            />
            {error.address && 
              <p className="text-red-500 text-sm">{error.address}</p>
            }
          </div>

          <div className="px-8 py-4 flex flex-col sm:flex-row gap-3 mt-4 justify-center">

            <button
              onClick={handleSave}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow"
            >
              {editIndex !== null ? "Update" : "Save"}
            </button>

            {editIndex !== null && (
              <button
                type="button"
                onClick={() => handleDelete(editIndex)}
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
                filteredList.map((entry, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{entry.name}</td>
                    <td className="px-4 py-3 text-center">{entry.contact}</td>
                    <td className="px-4 py-3 text-center">{entry.email}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleEdit(index)}
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
