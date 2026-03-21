import { ZodError, z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import DB from "@/db";
import {
  getTranslationEntry,
  handleDelete,
  handlePut,
} from "@/lib/translations-api";

const TranslationMutationSchema = z.object({
  namespace: z.enum(["areas", "countries", "institutions"]),
  previousNameEn: z.string().nonempty().optional(),
  nameEn: z.string().nonempty(),
  translations: z.array(
    z.object({
      locale: z.string().max(3).nonempty(),
      name: z.string().nonempty(),
    }),
  ),
});

const TranslationDeleteSchema = z.object({
  namespace: z.enum(["areas", "countries", "institutions"]),
  nameEn: z.string().nonempty(),
});

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const locale = params.get("locale");
  const namespace = params.get("namespace");
  const nameEn = params.get("nameEn");

  if (namespace && nameEn) {
    const entry = await getTranslationEntry(namespace, nameEn);

    if (!entry) {
      return NextResponse.json({ title: "Translation not found" }, { status: 404 });
    }

    return NextResponse.json(entry);
  }

  DB.loadDatabase();

  if (locale) {
    const data = await DB.findOneAsync({ locale });
    return NextResponse.json(data);
  }

  const data = await DB.findAsync({});
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  try {
    const body = TranslationMutationSchema.parse(await req.json());

    return handlePut(
      new NextRequest(req.url, {
        method: req.method,
        headers: req.headers,
        body: JSON.stringify(body),
      }),
      body.namespace,
      TranslationMutationSchema.omit({ namespace: true }),
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { title: "Invalid request body", details: error.issues },
        { status: 400 },
      );
    }

    console.error("[PUT /api/translations]", error);
    return NextResponse.json({ title: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = TranslationDeleteSchema.parse(await req.json());

    return handleDelete(
      new NextRequest(req.url, {
        method: req.method,
        headers: req.headers,
        body: JSON.stringify({ nameEn: body.nameEn }),
      }),
      body.namespace,
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { title: "Invalid request body", details: error.issues },
        { status: 400 },
      );
    }

    console.error("[DELETE /api/translations]", error);
    return NextResponse.json({ title: "Internal server error" }, { status: 500 });
  }
}
