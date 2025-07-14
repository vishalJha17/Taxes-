"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/layouts/DashboardLayout"

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

      // ⬇️ Download pre-generated PDF
      downloadRegimePdf(regime)
    } else {
      setMessage(data.error || "❌ Something went wrong")
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-xl border">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
          Select Your Tax Regime
        </h2>

        {loading ? (
          <p className="text-gray-500 text-center">Loading current regime...</p>
        ) : (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Regime
            </label>
            <select
              value={regime}
              onChange={(e) => setRegime(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Regime --</option>
              <option value="old">Old Regime</option>
              <option value="new">New Regime</option>
            </select>

            <button
              onClick={handleSubmit}
              disabled={!regime}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition disabled:opacity-50"
            >
              Submit & Download
            </button>

            {message && (
              <div
                className={`mt-5 text-center p-3 rounded-lg font-medium text-sm ${
                  message.startsWith("✅")
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {message}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
