import { env } from "@repo/env/admin";
import jwt from "jsonwebtoken";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";

  let password = "";

  if (contentType.includes("application/json")) {
    const body = (await request.json()) as { password?: string };
    password = body.password?.trim() || "";
  } else {
    const formData = await request.formData();
    password = String(formData.get("password") || "").trim();
  }

  if (password !== env.PASSWORD) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = jwt.sign({ role: "admin" }, env.JWT_SECRET, {
    expiresIn: "1d",
  });

  const response = contentType.includes("application/json")
    ? NextResponse.json({ ok: true }, { status: 200 })
    : NextResponse.redirect(new URL("/", request.url));

  response.cookies.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true }, { status: 200 });

  response.cookies.set("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });

  return response;
}