"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import "@/styles/login.css"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async () => {
    setError("")

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (res.ok) {
      localStorage.setItem("token", data.token)
      localStorage.setItem("userEmail", email)
      router.push("/dashboard")
    } else {
      setError(data.error || "Login failed")
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Welcome Back</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />

        {error && <p className="login-error">{error}</p>}

        <button onClick={handleLogin} className="login-button">
          Login
        </button>

        <p className="login-footer">
          Don&apos;t have an account?
          <button
            onClick={() => router.push("/register")}
            className="login-link"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  )
}
