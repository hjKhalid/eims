import { SessionsService } from './sessions.service';
export declare class SessionsController {
    private readonly sessionsService;
    constructor(sessionsService: SessionsService);
    create(body: {
        classId: string;
        teacherId: string;
        title: string;
        scheduledAt: string;
        roomId?: string;
    }): Promise<{
        class: {
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        classId: string;
        title: string;
        status: import("@prisma/client").$Enums.SessionStatus;
        teacherId: string;
        scheduledAt: Date;
        roomId: string | null;
        recordingUrl: string | null;
    }>;
    findAll(classId: string, teacherId: string): Promise<({
        class: {
            name: string;
        };
        participants: {
            id: string;
            userId: string;
            sessionId: string;
            joinedAt: Date;
            leftAt: Date | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        classId: string;
        title: string;
        status: import("@prisma/client").$Enums.SessionStatus;
        teacherId: string;
        scheduledAt: Date;
        roomId: string | null;
        recordingUrl: string | null;
    })[]>;
    findOne(id: string): Promise<{
        class: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            branchId: string;
            gradeLevel: string | null;
        };
        participants: {
            id: string;
            userId: string;
            sessionId: string;
            joinedAt: Date;
            leftAt: Date | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        classId: string;
        title: string;
        status: import("@prisma/client").$Enums.SessionStatus;
        teacherId: string;
        scheduledAt: Date;
        roomId: string | null;
        recordingUrl: string | null;
    }>;
    start(id: string): Promise<{
        id: string;
        createdAt: Date;
        classId: string;
        title: string;
        status: import("@prisma/client").$Enums.SessionStatus;
        teacherId: string;
        scheduledAt: Date;
        roomId: string | null;
        recordingUrl: string | null;
    }>;
    join(id: string, body: {
        userId: string;
    }): Promise<{
        joined: boolean;
        roomId: string | null;
    }>;
    end(id: string, body: {
        recordingUrl?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        classId: string;
        title: string;
        status: import("@prisma/client").$Enums.SessionStatus;
        teacherId: string;
        scheduledAt: Date;
        roomId: string | null;
        recordingUrl: string | null;
    }>;
    getParticipants(id: string): Promise<{
        id: string;
        userId: string;
        sessionId: string;
        joinedAt: Date;
        leftAt: Date | null;
    }[]>;
}
