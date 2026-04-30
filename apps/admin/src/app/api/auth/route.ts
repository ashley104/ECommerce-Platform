import { env } from "@repo/env/admin";
import jwt from "jsonwebtoken";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";
  let password = "";

  if (contentType.includes("application/json")) {
    try {
      const body = (await request.json()) as { password?: string };
      password = String(body.password || "").trim();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
  } else {
    const formData = await request.formData();
    password = String(formData.get("password") || "").trim();
  }

  if (password !== env.PASSWORD) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = jwt.sign({ role: "admin" }, env.JWT_SECRET, {
    expiresIn: "30m",
  });

  const response = NextResponse.redirect(new URL("/", request.url));

  response.cookies.set("auth_token", token, {
    httpOnly: true, //not accessible to client-side JavaScript
    secure: process.env.NODE_ENV === "production", //only sent over HTTPS in production
    sameSite: "strict", //not sent with cross-site requests
    path: "/", //cookie is sent for all paths in the domain
    maxAge: 60 * 30, //30 minutes in seconds
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true }, { status: 200 });

  response.cookies.set("auth_token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  return response;
}