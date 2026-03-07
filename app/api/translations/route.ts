import { NextRequest, NextResponse } from "next/server";
import DB from "@/db"

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams
  const locale = params.get("locale")

  DB.loadDatabase()

  const data = await DB.findOneAsync({ locale })

  return NextResponse.json(data)
}
