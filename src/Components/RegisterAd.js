import React, { useState } from 'react';

export default function RegisterAd() {

  const [Register, setRegister] = useState({
    name: '',
    email: '',
    password: '',
    contactno: '',
    address: ''
  });

  const [error, setError] = useState({
    name: '',
    email: '',
    password: '',
    contactno: '',
    address: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  function handlechange(e) {
    const { name, value } = e.target;
    setRegister({ ...Register, [name]: value });
    setError({ ...error, [name]: '' });
  }

  function handleSubmit(e) {
    e.preventDefault();

    let errors = {};
    let isValid = true;

    if (!Register.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    }

    const emailreg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!Register.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!emailreg.test(Register.email)) {
      errors.email = "Invalid email format";
      isValid = false;
    }

    if (!Register.password.trim()) {
      errors.password = "Password is required";
      isValid = false;
    }

    const mobilereg = /^(?:\+91|0)?[6-9]\d{9}$/;
    if (!Register.contactno.trim()) {
      errors.contactno = "Contact Number is required";
      isValid = false;
    } else if (!mobilereg.test(Register.contactno)) {
      errors.contactno = "Invalid Contact Number format";
      isValid = false;
    }

    if (!Register.address.trim()) {
      errors.address = "Address is required";
      isValid = false;
    }

    if (!isValid) {
      setError(errors);
      return;
    }

 

    const url = process.env.REACT_APP_URL;

    const creatorId = localStorage.getItem("userId");

    if (!creatorId) {
      alert("Creator ID missing. Please login again.");
      return;
    }

    const payload = {
      ...Register,
      creatorId: creatorId 
    };

    fetch(`${url}/registration`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(data => {
        console.log("Full response:", data);

        if (data.success) {
          alert("Sales Person Registered Successfully!");
        } else {
          alert(data.message || "Registration Failed");
        }
      })
      .catch(err => {
        console.log("Error in post", err);
      });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 pt-20 pb-16 px-4 sm:px-6 flex justify-center mt-5">

      <div className="w-full max-w-4xl bg-white/80 p-8 md:p-10 rounded-3xl shadow-xl">

        <h2 className="text-2xl text-center font-bold mb-6 text-gray-900">
          Register
        </h2>

        <p className="text-center text-gray-600 mb-10 text-sm">
          Create your Salesperson account
        </p>

        <form onSubmit={handleSubmit}>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">

            <div>
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white focus:border-blue-500 outline-none"
                value={Register.name}
                onChange={handlechange}
              />
              <p className="text-red-500 text-sm h-5 mt-1">{error.name}</p>
            </div>

            <div>
              <input
                type="text"
                name="email"
                placeholder="Email Address"
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white focus:border-blue-500 outline-none"
                value={Register.email}
                onChange={handlechange}
              />
              <p className="text-red-500 text-sm h-5 mt-1">{error.email}</p>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white focus:border-blue-500 outline-none"
                value={Register.password}
                onChange={handlechange}
              />
              <button
                type="button"
                className="absolute right-3 top-5 text-gray-600 text-xl"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁" : "🔒"}
              </button>

              <p className="text-red-500 text-sm h-5 mt-1">{error.password}</p>
            </div>

            <div>
              <input
                type="text"
                name="contactno"
                placeholder="Contact No"
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white focus:border-blue-500 outline-none"
                value={Register.contactno}
                onChange={handlechange}
              />
              <p className="text-red-500 text-sm h-5 mt-1">{error.contactno}</p>
            </div>

            <div className="sm:col-span-2">
              <input
                type="text"
                name="address"
                placeholder="Address"
                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white focus:border-blue-500 outline-none"
                value={Register.address}
                onChange={handlechange}
              />
              <p className="text-red-500 text-sm h-5 mt-1">{error.address}</p>
            </div>

          </div>

          <div className="px-8 py-4 flex flex-col sm:flex-row gap-3 mt-4 justify-center">
            <button
              type="submit"
              className=" bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-3 px-6 rounded-lg shadow-md"
            >
              Register
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
