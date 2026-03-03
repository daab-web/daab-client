import DB from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams
  const locale = params.get("locale")
  const namespace = params.get("namespace")

  console.log(locale, namespace)

  DB.loadDatabase()

  const data = await DB.findAsync({ locale, namespace });

  return NextResponse.json(data);
}
