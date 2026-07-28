import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configure Nodemailer transporter (SMTP config or ethereal test account fallback)
    const host = process.env.SMTP_HOST || 'smtp.ethereal.email';
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER || '';
    const pass = process.env.SMTP_PASS || '';

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: user ? { user, pass } : undefined,
    });
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

    try {
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;

      if (!smtpUser || !smtpPass) {
        // Fallback to Ethereal test inbox if no SMTP user configured
        const testAccount = await nodemailer.createTestAccount();
        const testTransporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });

        const info = await testTransporter.sendMail({
          from: `"TickeX Tickets" <tickets@tickex.com>`,
          to: options.toEmail,
          subject: `🎟️ Your Ticket Pass: ${options.eventTitle}`,
          html: htmlBody,
        });

        const previewUrl = nodemailer.getTestMessageUrl(info);
        this.logger.log(`📧 Ticket Confirmation Email SENT to: ${options.toEmail}`);
        this.logger.log(`📥 Click to View/Download Email Pass in Browser: ${previewUrl}`);
      } else {
        // Send real email via configured SMTP (e.g. Gmail)
        const host = process.env.SMTP_HOST || 'smtp.gmail.com';
        const port = parseInt(process.env.SMTP_PORT || '465', 10);
        const isGmail = host.includes('gmail') || smtpUser.endsWith('@gmail.com');

        const activeTransporter = nodemailer.createTransport(
          isGmail
            ? {
                service: 'gmail',
                auth: {
                  user: smtpUser,
                  pass: smtpPass,
                },
              }
            : {
                host,
                port,
                secure: port === 465,
                auth: {
                  user: smtpUser,
                  pass: smtpPass,
                },
              }
        );

        const info = await activeTransporter.sendMail({
          from: process.env.SMTP_FROM || `"TickeX Tickets" <${smtpUser}>`,
          to: options.toEmail,
          subject: `🎟️ Your Ticket Pass: ${options.eventTitle}`,
          html: htmlBody,
        });

        this.logger.log(`📧 Ticket Confirmation Email AUTOMATICALLY DELIVERED to: ${options.toEmail} (MsgID: ${info.messageId})`);
      }
    } catch (err: any) {
      this.logger.error(`SMTP Send error (${err.message}). Generating fallback preview link...`);
      try {
        const testAccount = await nodemailer.createTestAccount();
        const testTransporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: { user: testAccount.user, pass: testAccount.pass },
        });
        const info = await testTransporter.sendMail({
          from: `"TickeX Tickets" <tickets@tickex.com>`,
          to: options.toEmail,
          subject: `🎟️ Your Ticket Pass: ${options.eventTitle}`,
          html: htmlBody,
        });
        const previewUrl = nodemailer.getTestMessageUrl(info);
        this.logger.log(`📥 [FALLBACK PASS LINK] View & Download Ticket Email in Browser: ${previewUrl}`);
      } catch (fallbackErr) {
        console.error('Fallback email error:', fallbackErr);
      }
    }
  }
}
