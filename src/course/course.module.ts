import { Module } from '@nestjs/common';
import { CourseService } from './course.service.js';
import { CourseController } from './course.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './schemas/course.schemas.js';

@Module({
  controllers: [CourseController],
  providers: [CourseService],
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
  ],
})
export class CourseModule {}
