import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
export declare class BranchesController {
    private readonly branchesService;
    constructor(branchesService: BranchesService);
    create(createBranchDto: CreateBranchDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        schoolId: string;
        city: string | null;
        headId: string | null;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        schoolId: string;
        city: string | null;
        headId: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        schoolId: string;
        city: string | null;
        headId: string | null;
    } | null>;
    update(id: string, updateBranchDto: UpdateBranchDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        schoolId: string;
        city: string | null;
        headId: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        schoolId: string;
        city: string | null;
        headId: string | null;
    }>;
}
