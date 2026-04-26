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
exports.EnrollmentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EnrollmentService = class EnrollmentService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async enroll(classId, studentId) {
        const existing = await this.prisma.enrollment.findFirst({ where: { classId, studentId } });
        if (existing)
            throw new common_1.ConflictException('Student already enrolled in this class');
        const cls = await this.prisma.class.findUnique({ where: { id: classId } });
        if (!cls)
            throw new common_1.NotFoundException('Class not found');
        return this.prisma.enrollment.create({ data: { classId, studentId } });
    }
    async unenroll(classId, studentId) {
        const enrollment = await this.prisma.enrollment.findFirst({ where: { classId, studentId } });
        if (!enrollment)
            throw new common_1.NotFoundException('Enrollment not found');
        return this.prisma.enrollment.delete({ where: { id: enrollment.id } });
    }
    async getStudents(classId) {
        return this.prisma.enrollment.findMany({
            where: { classId },
            include: {
                class: { select: { name: true } },
            },
            orderBy: { enrolledAt: 'desc' },
        });
    }
    async getStudentClasses(studentId) {
        return this.prisma.enrollment.findMany({
            where: { studentId },
            include: { class: { include: { branch: { include: { school: true } } } } },
            orderBy: { enrolledAt: 'desc' },
        });
    }
};
exports.EnrollmentService = EnrollmentService;
exports.EnrollmentService = EnrollmentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EnrollmentService);
//# sourceMappingURL=enrollment.service.js.map