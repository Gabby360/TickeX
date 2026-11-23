import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { OrganizerApplicationDto } from './dto/organizer-application.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('apply-organizer')
  @HttpCode(HttpStatus.OK)
  async applyOrganizer(@Body() dto: OrganizerApplicationDto) {
    return this.usersService.submitOrganizerApplication(dto);
  }
}
