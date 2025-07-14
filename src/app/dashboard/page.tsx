"use client"

import DashboardLayout from "@/layouts/DashboardLayout"
import Link from "next/link"
import { ArrowRight, FileText, Lock, Shuffle } from "lucide-react"

const tiles = [
  {
    title: "Switch Tax Regime",
    icon: <Shuffle className="w-6 h-6 text-blue-600" />,
    description: "Switch between Old and New tax regimes.",
    href: "/tax-regime",
  },
  {
    title: "View Report",
    icon: <FileText className="w-6 h-6 text-green-600" />,
    description: "View your tax submission report.",
    href: "/report",
  },
  {
    title: "Change Password",
    icon: <Lock className="w-6 h-6 text-red-600" />,
    description: "Update your login credentials.",
    href: "/change-password",
  },
]

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome to the Tax Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your tax settings and reports.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiles.map((tile) => (
          <Link
            key={tile.href}
            href={tile.href}
            className="bg-white shadow hover:shadow-md rounded-lg p-5 transition border border-gray-200 flex flex-col justify-between"
          >
            <div className="flex items-center gap-3">
              {tile.icon}
              <h2 className="text-lg font-semibold">{tile.title}</h2>
            </div>
            <p className="text-sm text-gray-600 mt-2 flex-1">
              {tile.description}
            </p>
            <div className="mt-4 text-sm text-blue-600 flex items-center gap-1">
              Go <ArrowRight size={16} />
            </div>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  )
}
