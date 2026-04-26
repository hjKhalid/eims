import { Module } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { AssignmentsController, SubmissionsController } from './assignments.controller';

@Module({ controllers: [AssignmentsController, SubmissionsController], providers: [AssignmentsService], exports: [AssignmentsService] })
export class AssignmentsModule {}
