import { Controller, Get, Post, Patch, Query, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MessagesService } from './messages.service';

@Controller()
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private svc: MessagesService) {}

  @Get('messages/inbox')
  inbox(@Request() req: any) {
    return this.svc.getInbox(req.user.userId);
  }

  @Get('messages')
  conversation(@Request() req: any, @Query('with') withId: string) {
    return this.svc.getConversation(req.user.userId, withId);
  }

  @Post('messages')
  send(@Request() req: any, @Body() body: any) {
    return this.svc.send(req.user.userId, body);
  }

  @Patch('messages/read')
  markRead(@Request() req: any, @Body() body: { partnerId: string }) {
    return this.svc.markRead(body.partnerId, req.user.userId);
  }

  @Get('announcements')
  getAnnouncements(@Query('branchId') branchId?: string, @Query('classId') classId?: string) {
    return this.svc.getAnnouncements(branchId, classId);
  }

  @Post('announcements')
  createAnnouncement(@Request() req: any, @Body() body: any) {
    return this.svc.createAnnouncement({ ...body, postedById: req.user.userId });
  }
}
