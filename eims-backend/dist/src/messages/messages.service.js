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
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MessagesService = class MessagesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getConversation(userId1, userId2) {
        return this.prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId1, receiverId: userId2 },
                    { senderId: userId2, receiverId: userId1 },
                ],
            },
            orderBy: { createdAt: 'asc' },
            include: { sender: { select: { id: true, name: true, avatar: true } } },
        });
    }
    async send(senderId, dto) {
        const msg = await this.prisma.message.create({
            data: { senderId, receiverId: dto.receiverId, body: dto.body, classId: dto.classId },
            include: { sender: { select: { id: true, name: true, avatar: true } } },
        });
        return msg;
    }
    async markRead(senderId, receiverId) {
        await this.prisma.message.updateMany({
            where: { senderId, receiverId, readAt: null },
            data: { readAt: new Date() },
        });
        return { message: 'Marked as read' };
    }
    async getInbox(userId) {
        const sent = await this.prisma.message.findMany({
            where: { OR: [{ senderId: userId }, { receiverId: userId }] },
            orderBy: { createdAt: 'desc' },
            include: {
                sender: { select: { id: true, name: true, avatar: true } },
                receiver: { select: { id: true, name: true, avatar: true } },
            },
        });
        const seen = new Set();
        const threads = [];
        for (const msg of sent) {
            const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
            if (!seen.has(partnerId)) {
                seen.add(partnerId);
                const partner = msg.senderId === userId ? msg.receiver : msg.sender;
                const unread = await this.prisma.message.count({
                    where: { senderId: partnerId, receiverId: userId, readAt: null },
                });
                threads.push({ partner, lastMessage: msg, unread });
            }
        }
        return threads;
    }
    async getAnnouncements(branchId, classId) {
        return this.prisma.announcement.findMany({
            where: {
                ...(branchId && { branchId }),
                ...(classId && { classId }),
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createAnnouncement(dto) {
        return this.prisma.announcement.create({
            data: {
                branchId: dto.branchId,
                classId: dto.classId,
                title: dto.title,
                body: dto.body,
                postedBy: dto.postedById,
            },
        });
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map