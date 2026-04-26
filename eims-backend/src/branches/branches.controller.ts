import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RoleType } from '@prisma/client';

@Controller('branches')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL)
  create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchesService.create(createBranchDto);
  }

  @Get()
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER)
  findAll() {
    return this.branchesService.findAll();
  }

  @Get(':id')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER)
  findOne(@Param('id') id: string) {
    return this.branchesService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL)
  update(@Param('id') id: string, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchesService.update(id, updateBranchDto);
  }

  @Delete(':id')
  @Roles(RoleType.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.branchesService.remove(id);
  }
}
