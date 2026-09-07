import { getStore } from '@netlify/blobs';
import { timingSafeEqual } from 'node:crypto';

const STORE_NAME = 'forma-recipe-photos';
const VALID_IDS = new Set(['b1','b2','b3','b4','b5','l1','l2','l3','l4','l5','l6','s1','s2','s3','s4','s5','d1','d2','d3','d4','d5','d6']);

function safeEqual(a = '', b = '') {
  const aa = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return aa.length === bb.length && aa.length > 0 && timingSafeEqual(aa, bb);
}

function text(message, status = 400) {
  return new Response(message, { status, headers: { 'content-type': 'text/plain; charset=utf-8' } });
}

export default async (req) => {
  const url = new URL(req.url);
  const id = url.searchParams.get('id') || req.headers.get('x-recipe-id') || '';
  if (!VALID_IDS.has(id)) return text('Unknown recipe id', 404);

  const store = getStore(STORE_NAME, { consistency: 'strong' });
  const key = `photos/${id}.webp`;

  if (req.method === 'GET') {
    const image = await store.get(key, { type: 'arrayBuffer' });
    if (!image) return text('Image not found', 404);
    return new Response(image, {
      status: 200,
      headers: {
        'content-type': 'image/webp',
        'cache-control': 'public, max-age=31536000, immutable',
      },
    });
  }

  if (req.method === 'POST') {
    const expected = process.env.FORMA_RECIPE_UPLOAD_KEY || '';
    const supplied = req.headers.get('x-recipe-upload-key') || '';
    if (!safeEqual(supplied, expected)) return text('Unauthorized', 401);
    const bytes = await req.arrayBuffer();
    if (!bytes.byteLength || bytes.byteLength > 5_000_000) return text('Invalid image body', 400);
    await store.set(key, bytes);
    return Response.json({ ok: true, id, bytes: bytes.byteLength });
  }

  return text('Method not allowed', 405);
};
