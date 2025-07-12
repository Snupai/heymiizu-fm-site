import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Simple in-memory rate limit: { [ip]: timestamp }
const rateLimit: Record<string, number> = {};
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
  const now = Date.now();
  if (rateLimit[ip] && now - rateLimit[ip] < RATE_LIMIT_WINDOW) {
    return NextResponse.json({ error: 'Please wait before sending another message.' }, { status: 429 });
  }
  rateLimit[ip] = now;

  const data = await req.json();
  const {
    name, email, telephone, company, projectType, sequenceLength, deadline, assets, description
  } = data;

  if (!name || !email || !projectType || !sequenceLength || !deadline || !assets || !description) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: process.env.EMAIL_TO || process.env.EMAIL_USER,
    subject: `New Project Request from ${name}`,
    text: `**Name:** ${name}\n**Email:** ${email}\n**Telephone:** ${telephone || 'N/A'}\n**Company:** ${company || 'N/A'}\n**Project Type:** ${projectType}\n**Sequence Length:** ${sequenceLength}\n**Deadline:** ${deadline}\n**Any Assets:** ${assets}\n\n**Description:**\n${description}`,
    replyTo: email,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 });
  }
} 