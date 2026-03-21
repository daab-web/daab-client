import { ZodError, ZodType } from "zod";
import { NextRequest, NextResponse } from "next/server";
import DB from "@/db";

export type TranslationEntry = {
  nameEn: string;
  translations: { locale: string; name: string }[];
};

export type TranslationUpdateEntry = TranslationEntry & {
  previousNameEn?: string;
};

export function makeKey(namespace: string, nameEn: string): string {
  return `${namespace}.${nameEn.replace(/\W+/g, "")}`;
}

function getValueAtPath(
  source: Record<string, unknown>,
  path: string,
): unknown {
  return path.split(".").reduce<unknown>((current, segment) => {
    if (!current || typeof current !== "object") {
      return undefined;
    }

    return (current as Record<string, unknown>)[segment];
  }, source);
}

export async function getTranslationEntry(namespace: string, nameEn: string) {
  const key = makeKey(namespace, nameEn);
  const docs = (await DB.findAsync(
    { [key]: { $exists: true } },
    { locale: 1, [key]: 1, _id: 0 },
  )) as Array<Record<string, unknown>>;

  if (!docs.length) {
    return null;
  }

  const englishValue = docs
    .filter((doc) => doc.locale === "en")
    .map((doc) => getValueAtPath(doc, key))
    .find((value) => typeof value === "string");

  return {
    nameEn:
      typeof englishValue === "string" && englishValue.trim().length > 0
        ? englishValue
        : nameEn,
    translations: docs
      .filter(
        (doc) =>
          typeof doc.locale === "string" &&
          doc.locale !== "en" &&
          typeof getValueAtPath(doc, key) === "string",
      )
      .map((doc) => ({
        locale: doc.locale as string,
        name: getValueAtPath(doc, key) as string,
      })),
  };
}

export async function handleGet(req: NextRequest, namespace: string) {
  const nameEn = req.nextUrl.searchParams.get("nameEn");

  if (nameEn) {
    const entry = await getTranslationEntry(namespace, nameEn);

    if (!entry) {
      return NextResponse.json({ title: "Translation not found" }, { status: 404 });
    }

    return NextResponse.json(entry);
  }

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

export async function handlePut<T extends TranslationUpdateEntry>(
  req: NextRequest,
  namespace: string,
  schema: ZodType<T>,
) {
  try {
    const body = schema.parse(await req.json());
    const previousNameEn = body.previousNameEn?.trim() || body.nameEn;
    const oldKey = makeKey(namespace, previousNameEn);
    const newKey = makeKey(namespace, body.nameEn);
    const translations = new Map<string, string>([["en", body.nameEn]]);

    for (const translation of body.translations) {
      translations.set(translation.locale, translation.name);
    }

    const unsetPayload =
      oldKey === newKey
        ? { [oldKey]: true }
        : { [oldKey]: true, [newKey]: true };

    await DB.updateAsync({}, { $unset: unsetPayload }, { multi: true });

    await Promise.all(
      Array.from(translations.entries()).map(([locale, name]) =>
        DB.updateAsync(
          { locale },
          { $set: { [newKey]: name } },
          { upsert: true },
        ),
      ),
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { title: "Invalid request body", details: err.issues },
        { status: 400 },
      );
    }
    console.error(`[PUT /api/${namespace}]`, err);
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
