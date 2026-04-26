import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RoleType } from '@prisma/client';

@Controller('sessions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER, RoleType.TEACHER)
  create(@Body() body: { classId: string; teacherId: string; title: string; scheduledAt: string; roomId?: string }) {
    return this.sessionsService.create(body);
  }

  @Get()
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER, RoleType.TEACHER, RoleType.STUDENT)
  findAll(@Query('classId') classId: string, @Query('teacherId') teacherId: string) {
    return this.sessionsService.findAll(classId, teacherId);
  }

  @Get(':id')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER, RoleType.TEACHER, RoleType.STUDENT)
  findOne(@Param('id') id: string) {
    return this.sessionsService.findOne(id);
  }

  @Post(':id/start')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.TEACHER)
  start(@Param('id') id: string) {
    return this.sessionsService.start(id);
  }

  @Post(':id/join')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER, RoleType.TEACHER, RoleType.STUDENT)
  join(@Param('id') id: string, @Body() body: { userId: string }) {
    return this.sessionsService.join(id, body.userId);
  }

  @Post(':id/end')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.TEACHER)
  end(@Param('id') id: string, @Body() body: { recordingUrl?: string }) {
    return this.sessionsService.end(id, body.recordingUrl);
  }

  @Get(':id/participants')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER, RoleType.TEACHER)
  getParticipants(@Param('id') id: string) {
    return this.sessionsService.getParticipants(id);
  }
}
