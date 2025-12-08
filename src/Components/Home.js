import React from "react";
export default function Home() {

  return (
    <div className="min-h-screen pt-32 px-4 pb-10 
      bg-gradient-to-br from-blue-100 to-blue-200 
      flex justify-center">

      <div className="w-full max-w-3xl text-center">

        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 drop-shadow-sm">
          Welcome to Billing Software
        </h1>

        <p className="text-gray-600 mt-4 text-base md:text-lg">
          A smooth and modern toolkit to manage your business operations with ease.
        </p>

        <div className="
          mt-12 bg-white/60 backdrop-blur-lg 
          p-8 rounded-2xl border border-gray-300/20 shadow
        ">
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            What you can do here
          </h2>

          <ul className="text-gray-600 text-left space-y-3 text-sm md:text-base">
            <li>• Create and manage invoices effortlessly</li>
            <li>• Track purchases and vendor payments</li>
            <li>• Maintain customer and vendor records</li>
            <li>• Monitor product stock & inventory levels</li>
            <li>• View detailed sales, purchase and profit reports</li>
            <li>• Handle receipts, due amounts and payment statuses</li>
          </ul>
        </div>

        <div className="
          mt-10 bg-white/50 backdrop-blur-md 
          p-6 rounded-2xl border border-gray-300/20 shadow-sm
        ">
          <h3 className="text-lg font-semibold text-gray-800">
            Simple • Clean • Efficient
          </h3>
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            Designed to make your workflow easier, not complicated.
          </p>
        </div>



      </div>
    </div>
  );
}
