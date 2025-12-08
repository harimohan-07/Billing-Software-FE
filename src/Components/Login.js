import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export default function Login() {

  const [LoginDetails, setLoginDetails] = useState({
    email: '',
    password: ''
  });
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState({
    email: '',
    password: ''
  });

  function handlechange(e) {
    const { name, value } = e.target;
    setLoginDetails({ ...LoginDetails, [name]: value });
    setError({ ...error, [name]: '' });
  }

  function handleSubmit(e) {
    e.preventDefault();

    let errors = {};
    let isValid = true;
    const emailreg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!LoginDetails.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!emailreg.test(LoginDetails.email)) {
      errors.email = "Invalid email format";
      isValid = false;
    }

    if (!LoginDetails.password.trim()) {
      errors.password = "Password is required";
      isValid = false;
    }

    if (!isValid) {
      setError(errors);
      return;
    }

    
  const url = process.env.REACT_APP_URL

    fetch(`${url}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(LoginDetails),
    })
      .then(res => res.json())
      .then(data => {
        console.log("Login:", data);

        if (!data.success) {
          alert(data.message);
          return;
        }

    
        localStorage.setItem("token", data.token);
        localStorage.setItem("userdata", JSON.stringify(data.user));
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("companyId", data.user.companyId);
        localStorage.setItem("userId", data.user._id);

      })
      .catch(err => console.log("Login error:", err));
  }

  return (
    <div className="min-h-screen flex flex-col">

      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center px-4">

        <div className="w-full max-w-sm bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
          <h2 className="text-3xl font-bold text-center text-black mb-6 drop-shadow">
            Login
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>

            <div>
              <input
                type="text"
                name="email"
                placeholder="Email Address"
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white focus:border-blue-500 outline-none"
                value={LoginDetails.email}
                onChange={handlechange}
              />
              {error.email && <p className="text-red-500 text-sm mt-1">{error.email}</p>}
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white focus:border-blue-500 outline-none"
                value={LoginDetails.password}
                onChange={handlechange}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 bottom-3 text-gray-600"
              >
                {showPassword ? "👁" : "🔒"}
              </button>

              {error.password && (
                <p className="text-red-500 text-sm mt-1">{error.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300"
              onClick={() => navigate("/home")}

           >

              Login
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}
