import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = user.emailAddresses[0]?.emailAddress;
  if (!email) {
    return NextResponse.json({ error: "No email found" }, { status: 400 });
  }

  try {
    const { key } = await request.json();
    if (!key) {
      return NextResponse.json({ error: "Missing license key" }, { status: 400 });
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    const secret = process.env.INTERNAL_API_SECRET || "";

    const response = await fetch(`${apiUrl}/api/payments/licenses/${key}/unbind?user_email=${encodeURIComponent(email)}`, {
      method: "POST",
      headers: {
        "internal-secret": secret,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json({ error: errorData.detail || `FastAPI returned ${response.status}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy error unbinding device:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
