import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    if (!privateKey || privateKey === 'your_imagekit_private_key_here') {
      return NextResponse.json(
        { error: 'ImageKit not configured' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const mod = await import('@imagekit/nodejs');
    const ImageKit = mod.default || mod.ImageKit;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ik = new (ImageKit as any)({
      privateKey,
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '',
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '',
    });

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64File = buffer.toString('base64');
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

    const result = await ik.files.upload({
      file: base64File,
      fileName,
      folder: '/artisan-marketplace/products',
      useUniqueFileName: true,
    });

    return NextResponse.json({
      url: result.url,
      fileId: result.fileId,
    });
  } catch (err) {
    console.error('Image upload error:', err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
