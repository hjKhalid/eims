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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollmentController = void 0;
const common_1 = require("@nestjs/common");
const enrollment_service_1 = require("./enrollment.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const client_1 = require("@prisma/client");
let EnrollmentController = class EnrollmentController {
    enrollmentService;
    constructor(enrollmentService) {
        this.enrollmentService = enrollmentService;
    }
    enroll(classId, body) {
        return this.enrollmentService.enroll(classId, body.studentId);
    }
    unenroll(classId, studentId) {
        return this.enrollmentService.unenroll(classId, studentId);
    }
    getStudents(classId) {
        return this.enrollmentService.getStudents(classId);
    }
    getStudentClasses(studentId) {
        return this.enrollmentService.getStudentClasses(studentId);
    }
};
exports.EnrollmentController = EnrollmentController;
__decorate([
    (0, common_1.Post)('classes/:classId/enroll'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.SUPER_ADMIN, client_1.RoleType.PRINCIPAL, client_1.RoleType.MANAGER),
    __param(0, (0, common_1.Param)('classId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EnrollmentController.prototype, "enroll", null);
__decorate([
    (0, common_1.Delete)('classes/:classId/enroll/:studentId'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.SUPER_ADMIN, client_1.RoleType.PRINCIPAL, client_1.RoleType.MANAGER),
    __param(0, (0, common_1.Param)('classId')),
    __param(1, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], EnrollmentController.prototype, "unenroll", null);
__decorate([
    (0, common_1.Get)('classes/:classId/students'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.SUPER_ADMIN, client_1.RoleType.PRINCIPAL, client_1.RoleType.MANAGER, client_1.RoleType.TEACHER),
    __param(0, (0, common_1.Param)('classId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EnrollmentController.prototype, "getStudents", null);
__decorate([
    (0, common_1.Get)('students/:studentId/classes'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.SUPER_ADMIN, client_1.RoleType.PRINCIPAL, client_1.RoleType.MANAGER, client_1.RoleType.TEACHER, client_1.RoleType.STUDENT),
    __param(0, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EnrollmentController.prototype, "getStudentClasses", null);
exports.EnrollmentController = EnrollmentController = __decorate([
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [enrollment_service_1.EnrollmentService])
], EnrollmentController);
//# sourceMappingURL=enrollment.controller.js.map