"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/layouts/DashboardLayout"

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
      <div className="bg-white p-6 rounded shadow max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Tax Regime Report</h1>

        {loading ? (
          <p>Loading your data...</p>
        ) : (
          <div className="space-y-4">
            <div className="border p-4 rounded">
              <h2 className="font-semibold text-lg">Selected Regime:</h2>
              <p className="text-blue-600 text-xl mt-1 capitalize">{regime}</p>
            </div>

            <div className="border p-4 rounded">
              <h2 className="font-semibold text-lg">Summary:</h2>
              <ul className="list-disc list-inside text-gray-700">
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
