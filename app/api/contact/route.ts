import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(req: Request) {
  try {
    const { name, email, phone, occasion, message } = await req.json();

    if (!name || !email || !message) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!resend) {
      return Response.json({ error: 'Email service is not configured.' }, { status: 500 });
    }

    await resend.emails.send({
      from: "Padie's Cakes <orders@padiescakes.ca>",
      to: 'joshuams128@gmail.com',
      subject: `New Inquiry from ${name}${occasion ? ` - ${occasion}` : ''}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="background-color: #f6d3e1; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <img src="https://padiescakes.ca/images/padiescakes.logo1.png" alt="PadieCakes" style="max-width: 150px; height: auto; margin-bottom: 10px;" />
            <h1 style="color: white; margin: 0;">New Contact Inquiry</h1>
          </div>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px;">
            <h3 style="color: #374151;">Contact Details</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            ${occasion ? `<p><strong>Occasion:</strong> ${occasion}</p>` : ''}
            <h3 style="color: #374151;">Message</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: 'Failed to send message', details: msg }, { status: 500 });
  }
}
