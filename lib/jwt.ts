import jwt from "jsonwebtoken";

// ✅ Fallback secret for development
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_dev_only";

export function generateToken(userId: string, role: string): string {
  return jwt.sign(
    { id: userId, role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token: string): any {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("✅ Token verified successfully:", decoded);
    return decoded;
  } catch (error) {
    console.error("❌ Token verification failed:", error);
    return null;
  }
}

export function generateVerificationToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}