import React, { useState, useEffect } from "react";

export default function Prod() {
    const [product, setProduct] = useState({
        name: "",
        category: "",
        price: "",
        gst: "",
        stock: "",
        status: "active",
    });

    const [error, setError] = useState({});
    const [productList, setProductList] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState("");

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("products")) || [];
        setProductList(stored);
    }, []);

    const saveToStorage = (list) => {
        localStorage.setItem("products", JSON.stringify(list));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
        setError({ ...error, [name]: "" });
    };

    const validate = () => {
        let errors = {};
        let isValid = true;

        if (!product.name.trim()) {
            errors.name = "Product Name is required";
            isValid = false;
        }
        if (!product.category.trim()) {
            errors.category = "Category is required";
            isValid = false;
        }
        if (!product.price.trim()) {
            errors.price = "Price is required";
            isValid = false;
        }
        if (!product.gst.trim()) {
            errors.gst = "GST% is required";
            isValid = false;
        }
        if (!product.stock.trim()) {
            errors.stock = "Stock Unit is required";
            isValid = false;
        }

        setError(errors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        const entry = { ...product };
        let updatedList = [...productList];

        if (editIndex !== null) {
            updatedList[editIndex] = entry;
        } else {
            updatedList.push(entry);
        }

        setProductList(updatedList);
        saveToStorage(updatedList);

        setProduct({
            name: "",
            category: "",
            price: "",
            gst: "",
            stock: "",
            status: "active",
        });

        setEditIndex(null);
    };

    const handleEdit = (i) => {
        setEditIndex(i);
        setProduct(productList[i]);
    };

    const handleDelete = (i) => {
        const updated = productList.filter((_, index) => index !== i);
        setProductList(updated);
        saveToStorage(updated);

        if (editIndex === i) {
            setProduct({
                name: "",
                category: "",
                price: "",
                gst: "",
                stock: "",
                status: "active",
            });
            setEditIndex(null);
        }
    };

    const filteredProducts = productList.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
            filterCategory === "" || p.category === filterCategory;
        return matchSearch && matchCategory;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 pt-28 px-4 pb-10  flex justify-center">

            <div className="w-full max-w-4xl bg-white/80 p-6 md:p-8 rounded-2xl shadow-2xl">

                <h1 className="text-2xl font-bold mb-6 text-gray-900 text-center">
                    Product Management
                </h1>

                <p className="text-gray-600 text-sm md:text-base mb-9 text-center">
                    Enter product details for inventory and billing sync
                </p>

                <div className="flex flex-col md:flex-row items-center md:justify-between gap-4 mb-10">

                    <input
                        type="text"
                        placeholder="🔍 Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full md:w-1/2 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white focus:border-blue-500 outline-none"
                    />

                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-full md:w-1/2 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white focus:border-blue-500 outline-none"
                    >
                        <option value="">All Categories</option>
                        {[...new Set(productList.map((p) => p.category))].map((cat, i) => (
                            <option key={i} value={cat}>{cat}</option>
                        ))}
                    </select>

                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                        <div>
                            <label className="font-semibold">Product Name</label>
                            <input
                                name="name"
                                value={product.name}
                                onChange={handleChange}
                                placeholder="Enter product name"
                                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white focus:border-blue-500 outline-none" />

                            {error.name && <p className="text-red-500 text-sm">{error.name}</p>}
                        </div>

                        <div>
                            <label className="font-semibold">Category</label>
                            <input
                                name="category"
                                value={product.category}
                                onChange={handleChange}
                                placeholder="Enter category"
                                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white focus:border-blue-500 outline-none" />

                            {error.category && <p className="text-red-500 text-sm">{error.category}</p>}
                        </div>

                        <div>
                            <label className="font-semibold">Price</label>
                            <input
                                type="number"
                                name="price"
                                value={product.price}
                                onChange={handleChange}
                                placeholder="Enter price"
                                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white focus:border-blue-500 outline-none" />

                            {error.price && <p className="text-red-500 text-sm">{error.price}</p>}
                        </div>

                        <div>
                            <label className="font-semibold">Tax (GST%)</label>
                            <input
                                type="number"
                                name="gst"
                                value={product.gst}
                                onChange={handleChange}
                                placeholder="GST %"
                                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white focus:border-blue-500 outline-none" />

                            {error.gst && <p className="text-red-500 text-sm">{error.gst}</p>}
                        </div>

                        <div>
                            <label className="font-semibold">Stock Unit</label>
                            <input
                                type="number"
                                name="stock"
                                value={product.stock}
                                onChange={handleChange}
                                placeholder="Stock quantity"
                                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white focus:border-blue-500 outline-none" />

                            {error.stock && <p className="text-red-500 text-sm">{error.stock}</p>}
                        </div>

                        <div>
                            <label className="font-semibold">Status</label>
                            <select
                                name="status"
                                value={product.status}
                                onChange={handleChange}
                                className="w-full mt-2 px-4 py-3 border-2 border-gray-500 rounded-lg bg-white focus:border-blue-500 outline-none">

                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
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
                            type="submit"
                            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow"
                        >
                            {editIndex !== null ? "Save Changes" : "Add Product"}
                        </button>

                    </div>

                </form>

                <div className="mt-12 bg-white rounded-xl shadow border overflow-x-auto">
                    <h2 className="text-xl font-bold p-4 border-b bg-gray-100">Product List</h2>

                    <table className="w-full text-sm">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="p-3 text-left">Product</th>
                                <th className="p-3 text-left">Category</th>
                                <th className="p-3 text-center">Price</th>
                                <th className="p-3 text-center">GST%</th>
                                <th className="p-3 text-center">Stock</th>
                                <th className="p-3 text-center">Status</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-4 text-center text-gray-500">
                                        No products found.
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((item, i) => (
                                    <tr key={i} className="border-t border-gray-500 hover:bg-gray-50">

                                        <td className="p-3">{item.name}</td>
                                        <td className="p-3">{item.category}</td>
                                        <td className="p-3 text-center">₹ {item.price}</td>
                                        <td className="p-3 text-center">{item.gst}%</td>
                                        <td className="p-3 text-center">{item.stock}</td>
                                        <td className="p-3 text-center capitalize">{item.status}</td>

                                        <td className="p-3 text-center">
                                            <button
                                                onClick={() => handleEdit(i)}
                                                className="text-blue-600 underline"
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
