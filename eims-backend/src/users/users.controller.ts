import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, UseGuards,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RoleType } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Post()
  @Roles(RoleType.SUPER_ADMIN)
  async create(@Body() body: { name: string; email: string; password: string; phone?: string }) {
    const passwordHash = await bcrypt.hash(body.password, 10);
    return this.usersService.create({
      name: body.name,
      email: body.email,
      passwordHash,
      phone: body.phone,
    });
  }

  @Patch(':id')
  @Roles(RoleType.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() body: any) {
    const { password, ...rest } = body;
    return this.usersService.update(id, rest);
  }

  @Delete(':id')
  @Roles(RoleType.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
