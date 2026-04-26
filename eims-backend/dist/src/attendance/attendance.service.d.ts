import { PrismaService } from '../prisma/prisma.service';
import { AttendanceStatus, LeaveStatus } from '@prisma/client';
export declare class AttendanceService {
    private prisma;
    constructor(prisma: PrismaService);
    markAttendance(data: {
        classId: string;
        studentId: string;
        date: string;
        status: AttendanceStatus;
        sessionId?: string;
        source?: string;
    }): Promise<{
        id: string;
        classId: string;
        studentId: string;
        date: Date;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        source: string;
        sessionId: string | null;
    }>;
    getClassAttendance(classId: string, date: string): Promise<{
        id: string;
        classId: string;
        studentId: string;
        date: Date;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        source: string;
        sessionId: string | null;
    }[]>;
    getStudentAttendance(studentId: string, from: string, to: string): Promise<({
        class: {
            name: string;
        };
    } & {
        id: string;
        classId: string;
        studentId: string;
        date: Date;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        source: string;
        sessionId: string | null;
    })[]>;
    getAttendanceSummary(studentId: string): Promise<{
        total: number;
        present: number;
        absent: number;
        late: number;
        percentage: number;
    }>;
    createLeaveRequest(data: {
        studentId: string;
        fromDate: string;
        toDate: string;
        reason: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        studentId: string;
        status: import("@prisma/client").$Enums.LeaveStatus;
        fromDate: Date;
        toDate: Date;
        reason: string | null;
        approvedBy: string | null;
    }>;
    getLeaveRequests(filters: {
        studentId?: string;
        branchId?: string;
        status?: LeaveStatus;
    }): Promise<{
        id: string;
        createdAt: Date;
        studentId: string;
        status: import("@prisma/client").$Enums.LeaveStatus;
        fromDate: Date;
        toDate: Date;
        reason: string | null;
        approvedBy: string | null;
    }[]>;
    updateLeaveRequest(id: string, status: LeaveStatus, approvedBy?: string): Promise<{
        id: string;
        createdAt: Date;
        studentId: string;
        status: import("@prisma/client").$Enums.LeaveStatus;
        fromDate: Date;
        toDate: Date;
        reason: string | null;
        approvedBy: string | null;
    }>;
}
