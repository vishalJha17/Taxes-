// src/app/api/change-password/route.ts

import { NextRequest, NextResponse } from "next/server"
import { getUserIdFromRequest } from "@/lib/auth"
import { hash, compare } from "bcrypt"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { currentPassword, newPassword } = await req.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const isMatch = await compare(currentPassword, user.password)
    if (!isMatch) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 403 }
      )
    }

    const hashedPassword = await hash(newPassword, 10)
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    })

    return NextResponse.json({ message: "Password changed successfully" })
  } catch (error) {
    console.error("[CHANGE_PASSWORD_ERROR]", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
