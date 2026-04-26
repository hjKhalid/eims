"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_service_1 = require("./prisma/prisma.service");
const auth_module_1 = require("./auth/auth.module");
const prisma_module_1 = require("./prisma/prisma.module");
const users_module_1 = require("./users/users.module");
const schools_module_1 = require("./schools/schools.module");
const branches_module_1 = require("./branches/branches.module");
const organizations_module_1 = require("./organizations/organizations.module");
const classes_module_1 = require("./classes/classes.module");
const subjects_module_1 = require("./subjects/subjects.module");
const enrollment_module_1 = require("./enrollment/enrollment.module");
const attendance_module_1 = require("./attendance/attendance.module");
const sessions_module_1 = require("./sessions/sessions.module");
const assignments_module_1 = require("./assignments/assignments.module");
const finance_module_1 = require("./finance/finance.module");
const notifications_module_1 = require("./notifications/notifications.module");
const reports_module_1 = require("./reports/reports.module");
const messages_module_1 = require("./messages/messages.module");
const upload_module_1 = require("./upload/upload.module");
const config_1 = require("@nestjs/config");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            auth_module_1.AuthModule,
            prisma_module_1.PrismaModule,
            users_module_1.UsersModule,
            schools_module_1.SchoolsModule,
            branches_module_1.BranchesModule,
            organizations_module_1.OrganizationsModule,
            classes_module_1.ClassesModule,
            subjects_module_1.SubjectsModule,
            enrollment_module_1.EnrollmentModule,
            attendance_module_1.AttendanceModule,
            sessions_module_1.SessionsModule,
            assignments_module_1.AssignmentsModule,
            finance_module_1.FinanceModule,
            notifications_module_1.NotificationsModule,
            reports_module_1.ReportsModule,
            messages_module_1.MessagesModule,
            upload_module_1.UploadModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, prisma_service_1.PrismaService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map