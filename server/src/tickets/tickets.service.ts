import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  async purchaseTicket(userId: string, eventId: string, reference?: string) {
    // 1. Check if event exists
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // 2. Paystack verification for paid events
    if (event.price > 0) {
      if (!reference) {
        throw new BadRequestException('Transaction reference is required for paid events');
      }

      // Check if reference is already used to prevent double-spending
      const existingTicket = await this.prisma.ticket.findUnique({
        where: { paymentReference: reference },
      });
      if (existingTicket) {
        throw new BadRequestException('This transaction reference has already been used');
      }

      // Verify transaction with Paystack API
      const paystackSecret = process.env.PAYSTACK_SECRET_KEY || 'sk_test_7a1ab0b8ef6c3b6e8a8da25dc012a65fdfa5e01b';
      try {
        const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${paystackSecret}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errText = await response.text();
          console.error('Paystack verification error:', response.status, errText);
          throw new BadRequestException(`Failed to communicate with payment gateway. Paystack status: ${response.status}`);
        }

        const verification = await response.json();
        
        if (!verification.status || verification.data.status !== 'success') {
          throw new BadRequestException('Payment was not successful or could not be verified');
        }

        // Validate amount (Paystack amount is in kobo/pesewas) and currency
        const paidAmount = verification.data.amount; // e.g. 2000 for GH₵ 20
        const expectedAmount = event.price * 100;
        const paidCurrency = verification.data.currency;

        if (paidAmount < expectedAmount) {
          throw new BadRequestException(`Insufficient paid amount. Expected GH₵ ${event.price}`);
        }

        if (paidCurrency !== 'GHS') {
          throw new BadRequestException('Invalid payment currency. Expected GHS');
        }
      } catch (err: any) {
        if (err instanceof BadRequestException) throw err;
        throw new BadRequestException('Error validating payment with Paystack: ' + err.message);
      }
    }

    // 3. Create the ticket
    const ticket = await this.prisma.ticket.create({
      data: {
        userId,
        eventId,
        status: 'PAID',
        paymentReference: event.price > 0 ? reference : null,
      },
      include: {
        event: true,
      },
    });

    return ticket;
  }

  async getUserTickets(userId: string) {
    return this.prisma.ticket.findMany({
      where: { userId },
      include: {
        event: {
          include: {
            organizer: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async scanTicket(userId: string, qrCode: string, eventId: string) {
    // 1. Verify user is the organizer of the event
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.organizerId !== userId) {
      throw new BadRequestException('You do not have permission to scan tickets for this event');
    }

    // 2. Find the ticket
    const ticket = await this.prisma.ticket.findUnique({
      where: { qrCode },
      include: { user: { select: { name: true, email: true } } },
    });

    if (!ticket) {
      throw new NotFoundException('Invalid ticket QR Code');
    }

    if (ticket.eventId !== eventId) {
      throw new BadRequestException('Ticket belongs to a different event');
    }

    if (ticket.status === 'SCANNED') {
      throw new BadRequestException('Ticket has already been scanned');
    }

    if (ticket.status !== 'PAID') {
      throw new BadRequestException(`Ticket status is ${ticket.status}`);
    }

    // 3. Mark as scanned
    const updatedTicket = await this.prisma.ticket.update({
      where: { id: ticket.id },
      data: {
        status: 'SCANNED',
        scannedAt: new Date(),
      },
    });

    return {
      success: true,
      message: 'Ticket scanned successfully',
      attendee: ticket.user.name || ticket.user.email,
      ticket: updatedTicket,
    };
  }

  async getEventAnalytics(userId: string, eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.organizerId !== userId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (user?.role !== 'ADMIN') {
        throw new BadRequestException('You do not have permission to view analytics for this event');
      }
    }

    const tickets = await this.prisma.ticket.findMany({
      where: { eventId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalTicketsSold = tickets.length;
    const totalScanned = tickets.filter((t) => t.status === 'SCANNED').length;
    const totalRevenue = totalTicketsSold * event.price;

    return {
      event,
      totalTicketsSold,
      totalScanned,
      totalRevenue,
      attendees: tickets,
    };
  }
}
