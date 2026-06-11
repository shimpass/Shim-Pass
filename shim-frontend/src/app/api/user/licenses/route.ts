import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = user.emailAddresses[0]?.emailAddress;
  if (!email) {
    return NextResponse.json({ error: "No email found" }, { status: 400 });
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    const secret = process.env.INTERNAL_API_SECRET || "";

    const response = await fetch(`${apiUrl}/api/payments/user/${email}/licenses`, {
      headers: {
        "internal-secret": secret,
      },
    });

    if (!response.ok) {
      throw new Error(`FastAPI returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy error fetching licenses:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
