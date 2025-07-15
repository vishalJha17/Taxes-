"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import "@/styles/register.css" // <-- Import the external CSS

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
    <div className="register-container-wrapper">
      <div className="register-container">
        <h1 className="register-title">Register</h1>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="register-input"
        />

        <input
          type="text"
          name="pan"
          placeholder="PAN Number"
          value={formData.pan}
          onChange={handleChange}
          className="register-input"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="register-input"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="register-input"
        />

        <select
          name="regime"
          value={formData.regime}
          onChange={handleChange}
          className="register-select"
        >
          <option value="">-- Select Tax Regime --</option>
          <option value="old">Old Regime</option>
          <option value="new">New Regime</option>
        </select>

        {error && <p className="register-message register-error">{error}</p>}
        {success && (
          <p className="register-message register-success">{success}</p>
        )}

        <button onClick={handleSubmit} className="register-button">
          Register
        </button>

        <div className="register-footer">
          Already have an account?
          <button onClick={() => router.push("/login")}>Login</button>
        </div>
      </div>
    </div>
  )
}
