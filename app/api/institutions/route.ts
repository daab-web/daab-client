import { NextRequest } from "next/server";
import { AddInstitutionSchema } from "./schemas";
import { handleGet, handlePost, handleDelete } from "@/lib/translations-api";

const NAMESPACE = "institutions";

export async function GET(req: NextRequest) {
  return handleGet(req, NAMESPACE);
}

export async function POST(req: NextRequest) {
  return handlePost(req, NAMESPACE, AddInstitutionSchema);
}

export async function DELETE(req: NextRequest) {
  return handleDelete(req, NAMESPACE);
}
