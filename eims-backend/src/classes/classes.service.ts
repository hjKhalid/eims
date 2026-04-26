import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Class, Prisma, Timetable, StudyMaterial } from '@prisma/client';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Class[]> {
    return this.prisma.class.findMany({
      include: { branch: true },
    });
  }

  async findOne(id: string): Promise<Class | null> {
    return this.prisma.class.findUnique({
      where: { id },
      include: { branch: true, subjects: true },
    });
  }

  async create(data: Prisma.ClassUncheckedCreateInput): Promise<Class> {
    return this.prisma.class.create({
      data,
    });
  }

  async update(id: string, data: Prisma.ClassUncheckedUpdateInput): Promise<Class> {
    return this.prisma.class.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Class> {
    return this.prisma.class.delete({
      where: { id },
    });
  }

  // --- Timetable ---
  async getTimetable(classId: string): Promise<Timetable[]> {
    return this.prisma.timetable.findMany({
      where: { classId },
      orderBy: [{ day: 'asc' }, { period: 'asc' }],
    });
  }

  async addTimetableEntry(classId: string, data: Omit<Prisma.TimetableUncheckedCreateInput, 'classId'>): Promise<Timetable> {
    return this.prisma.timetable.create({
      data: { ...data, classId },
    });
  }

  async removeTimetableEntry(id: string): Promise<Timetable> {
    return this.prisma.timetable.delete({
      where: { id },
    });
  }

  // --- Study Materials ---
  async getStudyMaterials(classId: string): Promise<StudyMaterial[]> {
    return this.prisma.studyMaterial.findMany({
      where: { classId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addStudyMaterial(classId: string, data: Omit<Prisma.StudyMaterialUncheckedCreateInput, 'classId'>): Promise<StudyMaterial> {
    return this.prisma.studyMaterial.create({
      data: { ...data, classId },
    });
  }

  async removeStudyMaterial(id: string): Promise<StudyMaterial> {
    return this.prisma.studyMaterial.delete({
      where: { id },
    });
  }
}
