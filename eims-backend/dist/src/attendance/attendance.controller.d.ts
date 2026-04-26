import { AttendanceService } from './attendance.service';
import { AttendanceStatus, LeaveStatus } from '@prisma/client';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    markAttendance(body: {
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
    getAttendance(classId: string, studentId: string, date: string, from: string, to: string): Promise<{
        id: string;
        classId: string;
        studentId: string;
        date: Date;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        source: string;
        sessionId: string | null;
    }[]> | never[];
    getAttendanceSummary(studentId: string): Promise<{
        total: number;
        present: number;
        absent: number;
        late: number;
        percentage: number;
    }>;
    createLeaveRequest(body: {
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
    getLeaveRequests(studentId: string, status: LeaveStatus): Promise<{
        id: string;
        createdAt: Date;
        studentId: string;
        status: import("@prisma/client").$Enums.LeaveStatus;
        fromDate: Date;
        toDate: Date;
        reason: string | null;
        approvedBy: string | null;
    }[]>;
    updateLeaveRequest(id: string, body: {
        status: LeaveStatus;
        approvedBy?: string;
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
}
