import { PrismaService } from '../prisma/prisma.service';
import { Branch, Prisma } from '@prisma/client';
export declare class BranchesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<Branch[]>;
    findOne(id: string): Promise<Branch | null>;
    create(data: Prisma.BranchUncheckedCreateInput): Promise<Branch>;
    update(id: string, data: Prisma.BranchUncheckedUpdateInput): Promise<Branch>;
    remove(id: string): Promise<Branch>;
}
