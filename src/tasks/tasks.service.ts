import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { TaskStatus } from './task-status.model';
import { TaskDto } from './dto/task.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
    private logger = new Logger('TasksService');
    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>,
    ) {

    }

    async getAllTask(): Promise<Task[]> {
        return await this.taskRepository.find();
    }

    async findTaskById(id: string, user: User): Promise<Task> {
        const taskReponse = await this.taskRepository.findOneBy({id: id, user: user});
        if (!taskReponse) {
            this.logger.warn(`not found id = ${id}`)
            throw new NotFoundException(`not found id = "${id}"`)
        }
        return taskReponse;
    }

    async createTask(taskDto: TaskDto, user: User): Promise<Task> {
        console.log(taskDto);
        const {title, description} = taskDto;
        const task = this.taskRepository.create({title, description, status: TaskStatus.OPEN, user});
        
        
        // const task = new Task();
        // task.title = title;
        // task.description = description;
        // task.status = TaskStatus.OPEN;
        const respone =  await this.taskRepository.save(task);
        return respone;
    }

    async updateTask(taskDto: TaskDto, user: User): Promise<Task> {
        const {id, title, description, status} = taskDto;
        console.log({id, title, description, status})
        const task = await this.findTaskById(id, user);
        if (title) {
            task.title = title;
        }
        if (description) {
            task.description = description;
        }
        if (status) {
            task.status = status;
        }
        console.log(task);
        const reponse = await this.taskRepository.save(task);
        return reponse;
    }

    async removeTaskById(id: string): Promise<Task> {
        const task = await this.taskRepository.findOneBy({id :id});
        const response = await this.taskRepository.delete(id);
        console.log(response);
        if (response.affected ===0) {
            throw new BadRequestException(`Not delete record with ${id}`)
        }
        return task;
    }

    async filterAndSearchTask(taskDto: TaskDto, user: User): Promise<Task[]> {
        const {status, search} = taskDto;
        
        console.log({status, search});
        const tasks = await this.taskRepository.createQueryBuilder("task")
                .where("status = :status or true = true " , {status})
                .andWhere("description like :search").setParameter('search', `%${search}%`)
                .andWhere({user})
                .getMany();
        // console.log(tasks);
        return tasks;
    }
}
