import React, { useState } from "react";

export default function Company() {
  const [search, setSearch] = useState("");

  const companies = [
    { name: "Alpha Traders", gst: "33ABCDE1234F1Z5", plan: "Pro", status: "active" },
    { name: "Beta Exports", gst: "29AAACD1234G1Z9", plan: "Basic", status: "expired" },
    { name: "Royal Electronics", gst: "07DEFGH5678K1Z0", plan: "Demo", status: "active" },
  ];

  const filtered = companies.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 pt-28 px-4 md:px-10">
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Select a Company</h1>
      </div>

      <input
        type="text"
        placeholder="🔍 Search companies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
     className=" w-full sm:w-1/2 lg:w-3/6 mt-2 mb-8 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white focus:border-blue-500 outline-none"/>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {filtered.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center py-10">
            No companies found.
          </p>
        ) : (
          filtered.map((company, i) => (
            <div
              key={i}
              className="bg-white border rounded-2xl shadow p-6 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-bold text-gray-800">{company.name}</h2>
                <p className="text-gray-600 mt-1">GST: {company.gst}</p>

                <p className="mt-3 font-semibold">
                  Plan:{" "}
                  <span
                    className={
                      company.plan === "Pro"
                        ? "text-green-700"
                        : company.plan === "Basic"
                        ? "text-blue-700"
                        : "text-yellow-700"
                    }
                  >
                    {company.plan}
                  </span>
                </p>

                <p
                  className={`mt-1 font-medium ${
                    company.status === "active"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {company.status === "active" ? "Active" : "Expired"}
                </p>
              </div>

              <button className="mt-6 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 shadow">
                Select
              </button>
            </div>
          ))
        )}

      </div>
    </div>
  );
}
