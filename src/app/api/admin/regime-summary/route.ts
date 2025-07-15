// src/app/api/admin/regime-summary/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserIdFromRequest } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const userId = getUserIdFromRequest(req)
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Only admins allowed" }, { status: 403 })
  }

  const newCount = await prisma.user.count({ where: { regime: true } })
  const oldCount = await prisma.user.count({ where: { regime: false } })

  return NextResponse.json({ newCount, oldCount })
}
