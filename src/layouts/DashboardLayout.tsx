"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"

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
    <aside className="w-64 h-screen bg-blue-900 text-white flex flex-col px-4 py-6">
      <h1 className="text-2xl font-bold mb-8">Tax Regime</h1>
      <nav className="flex-1 space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block py-2 px-3 rounded hover:bg-blue-700 transition"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <button
        className="bg-red-600 hover:bg-red-700 py-2 rounded mt-6"
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
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen bg-gray-50 p-6">{children}</main>
    </div>
  )
}
