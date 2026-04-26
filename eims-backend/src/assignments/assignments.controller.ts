import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RoleType } from '@prisma/client';

@Controller('assignments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.TEACHER)
  create(@Body() body: { classId: string; teacherId: string; title: string; description?: string; dueDate: string; maxMarks?: number; files?: string[] }) {
    return this.assignmentsService.create(body);
  }

  @Get()
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER, RoleType.TEACHER, RoleType.STUDENT)
  findAll(@Query('classId') classId: string, @Query('teacherId') teacherId: string) {
    return this.assignmentsService.findAll(classId, teacherId);
  }

  @Get(':id')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER, RoleType.TEACHER, RoleType.STUDENT)
  findOne(@Param('id') id: string) {
    return this.assignmentsService.findOne(id);
  }

  @Post(':id/submit')
  @Roles(RoleType.STUDENT)
  submit(@Param('id') assignmentId: string, @Body() body: { studentId: string; text?: string; files?: string[] }) {
    return this.assignmentsService.submit(assignmentId, body.studentId, { text: body.text, files: body.files });
  }

  @Get(':id/submissions')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER, RoleType.TEACHER)
  getSubmissions(@Param('id') assignmentId: string) {
    return this.assignmentsService.getSubmissions(assignmentId);
  }

  @Delete(':id')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.TEACHER)
  delete(@Param('id') id: string) {
    return this.assignmentsService.delete(id);
  }
}

// Separate controller for submissions grading
import { Controller as SubmissionsCtrl } from '@nestjs/common';

@SubmissionsCtrl('submissions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubmissionsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Patch(':id/grade')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.TEACHER)
  grade(@Param('id') id: string, @Body() body: { marks: number; feedback?: string }) {
    return this.assignmentsService.grade(id, body);
  }
}
