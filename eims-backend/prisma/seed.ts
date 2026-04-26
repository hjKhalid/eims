import 'dotenv/config';
import { PrismaClient, RoleType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // 1. Ensure all Roles exist
  const rolesToCreate = [
    RoleType.SUPER_ADMIN,
    RoleType.PRINCIPAL,
    RoleType.MANAGER,
    RoleType.TEACHER,
    RoleType.STUDENT,
    RoleType.PARENT,
  ];

  const roleMap: Record<string, string> = {};

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

  // 2. Seed a default Organization
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

  // 3. Seed a default School
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

  // 4. Seed a default Branch
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

  // 5. Seed Users for each role
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash('admin123', saltRounds);

  const usersToCreate = [
    { name: 'System Admin', email: 'admin@example.com', role: RoleType.SUPER_ADMIN },
    { name: 'Principal Skinner', email: 'principal@example.com', role: RoleType.PRINCIPAL },
    { name: 'Manager Mike', email: 'manager@example.com', role: RoleType.MANAGER },
    { name: 'Teacher Tom', email: 'teacher@example.com', role: RoleType.TEACHER },
    { name: 'Student Sam', email: 'student@example.com', role: RoleType.STUDENT },
    { name: 'Parent Pat', email: 'parent@example.com', role: RoleType.PARENT },
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
          schoolId: u.role !== RoleType.SUPER_ADMIN ? defaultSchool.id : null,
          branchId: u.role !== RoleType.SUPER_ADMIN && u.role !== RoleType.PRINCIPAL ? defaultBranch.id : null,
        },
      });
      console.log(`Linked user ${u.email} to ${u.role}`);
    } else {
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
