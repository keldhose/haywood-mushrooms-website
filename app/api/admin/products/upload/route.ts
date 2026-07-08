import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { adminStorage } from "@/lib/firebase/admin";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

function sanitizeFilename(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Only JPEG, PNG, WEBP, or GIF images are allowed." }, { status: 400 });
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "Image must be smaller than 5MB." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const path = `products/${Date.now()}-${sanitizeFilename(file.name)}`;

  try {
    const bucket = adminStorage.bucket();
    const blob = bucket.file(path);

    await blob.save(buffer, { contentType: file.type });
    await blob.makePublic();

    const url = `https://storage.googleapis.com/${bucket.name}/${path}`;
    return NextResponse.json({ url });
  } catch (err) {
    console.error("Failed to upload product image:", err);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 502 });
  }
}
