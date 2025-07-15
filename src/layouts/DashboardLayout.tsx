"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import "@/styles/dashboard.css"

const Sidebar = () => {
  const router = useRouter()
  const links = [
    { label: "Home", href: "/dashboard" },
    { label: "Change Password", href: "/change-password" },
    { label: "Admin", href: "/admin" },
    { label: "Tax Regime", href: "/taxes" },
    { label: "Report", href: "/report" },
  ]

  return (
    <aside className="sidebar">
      <h1 className="sidebar-title">Tax Regime</h1>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="sidebar-link">
            {link.label}
          </Link>
        ))}
      </nav>
      <button
        className="logout-button"
        onClick={() => {
          localStorage.removeItem("token")
          router.push("/login")
        }}
      >
        Log Out
      </button>
    </aside>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">{children}</main>
    </div>
  )
}
