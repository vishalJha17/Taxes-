import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { compare } from "bcrypt"
import { generateToken } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || !(await compare(password, user.password))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const token = generateToken(user.id)
  return NextResponse.json({ token })
}
