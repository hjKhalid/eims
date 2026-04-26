import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getSchoolSummary(schoolId: string) {
    const school = await this.prisma.school.findUnique({ where: { id: schoolId }, include: { branches: true } });
    const branchIds = school?.branches.map(b => b.id) || [];

    const [totalClasses, totalSubjects, totalExpenses, totalInvoices, paidInvoices] = await Promise.all([
      this.prisma.class.count({ where: { branchId: { in: branchIds } } }),
      this.prisma.subject.count({ where: { branchId: { in: branchIds } } }),
      this.prisma.expense.aggregate({ where: { branchId: { in: branchIds } }, _sum: { amount: true } }),
      this.prisma.feeInvoice.count(),
      this.prisma.feeInvoice.count({ where: { status: 'PAID' } }),
    ]);

    return {
      school: { id: schoolId, name: school?.name, branches: school?.branches.length },
      academic: { classes: totalClasses, subjects: totalSubjects },
      finance: {
        totalExpenses: totalExpenses._sum.amount || 0,
        totalInvoices,
        paidInvoices,
        pendingInvoices: totalInvoices - paidInvoices,
        collectionRate: totalInvoices ? Math.round((paidInvoices / totalInvoices) * 100) : 0,
      },
    };
  }

  async getBranchFinance(branchId: string) {
    const [expenses, invoices, payments] = await Promise.all([
      this.prisma.expense.findMany({ where: { branchId }, orderBy: { date: 'desc' } }),
      this.prisma.feeStructure.findMany({ where: { branchId }, include: { invoices: { include: { payments: true } } } }),
      this.prisma.salaryDisbursement.findMany({ orderBy: { paidAt: 'desc' } }),
    ]);
    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
    const totalRevenue = invoices.reduce((s, fs) => s + fs.invoices.reduce((ss, inv) => ss + inv.payments.reduce((p, pay) => p + pay.amount, 0), 0), 0);
    const totalSalaries = payments.reduce((s, d) => s + d.net, 0);
    return { totalRevenue, totalExpenses, totalSalaries, netProfit: totalRevenue - totalExpenses - totalSalaries, expenses, invoices };
  }

  async getStudentProgress(studentId: string) {
    const [enrollments, attendance, invoices, assignments] = await Promise.all([
      this.prisma.enrollment.findMany({ where: { studentId }, include: { class: true } }),
      this.prisma.attendance.findMany({ where: { studentId } }),
      this.prisma.feeInvoice.findMany({ where: { studentId }, include: { payments: true } }),
      this.prisma.submission.findMany({ where: { studentId }, include: { assignment: { select: { title: true, maxMarks: true, dueDate: true } } } }),
    ]);

    const totalAttendance = attendance.length;
    const present = attendance.filter(a => a.status === 'PRESENT').length;
    const avgMarks = assignments.filter(a => a.marks !== null).length
      ? Math.round(assignments.filter(a => a.marks !== null).reduce((s, a) => s + (a.marks || 0), 0) / assignments.filter(a => a.marks !== null).length)
      : null;

    return {
      studentId,
      enrolledClasses: enrollments.length,
      attendance: { total: totalAttendance, present, percentage: totalAttendance ? Math.round((present / totalAttendance) * 100) : 0 },
      fees: { total: invoices.length, paid: invoices.filter(i => i.status === 'PAID').length, pending: invoices.filter(i => i.status !== 'PAID').length },
      assignments: { total: assignments.length, graded: assignments.filter(a => a.marks !== null).length, avgMarks },
      submissions: assignments,
    };
  }

  async getDashboardSummary() {
    const [schools, branches, users, classes] = await Promise.all([
      this.prisma.school.count(),
      this.prisma.branch.count(),
      this.prisma.user.count(),
      this.prisma.class.count(),
    ]);
    const [sessions, assignments, invoices] = await Promise.all([
      this.prisma.liveSession.count({ where: { status: 'ENDED' } }),
      this.prisma.assignment.count(),
      this.prisma.feeInvoice.count({ where: { status: 'PAID' } }),
    ]);
    return { schools, branches, users, classes, sessions, assignments, paidInvoices: invoices };
  }
}
