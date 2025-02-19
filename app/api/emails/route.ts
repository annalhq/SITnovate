import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

interface EmailMetadata {
  received: string;
  spf: string;
  dkim: string;
  message_id: string;
}

interface DMARCInfo {
  status: string;
  domain: string;
  policy: string;
}

interface EmailHeader {
  from: string;
  subject: string;
  protocol: string;
  dmarc: DMARCInfo;
  metadata: EmailMetadata;
}

interface EmailData {
  user_email: string;
  header: EmailHeader;
  links: string[];
  text: string;
}

interface EmailJson {
  emails: EmailData[];
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "emails.json");
    const jsonData = await fs.readFile(filePath, "utf8");
    const data: EmailJson = JSON.parse(jsonData);

    const headers: Record<string, EmailHeader> = {};
    const links: Record<string, string[]> = {};
    const texts: Record<string, string> = {};

    data.emails.forEach((email) => {
      headers[email.user_email] = email.header;
      links[email.user_email] = email.links;
      texts[email.user_email] = email.text;
    });

    return NextResponse.json({ headers, links, texts });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}
