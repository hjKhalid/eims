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
exports.SessionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SessionsService = class SessionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.liveSession.create({
            data: {
                classId: data.classId,
                teacherId: data.teacherId,
                title: data.title,
                scheduledAt: new Date(data.scheduledAt),
                roomId: data.roomId || `room-${Date.now()}`,
                status: 'SCHEDULED',
            },
            include: { class: { select: { name: true } } },
        });
    }
    async findAll(classId, teacherId) {
        return this.prisma.liveSession.findMany({
            where: {
                ...(classId ? { classId } : {}),
                ...(teacherId ? { teacherId } : {}),
            },
            include: { class: { select: { name: true } }, participants: true },
            orderBy: { scheduledAt: 'desc' },
        });
    }
    async findOne(id) {
        const session = await this.prisma.liveSession.findUnique({
            where: { id },
            include: { class: true, participants: true },
        });
        if (!session)
            throw new common_1.NotFoundException('Session not found');
        return session;
    }
    async start(id) {
        return this.prisma.liveSession.update({
            where: { id },
            data: { status: 'LIVE' },
        });
    }
    async join(id, userId) {
        const session = await this.findOne(id);
        const existing = await this.prisma.sessionParticipant.findFirst({ where: { sessionId: id, userId } });
        if (!existing) {
            await this.prisma.sessionParticipant.create({ data: { sessionId: id, userId } });
        }
        await this.prisma.attendance.upsert({
            where: { id: (await this.prisma.attendance.findFirst({ where: { classId: session.classId, studentId: userId, date: new Date(new Date().toDateString()) } }))?.id || '' },
            update: { status: 'PRESENT', source: 'auto', sessionId: id },
            create: { classId: session.classId, studentId: userId, date: new Date(new Date().toDateString()), status: 'PRESENT', source: 'auto', sessionId: id },
        }).catch(() => this.prisma.attendance.create({ data: { classId: session.classId, studentId: userId, date: new Date(new Date().toDateString()), status: 'PRESENT', source: 'auto', sessionId: id } }));
        return { joined: true, roomId: session.roomId };
    }
    async end(id, recordingUrl) {
        await this.prisma.sessionParticipant.updateMany({
            where: { sessionId: id, leftAt: null },
            data: { leftAt: new Date() },
        });
        return this.prisma.liveSession.update({
            where: { id },
            data: { status: 'ENDED', recordingUrl },
        });
    }
    async getParticipants(id) {
        return this.prisma.sessionParticipant.findMany({
            where: { sessionId: id },
            orderBy: { joinedAt: 'asc' },
        });
    }
};
exports.SessionsService = SessionsService;
exports.SessionsService = SessionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SessionsService);
//# sourceMappingURL=sessions.service.js.map