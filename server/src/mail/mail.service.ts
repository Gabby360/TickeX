import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export interface OrganizerApplicationEmailData {
  name: string;
  email: string;
  organization: string;
  category: string;
  location: string;
  date: string;
  isFree?: boolean;
  price?: number;
  description: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private etherealTransporter: nodemailer.Transporter | null = null;

  private async getEtherealTransporter() {
    if (!this.etherealTransporter) {
      const testAccount = await nodemailer.createTestAccount();
      this.etherealTransporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });
    }
    return this.etherealTransporter;
  }

  /**
   * Helper to send an email using Resend, configured SMTP (Gmail/other), or fallback to Ethereal
   */
  private async sendEmail(options: {
    to: string;
    subject: string;
    html: string;
    from?: string;
  }) {
    // 1. Check if Resend API key is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(resendApiKey);
        const resendFrom =
          process.env.RESEND_FROM || 'TickeX <onboarding@resend.dev>';

        const res = await resend.emails.send({
          from: resendFrom,
          to: options.to,
          subject: options.subject,
          html: options.html,
        });

        if (res.error) {
          throw new Error(res.error.message);
        }

        this.logger.log(
          `📧 Email DELIVERED via Resend to: ${options.to} (ID: ${res.data?.id})`,
        );
        return { success: true, messageId: res.data?.id };
      } catch (resendErr: unknown) {
        const errorMsg =
          resendErr instanceof Error ? resendErr.message : String(resendErr);
        this.logger.error(
          `Resend error sending to ${options.to}: ${errorMsg}`,
        );
      }
    }

    // 2. Check if SMTP is configured
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const defaultFrom =
      process.env.SMTP_FROM || `"TickeX" <${smtpUser || 'support@tickex.com'}>`;
    const from = options.from || defaultFrom;

    if (smtpUser && smtpPass) {
      try {
        const host = process.env.SMTP_HOST || 'smtp.gmail.com';
        const port = parseInt(process.env.SMTP_PORT || '465', 10);
        const isGmail =
          host.includes('gmail') || smtpUser.endsWith('@gmail.com');

        const activeTransporter = nodemailer.createTransport(
          isGmail
            ? {
                service: 'gmail',
                auth: { user: smtpUser, pass: smtpPass },
                connectionTimeout: 5000,
                greetingTimeout: 5000,
                socketTimeout: 8000,
              }
            : {
                host,
                port,
                secure: port === 465,
                auth: { user: smtpUser, pass: smtpPass },
                connectionTimeout: 5000,
                greetingTimeout: 5000,
                socketTimeout: 8000,
              },
        );

        const info = await activeTransporter.sendMail({
          from,
          to: options.to,
          subject: options.subject,
          html: options.html,
        });

        this.logger.log(
          `📧 Email DELIVERED to: ${options.to} (Subject: "${options.subject}", MsgID: ${info.messageId})`,
        );
        return { success: true, messageId: info.messageId };
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        this.logger.error(
          `SMTP Send error to ${options.to} (${errorMsg}). Generating fallback preview link...`,
        );
      }
    }

    // Fallback to Ethereal test inbox if no SMTP configured or if SMTP threw an error
    try {
      const transporter = await this.getEtherealTransporter();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const info = await transporter.sendMail({
        from: options.from || `"TickeX" <support@tickex.com>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const previewUrl = nodemailer.getTestMessageUrl(info);
      this.logger.log(
        `📥 [PREVIEW EMAIL] Delivered to Ethereal for ${options.to}: ${previewUrl}`,
      );
      return { success: true, previewUrl };
    } catch (fallbackErr: unknown) {
      const errorMsg =
        fallbackErr instanceof Error
          ? fallbackErr.message
          : String(fallbackErr);
      this.logger.error(`Fallback email error for ${options.to}: ${errorMsg}`);
      return { success: false, error: errorMsg };
    }
  }

  async sendTicketConfirmationEmail(options: {
    toEmail: string;
    userName: string;
    eventTitle: string;
    eventDate: string;
    eventLocation: string;
    ticketPrice: string;
    ticketId: string;
    qrCode: string;
    eventId: string;
  }) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const downloadUrl = `${frontendUrl}/events/${options.eventId}?ticketId=${options.ticketId}`;

    const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #030014; color: #ffffff; margin: 0; padding: 20px; }
        .card { max-width: 600px; margin: 0 auto; background: #0f172a; border: 1px solid #1e293b; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
        .header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; text-align: center; }
        .header h1 { margin: 0; color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
        .content { padding: 30px; }
        .greeting { font-size: 18px; color: #e2e8f0; margin-bottom: 20px; }
        .event-box { background: #1e293b; border-left: 4px solid #f97316; padding: 20px; border-radius: 12px; margin-bottom: 25px; }
        .event-title { font-size: 20px; font-weight: 700; color: #ffffff; margin-top: 0; margin-bottom: 10px; }
        .event-meta { color: #94a3b8; font-size: 14px; margin: 5px 0; }
        .qr-section { background: #090d16; border: 1px dashed #334155; padding: 20px; border-radius: 16px; text-align: center; margin: 25px 0; }
        .qr-code { font-family: monospace; font-size: 16px; background: #f97316; color: #ffffff; padding: 8px 16px; border-radius: 8px; display: inline-block; font-weight: bold; margin-top: 10px; }
        .btn-container { text-align: center; margin-top: 30px; }
        .btn { display: inline-block; background: #f97316; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-weight: bold; font-size: 16px; box-shadow: 0 10px 15px -3px rgba(249, 115, 22, 0.4); }
        .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; border-top: 1px solid #1e293b; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>🎟️ TickeX Ticket Pass Confirmed</h1>
        </div>
        <div class="content">
          <div class="greeting">Hello ${options.userName || 'Valued Attendee'},</div>
          <p style="color: #cbd5e1; line-height: 1.6;">
            Thank you for purchasing your pass on <strong>TickeX</strong>! Your ticket has been generated and is ready for entry at the gate.
          </p>
          
          <div class="event-box">
            <div class="event-title">${options.eventTitle}</div>
            <div class="event-meta">📅 Date: <strong>${options.eventDate}</strong></div>
            <div class="event-meta">📍 Location: <strong>${options.eventLocation}</strong></div>
            <div class="event-meta">💳 Paid: <strong>${options.ticketPrice}</strong></div>
          </div>

          <div class="qr-section">
            <div style="color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Single-Use Security Pass ID</div>
            <div class="qr-code">${options.qrCode}</div>
            <p style="color: #64748b; font-size: 12px; margin-top: 10px;">Present this digital pass or downloaded PDF at venue entry.</p>
          </div>

          <div class="btn-container">
            <a href="${downloadUrl}" class="btn" target="_blank">📥 View & Download Ticket Pass</a>
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} TickeX Ghana &bull; Instant Verified Ticketing Platform
        </div>
      </div>
    </body>
    </html>
    `;

    return this.sendEmail({
      to: options.toEmail,
      subject: `🎟️ Your Ticket Pass: ${options.eventTitle}`,
      html: htmlBody,
    });
  }

  /**
   * Sends dual emails upon organizer hosting application submission:
   * 1. Alert to Platform Admin that someone wants to host on TickeX
   * 2. Confirmation to Applicant acknowledging receipt of application
   */
  async sendOrganizerApplicationEmails(data: OrganizerApplicationEmailData) {
    const adminEmail =
      process.env.ADMIN_EMAIL ||
      process.env.SMTP_USER ||
      'agblevorgabriel@gmail.com';
    const frontendUrl =
      process.env.FRONTEND_URL || 'https://ticke-x-blond.vercel.app';
    const adminDashboardUrl = `${frontendUrl}/admin/dashboard`;

    const pricingDisplay = data.isFree
      ? '🎟️ Free Event (No Admission Fee)'
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
        .cta-container { text-align: center; margin: 30px 0 10px 0; }
        .btn { display: inline-block; background: #f97316; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 700; font-size: 15px; box-shadow: 0 10px 15px -3px rgba(249, 115, 22, 0.4); }
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
            <div class="row"><span class="label">💳 Ticket Pricing:</span><span class="value" style="color: ${data.isFree ? '#34d399' : '#fb923c'};">${pricingDisplay}</span></div>
          </div>

          <div style="font-size: 13px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">About the Planned Event:</div>
          <div class="desc-box">${data.description}</div>

          <div class="cta-container">
            <a href="${adminDashboardUrl}" class="btn" target="_blank">Open Admin Dashboard & Upgrade User</a>
          </div>
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
            <div class="row"><span class="label">💳 Pricing / Admission:</span><span class="value" style="color: ${data.isFree ? '#34d399' : '#fb923c'};">${pricingDisplay}</span></div>
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

    // Send emails sequentially or via Promise.allSettled
    const adminResult = await this.sendEmail({
      to: adminEmail,
      subject: `🚀 New Organizer Application: ${data.organization || data.name} wants to host on TickeX`,
      html: adminHtml,
    });

    const applicantResult = await this.sendEmail({
      to: data.email,
      subject: `🎉 Application Received: Hosting on TickeX`,
      html: applicantHtml,
    });

    this.logger.log(
      `Organizer application emails dispatched. Admin notification: ${adminResult.success ? 'Sent' : 'Failed'}, Applicant confirmation: ${applicantResult.success ? 'Sent' : 'Failed'}`,
    );

    return {
      adminNotification: adminResult,
      applicantConfirmation: applicantResult,
    };
  }
}
