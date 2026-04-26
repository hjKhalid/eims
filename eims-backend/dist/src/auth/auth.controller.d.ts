import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthController {
    private authService;
    private prisma;
    constructor(authService: AuthService, prisma: PrismaService);
    login(body: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            roles: any;
        };
    }>;
    register(body: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            roles: any;
        };
    }>;
    changePassword(req: any, body: {
        currentPassword: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
    updateProfile(req: any, body: {
        name?: string;
        phone?: string;
    }): Promise<{
        id: string;
        name: string;
        phone: string | null;
        email: string;
    }>;
    me(req: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        phone: string | null;
        email: string;
        avatar: string | null;
        roles: ({
            role: {
                id: string;
                name: import("@prisma/client").$Enums.RoleType;
            };
        } & {
            id: string;
            schoolId: string | null;
            userId: string;
            roleId: string;
            branchId: string | null;
        })[];
    } | null>;
}
