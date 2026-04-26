import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RoleType } from '@prisma/client';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER)
  getDashboardSummary() {
    return this.reportsService.getDashboardSummary();
  }

  @Get('school/:id/summary')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER)
  getSchoolSummary(@Param('id') id: string) {
    return this.reportsService.getSchoolSummary(id);
  }

  @Get('branch/:id/finance')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER)
  getBranchFinance(@Param('id') id: string) {
    return this.reportsService.getBranchFinance(id);
  }

  @Get('student/:id/progress')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER, RoleType.TEACHER, RoleType.STUDENT, RoleType.PARENT)
  getStudentProgress(@Param('id') id: string) {
    return this.reportsService.getStudentProgress(id);
  }
}
