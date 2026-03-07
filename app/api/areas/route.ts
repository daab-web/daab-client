import { NextRequest } from "next/server";
import { AddAreaSchema } from "./schemas";
import { handleGet, handlePost, handleDelete } from "@/lib/translations-api";

const NAMESPACE = "areas";

export async function GET(req: NextRequest) {
  return handleGet(req, NAMESPACE);
}

export async function POST(req: NextRequest) {
  return handlePost(req, NAMESPACE, AddAreaSchema);
}

export async function DELETE(req: NextRequest) {
  return handleDelete(req, NAMESPACE);
}
