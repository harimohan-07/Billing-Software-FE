import React, { useState, useMemo } from "react";

export default function Inventory() {
  const [filters, setFilters] = useState({
    category: "",
    search: "",
    startDate: "",
    endDate: "",
  });

  const products = [
    {
      id: 1,
      name: "Billing Paper Roll",
      category: "Stationery",
      availableQty: 25,
      unitPrice: 30,
      lastUpdated: "2025-11-18",
      lowStockThreshold: 10,
    },
    {
      id: 2,
      name: "Thermal Printer",
      category: "Hardware",
      availableQty: 5,
      unitPrice: 4500,
      lastUpdated: "2025-11-20",
      lowStockThreshold: 8,
    },
    {
      id: 3,
      name: "Barcode Stickers",
      category: "Stationery",
      availableQty: 120,
      unitPrice: 0.8,
      lastUpdated: "2025-11-19",
      lowStockThreshold: 50,
    },
    {
      id: 4,
      name: "POS Machine",
      category: "Hardware",
      availableQty: 2,
      unitPrice: 15000,
      lastUpdated: "2025-11-17",
      lowStockThreshold: 3,
    },
  ];

  const categories = ["Stationery", "Hardware"];

  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (filters.category && p.category !== filters.category) return false;

      if (
        filters.search &&
        !p.name.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }


      if (filters.startDate && p.lastUpdated < filters.startDate) return false;
      if (filters.endDate && p.lastUpdated > filters.endDate) return false;

      return true;
    });
  }, [filters, products]);

  const totalStockValue = useMemo(() => {
    return filteredProducts.reduce(
      (sum, p) => sum + p.availableQty * p.unitPrice,
      0
    );
  }, [filteredProducts]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 pt-28 px-4 pb-10  flex justify-center">

      <div className="w-full max-w-4xl bg-white/80 justify-center p-6 md:p-8 rounded-2xl shadow-2xl">

        <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-6 text-gray-900">
              Stock Management
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Monitor product availability and auto-sync with Sales & Purchase modules
            </p>
          </div>

          <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-2xl text-sm">
            <span>⚠️</span>
            <span>Low stock items highlighted with alert icon</span>
          </div>
        </div>

        <div className="mb-8 bg-gray-50/80 border border-gray-600 rounded-2xl p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            Filters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600">
                Category
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white focus:border-blue-500 outline-none"              >
                <option value="">All</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600">
                Product Name
              </label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search product..."
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white focus:border-blue-500 outline-none" />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600">
                From Date
              </label>
              <input
                type="date"
                name="startDate"
              placeholder=" From Date"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white focus:border-blue-500 outline-none" />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600">
                To Date
              </label>
              <input
                type="date"
                name="endDate"
                 placeholder=" To Date"
                 value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white focus:border-blue-500 outline-none" />
            </div>
          </div>
        </div>


        <div className="bg-white/90 rounded-2xl border border-gray-600 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Item Name</th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Available Qty
                  </th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Unit Price
                  </th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Stock Value
                  </th>
                  <th className="px-4 py-3 text-center font-semibold">
                    Low Stock
                  </th>
                  <th className="px-4 py-3 text-center font-semibold">
                    Last Updated
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No products found for the selected filters.
                    </td>
                  </tr>
                )}

                {filteredProducts.map((p) => {
                  const stockValue = p.availableQty * p.unitPrice;
                  const isLow = p.availableQty <= p.lowStockThreshold;

                  return (
                    <tr
                      key={p.id}
                      className="border-t border-gray-600 last:border-b hover:bg-gray-50/80"
                    >
                      <td className="px-4 py-3 text-gray-800 font-medium">
                        {p.name}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">
                        {p.availableQty}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">
                        ₹ {p.unitPrice.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900 font-semibold">
                        ₹ {stockValue.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            Low
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            OK
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600">
                        {p.lastUpdated}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 px-4 py-4 bg-gray-50 border-t">
            <p className="text-gray-700 text-sm">
              ✔ Auto-update enabled with Sales and Purchase modules (stock
              adjusts on every sale and purchase entry).
            </p>
            <p className="text-gray-900 font-semibold text-sm">
              Total Stock Value:{" "}
              <span className="text-blue-700">
                ₹ {totalStockValue.toLocaleString()}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
