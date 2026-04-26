import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async getForUser(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async create(data: { userId: string; type: string; title: string; body: string; dataJson?: string }) {
    return this.prisma.notification.create({ data });
  }

  async markRead(id: string) {
    return this.prisma.notification.update({ where: { id }, data: { readAt: new Date() } });
  }

  async markAllRead(userId: string) {
    return this.prisma.notification.updateMany({ where: { userId, readAt: null }, data: { readAt: new Date() } });
  }

  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({ where: { userId, readAt: null } });
  }

  // Announcements
  async createAnnouncement(data: { branchId: string; classId?: string; title: string; body: string; postedBy: string }) {
    return this.prisma.announcement.create({ data });
  }

  async getAnnouncements(branchId?: string, classId?: string) {
    return this.prisma.announcement.findMany({
      where: {
        ...(branchId ? { branchId } : {}),
        ...(classId ? { classId } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Helper: broadcast to multiple users
  async broadcast(userIds: string[], type: string, title: string, body: string, dataJson?: string) {
    return this.prisma.notification.createMany({
      data: userIds.map(userId => ({ userId, type, title, body, dataJson })),
    });
  }
}
