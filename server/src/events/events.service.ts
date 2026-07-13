import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createEventDto: CreateEventDto) {
    return this.prisma.event.create({
      data: {
        title: createEventDto.title,
        description: createEventDto.description,
        category: createEventDto.category,
        date: new Date(createEventDto.date),
        location: createEventDto.location,
        price: createEventDto.price ?? 0,
        image: createEventDto.image || undefined,
        featured: createEventDto.featured ?? false,
        organizerId: userId,
      },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll(search?: string, category?: string, location?: string) {
    const where: any = {};

    if (category && category !== 'All') {
      where.category = { equals: category, mode: 'insensitive' };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    return this.prisma.event.findMany({
      where,
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return event;
  }

  async update(id: string, userId: string, updateEventDto: UpdateEventDto) {
    const event = await this.findOne(id);

    if (event.organizerId !== userId) {
      throw new ForbiddenException('You are not authorized to update this event');
    }

    return this.prisma.event.update({
      where: { id },
      data: {
        title: updateEventDto.title,
        description: updateEventDto.description,
        category: updateEventDto.category,
        date: updateEventDto.date ? new Date(updateEventDto.date) : undefined,
        location: updateEventDto.location,
        price: updateEventDto.price,
        image: updateEventDto.image,
        featured: updateEventDto.featured,
      },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string, userRole?: string) {
    const event = await this.findOne(id);

    if (userRole !== 'ADMIN' && event.organizerId !== userId) {
      throw new ForbiddenException('You are not authorized to delete this event');
    }

    await this.prisma.event.delete({
      where: { id },
    });

    return { message: 'Event successfully removed' };
  }
}
