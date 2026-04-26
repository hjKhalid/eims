import { SchoolsService } from './schools.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
export declare class SchoolsController {
    private readonly schoolsService;
    constructor(schoolsService: SchoolsService);
    create(createSchoolDto: CreateSchoolDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        address: string | null;
        phone: string | null;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        address: string | null;
        phone: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        address: string | null;
        phone: string | null;
    } | null>;
    update(id: string, updateSchoolDto: UpdateSchoolDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        address: string | null;
        phone: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        address: string | null;
        phone: string | null;
    }>;
}
