import { PrismaService } from '../prisma/prisma.service';
import { Class, Prisma, Timetable, StudyMaterial } from '@prisma/client';
export declare class ClassesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<Class[]>;
    findOne(id: string): Promise<Class | null>;
    create(data: Prisma.ClassUncheckedCreateInput): Promise<Class>;
    update(id: string, data: Prisma.ClassUncheckedUpdateInput): Promise<Class>;
    remove(id: string): Promise<Class>;
    getTimetable(classId: string): Promise<Timetable[]>;
    addTimetableEntry(classId: string, data: Omit<Prisma.TimetableUncheckedCreateInput, 'classId'>): Promise<Timetable>;
    removeTimetableEntry(id: string): Promise<Timetable>;
    getStudyMaterials(classId: string): Promise<StudyMaterial[]>;
    addStudyMaterial(classId: string, data: Omit<Prisma.StudyMaterialUncheckedCreateInput, 'classId'>): Promise<StudyMaterial>;
    removeStudyMaterial(id: string): Promise<StudyMaterial>;
}
