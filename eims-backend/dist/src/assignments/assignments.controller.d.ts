import { AssignmentsService } from './assignments.service';
export declare class AssignmentsController {
    private readonly assignmentsService;
    constructor(assignmentsService: AssignmentsService);
    create(body: {
        classId: string;
        teacherId: string;
        title: string;
        description?: string;
        dueDate: string;
        maxMarks?: number;
        files?: string[];
    }): Promise<{
        class: {
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        classId: string;
        title: string;
        teacherId: string;
        description: string | null;
        dueDate: Date;
        maxMarks: number | null;
        files: string[];
    }>;
    findAll(classId: string, teacherId: string): Promise<({
        _count: {
            submissions: number;
        };
        class: {
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        classId: string;
        title: string;
        teacherId: string;
        description: string | null;
        dueDate: Date;
        maxMarks: number | null;
        files: string[];
    })[]>;
    findOne(id: string): Promise<{
        class: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            branchId: string;
            gradeLevel: string | null;
        };
        submissions: {
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
        }[];
    } & {
        id: string;
        createdAt: Date;
        classId: string;
        title: string;
        teacherId: string;
        description: string | null;
        dueDate: Date;
        maxMarks: number | null;
        files: string[];
    }>;
    submit(assignmentId: string, body: {
        studentId: string;
        text?: string;
        files?: string[];
    }): Promise<{
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
    }>;
    getSubmissions(assignmentId: string): Promise<{
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
    }[]>;
    delete(id: string): Promise<{
        id: string;
        createdAt: Date;
        classId: string;
        title: string;
        teacherId: string;
        description: string | null;
        dueDate: Date;
        maxMarks: number | null;
        files: string[];
    }>;
}
export declare class SubmissionsController {
    private readonly assignmentsService;
    constructor(assignmentsService: AssignmentsService);
    grade(id: string, body: {
        marks: number;
        feedback?: string;
    }): Promise<{
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
    }>;
}
