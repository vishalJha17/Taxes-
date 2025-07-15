"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/layouts/DashboardLayout"
import "@/styles/admin.css" // ✅ import the plain CSS

interface User {
  id: string
  name: string
  email: string
  role: string
  pan?: string
  regime?: boolean
}

export default function AdminPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [notAdmin, setNotAdmin] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (res.status === 403) {
        setNotAdmin(true)
        setLoading(false)
        return
      }

      if (!res.ok) {
        console.error("Failed to fetch users")
        setLoading(false)
        return
      }

      const data = await res.json()
      setUsers(data.users || [])
      setLoading(false)
    }

    fetchUsers()
  }, [router])

  return (
    <DashboardLayout>
      <div className="admin-container">
        <h1 className="admin-heading">Admin - User Management</h1>

        {loading ? (
          <div className="text-center">Loading users...</div>
        ) : notAdmin ? (
          <div className="text-center text-danger">
            🚫 Only admins can access this page.
          </div>
        ) : users.length === 0 ? (
          <div className="text-center">No users found.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>PAN</th>
                <th>Regime</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.pan || "—"}</td>
                  <td>{user.regime ? "New" : "Old"}</td>
                  <td>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  )
}
