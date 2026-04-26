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
exports.ClassesController = void 0;
const common_1 = require("@nestjs/common");
const classes_service_1 = require("./classes.service");
const create_class_dto_1 = require("./dto/create-class.dto");
const update_class_dto_1 = require("./dto/update-class.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const client_1 = require("@prisma/client");
let ClassesController = class ClassesController {
    classesService;
    constructor(classesService) {
        this.classesService = classesService;
    }
    create(createClassDto) {
        return this.classesService.create(createClassDto);
    }
    findAll() {
        return this.classesService.findAll();
    }
    findOne(id) {
        return this.classesService.findOne(id);
    }
    update(id, updateClassDto) {
        return this.classesService.update(id, updateClassDto);
    }
    remove(id) {
        return this.classesService.remove(id);
    }
    getTimetable(id) {
        return this.classesService.getTimetable(id);
    }
    addTimetableEntry(id, body) {
        return this.classesService.addTimetableEntry(id, body);
    }
    removeTimetableEntry(entryId) {
        return this.classesService.removeTimetableEntry(entryId);
    }
    getStudyMaterials(id) {
        return this.classesService.getStudyMaterials(id);
    }
    addStudyMaterial(id, body) {
        return this.classesService.addStudyMaterial(id, body);
    }
    removeStudyMaterial(materialId) {
        return this.classesService.removeStudyMaterial(materialId);
    }
};
exports.ClassesController = ClassesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.RoleType.SUPER_ADMIN, client_1.RoleType.PRINCIPAL, client_1.RoleType.MANAGER),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_class_dto_1.CreateClassDto]),
    __metadata("design:returntype", void 0)
], ClassesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.RoleType.SUPER_ADMIN, client_1.RoleType.PRINCIPAL, client_1.RoleType.MANAGER, client_1.RoleType.TEACHER),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ClassesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.SUPER_ADMIN, client_1.RoleType.PRINCIPAL, client_1.RoleType.MANAGER, client_1.RoleType.TEACHER),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClassesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.SUPER_ADMIN, client_1.RoleType.PRINCIPAL, client_1.RoleType.MANAGER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_class_dto_1.UpdateClassDto]),
    __metadata("design:returntype", void 0)
], ClassesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.SUPER_ADMIN, client_1.RoleType.PRINCIPAL),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClassesController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/timetable'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClassesController.prototype, "getTimetable", null);
__decorate([
    (0, common_1.Post)(':id/timetable'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.SUPER_ADMIN, client_1.RoleType.PRINCIPAL, client_1.RoleType.MANAGER, client_1.RoleType.TEACHER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ClassesController.prototype, "addTimetableEntry", null);
__decorate([
    (0, common_1.Delete)('timetable/:entryId'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.SUPER_ADMIN, client_1.RoleType.PRINCIPAL, client_1.RoleType.MANAGER, client_1.RoleType.TEACHER),
    __param(0, (0, common_1.Param)('entryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClassesController.prototype, "removeTimetableEntry", null);
__decorate([
    (0, common_1.Get)(':id/materials'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClassesController.prototype, "getStudyMaterials", null);
__decorate([
    (0, common_1.Post)(':id/materials'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.SUPER_ADMIN, client_1.RoleType.PRINCIPAL, client_1.RoleType.MANAGER, client_1.RoleType.TEACHER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ClassesController.prototype, "addStudyMaterial", null);
__decorate([
    (0, common_1.Delete)('materials/:materialId'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.SUPER_ADMIN, client_1.RoleType.PRINCIPAL, client_1.RoleType.MANAGER, client_1.RoleType.TEACHER),
    __param(0, (0, common_1.Param)('materialId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClassesController.prototype, "removeStudyMaterial", null);
exports.ClassesController = ClassesController = __decorate([
    (0, common_1.Controller)('classes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [classes_service_1.ClassesService])
], ClassesController);
//# sourceMappingURL=classes.controller.js.map