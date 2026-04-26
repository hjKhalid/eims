import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { classId: string; teacherId: string; title: string; description?: string; dueDate: string; maxMarks?: number; files?: string[] }) {
    return this.prisma.assignment.create({
      data: {
        classId: data.classId,
        teacherId: data.teacherId,
        title: data.title,
        description: data.description,
        dueDate: new Date(data.dueDate),
        maxMarks: data.maxMarks,
        files: data.files || [],
      },
      include: { class: { select: { name: true } } },
    });
  }

  async findAll(classId?: string, teacherId?: string) {
    return this.prisma.assignment.findMany({
      where: {
        ...(classId ? { classId } : {}),
        ...(teacherId ? { teacherId } : {}),
      },
      include: {
        class: { select: { name: true } },
        _count: { select: { submissions: true } },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async findOne(id: string) {
    const a = await this.prisma.assignment.findUnique({
      where: { id },
      include: { class: true, submissions: true },
    });
    if (!a) throw new NotFoundException('Assignment not found');
    return a;
  }

  async submit(assignmentId: string, studentId: string, data: { text?: string; files?: string[] }) {
    const assignment = await this.prisma.assignment.findUnique({ where: { id: assignmentId } });
    if (!assignment) throw new NotFoundException('Assignment not found');
    const isLate = new Date() > assignment.dueDate;
    const existing = await this.prisma.submission.findFirst({ where: { assignmentId, studentId } });
    if (existing) {
      return this.prisma.submission.update({
        where: { id: existing.id },
        data: { text: data.text, files: data.files || [], isLate, submittedAt: new Date() },
      });
    }
    return this.prisma.submission.create({
      data: { assignmentId, studentId, text: data.text, files: data.files || [], isLate },
    });
  }

  async getSubmissions(assignmentId: string) {
    return this.prisma.submission.findMany({
      where: { assignmentId },
      orderBy: { submittedAt: 'asc' },
    });
  }

  async grade(submissionId: string, data: { marks: number; feedback?: string }) {
    const sub = await this.prisma.submission.findUnique({ where: { id: submissionId } });
    if (!sub) throw new NotFoundException('Submission not found');
    return this.prisma.submission.update({
      where: { id: submissionId },
      data: { marks: data.marks, feedback: data.feedback, gradedAt: new Date() },
    });
  }

  async delete(id: string) {
    return this.prisma.assignment.delete({ where: { id } });
  }
}
