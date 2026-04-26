import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RoleType } from '@prisma/client';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post('classes/:classId/enroll')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER)
  enroll(@Param('classId') classId: string, @Body() body: { studentId: string }) {
    return this.enrollmentService.enroll(classId, body.studentId);
  }

  @Delete('classes/:classId/enroll/:studentId')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER)
  unenroll(@Param('classId') classId: string, @Param('studentId') studentId: string) {
    return this.enrollmentService.unenroll(classId, studentId);
  }

  @Get('classes/:classId/students')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER, RoleType.TEACHER)
  getStudents(@Param('classId') classId: string) {
    return this.enrollmentService.getStudents(classId);
  }

  @Get('students/:studentId/classes')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER, RoleType.TEACHER, RoleType.STUDENT)
  getStudentClasses(@Param('studentId') studentId: string) {
    return this.enrollmentService.getStudentClasses(studentId);
  }
}
