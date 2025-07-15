"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/layouts/DashboardLayout"
import "@/styles/report.css"

export default function ReportPage() {
  const [regime, setRegime] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRegime = async () => {
      const res = await fetch("/api/user/regime", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      const data = await res.json()
      if (res.ok) {
        setRegime(data.regime)
      }
      setLoading(false)
    }

    fetchRegime()
  }, [])

  return (
    <DashboardLayout>
      <div className="report-container">
        <h1 className="report-title">Tax Regime Report</h1>

        {loading ? (
          <p className="report-loading">Loading your data...</p>
        ) : (
          <div>
            <div className="report-section">
              <h2>Selected Regime:</h2>
              <p className="report-regime">{regime}</p>
            </div>

            <div className="report-section">
              <h2>Summary:</h2>
              <ul className="report-summary-list">
                <li>
                  Regime: <span className="capitalize">{regime}</span>
                </li>
                <li>Submitted: ✅ Yes</li>
                <li>Year: 2025–26</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
