import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [moduleOpen, setModuleOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("userdata"));
  const role = user?.role; 
  const isLoggedIn = !!user;

  return (
    <>
      <nav
        className="
          fixed top-0 left-0 right-0 z-20
          bg-white/70 backdrop-blur-lg
          shadow-md border-b border-gray-300/30
        "
      >
        <div className="flex items-center justify-between px-5 py-3">

          <h3 className="text-2xl font-bold text-gray-800">
            Billing Software
          </h3>

          <button
            onClick={() => setOpen(true)}
            className="
              p-2 rounded-lg
              bg-white/50 hover:bg-white/70
              transition border border-gray-300/40
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      <div
        className={`
          fixed top-0 right-0 h-full w-72 z-30
          transform transition-all duration-300
          ${open ? "translate-x-0" : "translate-x-full"}
          bg-white/80 backdrop-blur-2xl shadow-2xl
          border-l border-gray-300/30
        `}
      >
        <div className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-md border-b border-gray-300/40">
          <h5 className="text-lg font-bold text-gray-800 tracking-wide">
            Menu
          </h5>

          <button
            onClick={() => setOpen(false)}
            className="p-2 text-xl text-gray-700 hover:text-red-500 transition"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <ul className="space-y-4">

            <li
              className="
                flex items-center gap-3 p-3 rounded-xl cursor-pointer
                bg-white/50 hover:bg-white/80 
                shadow-sm border border-gray-300/30 transition
              "
              onClick={() => navigate("/home")}
            >
              <span className="text-2xl">🏠</span>
              <span className="text-gray-800 font-semibold">Home</span>
            </li>

            {!isLoggedIn && (
              <li
                className="
                  flex items-center gap-3 p-3 rounded-xl cursor-pointer
                  bg-white/50 hover:bg-white/80 
                  shadow-sm border border-gray-300/30 transition
                "
                onClick={() => navigate("/login")}
              >
                <span className="text-2xl">🔐</span>
                <span className="text-gray-800 font-semibold">Login</span>
              </li>
            )}

            {isLoggedIn && (
              <li>
                <button
                  onClick={() => setModuleOpen(!moduleOpen)}
                  className="
                    flex items-center justify-between 
                    w-full p-3
                    rounded-xl bg-white/50 hover:bg-white/80 
                    shadow-sm border border-gray-300/30 transition
                  "
                >
                  <span className="flex items-center gap-3 text-gray-800 font-semibold">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.5 6h3m-3 6h3m-3 6h3M4 6h.01M4 12h.01M4 18h.01M19 6h1M19 12h1M19 18h1"
                      />
                    </svg>
                    Management Panel
                  </span>

                  <span className="text-gray-700">
                    {moduleOpen ? "▲" : "▼"}
                  </span>
                </button>

                <ul
                  className={`
                    pl-6 mt-3 space-y-3 transition-all duration-300
                    ${moduleOpen ? "max-h-96" : "max-h-0 overflow-hidden"}
                  `}
                >

                  <li className="hover:text-blue-600 cursor-pointer" onClick={() => navigate("/purchase")}>
                    Purchase & Product Management
                  </li>

                  <li className="hover:text-blue-600 cursor-pointer" onClick={() => navigate("/sales")}>
                    Sales Management
                  </li>

                  <li className="hover:text-blue-600 cursor-pointer" onClick={() => navigate("/payments")}>
                    Payment & Receipt Management
                  </li>

                  <li className="hover:text-blue-600 cursor-pointer" onClick={() => navigate("/inventory")}>
                    Stock Management
                  </li>

                  <li className="hover:text-blue-600 cursor-pointer" onClick={() => navigate("/customerven")}>
                    Customer & Vendor Management
                  </li>

                  {role === "SHOP_OWNER" && (
                    <>
                      <li className="hover:text-blue-600 cursor-pointer" onClick={() => navigate("/reports")}>
                        Business Report
                      </li>

                      <li className="hover:text-blue-600 cursor-pointer" onClick={() => navigate("/regad")}>
                        Register a Sales Person
                      </li>
                    </>
                  )}
                </ul>
              </li>
            )}
          </ul>

          {isLoggedIn && (
            <div className="mt-6 pl-1">
              <button
                className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold shadow hover:bg-red-600"
                onClick={() => {
                  localStorage.clear();
                  navigate("/home");
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-10"
        />
      )}
    </>
  );
}
