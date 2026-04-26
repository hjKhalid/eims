"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AttendanceService = class AttendanceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async markAttendance(data) {
        const date = new Date(data.date);
        const existing = await this.prisma.attendance.findFirst({
            where: { classId: data.classId, studentId: data.studentId, date },
        });
        if (existing) {
            return this.prisma.attendance.update({
                where: { id: existing.id },
                data: { status: data.status, source: data.source || 'manual' },
            });
        }
        return this.prisma.attendance.create({
            data: {
                classId: data.classId,
                studentId: data.studentId,
                date,
                status: data.status,
                source: data.source || 'manual',
                sessionId: data.sessionId,
            },
        });
    }
    async getClassAttendance(classId, date) {
        return this.prisma.attendance.findMany({
            where: { classId, date: new Date(date) },
            orderBy: { studentId: 'asc' },
        });
    }
    async getStudentAttendance(studentId, from, to) {
        return this.prisma.attendance.findMany({
            where: {
                studentId,
                date: { gte: new Date(from), lte: new Date(to) },
            },
            include: { class: { select: { name: true } } },
            orderBy: { date: 'desc' },
        });
    }
    async getAttendanceSummary(studentId) {
        const all = await this.prisma.attendance.findMany({ where: { studentId } });
        const total = all.length;
        const present = all.filter(a => a.status === 'PRESENT').length;
        const absent = all.filter(a => a.status === 'ABSENT').length;
        const late = all.filter(a => a.status === 'LATE').length;
        return { total, present, absent, late, percentage: total ? Math.round((present / total) * 100) : 0 };
    }
    async createLeaveRequest(data) {
        return this.prisma.leaveRequest.create({
            data: {
                studentId: data.studentId,
                fromDate: new Date(data.fromDate),
                toDate: new Date(data.toDate),
                reason: data.reason,
            },
        });
    }
    async getLeaveRequests(filters) {
        return this.prisma.leaveRequest.findMany({
            where: {
                ...(filters.studentId ? { studentId: filters.studentId } : {}),
                ...(filters.status ? { status: filters.status } : {}),
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateLeaveRequest(id, status, approvedBy) {
        const req = await this.prisma.leaveRequest.findUnique({ where: { id } });
        if (!req)
            throw new common_1.NotFoundException('Leave request not found');
        return this.prisma.leaveRequest.update({
            where: { id },
            data: { status, approvedBy },
        });
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map