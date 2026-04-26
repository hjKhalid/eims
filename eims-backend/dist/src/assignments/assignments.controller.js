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
exports.SubmissionsController = exports.AssignmentsController = void 0;
const common_1 = require("@nestjs/common");
const assignments_service_1 = require("./assignments.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const client_1 = require("@prisma/client");
let AssignmentsController = class AssignmentsController {
    assignmentsService;
    constructor(assignmentsService) {
        this.assignmentsService = assignmentsService;
    }
    create(body) {
        return this.assignmentsService.create(body);
    }
    findAll(classId, teacherId) {
        return this.assignmentsService.findAll(classId, teacherId);
    }
    findOne(id) {
        return this.assignmentsService.findOne(id);
    }
    submit(assignmentId, body) {
        return this.assignmentsService.submit(assignmentId, body.studentId, { text: body.text, files: body.files });
    }
    getSubmissions(assignmentId) {
        return this.assignmentsService.getSubmissions(assignmentId);
    }
    delete(id) {
        return this.assignmentsService.delete(id);
    }
};
exports.AssignmentsController = AssignmentsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.RoleType.SUPER_ADMIN, client_1.RoleType.PRINCIPAL, client_1.RoleType.TEACHER),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AssignmentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.RoleType.SUPER_ADMIN, client_1.RoleType.PRINCIPAL, client_1.RoleType.MANAGER, client_1.RoleType.TEACHER, client_1.RoleType.STUDENT),
    __param(0, (0, common_1.Query)('classId')),
    __param(1, (0, common_1.Query)('teacherId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AssignmentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.SUPER_ADMIN, client_1.RoleType.PRINCIPAL, client_1.RoleType.MANAGER, client_1.RoleType.TEACHER, client_1.RoleType.STUDENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssignmentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/submit'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.STUDENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AssignmentsController.prototype, "submit", null);
__decorate([
    (0, common_1.Get)(':id/submissions'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.SUPER_ADMIN, client_1.RoleType.PRINCIPAL, client_1.RoleType.MANAGER, client_1.RoleType.TEACHER),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssignmentsController.prototype, "getSubmissions", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.SUPER_ADMIN, client_1.RoleType.PRINCIPAL, client_1.RoleType.TEACHER),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssignmentsController.prototype, "delete", null);
exports.AssignmentsController = AssignmentsController = __decorate([
    (0, common_1.Controller)('assignments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [assignments_service_1.AssignmentsService])
], AssignmentsController);
const common_2 = require("@nestjs/common");
let SubmissionsController = class SubmissionsController {
    assignmentsService;
    constructor(assignmentsService) {
        this.assignmentsService = assignmentsService;
    }
    grade(id, body) {
        return this.assignmentsService.grade(id, body);
    }
};
exports.SubmissionsController = SubmissionsController;
__decorate([
    (0, common_1.Patch)(':id/grade'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.SUPER_ADMIN, client_1.RoleType.PRINCIPAL, client_1.RoleType.TEACHER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SubmissionsController.prototype, "grade", null);
exports.SubmissionsController = SubmissionsController = __decorate([
    (0, common_2.Controller)('submissions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [assignments_service_1.AssignmentsService])
], SubmissionsController);
//# sourceMappingURL=assignments.controller.js.map