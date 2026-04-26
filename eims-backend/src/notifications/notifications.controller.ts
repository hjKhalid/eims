import { Controller, Get, Post, Patch, Param, Body, Query, Request, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RoleType } from '@prisma/client';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('notifications')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER, RoleType.TEACHER, RoleType.STUDENT, RoleType.PARENT)
  getNotifications(@Query('userId') userId: string) {
    return this.notificationsService.getForUser(userId);
  }

  @Get('notifications/unread-count')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER, RoleType.TEACHER, RoleType.STUDENT, RoleType.PARENT)
  getUnreadCount(@Query('userId') userId: string) {
    return this.notificationsService.getUnreadCount(userId);
  }

  @Patch('notifications/:id/read')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER, RoleType.TEACHER, RoleType.STUDENT, RoleType.PARENT)
  markRead(@Param('id') id: string) {
    return this.notificationsService.markRead(id);
  }

  @Post('notifications/read-all')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER, RoleType.TEACHER, RoleType.STUDENT, RoleType.PARENT)
  markAllRead(@Body() body: { userId: string }) {
    return this.notificationsService.markAllRead(body.userId);
  }

  @Post('notifications')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER)
  create(@Body() body: { userId: string; type: string; title: string; body: string; dataJson?: string }) {
    return this.notificationsService.create(body);
  }

  // Announcements
  @Post('announcements')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER, RoleType.TEACHER)
  createAnnouncement(@Body() body: { branchId: string; classId?: string; title: string; body: string; postedBy: string }) {
    return this.notificationsService.createAnnouncement(body);
  }

  @Get('announcements')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER, RoleType.TEACHER, RoleType.STUDENT, RoleType.PARENT)
  getAnnouncements(@Query('branchId') branchId: string, @Query('classId') classId: string) {
    return this.notificationsService.getAnnouncements(branchId, classId);
  }
}
