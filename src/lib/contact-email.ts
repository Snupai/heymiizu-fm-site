export type ContactInquiry = {
  name: string;
  email: string;
  telephone: string | null;
  referral: string | null;
  service: string;
  budget: string;
  deadline: string;
  region: "local" | "international";
  description: string;
};

function esc(input: string | undefined | null): string {
  if (!input) return "";
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatIsoDate(value: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;

  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatDeadlineRange(deadline: string): string {
  const [from, to] = deadline.split(" - ");
  if (!from || !to) return deadline;
  return `${formatIsoDate(from)} – ${formatIsoDate(to)}`;
}

export function getContactLocationLabel(
  region: ContactInquiry["region"],
): string {
  return region === "local" ? "Germany" : "International";
}

function fieldRow(label: string, valueHtml: string): string {
  return `
    <tr>
      <td style="padding:0 0 18px;">
        <p class="label" style="color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:.06em;margin:0 0 4px;">${esc(label)}</p>
        <p class="value" style="margin:0;font-size:16px;font-weight:600;color:#0b0c0f;line-height:1.4;">${valueHtml}</p>
      </td>
    </tr>
  `;
}

export function buildContactInquiryEmail(inquiry: ContactInquiry) {
  const location = getContactLocationLabel(inquiry.region);
  const dates = inquiry.deadline ? formatDeadlineRange(inquiry.deadline) : "";
  const phone = inquiry.telephone;
  const referral = inquiry.referral;
  const descriptionHtml = esc(inquiry.description).replace(/\n/g, "<br>");

  const textLines = [
    `New project request (${location})`,
    "",
    `Service: ${inquiry.service}`,
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    `Phone: ${phone ?? "Not provided"}`,
    `Found via: ${referral ?? "Not specified"}`,
    `Budget: ${inquiry.budget || "Not provided"}`,
    `Project dates: ${dates || "Not provided"}`,
    "",
    "About the project:",
    inquiry.description,
  ];

  const html = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
    <title>New Project Request</title>
    <style>
      :root { color-scheme: light dark; supported-color-schemes: light dark; }
      body { margin:0; padding:0; background:#e6f3ff; }
      .wrapper { width:100%; background:#e6f3ff; padding:24px 0; }
      .container { width:100%; max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 6px 24px rgba(0,0,0,0.08); }
      .header { padding:20px 24px; background:linear-gradient(135deg,#0189ff,#006fd1); color:#ffffff; }
      .title { margin:0; font-size:20px; font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,'Helvetica Neue',sans-serif; }
      .location { padding:20px 24px; background:#e6f3ff; border-bottom:1px solid rgba(1,137,255,0.18); }
      .location-label { margin:0; color:#0189ff; font-size:11px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; }
      .location-value { margin:6px 0 0; color:#0b0c0f; font-size:28px; font-weight:700; letter-spacing:-0.03em; line-height:1.1; }
      .content { padding:24px; font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,'Helvetica Neue',sans-serif; color:#0b0c0f; line-height:1.6; }
      .label { color:#6b7280; font-size:12px; text-transform:uppercase; letter-spacing:.06em; margin:0 0 4px; }
      .value { margin:0; font-size:16px; font-weight:600; color:#0b0c0f; }
      .badge { display:inline-block; padding:6px 12px; border-radius:999px; background:#e6f3ff; color:#0189ff; font-size:14px; font-weight:700; }
      .muted { color:#6b7280; font-size:12px; }
      .description { background:#f4f9ff; border-left:3px solid #0189ff; border-radius:10px; padding:14px 16px; }
      .cta { display:inline-block; margin-top:4px; background:#0189ff; color:#ffffff !important; text-decoration:none; padding:10px 14px; border-radius:10px; font-weight:600; }
      @media (prefers-color-scheme: dark) {
        body, .wrapper { background:#0b0c0f !important; }
        .container { background:#0f172a !important; box-shadow:none; }
        .location { background:#050315 !important; border-bottom-color:#1f2937 !important; }
        .location-value, .content, .value { color:#e5e7eb !important; }
        .description { background:rgba(1,137,255,0.12) !important; }
        .badge { background:rgba(1,137,255,0.12) !important; color:#9ccfff !important; }
        .cta { background:#0189ff !important; color:#ffffff !important; }
      }
    </style>
  </head>
  <body>
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(location)} · ${esc(inquiry.service)} · ${esc(inquiry.name)}</div>
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
                <td class="location">
                  <p class="location-label">Location</p>
                  <p class="location-value">${esc(location)}</p>
                </td>
              </tr>
              <tr>
                <td class="content">
                  <p class="muted" style="margin:0 0 12px">You received a new inquiry via the contact form.</p>
                  <p class="label" style="margin-bottom:8px;">Service</p>
                  <span class="badge">${esc(inquiry.service)}</span>

                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:24px;">
                    ${fieldRow("Name", esc(inquiry.name))}
                    ${fieldRow(
                      "Email",
                      `<a href="mailto:${esc(inquiry.email)}" style="color:#0189ff;text-decoration:underline;">${esc(inquiry.email)}</a>`,
                    )}
                    ${
                      phone
                        ? fieldRow(
                            "Phone",
                            `<a href="tel:${esc(phone)}" style="color:#0189ff;text-decoration:underline;">${esc(phone)}</a>`,
                          )
                        : ""
                    }
                    ${referral ? fieldRow("Found via", esc(referral)) : ""}
                    ${inquiry.budget ? fieldRow("Budget", esc(inquiry.budget)) : ""}
                    ${dates ? fieldRow("Project dates", esc(dates)) : ""}
                  </table>

                  <p class="label">About the project</p>
                  <div class="description">
                    <p class="value" style="margin:0;font-weight:500;line-height:1.55;">${descriptionHtml}</p>
                  </div>

                  <p style="margin:22px 0 0;">
                    <a class="cta" href="mailto:${esc(inquiry.email)}">Reply to ${esc(inquiry.name)}</a>
                  </p>
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
  `;

  return {
    subject: `New Project Request from ${inquiry.name} · ${location}`,
    text: textLines.join("\n"),
    html,
  };
}
