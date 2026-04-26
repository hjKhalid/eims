import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { SchoolsModule } from './schools/schools.module';
import { BranchesModule } from './branches/branches.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { ClassesModule } from './classes/classes.module';
import { SubjectsModule } from './subjects/subjects.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { AttendanceModule } from './attendance/attendance.module';
import { SessionsModule } from './sessions/sessions.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { FinanceModule } from './finance/finance.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReportsModule } from './reports/reports.module';
import { MessagesModule } from './messages/messages.module';
import { UploadModule } from './upload/upload.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    UsersModule,
    SchoolsModule,
    BranchesModule,
    OrganizationsModule,
    ClassesModule,
    SubjectsModule,
    EnrollmentModule,
    AttendanceModule,
    SessionsModule,
    AssignmentsModule,
    FinanceModule,
    NotificationsModule,
    ReportsModule,
    MessagesModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
