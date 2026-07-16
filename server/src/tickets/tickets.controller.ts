import { Controller, Post, Get, Body, UseGuards, Request, Param } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('purchase')
  purchaseTicket(
    @Request() req: any,
    @Body('eventId') eventId: string,
    @Body('reference') reference?: string,
  ) {
    return this.ticketsService.purchaseTicket(req.user.id, eventId, reference);
  }

  @Post('purchase-guest')
  purchaseTicketGuest(
    @Body('eventId') eventId: string,
    @Body('email') email: string,
    @Body('name') name: string,
    @Body('reference') reference?: string,
  ) {
    return this.ticketsService.purchaseTicketGuest(eventId, email, name, reference);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-tickets')
  getMyTickets(@Request() req: any) {
    return this.ticketsService.getUserTickets(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('scan')
  scanTicket(
    @Request() req: any,
    @Body('qrCode') qrCode: string,
    @Body('eventId') eventId: string,
  ) {
    return this.ticketsService.scanTicket(req.user.id, qrCode, eventId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('event/:eventId/analytics')
  getEventAnalytics(@Request() req: any, @Param('eventId') eventId: string) {
    return this.ticketsService.getEventAnalytics(req.user.id, eventId);
  }
}
