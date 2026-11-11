import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { ADMIN_EMAIL } from "@/lib/admin";

// Server-side admin check for API routes.
// The request must carry "Authorization: Bearer <Firebase ID token>" of the
// admin account. Returns a 401/403 response to send back, or null if OK.
//
// Usage:
//   const denied = await requireAdmin(req);
//   if (denied) return denied;
export async function requireAdmin(req: NextRequest): Promise<NextResponse | null> {
  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = await adminAuth.verifyIdToken(authHeader.slice("Bearer ".length));

    const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || ADMIN_EMAIL).toLowerCase();

    if ((decoded.email || "").toLowerCase() !== adminEmail) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return null;
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
