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
exports.AssignmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AssignmentsService = class AssignmentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.assignment.create({
            data: {
                classId: data.classId,
                teacherId: data.teacherId,
                title: data.title,
                description: data.description,
                dueDate: new Date(data.dueDate),
                maxMarks: data.maxMarks,
                files: data.files || [],
            },
            include: { class: { select: { name: true } } },
        });
    }
    async findAll(classId, teacherId) {
        return this.prisma.assignment.findMany({
            where: {
                ...(classId ? { classId } : {}),
                ...(teacherId ? { teacherId } : {}),
            },
            include: {
                class: { select: { name: true } },
                _count: { select: { submissions: true } },
            },
            orderBy: { dueDate: 'asc' },
        });
    }
    async findOne(id) {
        const a = await this.prisma.assignment.findUnique({
            where: { id },
            include: { class: true, submissions: true },
        });
        if (!a)
            throw new common_1.NotFoundException('Assignment not found');
        return a;
    }
    async submit(assignmentId, studentId, data) {
        const assignment = await this.prisma.assignment.findUnique({ where: { id: assignmentId } });
        if (!assignment)
            throw new common_1.NotFoundException('Assignment not found');
        const isLate = new Date() > assignment.dueDate;
        const existing = await this.prisma.submission.findFirst({ where: { assignmentId, studentId } });
        if (existing) {
            return this.prisma.submission.update({
                where: { id: existing.id },
                data: { text: data.text, files: data.files || [], isLate, submittedAt: new Date() },
            });
        }
        return this.prisma.submission.create({
            data: { assignmentId, studentId, text: data.text, files: data.files || [], isLate },
        });
    }
    async getSubmissions(assignmentId) {
        return this.prisma.submission.findMany({
            where: { assignmentId },
            orderBy: { submittedAt: 'asc' },
        });
    }
    async grade(submissionId, data) {
        const sub = await this.prisma.submission.findUnique({ where: { id: submissionId } });
        if (!sub)
            throw new common_1.NotFoundException('Submission not found');
        return this.prisma.submission.update({
            where: { id: submissionId },
            data: { marks: data.marks, feedback: data.feedback, gradedAt: new Date() },
        });
    }
    async delete(id) {
        return this.prisma.assignment.delete({ where: { id } });
    }
};
exports.AssignmentsService = AssignmentsService;
exports.AssignmentsService = AssignmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AssignmentsService);
//# sourceMappingURL=assignments.service.js.map