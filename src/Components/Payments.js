import React, { useState, useEffect } from "react";

export default function Payments() {
  const [activeTab, setActiveTab] = useState("receipts");
  const [search, setSearch] = useState("");

  const emptyForm = {
    partyName: "",
    amount: "",
    mode: "",
    date: "",
    reference: "",
    remarks: "",
    status: "pending",
    type: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const [filters, setFilters] = useState({
    from: "",
    to: "",
    status: "",
    type: "",
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("transactions")) || [];

    const fixed = saved.map((t) => ({
      ...t,
      tab:
        t.tab ||
        (t.type === "bill" || t.type === "advance given"
          ? "payments"
          : "receipts"),
    }));

    setTransactions(fixed);
    localStorage.setItem("transactions", JSON.stringify(fixed));
  }, []);

  const saveToStorage = (data) => {
    localStorage.setItem("transactions", JSON.stringify(data));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError({ ...error, [e.target.name]: "" });
  };

 const validateForm = () => {
  let errors = {};
  let isValid = true;

  if (!form.partyName.trim()) {
    errors.partyName =
      activeTab === "receipts"
        ? "Customer Name is required"
        : "Vendor Name is required";
    isValid = false;
  }

  if (!String(form.amount).trim()) {
    errors.amount = "Amount is required";
    isValid = false;
  }

  if (!form.reference.trim()) {
    errors.reference = "Reference Number is required";
    isValid = false;
  }

  if (!form.mode.trim()) {
    errors.mode = "Payment Mode is required";
    isValid = false;
  }

  if (!form.date.trim()) {
    errors.date = "Date is required";
    isValid = false;
  }

  if (!form.type.trim()) {
    errors.type = "Transaction Type is required";
    isValid = false;
  }

  setError(errors);
  return isValid;
};

  
  const handleAdd = () => {
    if (!validateForm()) return;

    const entry = {
      ...form,
      amount: Number(form.amount),
      tab: activeTab, // IMPORTANT
      createdAt: new Date().toISOString(),
    };

    let updated = [...transactions];

    if (editIndex !== null) {
      updated[editIndex] = entry;
    } else {
      updated.push(entry);
    }

    setTransactions(updated);
    saveToStorage(updated);
    setEditIndex(null);
    setForm(emptyForm);
  };

  const handleEdit = (i) => {
    setForm(transactions[i]);
    setEditIndex(i);
    setActiveTab(transactions[i].tab); 
    setError({});
  };


  const handleDelete = (i) => {
    const updated = transactions.filter((_, index) => index !== i);
    setTransactions(updated);
    saveToStorage(updated);
    setEditIndex(null);
    setForm(emptyForm);
  };

 
  const filteredList = transactions.filter((t) => {
    if (t.tab !== activeTab) return false;

    const text = search.toLowerCase();
    const matchSearch =
      t.partyName.toLowerCase().includes(text) ||
      t.amount.toString().includes(text) ||
      t.mode.toLowerCase().includes(text) ||
      t.reference.toLowerCase().includes(text) ||
      (t.remarks || "").toLowerCase().includes(text);

    if (!matchSearch) return false;

    if (filters.status && t.status !== filters.status) return false;
    if (filters.type && t.type !== filters.type) return false;
    if (filters.from && t.date < filters.from) return false;
    if (filters.to && t.date > filters.to) return false;

    return true;
  });

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 pt-28 px-4 pb-10 flex justify-center">
      <div className="w-full max-w-4xl bg-white/80 p-6 md:p-8 rounded-2xl shadow-2xl">

        <h1 className="text-2xl font-bold mb-6 text-gray-900 text-center">
          Payments & Receipts
        </h1>

        <div className="flex justify-center border-b mb-8 py-3 gap-4">
          {[
            { key: "receipts", label: "Receipts (Customers)" },
            { key: "payments", label: "Payments (Vendors)" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setError({});
                setForm(emptyForm);
                setEditIndex(null);
              }}
              className={`flex py-3 font-semibold text-center justify-around ${activeTab === tab.key
                ? "border-b-2 border-blue-600 text-blue-700"
                : "text-gray-600 hover:text-blue-700"
                }`}
            >
              {tab.label}
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

        <div className="bg-white p-6 rounded-2xl shadow border mb-10">
          <h2 className="text-lg font-semibold mb-4">
            {editIndex !== null ? "Edit Transaction" : "Add Transaction"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <input
                name="partyName"
                value={form.partyName}
                placeholder={activeTab === "receipts" ? "Customer Name" : "Vendor Name"}
                onChange={handleChange}
                className="w-full mt-2 bg-white focus:border-blue-500 outline-none px-4 py-3 border-2 border-gray-500 rounded-lg"
              />
              {error.partyName && (
                <p className="text-red-600 text-sm mt-1">{error.partyName}</p>
              )}
            </div>

            <div>
              <input
                name="amount"
                type="number"
                value={form.amount}
                placeholder="Amount"
                onChange={handleChange}
                className="w-full mt-2 bg-white focus:border-blue-500 outline-none px-4 py-3 border-2 border-gray-500 rounded-lg"
              />
              {error.amount && (
                <p className="text-red-600 text-sm mt-1">{error.amount}</p>
              )}
            </div>

            <div>
              <select
                name="mode"
                value={form.mode}
                onChange={handleChange}
                className="w-full mt-2 bg-white focus:border-blue-500 outline-none px-4 py-3 border-2 border-gray-500 rounded-lg"
              >
                <option value="">Payment Mode</option>
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="bank">Bank Transfer</option>
                <option value="card">Card</option>
                <option value="cheque">Cheque</option>
              </select>
              {error.mode && (
                <p className="text-red-600 text-sm mt-1">{error.mode}</p>
              )}
            </div>

            <div>
              <input
                name="date"
                type="date"
                placeholder="Date"
                value={form.date}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white text-gray-900 focus:border-blue-500 outline-none"
              />
              {error.date && (
                <p className="text-red-600 text-sm mt-1">{error.date}</p>
              )}


            </div>

            <input
              name="reference"
              value={form.reference}
              placeholder="Reference Number"
              onChange={handleChange}
              className="w-full mt-2 bg-white focus:border-blue-500 outline-none px-4 py-3 border-2 border-gray-500 rounded-lg"



            />


            <input
              name="remarks"
              value={form.remarks}
              placeholder="Remarks"
              onChange={handleChange}
              className="w-full mt-2  bg-white focus:border-blue-500 outline-none px-4 py-3 border-2 border-gray-500 rounded-lg"
            />

            <div className="relative min-h-[75px]">
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full bg-white focus:border-blue-500 outline-none mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg"
              >

                <option value="pending">Pending</option>
                <option value="completed">Completed</option>

              </select>
              <p className="text-red-600 text-sm mt-1">{error.mode}</p>

            </div>

            <div>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full mt-2 bg-white focus:border-blue-500  px-4 py-3 border-2 border-gray-500 rounded-lg"
              >
                <option value="">Transaction Type</option>

                {activeTab === "receipts" ? (
                  <>
                    <option value="invoice">Invoice Payment</option>
                    <option value="advance">Advance Received</option>
                  </>
                ) : (
                  <>
                    <option value="bill">Bill Payment</option>
                    <option value="advance">Advance Given</option>
                  </>
                )}
              </select>
              {error.type && (
                <p className="text-red-600 text-sm mt-1">{error.type}</p>
              )}
            </div>
          </div>

          <div className="px-8 py-4 flex flex-col sm:flex-row gap-3 mt-4 justify-center">

            {editIndex !== null && (
              <button
                onClick={() => handleDelete(editIndex)}
                type="button"
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow"
              >
                Delete
              </button>
            )}

            <button
  onClick={handleAdd}
  type="submit"
  className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white shadow w-full max-w-xs sm:w-auto"
>
  {editIndex !== null ? "Update Transaction" : "Add Transaction"}
</button>

          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow border mb-10">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <input
              type="date"
              name="from"
              placeholder="From Date"
              value={filters.from}
              onChange={(e) => setFilters({ ...filters, from: e.target.value })}
              className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg"
            />

            <input
              type="date"
              name="to"
              placeholder=" To Date"
              value={filters.to}
              onChange={(e) => setFilters({ ...filters, to: e.target.value })}
              className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg"
            />

            <select
              name="status"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>


        

        <div className="bg-white rounded-2xl shadow border overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">
                  {activeTab === "receipts" ? "Customer" : "Vendor"}
                </th>
                <th className="px-4 py-3 text-left font-semibold">Amount</th>
                <th className="px-4 py-3 text-center font-semibold">Mode</th>
                <th className="px-4 py-3 text-center font-semibold">Date</th>
                <th className="px-4 py-3 text-center font-semibold">Reference</th>
                <th className="px-4 py-3 text-center font-semibold">Type</th>
                <th className="px-4 py-3 text-center font-semibold">Status</th>
                <th className="px-4 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-6 text-center text-gray-500">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filteredList.map((t, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{t.partyName}</td>
                    <td className="px-4 py-3">₹{t.amount}</td>
                    <td className="px-4 py-3 text-center">{t.mode}</td>
                    <td className="px-4 py-3 text-center">{t.date}</td>
                    <td className="px-4 py-3 text-center">{t.reference}</td>
                    <td className="px-4 py-3 text-center">{t.type}</td>
                    <td
                      className={`px-4 py-3 text-center font-semibold ${t.status === "completed"
                        ? "text-green-700"
                        : "text-yellow-700"
                        }`}
                    >
                      {t.status}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleEdit(i)}
                        className="text-blue-600 hover:underline mr-4"
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