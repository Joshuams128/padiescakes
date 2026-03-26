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
      from: "Padie's Cakes <info@padiescakes.ca>",
      to: 'padiescakes@gmail.com',
      subject: `New Order #${orderNumber} from ${order.name} - $${order.total.toFixed(2)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="background-color: #F1D4E1; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <img src="https://padiescakes.ca/images/padiescakes.logo1.png" alt="PadieCakes" style="max-width: 150px; height: auto; margin-bottom: 10px;" />
            <h1 style="color: white; margin: 0;">New Order Received!</h1>
          </div>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #1f2937; margin-top: 0;">Order #${orderNumber}</h2>
            <h3 style="color: #374151;">Customer Information</h3>
            <p><strong>Name:</strong> ${order.name}</p>
            <p><strong>Email:</strong> ${order.email}</p>
            <p><strong>Phone:</strong> ${order.phone}</p>
            <p><strong>Address:</strong> ${order.address}</p>
            <p><strong>Date Needed:</strong> ${order.dateNeeded}</p>
            ${order.notes ? `<p><strong>Special Notes:</strong> ${order.notes}</p>` : ''}
            <h3 style="color: #374151;">Order Items</h3>
            ${order.items.map((item: any) => `
              <p>
                <strong>${item.name}</strong><br/>
                Flavor: ${item.flavor}<br/>
                ${item.size ? `Size: ${item.size}<br/>` : ''}
                ${item.filling ? `Filling: ${item.filling}<br/>` : ''}
                ${item.color ? `Colour: ${item.color}<br/>` : ''}
                ${item.dietaryOptions?.length > 0 ? `Dietary Options: ${item.dietaryOptions.join(', ')}<br/>` : ''}
                ${item.notes ? `Special Instructions: ${item.notes}<br/>` : ''}
                Quantity: ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}
              </p>
            `).join('')}
            <p style="font-size: 1.2em;"><strong>Total: $${order.total.toFixed(2)}</strong></p>
          </div>
        </div>
      `,
    });

    // Send confirmation email to customer
    await resend.emails.send({
      from: "Padie's Cakes <info@padiescakes.ca>",
      to: order.email,
      subject: `Order Confirmation #${orderNumber} - Padie's Cakes`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="background-color: #F1D4E1; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <img src="https://padiescakes.ca/images/padiescakes.logo1.png" alt="PadieCakes" style="max-width: 150px; height: auto; margin-bottom: 10px;" />
            <h1 style="color: white; margin: 0;">Thank You for Your Order!</h1>
          </div>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px;">
            <p style="font-size: 1.1em;">Hi ${order.name},</p>
            <p>We've received your order and we're so excited to create something special for you! 🎉</p>
            <h2 style="color: #1f2937;">Order #${orderNumber}</h2>
            <h3 style="color: #374151;">Order Summary</h3>
            ${order.items.map((item: any) => `
              <p>
                <strong>${item.name}</strong><br/>
                Flavor: ${item.flavor}<br/>
                ${item.size ? `Size: ${item.size}<br/>` : ''}
                ${item.filling ? `Filling: ${item.filling}<br/>` : ''}
                ${item.color ? `Colour: ${item.color}<br/>` : ''}
                ${item.dietaryOptions?.length > 0 ? `Dietary Options: ${item.dietaryOptions.join(', ')}<br/>` : ''}
                ${item.notes ? `Special Instructions: ${item.notes}<br/>` : ''}
                Quantity: ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}
              </p>
            `).join('')}
            <p><strong>Total: $${order.total.toFixed(2)}</strong></p>
            <h3 style="color: #374151;">Delivery Details</h3>
            <p><strong>Address:</strong> ${order.address}</p>
            <p><strong>Date Needed:</strong> ${order.dateNeeded}</p>
            <div style="background-color: #dcfce7; border-left: 4px solid #10b981; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <h3 style="color: #065f46; margin-top: 0;">💳 Payment</h3>
              <p style="margin: 5px 0;">Your order total is <strong style="color: #1f2937;">$${order.total.toFixed(2)}</strong>.</p>
              <p style="margin: 5px 0;">We'll contact you via email with payment instructions.</p>
            </div>
            <div style="background-color: #e0f2fe; border-left: 4px solid #0284c7; padding: 15px; border-radius: 4px; margin-top: 20px;">
              <p style="margin: 0;"><strong>📞 Next Steps:</strong> We'll contact you within 24 hours to confirm your order details and finalize delivery arrangements.</p>
            </div>
            <p style="margin-top: 20px;">If you have any questions, please don't hesitate to reach out!</p>
            <p style="margin-top: 30px;">With love,<br><strong>Padie's Cakes Team</strong></p>
          </div>
        </div>
      `,
    });

    return Response.json({ success: true, orderNumber });
  } catch (error) {
    console.error('Order processing error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: 'Failed to process order', details: msg }, { status: 500 });
  }
}
