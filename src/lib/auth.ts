// src/lib/auth.ts
import jwt from "jsonwebtoken"
import { NextRequest } from "next/server"
import { prisma } from "./prisma"

const JWT_SECRET = process.env.JWT_SECRET!

type JwtPayload = {
  userId: string
}

/**
 * Generate a JWT for the given user ID.
 */
export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" })
}

/**
 * Extract userId from a NextRequest's Authorization header.
 */
export function getUserIdFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization")
  if (!authHeader) return null

  const token = authHeader.split(" ")[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    return decoded.userId
  } catch {
    return null
  }
}

/**
 * Get full user object (optional) from request, useful for profile endpoints.
 */
export async function getUserFromRequest(req: NextRequest) {
  const userId = getUserIdFromRequest(req)
  if (!userId) return null

  const user = await prisma.user.findUnique({ where: { id: userId } })
  return user
}
