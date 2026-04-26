import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    create(body: {
        name: string;
        email: string;
        password: string;
        phone?: string;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        email: string;
        passwordHash: string;
        avatar: string | null;
    }>;
    update(id: string, body: any): Promise<any>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        email: string;
        passwordHash: string;
        avatar: string | null;
    }>;
}
