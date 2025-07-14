import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const taxes = await prisma.taxData.findMany({ where: { userId: user.id } })
  return NextResponse.json(taxes)
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { year, income, taxPaid } = await req.json()
  const tax = await prisma.taxData.create({
    data: { userId: user.id, year, income, taxPaid },
  })

  return NextResponse.json(tax)
}
