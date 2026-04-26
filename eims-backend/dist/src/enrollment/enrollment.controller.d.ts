import { EnrollmentService } from './enrollment.service';
export declare class EnrollmentController {
    private readonly enrollmentService;
    constructor(enrollmentService: EnrollmentService);
    enroll(classId: string, body: {
        studentId: string;
    }): Promise<{
        id: string;
        classId: string;
        studentId: string;
        enrolledAt: Date;
    }>;
    unenroll(classId: string, studentId: string): Promise<{
        id: string;
        classId: string;
        studentId: string;
        enrolledAt: Date;
    }>;
    getStudents(classId: string): Promise<({
        class: {
            name: string;
        };
    } & {
        id: string;
        classId: string;
        studentId: string;
        enrolledAt: Date;
    })[]>;
    getStudentClasses(studentId: string): Promise<({
        class: {
            branch: {
                school: {
                    id: string;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    organizationId: string;
                    address: string | null;
                    phone: string | null;
                };
            } & {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                schoolId: string;
                city: string | null;
                headId: string | null;
            };
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            branchId: string;
            gradeLevel: string | null;
        };
    } & {
        id: string;
        classId: string;
        studentId: string;
        enrolledAt: Date;
    })[]>;
}
