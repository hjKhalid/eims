import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RoleType, AttendanceStatus, LeaveStatus } from '@prisma/client';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  // ─── Attendance ───────────────────────────────────
  @Post('attendance')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER, RoleType.TEACHER)
  markAttendance(@Body() body: { classId: string; studentId: string; date: string; status: AttendanceStatus; sessionId?: string; source?: string }) {
    return this.attendanceService.markAttendance(body);
  }

  @Get('attendance')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER, RoleType.TEACHER, RoleType.STUDENT)
  getAttendance(
    @Query('classId') classId: string,
    @Query('studentId') studentId: string,
    @Query('date') date: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    if (classId && date) return this.attendanceService.getClassAttendance(classId, date);
    if (studentId && from && to) return this.attendanceService.getStudentAttendance(studentId, from, to);
    if (studentId) return this.attendanceService.getStudentAttendance(studentId, '2000-01-01', new Date().toISOString());
    return [];
  }

  @Get('attendance/summary/:studentId')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER, RoleType.TEACHER, RoleType.STUDENT, RoleType.PARENT)
  getAttendanceSummary(@Param('studentId') studentId: string) {
    return this.attendanceService.getAttendanceSummary(studentId);
  }

  // ─── Leave Requests ───────────────────────────────
  @Post('leave-requests')
  @Roles(RoleType.STUDENT, RoleType.PARENT, RoleType.TEACHER)
  createLeaveRequest(@Body() body: { studentId: string; fromDate: string; toDate: string; reason: string }) {
    return this.attendanceService.createLeaveRequest(body);
  }

  @Get('leave-requests')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER, RoleType.TEACHER, RoleType.STUDENT)
  getLeaveRequests(
    @Query('studentId') studentId: string,
    @Query('status') status: LeaveStatus,
  ) {
    return this.attendanceService.getLeaveRequests({ studentId, status });
  }

  @Patch('leave-requests/:id')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER, RoleType.TEACHER)
  updateLeaveRequest(@Param('id') id: string, @Body() body: { status: LeaveStatus; approvedBy?: string }) {
    return this.attendanceService.updateLeaveRequest(id, body.status, body.approvedBy);
  }
}
