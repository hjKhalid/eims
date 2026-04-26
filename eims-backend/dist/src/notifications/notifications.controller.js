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
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const notifications_service_1 = require("./notifications.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const client_1 = require("@prisma/client");
let NotificationsController = class NotificationsController {
    notificationsService;
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    getNotifications(userId) {
        return this.notificationsService.getForUser(userId);
    }
    getUnreadCount(userId) {
        return this.notificationsService.getUnreadCount(userId);
    }
    markRead(id) {
        return this.notificationsService.markRead(id);
    }
    markAllRead(body) {
        return this.notificationsService.markAllRead(body.userId);
    }
    create(body) {
        return this.notificationsService.create(body);
    }
    createAnnouncement(body) {
        return this.notificationsService.createAnnouncement(body);
    }
    getAnnouncements(branchId, classId) {
        return this.notificationsService.getAnnouncements(branchId, classId);
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Get)('notifications'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.SUPER_ADMIN, client_1.RoleType.PRINCIPAL, client_1.RoleType.MANAGER, client_1.RoleType.TEACHER, client_1.RoleType.STUDENT, client_1.RoleType.PARENT),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Get)('notifications/unread-count'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.SUPER_ADMIN, client_1.RoleType.PRINCIPAL, client_1.RoleType.MANAGER, client_1.RoleType.TEACHER, client_1.RoleType.STUDENT, client_1.RoleType.PARENT),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Patch)('notifications/:id/read'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.SUPER_ADMIN, client_1.RoleType.PRINCIPAL, client_1.RoleType.MANAGER, client_1.RoleType.TEACHER, client_1.RoleType.STUDENT, client_1.RoleType.PARENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "markRead", null);
__decorate([
    (0, common_1.Post)('notifications/read-all'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.SUPER_ADMIN, client_1.RoleType.PRINCIPAL, client_1.RoleType.MANAGER, client_1.RoleType.TEACHER, client_1.RoleType.STUDENT, client_1.RoleType.PARENT),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "markAllRead", null);
__decorate([
    (0, common_1.Post)('notifications'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.SUPER_ADMIN, client_1.RoleType.PRINCIPAL, client_1.RoleType.MANAGER),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('announcements'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.SUPER_ADMIN, client_1.RoleType.PRINCIPAL, client_1.RoleType.MANAGER, client_1.RoleType.TEACHER),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "createAnnouncement", null);
__decorate([
    (0, common_1.Get)('announcements'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.SUPER_ADMIN, client_1.RoleType.PRINCIPAL, client_1.RoleType.MANAGER, client_1.RoleType.TEACHER, client_1.RoleType.STUDENT, client_1.RoleType.PARENT),
    __param(0, (0, common_1.Query)('branchId')),
    __param(1, (0, common_1.Query)('classId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "getAnnouncements", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map