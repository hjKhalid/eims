import { PrismaService } from '../prisma/prisma.service';
import { InvoiceStatus } from '@prisma/client';
export declare class FinanceService {
    private prisma;
    constructor(prisma: PrismaService);
    createFeeStructure(data: {
        branchId: string;
        classId?: string;
        name: string;
        amount: number;
        frequency: string;
        dueDay: number;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        branchId: string;
        classId: string | null;
        amount: number;
        frequency: string;
        dueDay: number;
    }>;
    getFeeStructures(branchId?: string): Promise<({
        branch: {
            name: string;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        branchId: string;
        classId: string | null;
        amount: number;
        frequency: string;
        dueDay: number;
    })[]>;
    deleteFeeStructure(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        branchId: string;
        classId: string | null;
        amount: number;
        frequency: string;
        dueDay: number;
    }>;
    generateInvoices(feeStructureId: string, studentIds: string[]): Promise<{
        created: number;
        invoices: {
            id: string;
            createdAt: Date;
            studentId: string;
            status: import("@prisma/client").$Enums.InvoiceStatus;
            dueDate: Date;
            amount: number;
            feeStructureId: string;
        }[];
    }>;
    getInvoices(studentId?: string, branchId?: string, status?: InvoiceStatus): Promise<({
        feeStructure: {
            branch: {
                name: string;
            };
        } & {
            id: string;
            name: string;
            createdAt: Date;
            branchId: string;
            classId: string | null;
            amount: number;
            frequency: string;
            dueDay: number;
        };
        payments: {
            id: string;
            amount: number;
            method: string;
            gatewayRef: string | null;
            receiptNo: string | null;
            paidAt: Date;
            invoiceId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        studentId: string;
        status: import("@prisma/client").$Enums.InvoiceStatus;
        dueDate: Date;
        amount: number;
        feeStructureId: string;
    })[]>;
    recordPayment(data: {
        invoiceId: string;
        amount: number;
        method: string;
        gatewayRef?: string;
    }): Promise<{
        payment: {
            id: string;
            amount: number;
            method: string;
            gatewayRef: string | null;
            receiptNo: string | null;
            paidAt: Date;
            invoiceId: string;
        };
        receiptNo: string;
        message: string;
    }>;
    getReceipt(paymentId: string): Promise<{
        invoice: {
            feeStructure: {
                id: string;
                name: string;
                createdAt: Date;
                branchId: string;
                classId: string | null;
                amount: number;
                frequency: string;
                dueDay: number;
            };
        } & {
            id: string;
            createdAt: Date;
            studentId: string;
            status: import("@prisma/client").$Enums.InvoiceStatus;
            dueDate: Date;
            amount: number;
            feeStructureId: string;
        };
    } & {
        id: string;
        amount: number;
        method: string;
        gatewayRef: string | null;
        receiptNo: string | null;
        paidAt: Date;
        invoiceId: string;
    }>;
    createSalaryStructure(data: {
        branchId: string;
        role: string;
        base: number;
        allowances?: number;
        deductions?: number;
    }): Promise<{
        id: string;
        role: string;
        branchId: string;
        base: number;
        allowances: number;
        deductions: number;
    }>;
    getSalaryStructures(branchId?: string): Promise<({
        branch: {
            name: string;
        };
    } & {
        id: string;
        role: string;
        branchId: string;
        base: number;
        allowances: number;
        deductions: number;
    })[]>;
    runPayroll(data: {
        branchId: string;
        month: string;
        userIds: string[];
    }): Promise<{
        processed: number;
        disbursements: {
            id: string;
            userId: string;
            paidAt: Date;
            month: string;
            gross: number;
            net: number;
            slipUrl: string | null;
        }[];
    }>;
    getSalarySlips(userId?: string, month?: string): Promise<{
        id: string;
        userId: string;
        paidAt: Date;
        month: string;
        gross: number;
        net: number;
        slipUrl: string | null;
    }[]>;
    createExpense(data: {
        branchId: string;
        category: string;
        amount: number;
        description?: string;
        receiptUrl?: string;
    }): Promise<{
        id: string;
        branchId: string;
        date: Date;
        approvedBy: string | null;
        description: string | null;
        amount: number;
        category: string;
        receiptUrl: string | null;
    }>;
    getExpenses(branchId?: string, month?: string): Promise<({
        branch: {
            name: string;
        };
    } & {
        id: string;
        branchId: string;
        date: Date;
        approvedBy: string | null;
        description: string | null;
        amount: number;
        category: string;
        receiptUrl: string | null;
    })[]>;
    approveExpense(id: string, approvedBy: string): Promise<{
        id: string;
        branchId: string;
        date: Date;
        approvedBy: string | null;
        description: string | null;
        amount: number;
        category: string;
        receiptUrl: string | null;
    }>;
    deleteExpense(id: string): Promise<{
        id: string;
        branchId: string;
        date: Date;
        approvedBy: string | null;
        description: string | null;
        amount: number;
        category: string;
        receiptUrl: string | null;
    }>;
}
