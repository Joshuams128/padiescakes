import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(req: Request) {
  try {
    const order = await req.json();

    if (!order.name || !order.email || !order.phone || !order.address || !order.dateNeeded || !order.items) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const orderNumber = `ORD-${Date.now()}`;

    if (!resend) {
      return Response.json({ error: 'Email service is not configured.' }, { status: 500 });
    }

    await resend.emails.send({
      from: "Padie's Cakes <onboarding@resend.dev>",
      to: 'joshuams128@gmail.com',
      subject: `New Order from ${order.name}`,
      html: `
        <h2>New Order Received</h2>
        <p><strong>Order #:</strong> ${orderNumber}</p>
        <h3>Customer Information</h3>
        <p><strong>Name:</strong> ${order.name}</p>
        <p><strong>Email:</strong> ${order.email}</p>
        <p><strong>Phone:</strong> ${order.phone}</p>
        <p><strong>Address:</strong> ${order.address}</p>
        <p><strong>Date Needed:</strong> ${order.dateNeeded}</p>
        ${order.notes ? `<p><strong>Special Notes:</strong> ${order.notes}</p>` : ''}
        <h3>Order Items</h3>
        ${order.items.map((item: any) => `
          <p>
            <strong>${item.name}</strong><br/>
            Flavor: ${item.flavor}<br/>
            ${item.dietaryOptions?.length > 0 ? `Dietary Options: ${item.dietaryOptions.join(', ')}<br/>` : ''}
            ${item.notes ? `Special Instructions: ${item.notes}<br/>` : ''}
            Quantity: ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}
          </p>
        `).join('')}
        <p><strong>Total: $${order.total.toFixed(2)}</strong></p>
      `,
    });

    return Response.json({ success: true, orderNumber });
  } catch (error) {
    console.error('Order processing error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: 'Failed to process order', details: msg }, { status: 500 });
  }
}
