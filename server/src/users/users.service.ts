import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../generated/prisma';
import { MailService } from '../mail/mail.service';
import { OrganizerApplicationDto } from './dto/organizer-application.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            events: true,
            tickets: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateUserRole(id: string, role: Role) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, name: true, role: true },
    });
  }

  async getAdminStats() {
    const [totalUsers, totalEvents, tickets] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.event.count(),
      this.prisma.ticket.findMany({
        include: { event: { select: { price: true } } },
      }),
    ]);

    const totalTickets = tickets.length;
    const totalPlatformRevenue = tickets.reduce(
      (acc, t) => acc + t.event.price,
      0,
    );

    return {
      totalUsers,
      totalEvents,
      totalTickets,
      totalPlatformRevenue,
    };
  }

  async submitOrganizerApplication(dto: OrganizerApplicationDto) {
    let existingUser: { id: string; email: string } | null = null;
    try {
      existingUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
        select: { id: true, email: true },
      });
    } catch (dbErr: unknown) {
      const errorMsg = dbErr instanceof Error ? dbErr.message : String(dbErr);
      console.warn(
        'Could not query user in DB for organizer application:',
        errorMsg,
      );
    }

    const emailResult = await this.mailService.sendOrganizerApplicationEmails({
      name: dto.name,
      email: dto.email,
      organization: dto.organization,
      category: dto.category,
      location: dto.location,
      date: dto.date,
      isFree: dto.isFree,
      price: dto.price,
      description: dto.description,
    });

    return {
      success: true,
      message:
        'Organizer application submitted successfully. Confirmation emails sent.',
      userRegistered: !!existingUser,
      application: {
        name: dto.name,
        email: dto.email,
        organization: dto.organization,
        category: dto.category,
        location: dto.location,
        date: dto.date,
        isFree: !!dto.isFree,
        price: dto.price || 0,
      },
      emailDelivery: emailResult,
    };
  }
}
