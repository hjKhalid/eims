import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RoleType, InvoiceStatus } from '@prisma/client';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  // ─── Fee Structures ─────────────────────────────
  @Post('fee-structures')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL)
  createFeeStructure(@Body() body: any) { return this.financeService.createFeeStructure(body); }

  @Get('fee-structures')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER)
  getFeeStructures(@Query('branchId') branchId: string) { return this.financeService.getFeeStructures(branchId); }

  @Delete('fee-structures/:id')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL)
  deleteFeeStructure(@Param('id') id: string) { return this.financeService.deleteFeeStructure(id); }

  // ─── Fee Invoices ────────────────────────────────
  @Post('fee-invoices/generate')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER)
  generateInvoices(@Body() body: { feeStructureId: string; studentIds: string[] }) {
    return this.financeService.generateInvoices(body.feeStructureId, body.studentIds);
  }

  @Get('fee-invoices')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER, RoleType.STUDENT)
  getInvoices(@Query('studentId') studentId: string, @Query('branchId') branchId: string, @Query('status') status: InvoiceStatus) {
    return this.financeService.getInvoices(studentId, branchId, status);
  }

  // ─── Fee Payments ────────────────────────────────
  @Post('fee-payments')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER, RoleType.STUDENT)
  recordPayment(@Body() body: { invoiceId: string; amount: number; method: string; gatewayRef?: string }) {
    return this.financeService.recordPayment(body);
  }

  @Get('fee-payments/:id/receipt')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER, RoleType.STUDENT)
  getReceipt(@Param('id') id: string) { return this.financeService.getReceipt(id); }

  // ─── Salary Structures ───────────────────────────
  @Post('salary-structures')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL)
  createSalaryStructure(@Body() body: any) { return this.financeService.createSalaryStructure(body); }

  @Get('salary-structures')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER)
  getSalaryStructures(@Query('branchId') branchId: string) { return this.financeService.getSalaryStructures(branchId); }

  // ─── Salary Disbursements ────────────────────────
  @Post('salary-disbursements/run')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER)
  runPayroll(@Body() body: { branchId: string; month: string; userIds: string[] }) {
    return this.financeService.runPayroll(body);
  }

  @Get('salary-disbursements')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER, RoleType.TEACHER)
  getSalarySlips(@Query('userId') userId: string, @Query('month') month: string) {
    return this.financeService.getSalarySlips(userId, month);
  }

  // ─── Expenses ────────────────────────────────────
  @Post('expenses')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER)
  createExpense(@Body() body: any) { return this.financeService.createExpense(body); }

  @Get('expenses')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER)
  getExpenses(@Query('branchId') branchId: string, @Query('month') month: string) {
    return this.financeService.getExpenses(branchId, month);
  }

  @Patch('expenses/:id/approve')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL)
  approveExpense(@Param('id') id: string, @Body() body: { approvedBy: string }) {
    return this.financeService.approveExpense(id, body.approvedBy);
  }

  @Delete('expenses/:id')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER)
  deleteExpense(@Param('id') id: string) { return this.financeService.deleteExpense(id); }
}
