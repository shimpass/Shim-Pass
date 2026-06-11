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
    const formData = await request.formData();
    
    // OVERRIDE user_id and user_email with authenticated values
    // to prevent spoofing
    formData.set("user_id", user.id);
    formData.set("user_email", email);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    const secret = process.env.INTERNAL_API_SECRET || "";

    const response = await fetch(`${apiUrl}/api/payments/upload`, {
      method: "POST",
      headers: {
        "internal-secret": secret,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json({ error: errorData.detail || `FastAPI returned ${response.status}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy error uploading payment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
