import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    // Simulate some processing
    const response = { prediction: `Processed: ${text}` };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
