import {  NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getRequiredEnv, getOptionalEnv } from '@/app/lib/env';

const resend = new Resend(getRequiredEnv('RESEND_API_KEY'));

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    //validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Get required environment variables (will throw if missing)
    const contactEmail = getRequiredEnv('CONTACT_EMAIL');
    const fromEmail = getOptionalEnv('RESEND_FROM_EMAIL', 'onboarding@resend.dev');

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: `Portfolio Contact <${fromEmail}>`, // Use verified domain in production
      to: [contactEmail],
      subject: `New Contact Form Submission from ${name}`,
      replyTo: email,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f04e90;">New Contact Form Message</h2>
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
          </div>
          <div style="margin: 20px 0;">
            <h3>Message:</h3>
            <p style="line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          <hr style="border: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #6b7280; font-size: 14px;">
            This message was sent from your portfolio contact form.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Email sent successfully', id: data?.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}