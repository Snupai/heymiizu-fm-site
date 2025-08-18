import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Simple in-memory rate limit: { [ip]: timestamp }
const rateLimit: Record<string, number> = {};
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

// Escape HTML to avoid injection in email template
function esc(input: string | undefined | null): string {
  if (!input) return '';
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

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
    cooperation?: string;
    description: string;
  };
  const {
    name, email, telephone, company, projectType, sequenceLength, deadline, assets, cooperation, description
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
    text: `Name: ${name}\nEmail: ${email}\nTelephone: ${telephone ?? 'N/A'}\nCompany: ${company ?? 'N/A'}\nProject Type: ${projectType}\nCommission Type: ${cooperation ?? 'N/A'}\nSequence Length: ${sequenceLength}\nDeadline: ${deadlineDisplay}\nAny Assets: ${assets}\n\nDescription:\n${description}`,
    html: `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
    <title>New Project Request</title>
    <style>
      /* Prefer simple, inline-friendly styles for better client support */
      :root { color-scheme: light dark; supported-color-schemes: light dark; }
      /* Surface/backgrounds from style-guide */
      body { margin:0; padding:0; background:#e6f3ff; }
      .wrapper { width:100%; background:#e6f3ff; padding:24px 0; }
      .container { width:100%; max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 6px 24px rgba(0,0,0,0.08); }
      /* Brand header */
      .header { padding:20px 24px; background:linear-gradient(135deg,#0189ff,#006fd1); color:#ffffff; }
      .title { margin:0; font-size:20px; font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,'Helvetica Neue',sans-serif; }
      .content { padding:24px; font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,'Helvetica Neue',sans-serif; color:#0b0c0f; line-height:1.6; }
      .label { color:#6b7280; font-size:12px; text-transform:uppercase; letter-spacing:.06em; margin:0 0 4px; }
      .value { margin:0 0 16px; font-size:14px; color:#0b0c0f; }
      .divider { height:1px; background:#e6e6e6; margin:8px 0 20px; }
      .badge { display:inline-block; padding:6px 12px; border-radius:999px; background:#e6f3ff; color:#0189ff; font-size:14px; font-weight:700; }
      .muted { color:#6b7280; font-size:12px; }
      .cta { display:inline-block; margin-top:12px; background:#0189ff; color:#ffffff !important; text-decoration:none; padding:10px 14px; border-radius:10px; font-weight:600; }
      @media (prefers-color-scheme: dark) {
        body, .wrapper { background:#0b0c0f !important; }
        .container { background:#0f172a !important; box-shadow:none; }
        .content { color:#e5e7eb !important; }
        .value { color:#e5e7eb !important; }
        .divider { background:#1f2937 !important; }
        .badge { background:rgba(1,137,255,0.12) !important; color:#9ccfff !important; }
        .cta { background:#0189ff !important; color:#ffffff !important; }
      }
    </style>
  </head>
  <body>
    <!-- Preheader text -->
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">New project request from ${esc(name)}</div>
    <div class="wrapper">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td align="center">
            <table role="presentation" class="container" width="600" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td class="header">
                  <h1 class="title">New Project Request</h1>
                </td>
              </tr>
              <tr>
                <td class="content">
                  <p class="muted" style="margin:0 0 12px">You received a new inquiry via the contact form.</p>
                  <span class="badge">${esc(projectType)}</span>
                  <div class="divider"></div>

                  <p class="label">Name</p>
                  <p class="value">${esc(name)}</p>

                  <p class="label">Email</p>
                  <p class="value"><a href="mailto:${esc(email)}" style="color:#0189ff; text-decoration:underline;">${esc(email)}</a></p>

                  <p class="label">Telephone</p>
                  <p class="value">${esc(telephone ?? 'N/A')}</p>

                  <p class="label">Company</p>
                  <p class="value">${esc(company ?? 'N/A')}</p>

                  <p class="label">Commission Type</p>
                  <p class="value">${esc(cooperation ?? 'N/A')}</p>

                  <p class="label">Sequence Length</p>
                  <p class="value">${esc(sequenceLength)}</p>

                  <p class="label">Deadline</p>
                  <p class="value">${esc(deadlineDisplay)}</p>

                  <p class="label">Any Assets</p>
                  <p class="value">${esc(assets)}</p>

                  <div class="divider"></div>
                  <p class="label">Description</p>
                  <p class="value">${esc(description).replace(/\n/g, '<br>')}</p>
                  <p class="muted" style="margin-top:16px;">This message was generated from your website contact form.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>
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
 