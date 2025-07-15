"use client"

import DashboardLayout from "@/layouts/DashboardLayout"
import Link from "next/link"
import { ArrowRight, FileText, Lock, Shuffle, BarChart3 } from "lucide-react"
import { useEffect, useState } from "react"
import "@/styles/dashboard.css"

const staticTiles = [
  {
    title: "Switch Tax Regime",
    icon: <Shuffle className="tile-icon blue" />,
    description: "Switch between Old and New tax regimes.",
    href: "/tax-regime",
  },
  {
    title: "View Report",
    icon: <FileText className="tile-icon green" />,
    description: "View your tax submission report.",
    href: "/report",
  },
  {
    title: "Change Password",
    icon: <Lock className="tile-icon red" />,
    description: "Update your login credentials.",
    href: "/change-password",
  },
]

export default function DashboardPage() {
  const [newCount, setNewCount] = useState<number | null>(null)
  const [oldCount, setOldCount] = useState<number | null>(null)

  useEffect(() => {
    const fetchCounts = async () => {
      const res = await fetch("/api/admin/regime-summary", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (res.ok) {
        const data = await res.json()
        setNewCount(data.newCount)
        setOldCount(data.oldCount)
      }
    }

    fetchCounts()
  }, [])

  return (
    <DashboardLayout>
      <div className="dashboard-background">
        <div className="dashboard-overlay">
          <div className="dashboard-header">
            <h1>Welcome to the Tax Dashboard</h1>
            <p>Manage your tax settings and reports easily.</p>
          </div>

          <div className="tiles-grid">
            {/* Static Tiles */}
            {staticTiles.map((tile) => (
              <Link key={tile.href} href={tile.href} className="tile-card">
                <div className="tile-header">
                  {tile.icon}
                  <h2>{tile.title}</h2>
                </div>
                <p className="tile-description">{tile.description}</p>
                <div className="tile-footer">
                  Go <ArrowRight size={16} />
                </div>
              </Link>
            ))}

            {/* Regime Summary Tile */}
            <div className="tile-card regime-summary-tile">
              <div className="tile-header">
                <BarChart3 className="tile-icon purple" />
                <h2>Regime Summary</h2>
              </div>
              {newCount === null || oldCount === null ? (
                <p className="tile-description">Loading...</p>
              ) : (
                <div className="tile-description">
                  <p>
                    🆕 New Regime: <strong>{newCount}</strong>
                  </p>
                  <p>
                    📜 Old Regime: <strong>{oldCount}</strong>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
