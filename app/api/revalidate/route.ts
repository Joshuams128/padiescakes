import { revalidatePath } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';
import { parseBody } from 'next-sanity/webhook';

type WebhookBody = {
  _type?: string;
  slug?: { current?: string } | string;
};

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.SANITY_REVALIDATE_SECRET;
    if (!secret) {
      return NextResponse.json(
        { message: 'Missing SANITY_REVALIDATE_SECRET' },
        { status: 500 },
      );
    }

    const { isValidSignature, body } = await parseBody<WebhookBody>(req, secret);

    if (!isValidSignature) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
    }
    if (!body?._type) {
      return NextResponse.json({ message: 'Bad body: missing _type' }, { status: 400 });
    }

    revalidatePath('/shop', 'page');
    revalidatePath('/', 'page');

    const slug = typeof body.slug === 'string' ? body.slug : body.slug?.current;
    if (body._type === 'product' && slug) {
      revalidatePath(`/product/${slug}`, 'page');
    }

    return NextResponse.json({ revalidated: true, type: body._type, slug });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
