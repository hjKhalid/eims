import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RoleType } from '@prisma/client';

@Controller('classes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER)
  create(@Body() createClassDto: CreateClassDto) {
    return this.classesService.create(createClassDto);
  }

  @Get()
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER, RoleType.TEACHER)
  findAll() {
    return this.classesService.findAll();
  }

  @Get(':id')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER, RoleType.TEACHER)
  findOne(@Param('id') id: string) {
    return this.classesService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER)
  update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
    return this.classesService.update(id, updateClassDto);
  }

  @Delete(':id')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL)
  remove(@Param('id') id: string) {
    return this.classesService.remove(id);
  }

  // --- Timetable ---
  @Get(':id/timetable')
  getTimetable(@Param('id') id: string) {
    return this.classesService.getTimetable(id);
  }

  @Post(':id/timetable')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER, RoleType.TEACHER)
  addTimetableEntry(@Param('id') id: string, @Body() body: any) {
    return this.classesService.addTimetableEntry(id, body);
  }

  @Delete('timetable/:entryId')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER, RoleType.TEACHER)
  removeTimetableEntry(@Param('entryId') entryId: string) {
    return this.classesService.removeTimetableEntry(entryId);
  }

  // --- Study Materials ---
  @Get(':id/materials')
  getStudyMaterials(@Param('id') id: string) {
    return this.classesService.getStudyMaterials(id);
  }

  @Post(':id/materials')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER, RoleType.TEACHER)
  addStudyMaterial(@Param('id') id: string, @Body() body: any) {
    return this.classesService.addStudyMaterial(id, body);
  }

  @Delete('materials/:materialId')
  @Roles(RoleType.SUPER_ADMIN, RoleType.PRINCIPAL, RoleType.MANAGER, RoleType.TEACHER)
  removeStudyMaterial(@Param('materialId') materialId: string) {
    return this.classesService.removeStudyMaterial(materialId);
  }
}
