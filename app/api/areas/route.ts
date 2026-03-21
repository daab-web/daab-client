import { NextRequest } from "next/server";
import { AddAreaSchema, UpdateAreaSchema } from "./schemas";
import { handleDelete, handleGet, handlePost, handlePut } from "@/lib/translations-api";

const NAMESPACE = "areas";

export async function GET(req: NextRequest) {
  return handleGet(req, NAMESPACE);
}

export async function POST(req: NextRequest) {
  return handlePost(req, NAMESPACE, AddAreaSchema);
}

export async function PUT(req: NextRequest) {
  return handlePut(req, NAMESPACE, UpdateAreaSchema);
}

export async function DELETE(req: NextRequest) {
  return handleDelete(req, NAMESPACE);
}
