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
exports.ClassesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ClassesService = class ClassesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.class.findMany({
            include: { branch: true },
        });
    }
    async findOne(id) {
        return this.prisma.class.findUnique({
            where: { id },
            include: { branch: true, subjects: true },
        });
    }
    async create(data) {
        return this.prisma.class.create({
            data,
        });
    }
    async update(id, data) {
        return this.prisma.class.update({
            where: { id },
            data,
        });
    }
    async remove(id) {
        return this.prisma.class.delete({
            where: { id },
        });
    }
    async getTimetable(classId) {
        return this.prisma.timetable.findMany({
            where: { classId },
            orderBy: [{ day: 'asc' }, { period: 'asc' }],
        });
    }
    async addTimetableEntry(classId, data) {
        return this.prisma.timetable.create({
            data: { ...data, classId },
        });
    }
    async removeTimetableEntry(id) {
        return this.prisma.timetable.delete({
            where: { id },
        });
    }
    async getStudyMaterials(classId) {
        return this.prisma.studyMaterial.findMany({
            where: { classId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async addStudyMaterial(classId, data) {
        return this.prisma.studyMaterial.create({
            data: { ...data, classId },
        });
    }
    async removeStudyMaterial(id) {
        return this.prisma.studyMaterial.delete({
            where: { id },
        });
    }
};
exports.ClassesService = ClassesService;
exports.ClassesService = ClassesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClassesService);
//# sourceMappingURL=classes.service.js.map