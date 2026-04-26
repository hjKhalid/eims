import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
export declare class ClassesController {
    private readonly classesService;
    constructor(classesService: ClassesService);
    create(createClassDto: CreateClassDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        branchId: string;
        gradeLevel: string | null;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        branchId: string;
        gradeLevel: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        branchId: string;
        gradeLevel: string | null;
    } | null>;
    update(id: string, updateClassDto: UpdateClassDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        branchId: string;
        gradeLevel: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        branchId: string;
        gradeLevel: string | null;
    }>;
    getTimetable(id: string): Promise<{
        id: string;
        createdAt: Date;
        classId: string;
        day: string;
        period: number;
        room: string | null;
        startTime: string | null;
    }[]>;
    addTimetableEntry(id: string, body: any): Promise<{
        id: string;
        createdAt: Date;
        classId: string;
        day: string;
        period: number;
        room: string | null;
        startTime: string | null;
    }>;
    removeTimetableEntry(entryId: string): Promise<{
        id: string;
        createdAt: Date;
        classId: string;
        day: string;
        period: number;
        room: string | null;
        startTime: string | null;
    }>;
    getStudyMaterials(id: string): Promise<{
        url: string;
        id: string;
        createdAt: Date;
        classId: string;
        type: string;
        title: string;
        uploadedBy: string;
    }[]>;
    addStudyMaterial(id: string, body: any): Promise<{
        url: string;
        id: string;
        createdAt: Date;
        classId: string;
        type: string;
        title: string;
        uploadedBy: string;
    }>;
    removeStudyMaterial(materialId: string): Promise<{
        url: string;
        id: string;
        createdAt: Date;
        classId: string;
        type: string;
        title: string;
        uploadedBy: string;
    }>;
}
