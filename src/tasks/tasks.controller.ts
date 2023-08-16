import { Body, Controller, Get, Post, Param, Delete, Put, UseGuards, Logger } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { TaskDto } from './dto/task.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { ConfigService } from '@nestjs/config/dist';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TasksController');
    constructor(
        private tasksService: TasksService,
    ) {
    }

    @Get()
    getAllTask(): Promise<Task[]> {
        return this.tasksService.getAllTask();
    }

    @Get('/:id')
    findTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
        this.logger.verbose(`User "${user.username}" retrieving all tasks. Filter ${JSON.stringify(id)} `,);
        return this.tasksService.findTaskById(id, user);
    }

    @Post()
    createTask(@Body() taskDto: TaskDto, @GetUser() user: User): Promise<Task> {
        return this.tasksService.createTask(taskDto, user);
    }

    @Delete('/:id')
    removeTaskById(@Param('id') id: string): Promise<Task> {
        return this.tasksService.removeTaskById(id);
    }

    @Put()
    updateTask(@Body() taskDto: TaskDto, @GetUser() user: User ): Promise<Task> {
        return this.tasksService.updateTask(taskDto, user);
    }

    @Post('/search')
    filterAndSearchTask(@Body() taskDto: TaskDto, @GetUser() user: User): Promise<Task[]> {
        this.logger.verbose(`User "${user.username}" retrieving all tasks. Filter ${JSON.stringify(taskDto)} `,);
        return this.tasksService.filterAndSearchTask(taskDto, user);
    }
}
