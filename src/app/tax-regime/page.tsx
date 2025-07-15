"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/layouts/DashboardLayout"
import "@/styles/tax.css"

export default function TaxRegimePage() {
  const [regime, setRegime] = useState("")
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const fetchRegime = async () => {
      const res = await fetch("/api/user/regime", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      const data = await res.json()
      if (res.ok) setRegime(data.regime)
      setLoading(false)
    }

    fetchRegime()
  }, [])

  const downloadRegimePdf = (regimeValue: string) => {
    const filename = regimeValue === "new" ? "regime-new.pdf" : "regime-old.pdf"
    const link = document.createElement("a")
    link.href = `/pdfs/${filename}`
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleSubmit = async () => {
    setMessage("")

    const res = await fetch("/api/user/regime", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ regime }),
    })

    const data = await res.json()

    if (res.ok) {
      const label = regime === "new" ? "New" : "Old"
      setMessage(`✅ Regime updated to ${label}`)
      downloadRegimePdf(regime)
    } else {
      setMessage(data.error || "❌ Something went wrong")
    }
  }

  return (
    <DashboardLayout>
      <div className="tax-wrapper">
        <div className="tax-card">
          <h2 className="tax-title">Choose Your Tax Regime</h2>

          {loading ? (
            <p className="tax-loading">Fetching your regime...</p>
          ) : (
            <>
              <label htmlFor="regime" className="tax-label">
                Select Regime
              </label>
              <select
                id="regime"
                value={regime}
                onChange={(e) => setRegime(e.target.value)}
                className="tax-select"
              >
                <option value="">-- Select Regime --</option>
                <option value="old">Old Regime</option>
                <option value="new">New Regime</option>
              </select>

              <button
                className="tax-button"
                disabled={!regime}
                onClick={handleSubmit}
              >
                Submit & Download PDF
              </button>

              {message && (
                <div
                  className={`tax-message ${
                    message.startsWith("✅") ? "success" : "error"
                  }`}
                >
                  {message}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
