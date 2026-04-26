import { PrismaService } from '../prisma/prisma.service';
import { Organization, Prisma } from '@prisma/client';
export declare class OrganizationsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<Organization[]>;
    findOne(id: string): Promise<Organization | null>;
    create(data: Prisma.OrganizationCreateInput): Promise<Organization>;
    update(id: string, data: Prisma.OrganizationUpdateInput): Promise<Organization>;
    remove(id: string): Promise<Organization>;
}
