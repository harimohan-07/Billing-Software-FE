import React, { useState, useEffect } from "react";

export default function Payments() {
    const url = process.env.REACT_APP_URL;

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("userdata") || "{}");
  const companyId = user?.companyId;

  const emptyForm = {
    partyName: "",
    amount: "",
    mode: "",
    date: "",
    reference: "",
    remarks: "",
    status: "pending",
    type: "",
    tab: "",
  };

  const [activeTab, setActiveTab] = useState("receipts");
  const [search, setSearch] = useState("");
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

  const loadData = () => {
    if (!token) return;

    fetch(`${url}/transaction`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => r.json())
      .then((res) => {
       console.log("Get Transactions:", res);

        if (res.success) {
          setTransactions(res.data);

          localStorage.setItem(
            `transactions_${companyId}`,
            JSON.stringify(res.data)
          );
        } else {
          const stored =
            JSON.parse(
              localStorage.getItem(`transactions_${companyId}`)
            ) || [];
          setTransactions(stored);
        }
      })
      .catch(() => {
        const stored =
          JSON.parse(localStorage.getItem(`transactions_${companyId}`)) ||
          [];
        setTransactions(stored);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

 
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
      tab: activeTab,
      companyId,
    };

    fetch(`${url}/transaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(entry),
    })
      .then((res) => res.json())
      .then((data) => {
      console.log("Save Transactions:", data);

        if (data.success) {
          loadData();
          setForm(emptyForm);
          setEditIndex(null);
        }
      });
  };


  const handleUpdate = () => {
    if (!validateForm()) return;

    const updateId = transactions[editIndex].id;

    fetch(`${url}/transaction/${updateId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        companyId,
      }),
    })
      .then((r) => r.json())
      .then((res) => {
       console.log("Update Transactions:", res);

        if (res.success) {
          loadData();
          setForm(emptyForm);
          setEditIndex(null);
        }
      });
  };

 const handleDelete = (index) => {
  const deleteId = transactions[index]?.id;
  if (!deleteId) return;

  fetch(`${url}/transaction/${deleteId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((r) => r.json())
    .then((res) => {
      console.log("Delete Transactions:", res);

      loadData();
      setForm(emptyForm);
      setEditIndex(null);
    })
    .catch((err) => console.log("Delete error:", err));
};

  const handleEdit = (i) => {
    const t = transactions[i];

    setForm({
      partyName: t.partyName ?? "",
      amount: t.amount ?? "",
      mode: t.mode ?? "",
      date: t.date ?? "",
      reference: t.reference ?? "",
      remarks: t.remarks ?? "",
      status: t.status ?? "pending",
      type: t.type ?? "",
      tab: t.tab ?? activeTab,
    });

    setEditIndex(i);
    setActiveTab(t.tab);
    setError({});
  };

  const filteredList = transactions.filter((t) => {
    if (t.tab !== activeTab) return false;

    const text = search.toLowerCase();
    const matchSearch =
      t.partyName.toLowerCase().includes(text) ||
      t.amount.toString().includes(text) ||
      t.mode.toLowerCase().includes(text) ||
      (t.reference || "").toLowerCase().includes(text) ||
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
          className="w-full sm:w-1/2 lg:w-3/6 mt-2 mb-8 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white"
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
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg"
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
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg"
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
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg"
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
                value={form.date}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg"
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
              className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg"
            />

            <input
              name="remarks"
              value={form.remarks}
              placeholder="Remarks"
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg"
            />

            <div>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg"
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
                className="px-6 py-3 bg-red-600 text-white rounded-xl shadow"
              >
                Delete
              </button>
            )}

            <button
              onClick={editIndex !== null ? handleUpdate : handleAdd}
              className="px-6 py-3 bg-green-600 text-white rounded-xl shadow"
            >
              {editIndex !== null ? "Update Transaction" : "Add Transaction"}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow border overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3 text-center">Mode</th>
                <th className="px-4 py-3 text-center">Date</th>
                <th className="px-4 py-3 text-center">Reference</th>
                <th className="px-4 py-3 text-center">Type</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-6 text-center">
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
                      className={`px-4 py-3 text-center font-semibold ${
                        t.status === "completed"
                          ? "text-green-700"
                          : "text-yellow-700"
                      }`}
                    >
                      {t.status}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleEdit(i)}
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
