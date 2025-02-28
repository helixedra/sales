import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { db } from "@/utils/db";

const uploadDir = path.join(process.cwd(), "public", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Debug logging
    console.log(
      "Received form data entries:",
      [...formData.entries()].map(([key, value]) => ({
        key,
        type: value instanceof Blob ? value.type : typeof value,
        size: value instanceof Blob ? value.size : String(value).length,
      }))
    );

    let uploadedFileName = "";
    const file = formData.get("file");
    const imageFromClipboard = formData.get("imageFromClipboard");
    const category = formData.get("category");
    const number = formData.get("number");

    if (file instanceof Blob) {
      console.log("Processing file upload...");
      const buffer = Buffer.from(await file.arrayBuffer());
      const extension = file instanceof File ? path.extname(file.name) : ".jpg";
      const fileName = `file-${Date.now()}${extension}`;
      const filePath = path.join(uploadDir, fileName);

      console.log("File details:", {
        name: file instanceof File ? file.name : "unknown",
        type: file.type,
        size: buffer.length,
        extension,
        fileName,
        filePath,
      });

      if (file.type.startsWith("image/")) {
        await sharp(buffer).jpeg({ quality: 80 }).toFile(filePath);
        console.log("Image saved:", fileName);
      } else {
        fs.writeFileSync(filePath, buffer);
        console.log("File saved:", fileName);
      }
      uploadedFileName = fileName;
    }

    if (typeof imageFromClipboard === "string" && imageFromClipboard) {
      console.log("Processing clipboard image...");
      const base64Data = imageFromClipboard.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
      const fileName = `clipboard-${Date.now()}.jpg`;
      const imagePath = path.join(uploadDir, fileName);
      const buffer = Buffer.from(base64Data, "base64");

      await sharp(buffer).jpeg({ quality: 80 }).toFile(imagePath);

      console.log("Clipboard image saved:", fileName);
      uploadedFileName = fileName;
    }

    if (!uploadedFileName) {
      console.log("No valid file or image found in request");
      return NextResponse.json(
        { error: "No valid file or image found in request" },
        { status: 400 }
      );
    }

    // Insert the upload information into the database
    const timestamp = Date.now();
    const stmt = db.prepare(
      "INSERT INTO uploads (category, number, filename, timestamp) VALUES (?, ?, ?, ?)"
    );
    stmt.run(category, number, uploadedFileName, timestamp);

    console.log("Upload information saved to database");

    return NextResponse.json({
      message: "Upload successful",
      fileName: uploadedFileName,
      url: `/uploads/${uploadedFileName}`,
      category,
      number,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
