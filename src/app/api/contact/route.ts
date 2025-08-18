import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Simple in-memory rate limit: { [ip]: timestamp }
const rateLimit: Record<string, number> = {};
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown';
  const now = Date.now();
  if (rateLimit[ip] && now - rateLimit[ip] < RATE_LIMIT_WINDOW) {
    return NextResponse.json({ error: 'Please wait before sending another message.' }, { status: 429 });
  }
  rateLimit[ip] = now;

  const data = await req.json() as {
    name: string;
    email: string;
    telephone?: string;
    company?: string;
    projectType: string;
    sequenceLength: string;
    deadline?: string;
    assets: string;
    description: string;
  };
  const {
    name, email, telephone, company, projectType, sequenceLength, deadline, assets, description
  } = data;

  if (!name || !email || !projectType || !sequenceLength || !assets || !description) {
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

  const deadlineDisplay = (deadline && deadline.trim().length > 0) ? deadline : 'No deadline';

  const mailOptions = {
    from: process.env.EMAIL_FROM ?? process.env.EMAIL_USER,
    to: process.env.EMAIL_TO ?? process.env.EMAIL_USER,
    subject: `New Project Request from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nTelephone: ${telephone ?? 'N/A'}\nCompany: ${company ?? 'N/A'}\nProject Type: ${projectType}\nSequence Length: ${sequenceLength}\nDeadline: ${deadlineDisplay}\nAny Assets: ${assets}\n\nDescription:\n${description}`,
    html: `
<h2>New Project Request</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Telephone:</strong> ${telephone ?? 'N/A'}</p>
<p><strong>Company:</strong> ${company ?? 'N/A'}</p>
<p><strong>Project Type:</strong> ${projectType}</p>
<p><strong>Sequence Length:</strong> ${sequenceLength}</p>
<p><strong>Deadline:</strong> ${deadlineDisplay}</p>
<p><strong>Any Assets:</strong> ${assets}</p>
<br>
<p><strong>Description:</strong></p>
<p>${description.replace(/\n/g, '<br>')}</p>
    `,
    replyTo: email,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 });
  }
} 