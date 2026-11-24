import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const resendApiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL || "agbleger@gmail.com";
    const pricingDisplay = data.isFree
      ? "🎟️ Free Event (No Admission Fee)"
      : `💳 Paid Event: GH₵ ${(data.price || 0).toFixed(2)}`;

    // 1. Email to Platform Admin
    const adminHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #030712; color: #f8fafc; margin: 0; padding: 20px; }
        .card { max-width: 620px; margin: 0 auto; background: #0f172a; border: 1px solid #1e293b; border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); }
        .header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 32px 24px; text-align: center; }
        .header h1 { margin: 0; color: #ffffff; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
        .header p { margin: 6px 0 0 0; color: #ffedd5; font-size: 14px; font-weight: 500; }
        .content { padding: 32px 28px; }
        .badge { display: inline-block; background: rgba(249, 115, 22, 0.15); border: 1px solid #f97316; color: #fb923c; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 4px 12px; border-radius: 9999px; margin-bottom: 16px; }
        .intro { font-size: 15px; line-height: 1.6; color: #cbd5e1; margin-bottom: 24px; }
        .details-box { background: #1e293b; border: 1px solid #334155; border-radius: 14px; padding: 20px; margin-bottom: 24px; }
        .row { display: flex; justify-content: space-between; border-bottom: 1px solid #2d3b55; padding: 10px 0; font-size: 14px; }
        .row:last-child { border-bottom: none; }
        .label { color: #94a3b8; font-weight: 600; }
        .value { color: #f8fafc; font-weight: 700; text-align: right; }
        .desc-box { background: #090d16; border-left: 4px solid #f97316; padding: 16px; border-radius: 8px; margin-top: 12px; font-size: 14px; color: #e2e8f0; line-height: 1.5; white-space: pre-wrap; }
        .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; border-top: 1px solid #1e293b; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>🚀 New Organizer Hosting Request</h1>
          <p>Someone wants to host an event on TickeX</p>
        </div>
        <div class="content">
          <div class="badge">Host Application</div>
          <p class="intro">
            A prospective organizer has submitted details to host events on your platform. Review the event specifications below:
          </p>

          <div class="details-box">
            <div class="row"><span class="label">👤 Applicant Name:</span><span class="value">${data.name}</span></div>
            <div class="row"><span class="label">✉️ Email Address:</span><span class="value"><a href="mailto:${data.email}" style="color: #fb923c; text-decoration: none;">${data.email}</a></span></div>
            <div class="row"><span class="label">🏢 Organization / Brand:</span><span class="value">${data.organization}</span></div>
            <div class="row"><span class="label">🏷️ Primary Category:</span><span class="value">${data.category}</span></div>
            <div class="row"><span class="label">📅 Proposed Event Date:</span><span class="value">${data.date}</span></div>
            <div class="row"><span class="label">📍 Proposed Location:</span><span class="value">${data.location}</span></div>
            <div class="row"><span class="label">💳 Ticket Pricing:</span><span class="value" style="color: ${data.isFree ? "#34d399" : "#fb923c"};">${pricingDisplay}</span></div>
          </div>

          <div style="font-size: 13px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">About the Planned Event:</div>
          <div class="desc-box">${data.description}</div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} TickeX Ghana &bull; Instant Verified Ticketing Platform
        </div>
      </div>
    </body>
    </html>
    `;

    // 2. Email to Applicant
    const applicantHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #030712; color: #f8fafc; margin: 0; padding: 20px; }
        .card { max-width: 620px; margin: 0 auto; background: #0f172a; border: 1px solid #1e293b; border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); }
        .header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 32px 24px; text-align: center; }
        .header h1 { margin: 0; color: #ffffff; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
        .header p { margin: 6px 0 0 0; color: #ffedd5; font-size: 14px; font-weight: 500; }
        .content { padding: 32px 28px; }
        .greeting { font-size: 18px; font-weight: 700; color: #ffffff; margin-bottom: 12px; }
        .intro { font-size: 15px; line-height: 1.6; color: #cbd5e1; margin-bottom: 24px; }
        .details-box { background: #1e293b; border: 1px solid #334155; border-radius: 14px; padding: 20px; margin-bottom: 24px; }
        .row { display: flex; justify-content: space-between; border-bottom: 1px solid #2d3b55; padding: 10px 0; font-size: 14px; }
        .row:last-child { border-bottom: none; }
        .label { color: #94a3b8; font-weight: 600; }
        .value { color: #f8fafc; font-weight: 700; text-align: right; }
        .next-steps { background: rgba(249, 115, 22, 0.08); border: 1px solid rgba(249, 115, 22, 0.3); border-radius: 14px; padding: 20px; margin-top: 24px; }
        .next-steps h4 { margin: 0 0 10px 0; color: #fb923c; font-size: 15px; font-weight: 700; }
        .next-steps ol { margin: 0; padding-left: 20px; color: #cbd5e1; font-size: 14px; line-height: 1.6; }
        .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; border-top: 1px solid #1e293b; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>🎉 Application Received!</h1>
          <p>Thank you for choosing to host on TickeX</p>
        </div>
        <div class="content">
          <div class="greeting">Hello ${data.name},</div>
          <p class="intro">
            We have received your application to become an event organizer on <strong>TickeX</strong>. Our administrative team has been notified and is currently reviewing your event submission.
          </p>

          <div class="details-box">
            <div style="font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;">Submitted Details:</div>
            <div class="row"><span class="label">🏢 Organization / Host:</span><span class="value">${data.organization}</span></div>
            <div class="row"><span class="label">🏷️ Event Category:</span><span class="value">${data.category}</span></div>
            <div class="row"><span class="label">📅 Proposed Event Date:</span><span class="value">${data.date}</span></div>
            <div class="row"><span class="label">📍 Event Location:</span><span class="value">${data.location}</span></div>
            <div class="row"><span class="label">💳 Pricing / Admission:</span><span class="value" style="color: ${data.isFree ? "#34d399" : "#fb923c"};">${pricingDisplay}</span></div>
          </div>

          <div class="next-steps">
            <h4>🔍 What happens next?</h4>
            <ol>
              <li><strong>Review:</strong> Our administration team reviews every organizer application to ensure verified quality and safety.</li>
              <li><strong>Approval:</strong> Within 24 hours, your account will be upgraded to <strong>Organizer</strong> status.</li>
              <li><strong>Launch:</strong> Once approved, you can create tickets, configure payouts, and leverage our high-speed QR check-in technology.</li>
            </ol>
          </div>
        </div>
        <div class="footer">
          Need urgent help? Contact us at <a href="mailto:${adminEmail}" style="color: #fb923c; text-decoration: none;">${adminEmail}</a><br/>
          &copy; ${new Date().getFullYear()} TickeX Ghana &bull; Instant Verified Ticketing Platform
        </div>
      </div>
    </body>
    </html>
    `;

    // Send emails via Resend REST API
    if (resendApiKey) {
      await Promise.allSettled([
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "TickeX <onboarding@resend.dev>",
            to: adminEmail,
            subject: `🚀 New Organizer Application: ${data.organization || data.name} wants to host on TickeX`,
            html: adminHtml,
          }),
        }),
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "TickeX <onboarding@resend.dev>",
            to: data.email,
            subject: "🎉 Application Received: Hosting on TickeX",
            html: applicantHtml,
          }),
        }),
      ]);
    }

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully. Confirmation emails sent.",
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to process application";
    return NextResponse.json(
      { success: false, message },
      { status: 500 },
    );
  }
}
