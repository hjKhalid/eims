import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Branch, Prisma } from '@prisma/client';

@Injectable()
export class BranchesService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Branch[]> {
    return this.prisma.branch.findMany({
      include: { school: true },
    });
  }

  async findOne(id: string): Promise<Branch | null> {
    return this.prisma.branch.findUnique({
      where: { id },
      include: { school: true },
    });
  }

  async create(data: Prisma.BranchUncheckedCreateInput): Promise<Branch> {
    return this.prisma.branch.create({
      data,
    });
  }

  async update(id: string, data: Prisma.BranchUncheckedUpdateInput): Promise<Branch> {
    return this.prisma.branch.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Branch> {
    return this.prisma.branch.delete({
      where: { id },
    });
  }
}
