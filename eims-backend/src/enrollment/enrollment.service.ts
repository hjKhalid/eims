import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EnrollmentService {
  constructor(private prisma: PrismaService) {}

  async enroll(classId: string, studentId: string) {
    const existing = await this.prisma.enrollment.findFirst({ where: { classId, studentId } });
    if (existing) throw new ConflictException('Student already enrolled in this class');
    const cls = await this.prisma.class.findUnique({ where: { id: classId } });
    if (!cls) throw new NotFoundException('Class not found');
    return this.prisma.enrollment.create({ data: { classId, studentId } });
  }

  async unenroll(classId: string, studentId: string) {
    const enrollment = await this.prisma.enrollment.findFirst({ where: { classId, studentId } });
    if (!enrollment) throw new NotFoundException('Enrollment not found');
    return this.prisma.enrollment.delete({ where: { id: enrollment.id } });
  }

  async getStudents(classId: string) {
    return this.prisma.enrollment.findMany({
      where: { classId },
      include: {
        class: { select: { name: true } },
      },
      orderBy: { enrolledAt: 'desc' },
    });
  }

  async getStudentClasses(studentId: string) {
    return this.prisma.enrollment.findMany({
      where: { studentId },
      include: { class: { include: { branch: { include: { school: true } } } } },
      orderBy: { enrolledAt: 'desc' },
    });
  }
}
