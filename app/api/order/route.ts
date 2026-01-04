import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with API key from environment
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(request: NextRequest) {
  try {
    // Check if Resend is configured
    if (!resend) {
      console.error('Resend API key is not configured');
      return NextResponse.json(
        {
          success: false,
          error: 'Email service is not configured. Please contact support.',
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { customer, items, total, orderNumber } = body;

    // Format order items for email
    const itemsList = items
      .map(
        (item: any) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
            <strong>${item.name}</strong><br />
            <small>Flavor: ${item.flavor}</small><br />
            ${item.dietaryOptions.length > 0 ? `<small>Options: ${item.dietaryOptions.join(', ')}</small><br />` : ''}
            <small>Quantity: ${item.quantity}</small>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
            $${(item.price * item.quantity).toFixed(2)}
          </td>
        </tr>
      `
      )
      .join('');

    // Email to business owner
    const ownerEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>New Order - Padiescakes</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #ec4899; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">New Order Received!</h1>
          </div>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #ec4899; margin-top: 0;">Order #${orderNumber}</h2>
            
            <h3 style="color: #374151; margin-bottom: 10px;">Customer Information</h3>
            <table style="width: 100%; margin-bottom: 20px; background: white; border-radius: 8px; padding: 15px;">
              <tr>
                <td style="padding: 8px;"><strong>Name:</strong></td>
                <td style="padding: 8px;">${customer.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px;"><strong>Email:</strong></td>
                <td style="padding: 8px;">${customer.email}</td>
              </tr>
              <tr>
                <td style="padding: 8px;"><strong>Phone:</strong></td>
                <td style="padding: 8px;">${customer.phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px;"><strong>Delivery Address:</strong></td>
                <td style="padding: 8px;">${customer.deliveryAddress}</td>
              </tr>
              <tr>
                <td style="padding: 8px;"><strong>Date Needed:</strong></td>
                <td style="padding: 8px;">${customer.dateNeeded}</td>
              </tr>
              ${customer.specialNotes ? `
              <tr>
                <td style="padding: 8px;"><strong>Special Notes:</strong></td>
                <td style="padding: 8px;">${customer.specialNotes}</td>
              </tr>
              ` : ''}
            </table>
            
            <h3 style="color: #374151; margin-bottom: 10px;">Order Items</h3>
            <table style="width: 100%; margin-bottom: 20px; background: white; border-radius: 8px; border-collapse: collapse;">
              ${itemsList}
              <tr>
                <td style="padding: 12px; text-align: right;"><strong>Total:</strong></td>
                <td style="padding: 12px; text-align: right;"><strong style="color: #ec4899; font-size: 1.2em;">$${total.toFixed(2)}</strong></td>
              </tr>
            </table>
            
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin-top: 20px;">
              <p style="margin: 0;"><strong>⚠️ Action Required:</strong> Please contact the customer to confirm the order and arrange delivery details.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Email to customer (confirmation)
    const customerEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Order Confirmation - Padiescakes</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #ec4899; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">Thank You for Your Order!</h1>
          </div>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px;">
            <p style="font-size: 1.1em;">Hi ${customer.name},</p>
            <p>We've received your order and we're so excited to create something special for you! 🎉</p>
            
            <h2 style="color: #ec4899; margin-top: 20px;">Order #${orderNumber}</h2>
            
            <h3 style="color: #374151; margin-bottom: 10px;">Order Summary</h3>
            <table style="width: 100%; margin-bottom: 20px; background: white; border-radius: 8px; border-collapse: collapse;">
              ${itemsList}
              <tr>
                <td style="padding: 12px; text-align: right;"><strong>Total:</strong></td>
                <td style="padding: 12px; text-align: right;"><strong style="color: #ec4899; font-size: 1.2em;">$${total.toFixed(2)}</strong></td>
              </tr>
            </table>
            
            <h3 style="color: #374151; margin-bottom: 10px;">Delivery Details</h3>
            <table style="width: 100%; margin-bottom: 20px; background: white; border-radius: 8px; padding: 15px;">
              <tr>
                <td style="padding: 8px;"><strong>Address:</strong></td>
                <td style="padding: 8px;">${customer.deliveryAddress}</td>
              </tr>
              <tr>
                <td style="padding: 8px;"><strong>Date Needed:</strong></td>
                <td style="padding: 8px;">${customer.dateNeeded}</td>
              </tr>
            </table>
            
            <div style="background-color: #dcfce7; border-left: 4px solid #10b981; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <h3 style="color: #065f46; margin-top: 0;">💳 Payment Instructions</h3>
              <p style="margin: 5px 0;">Please send an e-transfer for <strong style="color: #ec4899;">$${total.toFixed(2)}</strong> to:</p>
              <p style="margin: 5px 0; font-size: 1.2em;"><strong>padiescakes@gmail.com</strong></p>
              <p style="margin: 5px 0;"><strong>Reference:</strong> Order #${orderNumber}</p>
            </div>
            
            <div style="background-color: #e0f2fe; border-left: 4px solid #0284c7; padding: 15px; border-radius: 4px; margin-top: 20px;">
              <p style="margin: 0;"><strong>📞 Next Steps:</strong> We'll contact you within 24 hours to confirm your order details and finalize delivery arrangements.</p>
            </div>
            
            <p style="margin-top: 20px;">If you have any questions, please don't hesitate to reach out!</p>
            
            <p style="margin-top: 30px;">With love,<br><strong>Padiescakes Team</strong></p>
          </div>
        </body>
      </html>
    `;

    // Send email to business owner
    await resend.emails.send({
      from: 'Padiescakes Orders <orders@padiescakes.com>',
      to: 'padiescakes@gmail.com',
      subject: `New Order #${orderNumber} - $${total.toFixed(2)}`,
      html: ownerEmailHtml,
    });

    // Send confirmation email to customer
    await resend.emails.send({
      from: 'Padiescakes <orders@padiescakes.com>',
      to: customer.email,
      subject: `Order Confirmation #${orderNumber} - Padiescakes`,
      html: customerEmailHtml,
    });

    return NextResponse.json(
      {
        success: true,
        orderNumber,
        total,
        message: 'Order placed successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Order processing error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process order',
      },
      { status: 500 }
    );
  }
}
