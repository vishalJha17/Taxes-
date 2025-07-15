import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserIdFromRequest } from "@/lib/auth"

// GET /api/user/regime
export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { regime: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const regime = user.regime ? "new" : "old"
    return NextResponse.json({ regime })
  } catch (err) {
    console.error("GET /regime error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// POST /api/user/regime
export async function POST(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { regime } = await req.json()
    if (regime !== "new" && regime !== "old") {
      return NextResponse.json(
        { error: "Invalid regime value" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const now = new Date()
    const currentYear = now.getFullYear()

    const lastChange = user.regimeChangedAt
    const lastChangeYear = lastChange?.getFullYear()

    const isSameFinancialYear = lastChangeYear === currentYear

    if (isSameFinancialYear && user.regimeChangeCount >= 1) {
      return NextResponse.json(
        { error: "You can only change regime once in a financial year." },
        { status: 403 }
      )
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        regime: regime === "new",
        regimeChangedAt: now,
        regimeChangeCount: isSameFinancialYear ? { increment: 1 } : 1,
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("POST /regime error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
