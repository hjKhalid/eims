import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InvoiceStatus } from '@prisma/client';
import { randomBytes } from 'crypto';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  // ─── Fee Structures ─────────────────────────────
  async createFeeStructure(data: { branchId: string; classId?: string; name: string; amount: number; frequency: string; dueDay: number }) {
    return this.prisma.feeStructure.create({ data });
  }

  async getFeeStructures(branchId?: string) {
    return this.prisma.feeStructure.findMany({
      where: branchId ? { branchId } : {},
      include: { branch: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteFeeStructure(id: string) {
    return this.prisma.feeStructure.delete({ where: { id } });
  }

  // ─── Fee Invoices ────────────────────────────────
  async generateInvoices(feeStructureId: string, studentIds: string[]) {
    const struct = await this.prisma.feeStructure.findUnique({ where: { id: feeStructureId } });
    if (!struct) throw new NotFoundException('Fee structure not found');
    const dueDate = new Date();
    dueDate.setDate(struct.dueDay);
    const invoices = await Promise.all(
      studentIds.map(studentId =>
        this.prisma.feeInvoice.create({
          data: { studentId, feeStructureId, amount: struct.amount, dueDate, status: 'UNPAID' },
        })
      )
    );
    return { created: invoices.length, invoices };
  }

  async getInvoices(studentId?: string, branchId?: string, status?: InvoiceStatus) {
    return this.prisma.feeInvoice.findMany({
      where: {
        ...(studentId ? { studentId } : {}),
        ...(status ? { status } : {}),
      },
      include: { feeStructure: { include: { branch: { select: { name: true } } } }, payments: true },
      orderBy: { dueDate: 'desc' },
    });
  }

  // ─── Fee Payments ────────────────────────────────
  async recordPayment(data: { invoiceId: string; amount: number; method: string; gatewayRef?: string }) {
    const invoice = await this.prisma.feeInvoice.findUnique({ where: { id: data.invoiceId } });
    if (!invoice) throw new NotFoundException('Invoice not found');
    const receiptNo = `REC-${Date.now()}-${randomBytes(3).toString('hex').toUpperCase()}`;
    const payment = await this.prisma.feePayment.create({
      data: {
        invoiceId: data.invoiceId,
        amount: data.amount,
        method: data.method,
        gatewayRef: data.gatewayRef,
        receiptNo,
      },
    });
    // Mark invoice paid
    await this.prisma.feeInvoice.update({ where: { id: data.invoiceId }, data: { status: 'PAID' } });
    return { payment, receiptNo, message: 'Payment recorded successfully' };
  }

  async getReceipt(paymentId: string) {
    const payment = await this.prisma.feePayment.findUnique({
      where: { id: paymentId },
      include: { invoice: { include: { feeStructure: true } } },
    });
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  // ─── Salary Structures ───────────────────────────
  async createSalaryStructure(data: { branchId: string; role: string; base: number; allowances?: number; deductions?: number }) {
    return this.prisma.salaryStructure.create({ data: { ...data, allowances: data.allowances || 0, deductions: data.deductions || 0 } });
  }

  async getSalaryStructures(branchId?: string) {
    return this.prisma.salaryStructure.findMany({
      where: branchId ? { branchId } : {},
      include: { branch: { select: { name: true } } },
    });
  }

  // ─── Salary Disbursements ────────────────────────
  async runPayroll(data: { branchId: string; month: string; userIds: string[] }) {
    const structures = await this.prisma.salaryStructure.findMany({ where: { branchId: data.branchId } });
    const disbursements = await Promise.all(
      data.userIds.map(async userId => {
        const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { roles: { include: { role: true } } } });
        const role = user?.roles?.[0]?.role?.name || 'TEACHER';
        const struct = structures.find(s => s.role === role);
        const gross = struct ? struct.base + struct.allowances : 0;
        const net = struct ? gross - struct.deductions : 0;
        return this.prisma.salaryDisbursement.create({
          data: { userId, month: data.month, gross, net, slipUrl: null },
        });
      })
    );
    return { processed: disbursements.length, disbursements };
  }

  async getSalarySlips(userId?: string, month?: string) {
    return this.prisma.salaryDisbursement.findMany({
      where: {
        ...(userId ? { userId } : {}),
        ...(month ? { month } : {}),
      },
      orderBy: { paidAt: 'desc' },
    });
  }

  // ─── Expenses ────────────────────────────────────
  async createExpense(data: { branchId: string; category: string; amount: number; description?: string; receiptUrl?: string }) {
    return this.prisma.expense.create({ data });
  }

  async getExpenses(branchId?: string, month?: string) {
    const where: any = {};
    if (branchId) where.branchId = branchId;
    if (month) {
      const [year, m] = month.split('-').map(Number);
      where.date = { gte: new Date(year, m - 1, 1), lt: new Date(year, m, 1) };
    }
    return this.prisma.expense.findMany({
      where,
      include: { branch: { select: { name: true } } },
      orderBy: { date: 'desc' },
    });
  }

  async approveExpense(id: string, approvedBy: string) {
    return this.prisma.expense.update({ where: { id }, data: { approvedBy } });
  }

  async deleteExpense(id: string) {
    return this.prisma.expense.delete({ where: { id } });
  }
}
