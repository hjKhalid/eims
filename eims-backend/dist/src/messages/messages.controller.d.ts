import { MessagesService } from './messages.service';
export declare class MessagesController {
    private svc;
    constructor(svc: MessagesService);
    inbox(req: any): Promise<any[]>;
    conversation(req: any, withId: string): Promise<({
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
    send(req: any, body: any): Promise<{
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
    markRead(req: any, body: {
        partnerId: string;
    }): Promise<{
        message: string;
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
    createAnnouncement(req: any, body: any): Promise<{
        id: string;
        createdAt: Date;
        branchId: string;
        body: string;
        classId: string | null;
        title: string;
        postedBy: string;
    }>;
}
