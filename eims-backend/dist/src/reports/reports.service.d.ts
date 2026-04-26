import { PrismaService } from '../prisma/prisma.service';
export declare class ReportsService {
    private prisma;
    constructor(prisma: PrismaService);
    getSchoolSummary(schoolId: string): Promise<{
        school: {
            id: string;
            name: string | undefined;
            branches: number | undefined;
        };
        academic: {
            classes: number;
            subjects: number;
        };
        finance: {
            totalExpenses: number;
            totalInvoices: number;
            paidInvoices: number;
            pendingInvoices: number;
            collectionRate: number;
        };
    }>;
    getBranchFinance(branchId: string): Promise<{
        totalRevenue: number;
        totalExpenses: number;
        totalSalaries: number;
        netProfit: number;
        expenses: {
            id: string;
            branchId: string;
            date: Date;
            approvedBy: string | null;
            description: string | null;
            amount: number;
            category: string;
            receiptUrl: string | null;
        }[];
        invoices: ({
            invoices: ({
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
            })[];
        } & {
            id: string;
            name: string;
            createdAt: Date;
            branchId: string;
            classId: string | null;
            amount: number;
            frequency: string;
            dueDay: number;
        })[];
    }>;
    getStudentProgress(studentId: string): Promise<{
        studentId: string;
        enrolledClasses: number;
        attendance: {
            total: number;
            present: number;
            percentage: number;
        };
        fees: {
            total: number;
            paid: number;
            pending: number;
        };
        assignments: {
            total: number;
            graded: number;
            avgMarks: number | null;
        };
        submissions: ({
            assignment: {
                title: string;
                dueDate: Date;
                maxMarks: number | null;
            };
        } & {
            id: string;
            studentId: string;
            files: string[];
            assignmentId: string;
            text: string | null;
            submittedAt: Date;
            isLate: boolean;
            marks: number | null;
            feedback: string | null;
            gradedAt: Date | null;
        })[];
    }>;
    getDashboardSummary(): Promise<{
        schools: number;
        branches: number;
        users: number;
        classes: number;
        sessions: number;
        assignments: number;
        paidInvoices: number;
    }>;
}
