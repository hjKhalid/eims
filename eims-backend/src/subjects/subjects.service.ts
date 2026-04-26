import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Subject, Prisma } from '@prisma/client';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Subject[]> {
    return this.prisma.subject.findMany({
      include: { branch: true },
    });
  }

  async findOne(id: string): Promise<Subject | null> {
    return this.prisma.subject.findUnique({
      where: { id },
      include: { branch: true, classes: true },
    });
  }

  async create(data: Prisma.SubjectUncheckedCreateInput): Promise<Subject> {
    return this.prisma.subject.create({
      data,
    });
  }

  async update(id: string, data: Prisma.SubjectUncheckedUpdateInput): Promise<Subject> {
    return this.prisma.subject.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Subject> {
    return this.prisma.subject.delete({
      where: { id },
    });
  }
}
