import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { existsSync, mkdirSync } from 'fs';

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'public/uploads');
if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ 
        success: false, 
        message: 'No file provided' 
      }, { status: 400 });
    }
    
    // Create a safe filename
    const originalName = file.name;
    const timestamp = Date.now();
    const fileName = `${timestamp}-${originalName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Save file to public/uploads directory
    const filePath = path.join(uploadsDir, fileName);
    await writeFile(filePath, buffer);
    
    // Return the URL path to the file (relative to public directory)
    return NextResponse.json({ 
      success: true, 
      fileUrl: `/uploads/${fileName}`,
      fileName,
      originalName
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to upload file' 
    }, { status: 500 });
  }
}
