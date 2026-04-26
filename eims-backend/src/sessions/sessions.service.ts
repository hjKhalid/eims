import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SessionStatus } from '@prisma/client';

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { classId: string; teacherId: string; title: string; scheduledAt: string; roomId?: string }) {
    return this.prisma.liveSession.create({
      data: {
        classId: data.classId,
        teacherId: data.teacherId,
        title: data.title,
        scheduledAt: new Date(data.scheduledAt),
        roomId: data.roomId || `room-${Date.now()}`,
        status: 'SCHEDULED',
      },
      include: { class: { select: { name: true } } },
    });
  }

  async findAll(classId?: string, teacherId?: string) {
    return this.prisma.liveSession.findMany({
      where: {
        ...(classId ? { classId } : {}),
        ...(teacherId ? { teacherId } : {}),
      },
      include: { class: { select: { name: true } }, participants: true },
      orderBy: { scheduledAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const session = await this.prisma.liveSession.findUnique({
      where: { id },
      include: { class: true, participants: true },
    });
    if (!session) throw new NotFoundException('Session not found');
    return session;
  }

  async start(id: string) {
    return this.prisma.liveSession.update({
      where: { id },
      data: { status: 'LIVE' },
    });
  }

  async join(id: string, userId: string) {
    const session = await this.findOne(id);
    const existing = await this.prisma.sessionParticipant.findFirst({ where: { sessionId: id, userId } });
    if (!existing) {
      await this.prisma.sessionParticipant.create({ data: { sessionId: id, userId } });
    }
    // Auto-log attendance
    await this.prisma.attendance.upsert({
      where: { id: (await this.prisma.attendance.findFirst({ where: { classId: session.classId, studentId: userId, date: new Date(new Date().toDateString()) } }))?.id || '' },
      update: { status: 'PRESENT', source: 'auto', sessionId: id },
      create: { classId: session.classId, studentId: userId, date: new Date(new Date().toDateString()), status: 'PRESENT', source: 'auto', sessionId: id },
    }).catch(() => 
      this.prisma.attendance.create({ data: { classId: session.classId, studentId: userId, date: new Date(new Date().toDateString()), status: 'PRESENT', source: 'auto', sessionId: id } })
    );
    return { joined: true, roomId: session.roomId };
  }

  async end(id: string, recordingUrl?: string) {
    await this.prisma.sessionParticipant.updateMany({
      where: { sessionId: id, leftAt: null },
      data: { leftAt: new Date() },
    });
    return this.prisma.liveSession.update({
      where: { id },
      data: { status: 'ENDED', recordingUrl },
    });
  }

  async getParticipants(id: string) {
    return this.prisma.sessionParticipant.findMany({
      where: { sessionId: id },
      orderBy: { joinedAt: 'asc' },
    });
  }
}
