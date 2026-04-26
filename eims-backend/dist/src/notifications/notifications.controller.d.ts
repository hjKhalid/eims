import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getNotifications(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        body: string;
        readAt: Date | null;
        type: string;
        title: string;
        dataJson: string | null;
    }[]>;
    getUnreadCount(userId: string): Promise<number>;
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
    markAllRead(body: {
        userId: string;
    }): Promise<import("@prisma/client").Prisma.BatchPayload>;
    create(body: {
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
    createAnnouncement(body: {
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
    getAnnouncements(branchId: string, classId: string): Promise<{
        id: string;
        createdAt: Date;
        branchId: string;
        body: string;
        classId: string | null;
        title: string;
        postedBy: string;
    }[]>;
}
