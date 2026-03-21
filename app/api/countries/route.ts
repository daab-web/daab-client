import { NextRequest } from "next/server";
import { AddCountrySchema, UpdateCountrySchema } from "./schemas";
import { handleDelete, handleGet, handlePost, handlePut } from "@/lib/translations-api";

const NAMESPACE = "countries";

export async function GET(req: NextRequest) {
  return handleGet(req, NAMESPACE);
}

export async function POST(req: NextRequest) {
  return handlePost(req, NAMESPACE, AddCountrySchema);
}

export async function PUT(req: NextRequest) {
  return handlePut(req, NAMESPACE, UpdateCountrySchema);
}

export async function DELETE(req: NextRequest) {
  return handleDelete(req, NAMESPACE);
}
