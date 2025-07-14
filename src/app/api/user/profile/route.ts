import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserIdFromRequest } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const userId = getUserIdFromRequest(req)
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      pan: true,
    },
  })

  return NextResponse.json(user)
}

export async function PATCH(req: NextRequest) {
  const userId = getUserIdFromRequest(req)
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { name } = await req.json()

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { name },
  })

  return NextResponse.json({
    success: true,
    name: updated.name,
  })
}
