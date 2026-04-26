import { PrismaService } from '../prisma/prisma.service';
export declare class SessionsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
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
    findAll(classId?: string, teacherId?: string): Promise<({
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
    join(id: string, userId: string): Promise<{
        joined: boolean;
        roomId: string | null;
    }>;
    end(id: string, recordingUrl?: string): Promise<{
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
