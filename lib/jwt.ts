import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_dev";

/**
 * Generate JWT token for authenticated user
 */
export function generateToken(userId: string, role: string): string {
  return jwt.sign(
    { id: userId, role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

/**
 * Verify JWT token and return decoded payload
 */
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Generate random verification token for email verification
 */
export function generateVerificationToken(): string {
  const part1 = Math.random().toString(36).substring(2, 15);
  const part2 = Math.random().toString(36).substring(2, 15);
  return part1 + part2;
}