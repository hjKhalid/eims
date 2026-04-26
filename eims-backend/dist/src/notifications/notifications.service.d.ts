import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    getForUser(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        body: string;
        readAt: Date | null;
        type: string;
        title: string;
        dataJson: string | null;
    }[]>;
    create(data: {
        userId: string;
        type: string;
        title: string;
        body: string;
        dataJson?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        body: string;
        readAt: Date | null;
        type: string;
        title: string;
        dataJson: string | null;
    }>;
    markRead(id: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        body: string;
        readAt: Date | null;
        type: string;
        title: string;
        dataJson: string | null;
    }>;
    markAllRead(userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    getUnreadCount(userId: string): Promise<number>;
    createAnnouncement(data: {
        branchId: string;
        classId?: string;
        title: string;
        body: string;
        postedBy: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        branchId: string;
        body: string;
        classId: string | null;
        title: string;
        postedBy: string;
    }>;
    getAnnouncements(branchId?: string, classId?: string): Promise<{
        id: string;
        createdAt: Date;
        branchId: string;
        body: string;
        classId: string | null;
        title: string;
        postedBy: string;
    }[]>;
    broadcast(userIds: string[], type: string, title: string, body: string, dataJson?: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
