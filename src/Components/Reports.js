import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Reports() {
  const url = process.env.REACT_APP_URL

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("userdata") || "{}");
  const companyId = user?.companyId;

  const [activeTab, setActiveTab] = useState("sales");
  const [filters, setFilters] = useState({ from: "", to: "" });

  const [summary, setSummary] = useState({
    totalSales: 0,
    totalPurchases: 0,
    netProfit: 0,
  });

  const [salesData, setSalesData] = useState([]); 
  const [pieData, setPieData] = useState([]); 

  const buildMonthlyChart = (sales = [], purchases = []) => {
    const map = new Map();

    sales.forEach((s) => {
      const dateStr =
        s.date || s.billDate || s.invoiceDate || "";
      if (!dateStr) return;

      const month = dateStr.slice(0, 7); 
      if (!map.has(month)) {
        map.set(month, { name: month, sales: 0, purchase: 0 });
      }

      const obj = map.get(month);
      obj.sales += Number(s.finalAmount || s.totalAmount || 0);
      map.set(month, obj);
    });

    purchases.forEach((p) => {
      const dateStr = p.orderdate || p.date || "";
      if (!dateStr) return;

      const month = dateStr.slice(0, 7); // YYYY-MM
      if (!map.has(month)) {
        map.set(month, { name: month, sales: 0, purchase: 0 });
      }

      const obj = map.get(month);
      obj.purchase += Number(p.finalAmount || p.totalAmount || 0);
      map.set(month, obj);
    });

    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  };

  
  const loadReport = () => {
    if (!token || !companyId) return;

    const params = new URLSearchParams();
    if (filters.from) params.append("from", filters.from);
    if (filters.to) params.append("to", filters.to);

    fetch(`${url}/reports?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => r.json())
      .then((res) => {
        if (!res.success) {
          console.log("Report fetch failed:", res.message);
          return;
        }

        const { summary, sales, purchases } = res;

        setSummary({
          totalSales: summary?.totalSales || 0,
          totalPurchases: summary?.totalPurchases || 0,
          netProfit: summary?.netProfit || 0,
        });

        setPieData([
          { name: "Total Sales", value: summary?.totalSales || 0 },
          { name: "Total Purchases", value: summary?.totalPurchases || 0 },
          { name: "Net Profit", value: summary?.netProfit || 0 },
        ]);

        const monthly = buildMonthlyChart(sales || [], purchases || []);
        setSalesData(monthly);
      })
      .catch((err) => console.log("Report fetch error:", err));
  };

  useEffect(() => {
    loadReport();
  }, []); 
  useEffect(() => {
    const handler = () => loadReport();
    window.addEventListener("refreshReports", handler);
    return () => window.removeEventListener("refreshReports", handler);
  }, []);

  const COLORS = ["#2563eb", "#16a34a", "#dc2626"];

function downloadPDF() {
  window.open(`${url}/reports/export/pdf?token=${token}`, "_blank");
}

function downloadExcel() {
  window.open(`${url}/reports/export/excel?token=${token}`, "_blank");
}

function downloadInvoice() {
  window.open(`${url}/reports/export/invoice?token=${token}`, "_blank");
}



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex justify-center items-start px-4 pt-28 pb-10">
      <div className="w-full max-w-4xl bg-white/80 p-6 md:p-8 rounded-2xl shadow-2xl">
        <h1 className="text-2xl font-bold text-center mb-6">
          Business Reports Dashboard
        </h1>

        <div
          className="
            flex justify-center items-center
            gap-3 sm:gap-4 md:gap-6 
            border-b pb-4 mb-8 
            whitespace-nowrap overflow-x-auto
            text-lg sm:text-sm md:text-base lg:text-lg
            no-scrollbar
          "
        >
          {[
            { key: "sales", label: "Sales" },
            { key: "purchase", label: "Purchases" },
            { key: "stock", label: "Stock" },
            { key: "profit", label: "Profit" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-2 font-semibold ${
                activeTab === tab.key
                  ? "border-b-2 border-blue-600 text-blue-700"
                  : "text-gray-600 hover:text-blue-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <input
            type="date"
            value={filters.from}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, from: e.target.value }))
            }
            className="px-4 py-3 border-2 rounded-lg w-full"
          />
          <input
            type="date"
            value={filters.to}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, to: e.target.value }))
            }
            className="px-4 py-3 border-2 rounded-lg w-full"
          />
          <button
            className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
            onClick={loadReport}
          >
            Generate Report
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white shadow p-6 rounded-xl text-center">
            <h3 className="text-lg font-semibold">Total Sales</h3>
            <p className="text-2xl font-bold text-blue-700">
              ₹{summary.totalSales.toLocaleString()}
            </p>
          </div>

          <div className="bg-white shadow p-6 rounded-xl text-center">
            <h3 className="text-lg font-semibold">Total Purchases</h3>
            <p className="text-2xl font-bold text-green-700">
              ₹{summary.totalPurchases.toLocaleString()}
            </p>
          </div>

          <div className="bg-white shadow p-6 rounded-xl text-center">
            <h3 className="text-lg font-semibold">Net Profit</h3>
            <p className="text-2xl font-bold text-red-700">
              ₹{summary.netProfit.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-center mb-2 font-semibold">Overall Summary</h3>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-center mb-2 font-semibold">
              Sales vs Purchases
            </h3>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#2563eb" />
                <Bar dataKey="purchase" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow mb-10">
          <h3 className="text-center mb-2 font-semibold">Sales Trend</h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#2563eb"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

       <div className="flex flex-wrap justify-center gap-6 mt-8">

  <button
    onClick={downloadPDF}
    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow active:scale-95"
  >
    Export PDF
  </button>

  <button
    onClick={downloadExcel}
    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow active:scale-95"
  >
    Export Excel
  </button>

  <button
    onClick={downloadInvoice}
    className="px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-lg shadow active:scale-95"
  >
    Print Invoice
  </button>

</div>

      </div>
    </div>
  );
}
