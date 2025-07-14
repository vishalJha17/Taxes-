import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserIdFromRequest } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const userId = getUserIdFromRequest(req)
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { regime } = await req.json()
  const regimeBool = regime === "new"

  const user = await prisma.user.findUnique({ where: { id: userId } })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const now = new Date()
  const currentYear = now.getFullYear()
  const lastChange = user.regimeChangedAt
  const lastChangeYear = lastChange?.getFullYear()

  // Check: Only one change per financial year
  if (lastChangeYear === currentYear && user.regimeChangeCount >= 1) {
    return NextResponse.json(
      { error: "You can only change regime once in a financial year." },
      { status: 403 }
    )
  }

  const isSameYear = lastChangeYear === currentYear

  await prisma.user.update({
    where: { id: userId },
    data: {
      regime: regimeBool,
      regimeChangedAt: now,
      regimeChangeCount: isSameYear ? { increment: 1 } : 1, // reset count if new year
    },
  })

  return NextResponse.json({ success: true })
}
