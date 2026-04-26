import { PrismaService } from '../prisma/prisma.service';
import { Subject, Prisma } from '@prisma/client';
export declare class SubjectsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<Subject[]>;
    findOne(id: string): Promise<Subject | null>;
    create(data: Prisma.SubjectUncheckedCreateInput): Promise<Subject>;
    update(id: string, data: Prisma.SubjectUncheckedUpdateInput): Promise<Subject>;
    remove(id: string): Promise<Subject>;
}
