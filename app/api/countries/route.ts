import { NextRequest } from "next/server";
import { AddCountrySchema } from "./schemas";
import { handleGet, handlePost, handleDelete } from "@/lib/translations-api";

const NAMESPACE = "countries";

export async function GET(req: NextRequest) {
  return handleGet(req, NAMESPACE);
}

export async function POST(req: NextRequest) {
  return handlePost(req, NAMESPACE, AddCountrySchema);
}

export async function DELETE(req: NextRequest) {
  return handleDelete(req, NAMESPACE);
}
