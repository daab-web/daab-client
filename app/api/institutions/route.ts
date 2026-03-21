import { NextRequest } from "next/server";
import { AddInstitutionSchema, UpdateInstitutionSchema } from "./schemas";
import { handleDelete, handleGet, handlePost, handlePut } from "@/lib/translations-api";

const NAMESPACE = "institutions";

export async function GET(req: NextRequest) {
  return handleGet(req, NAMESPACE);
}

export async function POST(req: NextRequest) {
  return handlePost(req, NAMESPACE, AddInstitutionSchema);
}

export async function PUT(req: NextRequest) {
  return handlePut(req, NAMESPACE, UpdateInstitutionSchema);
}

export async function DELETE(req: NextRequest) {
  return handleDelete(req, NAMESPACE);
}
