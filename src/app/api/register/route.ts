// src/app/api/register/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hash } from "bcrypt"

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, pan, regime } = await req.json()

    if (!name || !email || !password || !pan || !regime) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    const hashedPassword = await hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        pan,
        regime: regime === "new", // ✅ store as boolean
        regimeChangeCount: 0, // ✅ initialize regime change count
        role: "user",
      },
    })

    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    })
  } catch (error) {
    console.error("[REGISTER_ERROR]", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
