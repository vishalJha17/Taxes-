"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/layouts/DashboardLayout"

type User = {
  id: string
  name: string
  email: string
  role: string
}

export default function AdminPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (res.status === 403) {
        router.push("/dashboard") // 🚫 redirect if not admin
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
      <div className="bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Admin - User Management</h1>

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="p-2 border">{user.name}</td>
                  <td className="p-2 border">{user.email}</td>
                  <td className="p-2 border font-medium text-blue-600">
                    {user.role}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  )
}
