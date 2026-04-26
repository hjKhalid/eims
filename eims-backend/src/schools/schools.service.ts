import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { School, Prisma } from '@prisma/client';

@Injectable()
export class SchoolsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<School[]> {
    return this.prisma.school.findMany({
      include: { branches: true },
    });
  }

  async findOne(id: string): Promise<School | null> {
    return this.prisma.school.findUnique({
      where: { id },
      include: { branches: true },
    });
  }

  async create(data: Prisma.SchoolUncheckedCreateInput): Promise<School> {
    return this.prisma.school.create({
      data,
    });
  }

  async update(id: string, data: Prisma.SchoolUncheckedUpdateInput): Promise<School> {
    return this.prisma.school.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<School> {
    return this.prisma.school.delete({
      where: { id },
    });
  }
}
