"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/layouts/DashboardLayout"
import { Pencil } from "lucide-react"
import "@/styles/tax.css"
export default function TaxesPage() {
  const [name, setName] = useState("")
  const [pan, setPan] = useState("")
  const [level, setLevel] = useState("JM12")
  const [editingName, setEditingName] = useState(false)
  const [initialRegime, setInitialRegime] = useState("")
  const [selectedRegime, setSelectedRegime] = useState("")
  const [confirmed, setConfirmed] = useState(false)
  const [acknowledged, setAcknowledged] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    fetch("/api/user/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setName(data.name)
        setPan(data.pan)
        setInitialRegime(data.regime)
        setSelectedRegime(data.regime)
      })
  }, [])

  const handleNameChange = async () => {
    const confirmed = confirm("Are you sure you want to update your name?")
    if (!confirmed) return

    const token = localStorage.getItem("token")
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    })

    if (res.ok) {
      alert("✅ Name updated successfully")
      setEditingName(false)
    } else {
      alert("❌ Failed to update name")
    }
  }

  const handleRegimeSubmit = async () => {
    if (!selectedRegime || !confirmed || !acknowledged) {
      alert("Please select regime and check all conditions before submitting.")
      return
    }

    const token = localStorage.getItem("token")
    const res = await fetch("/api/user/regime", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ regime: selectedRegime }),
    })

    const data = await res.json()

    if (res.ok) {
      alert("✅ Regime updated successfully")
      setInitialRegime(selectedRegime) // sync UI with DB
    } else {
      alert(`❌ ${data.error || "Failed to update regime"}`)
    }
  }

  return (
    <DashboardLayout>
      <div className="bg-white rounded shadow p-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Taxes & Switch Regime
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block font-medium">PAN:</label>
            <input
              value={pan}
              readOnly
              className="w-full border p-2 rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium">Name:</label>
            <div className="relative">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                readOnly={!editingName}
                className={`w-full border p-2 rounded pr-10 ${
                  editingName ? "bg-white" : "bg-gray-100"
                }`}
              />
              <button
                onClick={() => setEditingName(true)}
                type="button"
                className="absolute right-2 top-2 text-gray-500 hover:text-blue-600"
                disabled={editingName}
              >
                <Pencil size={16} />
              </button>
            </div>
            {editingName && (
              <div className="mt-2 text-right">
                <button
                  onClick={handleNameChange}
                  className="text-sm bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700"
                >
                  Save
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block font-medium">Level:</label>
            <input
              value={level}
              readOnly
              className="w-full border p-2 rounded bg-gray-100"
            />
          </div>

          {initialRegime && (
            <p className="text-blue-700 font-medium">
              You are currently under income Tax default Option – (
              {initialRegime.charAt(0).toUpperCase() + initialRegime.slice(1)}{" "}
              Tax Regime).
            </p>
          )}

          <div>
            <label className="block font-medium">Switch Tax Regime:</label>
            <select
              className="w-full border p-2 rounded"
              value={selectedRegime}
              onChange={(e) => setSelectedRegime(e.target.value)}
            >
              <option value="">-- Select --</option>
              <option value="old">Old</option>
              <option value="new">New</option>
            </select>
          </div>

          <div className="space-y-2 text-sm">
            <label className="block">
              <input
                type="checkbox"
                className="mr-2"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
              />
              I have read the documents carefully.
            </label>
            <label className="block">
              <input
                type="checkbox"
                className="mr-2"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
              />
              I can switch only once in a financial year.
            </label>
          </div>

          <button
            onClick={handleRegimeSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-4"
          >
            Submit
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
