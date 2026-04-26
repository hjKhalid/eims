"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    console.log('Seeding database...');
    const rolesToCreate = [
        client_1.RoleType.SUPER_ADMIN,
        client_1.RoleType.PRINCIPAL,
        client_1.RoleType.MANAGER,
        client_1.RoleType.TEACHER,
        client_1.RoleType.STUDENT,
        client_1.RoleType.PARENT,
    ];
    const roleMap = {};
    for (const roleName of rolesToCreate) {
        let role = await prisma.role.findUnique({
            where: { name: roleName },
        });
        if (!role) {
            role = await prisma.role.create({ data: { name: roleName } });
            console.log(`Created ${roleName} role`);
        }
        roleMap[roleName] = role.id;
    }
    let defaultOrg = await prisma.organization.findFirst();
    if (!defaultOrg) {
        defaultOrg = await prisma.organization.create({
            data: {
                name: 'Default Organization',
                plan: 'premium',
            },
        });
        console.log(`Created default organization: ${defaultOrg.name}`);
    }
    let defaultSchool = await prisma.school.findFirst();
    if (!defaultSchool) {
        defaultSchool = await prisma.school.create({
            data: {
                organizationId: defaultOrg.id,
                name: 'Default High School',
                address: '123 Education Lane',
            },
        });
        console.log(`Created default school: ${defaultSchool.name}`);
    }
    let defaultBranch = await prisma.branch.findFirst();
    if (!defaultBranch) {
        defaultBranch = await prisma.branch.create({
            data: {
                schoolId: defaultSchool.id,
                name: 'Main Campus',
                city: 'Metropolis',
            },
        });
        console.log(`Created default branch: ${defaultBranch.name}`);
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash('admin123', saltRounds);
    const usersToCreate = [
        { name: 'System Admin', email: 'admin@example.com', role: client_1.RoleType.SUPER_ADMIN },
        { name: 'Principal Skinner', email: 'principal@example.com', role: client_1.RoleType.PRINCIPAL },
        { name: 'Manager Mike', email: 'manager@example.com', role: client_1.RoleType.MANAGER },
        { name: 'Teacher Tom', email: 'teacher@example.com', role: client_1.RoleType.TEACHER },
        { name: 'Student Sam', email: 'student@example.com', role: client_1.RoleType.STUDENT },
        { name: 'Parent Pat', email: 'parent@example.com', role: client_1.RoleType.PARENT },
    ];
    for (const u of usersToCreate) {
        let user = await prisma.user.findUnique({ where: { email: u.email } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    name: u.name,
                    email: u.email,
                    passwordHash,
                },
            });
            console.log(`Created user: ${u.email}`);
            await prisma.userRole.create({
                data: {
                    userId: user.id,
                    roleId: roleMap[u.role],
                    schoolId: u.role !== client_1.RoleType.SUPER_ADMIN ? defaultSchool.id : null,
                    branchId: u.role !== client_1.RoleType.SUPER_ADMIN && u.role !== client_1.RoleType.PRINCIPAL ? defaultBranch.id : null,
                },
            });
            console.log(`Linked user ${u.email} to ${u.role}`);
        }
        else {
            console.log(`User already exists: ${u.email}`);
        }
    }
    console.log('Database seeding completed successfully.');
}
main()
    .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map