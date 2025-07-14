"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    pan: "",
    email: "",
    password: "",
    regime: "", // either "old" or "new"
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setError("")
    setSuccess("")

    const { name, pan, email, password, regime } = formData
    if (!name || !pan || !email || !password || !regime) {
      setError("⚠️ All fields are required.")
      return
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    const data = await res.json()
    if (res.ok) {
      setSuccess("✅ Registered successfully. Redirecting to login...")
      setTimeout(() => router.push("/login"), 2000)
    } else {
      setError(data.error || "❌ Registration failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Register
        </h1>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded-lg"
        />

        <input
          type="text"
          name="pan"
          placeholder="PAN Number"
          value={formData.pan}
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded-lg"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded-lg"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded-lg"
        />

        <select
          name="regime"
          value={formData.regime}
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded-lg bg-white"
        >
          <option value="">-- Select Tax Regime --</option>
          <option value="old">Old Regime</option>
          <option value="new">New Regime</option>
        </select>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-4">{success}</p>}

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition"
        >
          Register
        </button>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?
            <button
              onClick={() => router.push("/login")}
              className="ml-1 text-blue-600 hover:underline font-medium"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
