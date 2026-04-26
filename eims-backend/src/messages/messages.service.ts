import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async getConversation(userId1: string, userId2: string) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
        ],
      },
      orderBy: { createdAt: 'asc' },
      include: { sender: { select: { id: true, name: true, avatar: true } } },
    });
  }

  async send(senderId: string, dto: { receiverId: string; body: string; classId?: string }) {
    const msg = await this.prisma.message.create({
      data: { senderId, receiverId: dto.receiverId, body: dto.body, classId: dto.classId },
      include: { sender: { select: { id: true, name: true, avatar: true } } },
    });
    return msg;
  }

  async markRead(senderId: string, receiverId: string) {
    await this.prisma.message.updateMany({
      where: { senderId, receiverId, readAt: null },
      data: { readAt: new Date() },
    });
    return { message: 'Marked as read' };
  }

  async getInbox(userId: string) {
    // Get latest message per conversation partner
    const sent = await this.prisma.message.findMany({
      where: { OR: [{ senderId: userId }, { receiverId: userId }] },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
        receiver: { select: { id: true, name: true, avatar: true } },
      },
    });

    // Deduplicate by partner
    const seen = new Set<string>();
    const threads: any[] = [];
    for (const msg of sent) {
      const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      if (!seen.has(partnerId)) {
        seen.add(partnerId);
        const partner = msg.senderId === userId ? msg.receiver : msg.sender;
        const unread = await this.prisma.message.count({
          where: { senderId: partnerId, receiverId: userId, readAt: null },
        });
        threads.push({ partner, lastMessage: msg, unread });
      }
    }
    return threads;
  }

  async getAnnouncements(branchId?: string, classId?: string) {
    return this.prisma.announcement.findMany({
      where: {
        ...(branchId && { branchId }),
        ...(classId && { classId }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createAnnouncement(dto: { branchId: string; classId?: string; title: string; body: string; postedById: string }) {
    return this.prisma.announcement.create({
      data: {
        branchId: dto.branchId,
        classId: dto.classId,
        title: dto.title,
        body: dto.body,
        postedBy: dto.postedById,
      },
    });
  }
}
