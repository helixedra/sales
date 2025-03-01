import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { db } from '@/utils/db';

const uploadDir = path.join(process.cwd(), 'public', 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    let uploadedFileName = '';
    const file = formData.get('file');
    const imageFromClipboard = formData.get('imageFromClipboard');
    const category = formData.get('category');
    const number = formData.get('number');

    if (file instanceof Blob) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const extension = file instanceof File ? path.extname(file.name) : '.jpg';
      const fileName = `file-${Date.now()}${extension}`;
      const filePath = path.join(uploadDir, fileName);

      if (file.type.startsWith('image/')) {
        await sharp(buffer).jpeg({ quality: 80 }).toFile(filePath);
      } else {
        fs.writeFileSync(filePath, buffer);
      }
      uploadedFileName = fileName;
    }

    if (typeof imageFromClipboard === 'string' && imageFromClipboard) {
      const base64Data = imageFromClipboard.replace(
        /^data:image\/(png|jpeg|jpg);base64,/,
        ''
      );
      const fileName = `clipboard-${Date.now()}.jpg`;
      const imagePath = path.join(uploadDir, fileName);
      const buffer = Buffer.from(base64Data, 'base64');

      await sharp(buffer).jpeg({ quality: 80 }).toFile(imagePath);

      uploadedFileName = fileName;
    }

    if (!uploadedFileName) {
      return NextResponse.json(
        { error: 'No valid file or image found in request' },
        { status: 400 }
      );
    }

    // Insert the upload information into the database
    const timestamp = Date.now();
    const stmt = db.prepare(
      'INSERT INTO uploads (category, number, filename, timestamp) VALUES (?, ?, ?, ?)'
    );
    stmt.run(category, number, uploadedFileName, timestamp);

    return NextResponse.json({
      message: 'Upload successful',
      fileName: uploadedFileName,
      url: `/uploads/${uploadedFileName}`,
      category,
      number,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
