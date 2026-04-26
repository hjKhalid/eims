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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const crypto_1 = require("crypto");
let FinanceService = class FinanceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createFeeStructure(data) {
        return this.prisma.feeStructure.create({ data });
    }
    async getFeeStructures(branchId) {
        return this.prisma.feeStructure.findMany({
            where: branchId ? { branchId } : {},
            include: { branch: { select: { name: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async deleteFeeStructure(id) {
        return this.prisma.feeStructure.delete({ where: { id } });
    }
    async generateInvoices(feeStructureId, studentIds) {
        const struct = await this.prisma.feeStructure.findUnique({ where: { id: feeStructureId } });
        if (!struct)
            throw new common_1.NotFoundException('Fee structure not found');
        const dueDate = new Date();
        dueDate.setDate(struct.dueDay);
        const invoices = await Promise.all(studentIds.map(studentId => this.prisma.feeInvoice.create({
            data: { studentId, feeStructureId, amount: struct.amount, dueDate, status: 'UNPAID' },
        })));
        return { created: invoices.length, invoices };
    }
    async getInvoices(studentId, branchId, status) {
        return this.prisma.feeInvoice.findMany({
            where: {
                ...(studentId ? { studentId } : {}),
                ...(status ? { status } : {}),
            },
            include: { feeStructure: { include: { branch: { select: { name: true } } } }, payments: true },
            orderBy: { dueDate: 'desc' },
        });
    }
    async recordPayment(data) {
        const invoice = await this.prisma.feeInvoice.findUnique({ where: { id: data.invoiceId } });
        if (!invoice)
            throw new common_1.NotFoundException('Invoice not found');
        const receiptNo = `REC-${Date.now()}-${(0, crypto_1.randomBytes)(3).toString('hex').toUpperCase()}`;
        const payment = await this.prisma.feePayment.create({
            data: {
                invoiceId: data.invoiceId,
                amount: data.amount,
                method: data.method,
                gatewayRef: data.gatewayRef,
                receiptNo,
            },
        });
        await this.prisma.feeInvoice.update({ where: { id: data.invoiceId }, data: { status: 'PAID' } });
        return { payment, receiptNo, message: 'Payment recorded successfully' };
    }
    async getReceipt(paymentId) {
        const payment = await this.prisma.feePayment.findUnique({
            where: { id: paymentId },
            include: { invoice: { include: { feeStructure: true } } },
        });
        if (!payment)
            throw new common_1.NotFoundException('Payment not found');
        return payment;
    }
    async createSalaryStructure(data) {
        return this.prisma.salaryStructure.create({ data: { ...data, allowances: data.allowances || 0, deductions: data.deductions || 0 } });
    }
    async getSalaryStructures(branchId) {
        return this.prisma.salaryStructure.findMany({
            where: branchId ? { branchId } : {},
            include: { branch: { select: { name: true } } },
        });
    }
    async runPayroll(data) {
        const structures = await this.prisma.salaryStructure.findMany({ where: { branchId: data.branchId } });
        const disbursements = await Promise.all(data.userIds.map(async (userId) => {
            const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { roles: { include: { role: true } } } });
            const role = user?.roles?.[0]?.role?.name || 'TEACHER';
            const struct = structures.find(s => s.role === role);
            const gross = struct ? struct.base + struct.allowances : 0;
            const net = struct ? gross - struct.deductions : 0;
            return this.prisma.salaryDisbursement.create({
                data: { userId, month: data.month, gross, net, slipUrl: null },
            });
        }));
        return { processed: disbursements.length, disbursements };
    }
    async getSalarySlips(userId, month) {
        return this.prisma.salaryDisbursement.findMany({
            where: {
                ...(userId ? { userId } : {}),
                ...(month ? { month } : {}),
            },
            orderBy: { paidAt: 'desc' },
        });
    }
    async createExpense(data) {
        return this.prisma.expense.create({ data });
    }
    async getExpenses(branchId, month) {
        const where = {};
        if (branchId)
            where.branchId = branchId;
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
    async approveExpense(id, approvedBy) {
        return this.prisma.expense.update({ where: { id }, data: { approvedBy } });
    }
    async deleteExpense(id) {
        return this.prisma.expense.delete({ where: { id } });
    }
};
exports.FinanceService = FinanceService;
exports.FinanceService = FinanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FinanceService);
//# sourceMappingURL=finance.service.js.map