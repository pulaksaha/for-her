import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudflare/images";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const result = await uploadImage(file, {
      source: "verse-upload",
    });

    if (!result) {
      return NextResponse.json(
        {
          error: "Cloudflare Images not configured",
          demo: true,
        },
        { status: 503 },
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[media/upload]", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
