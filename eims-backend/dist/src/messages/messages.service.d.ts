import { PrismaService } from '../prisma/prisma.service';
export declare class MessagesService {
    private prisma;
    constructor(prisma: PrismaService);
    getConversation(userId1: string, userId2: string): Promise<({
        sender: {
            id: string;
            name: string;
            avatar: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        body: string;
        readAt: Date | null;
        receiverId: string;
        classId: string | null;
        senderId: string;
    })[]>;
    send(senderId: string, dto: {
        receiverId: string;
        body: string;
        classId?: string;
    }): Promise<{
        sender: {
            id: string;
            name: string;
            avatar: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        body: string;
        readAt: Date | null;
        receiverId: string;
        classId: string | null;
        senderId: string;
    }>;
    markRead(senderId: string, receiverId: string): Promise<{
        message: string;
    }>;
    getInbox(userId: string): Promise<any[]>;
    getAnnouncements(branchId?: string, classId?: string): Promise<{
        id: string;
        createdAt: Date;
        branchId: string;
        body: string;
        classId: string | null;
        title: string;
        postedBy: string;
    }[]>;
    createAnnouncement(dto: {
        branchId: string;
        classId?: string;
        title: string;
        body: string;
        postedById: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        branchId: string;
        body: string;
        classId: string | null;
        title: string;
        postedBy: string;
    }>;
}
