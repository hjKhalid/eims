import { PrismaService } from '../prisma/prisma.service';
import { School, Prisma } from '@prisma/client';
export declare class SchoolsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<School[]>;
    findOne(id: string): Promise<School | null>;
    create(data: Prisma.SchoolUncheckedCreateInput): Promise<School>;
    update(id: string, data: Prisma.SchoolUncheckedUpdateInput): Promise<School>;
    remove(id: string): Promise<School>;
}
