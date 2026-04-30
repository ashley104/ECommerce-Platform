import { NextResponse, type NextRequest } from "next/server";
import {
  getPostsForWeb,
  getPostsBySearch,
  getPostsByCategory,
  getPostsByTag,
  getPostsByHistory,
} from "@repo/db/posts";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const q = url.searchParams.get("q") || "";
    const category = url.searchParams.get("category") || "";
    const tag = url.searchParams.get("tag") || "";
    const year = url.searchParams.get("year");
    const month = url.searchParams.get("month");

    let posts;

    if (q) {
      posts = await getPostsBySearch(q);
    } else if (category) {
      posts = await getPostsByCategory(category);
    } else if (tag) {
      posts = await getPostsByTag(tag);
    } else if (year && month) {
      const y = Number(year);
      const m = Number(month);
      if (!Number.isInteger(y) || !Number.isInteger(m) || m < 1 || m > 12) {
        return NextResponse.json({ error: "Invalid year/month" }, { status: 400 });
      }
      posts = await getPostsByHistory(y, m);
    } else {
      posts = await getPostsForWeb();
    }

    return NextResponse.json({ posts }, { status: 200 });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
