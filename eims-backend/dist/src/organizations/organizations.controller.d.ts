import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
export declare class OrganizationsController {
    private readonly organizationsService;
    constructor(organizationsService: OrganizationsService);
    create(createOrganizationDto: CreateOrganizationDto): Promise<{
        id: string;
        name: string;
        logoUrl: string | null;
        plan: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        logoUrl: string | null;
        plan: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        logoUrl: string | null;
        plan: string;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    update(id: string, updateOrganizationDto: UpdateOrganizationDto): Promise<{
        id: string;
        name: string;
        logoUrl: string | null;
        plan: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        logoUrl: string | null;
        plan: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
