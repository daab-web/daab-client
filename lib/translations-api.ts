import { ZodError, ZodType } from "zod";
import { NextRequest, NextResponse } from "next/server";
import DB from "@/db";

export type TranslationEntry = {
  nameEn: string;
  translations: { locale: string; name: string }[];
};

export function makeKey(namespace: string, nameEn: string): string {
  return `${namespace}.${nameEn.replace(/\W+/g, "")}`;
}

export async function handleGet(req: NextRequest, namespace: string) {
  const locale = req.nextUrl.searchParams.get("locale") || "en";
  const data = await DB.findOneAsync({ locale }, { [namespace]: 1, _id: 0 });
  return NextResponse.json(data);
}

export async function handlePost<T extends TranslationEntry>(
  req: NextRequest,
  namespace: string,
  schema: ZodType<T>,
) {
  try {
    const body = schema.parse(await req.json());
    const key = makeKey(namespace, body.nameEn);
    const translations = new Map<string, string>([["en", body.nameEn]]);

    for (const translation of body.translations) {
      translations.set(translation.locale, translation.name);
    }

    await Promise.all(
      Array.from(translations.entries()).map(([locale, name]) =>
        DB.updateAsync(
          { locale },
          { $set: { [key]: name } },
          { upsert: true },
        ),
      ),
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { title: "Invalid request body", details: err.issues },
        { status: 400 },
      );
    }
    console.error(`[POST /api/${namespace}]`, err);
    return NextResponse.json({ title: "Internal server error" }, { status: 500 });
  }
}

export async function handleDelete(req: NextRequest, namespace: string) {
  try {
    const { nameEn } = await req.json();

    if (!nameEn || typeof nameEn !== "string") {
      return NextResponse.json(
        { title: "Missing required field: nameEn" },
        { status: 400 },
      );
    }

    const key = makeKey(namespace, nameEn);

    await DB.updateAsync(
      {},
      { $unset: { [key]: true } },
      { multi: true },
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(`[DELETE /api/${namespace}]`, err);
    return NextResponse.json({ title: "Internal server error" }, { status: 500 });
  }
}
