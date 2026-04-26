import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AttendanceStatus, LeaveStatus } from '@prisma/client';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  // ─── Attendance ───────────────────────────────────
  async markAttendance(data: { classId: string; studentId: string; date: string; status: AttendanceStatus; sessionId?: string; source?: string }) {
    const date = new Date(data.date);
    const existing = await this.prisma.attendance.findFirst({
      where: { classId: data.classId, studentId: data.studentId, date },
    });
    if (existing) {
      return this.prisma.attendance.update({
        where: { id: existing.id },
        data: { status: data.status, source: data.source || 'manual' },
      });
    }
    return this.prisma.attendance.create({
      data: {
        classId: data.classId,
        studentId: data.studentId,
        date,
        status: data.status,
        source: data.source || 'manual',
        sessionId: data.sessionId,
      },
    });
  }

  async getClassAttendance(classId: string, date: string) {
    return this.prisma.attendance.findMany({
      where: { classId, date: new Date(date) },
      orderBy: { studentId: 'asc' },
    });
  }

  async getStudentAttendance(studentId: string, from: string, to: string) {
    return this.prisma.attendance.findMany({
      where: {
        studentId,
        date: { gte: new Date(from), lte: new Date(to) },
      },
      include: { class: { select: { name: true } } },
      orderBy: { date: 'desc' },
    });
  }

  async getAttendanceSummary(studentId: string) {
    const all = await this.prisma.attendance.findMany({ where: { studentId } });
    const total = all.length;
    const present = all.filter(a => a.status === 'PRESENT').length;
    const absent = all.filter(a => a.status === 'ABSENT').length;
    const late = all.filter(a => a.status === 'LATE').length;
    return { total, present, absent, late, percentage: total ? Math.round((present / total) * 100) : 0 };
  }

  // ─── Leave Requests ───────────────────────────────
  async createLeaveRequest(data: { studentId: string; fromDate: string; toDate: string; reason: string }) {
    return this.prisma.leaveRequest.create({
      data: {
        studentId: data.studentId,
        fromDate: new Date(data.fromDate),
        toDate: new Date(data.toDate),
        reason: data.reason,
      },
    });
  }

  async getLeaveRequests(filters: { studentId?: string; branchId?: string; status?: LeaveStatus }) {
    return this.prisma.leaveRequest.findMany({
      where: {
        ...(filters.studentId ? { studentId: filters.studentId } : {}),
        ...(filters.status ? { status: filters.status } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateLeaveRequest(id: string, status: LeaveStatus, approvedBy?: string) {
    const req = await this.prisma.leaveRequest.findUnique({ where: { id } });
    if (!req) throw new NotFoundException('Leave request not found');
    return this.prisma.leaveRequest.update({
      where: { id },
      data: { status, approvedBy },
    });
  }
}
