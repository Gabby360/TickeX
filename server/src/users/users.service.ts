import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../generated/prisma';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

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
    const totalPlatformRevenue = tickets.reduce((acc, t) => acc + t.event.price, 0);

    return {
      totalUsers,
      totalEvents,
      totalTickets,
      totalPlatformRevenue,
    };
  }
}
