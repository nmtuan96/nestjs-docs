import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { TaskStatus } from "../task-status.model";

export class TaskDto {
    id: string;
    title: string;
    description: string;
    @IsOptional()
    @IsEnum(TaskStatus)
    status: TaskStatus;
    search?: string;
}