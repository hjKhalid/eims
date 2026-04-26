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
exports.AttendanceController = void 0;
const common_1 = require("@nestjs/common");
const attendance_service_1 = require("./attendance.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const client_1 = require("@prisma/client");
let AttendanceController = class AttendanceController {
    attendanceService;
    constructor(attendanceService) {
        this.attendanceService = attendanceService;
    }
    markAttendance(body) {
        return this.attendanceService.markAttendance(body);
    }
    getAttendance(classId, studentId, date, from, to) {
        if (classId && date)
            return this.attendanceService.getClassAttendance(classId, date);
        if (studentId && from && to)
            return this.attendanceService.getStudentAttendance(studentId, from, to);
        if (studentId)
            return this.attendanceService.getStudentAttendance(studentId, '2000-01-01', new Date().toISOString());
        return [];
    }
    getAttendanceSummary(studentId) {
        return this.attendanceService.getAttendanceSummary(studentId);
    }
    createLeaveRequest(body) {
        return this.attendanceService.createLeaveRequest(body);
    }
    getLeaveRequests(studentId, status) {
        return this.attendanceService.getLeaveRequests({ studentId, status });
    }
    updateLeaveRequest(id, body) {
        return this.attendanceService.updateLeaveRequest(id, body.status, body.approvedBy);
    }
};
exports.AttendanceController = AttendanceController;
__decorate([
    (0, common_1.Post)('attendance'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.SUPER_ADMIN, client_1.RoleType.PRINCIPAL, client_1.RoleType.MANAGER, client_1.RoleType.TEACHER),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "markAttendance", null);
__decorate([
    (0, common_1.Get)('attendance'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.SUPER_ADMIN, client_1.RoleType.PRINCIPAL, client_1.RoleType.MANAGER, client_1.RoleType.TEACHER, client_1.RoleType.STUDENT),
    __param(0, (0, common_1.Query)('classId')),
    __param(1, (0, common_1.Query)('studentId')),
    __param(2, (0, common_1.Query)('date')),
    __param(3, (0, common_1.Query)('from')),
    __param(4, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "getAttendance", null);
__decorate([
    (0, common_1.Get)('attendance/summary/:studentId'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.SUPER_ADMIN, client_1.RoleType.PRINCIPAL, client_1.RoleType.MANAGER, client_1.RoleType.TEACHER, client_1.RoleType.STUDENT, client_1.RoleType.PARENT),
    __param(0, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "getAttendanceSummary", null);
__decorate([
    (0, common_1.Post)('leave-requests'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.STUDENT, client_1.RoleType.PARENT, client_1.RoleType.TEACHER),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "createLeaveRequest", null);
__decorate([
    (0, common_1.Get)('leave-requests'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.SUPER_ADMIN, client_1.RoleType.PRINCIPAL, client_1.RoleType.MANAGER, client_1.RoleType.TEACHER, client_1.RoleType.STUDENT),
    __param(0, (0, common_1.Query)('studentId')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "getLeaveRequests", null);
__decorate([
    (0, common_1.Patch)('leave-requests/:id'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.SUPER_ADMIN, client_1.RoleType.PRINCIPAL, client_1.RoleType.MANAGER, client_1.RoleType.TEACHER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "updateLeaveRequest", null);
exports.AttendanceController = AttendanceController = __decorate([
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [attendance_service_1.AttendanceService])
], AttendanceController);
//# sourceMappingURL=attendance.controller.js.map