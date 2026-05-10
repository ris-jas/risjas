import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { base64 } = await request.json();
    const data = base64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(data, 'base64');
    const filePath = path.join(process.cwd(), 'public', 'imgs', 'Logo-Clean.png');
    fs.writeFileSync(filePath, buffer);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
