import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { AuthoCredenticalDto } from './dto/AuthCredenticalsDto';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) {}

    async createUser(authCredentialDto: AuthoCredenticalDto): Promise<User> {
        const {username, password} = authCredentialDto;
        const salt = await bcryptjs.genSaltSync(10);
        const hashedPassword = await bcryptjs.hashSync(password, salt);
        console.log(salt);
        console.log(hashedPassword);
        const user = new User(); 
        user.username= username;
        user.password= hashedPassword;
        
        // const user =  this.userRepository.create({username, hashedPassword});
        try {
            return await this.userRepository.save(user);
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('Username already exists');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async signin(authCredentialDto: AuthoCredenticalDto): Promise<{accessToken: string}> {
        const {username, password} = authCredentialDto;
        const user = await this.userRepository.findOneBy({username: username});

        if (user && await bcryptjs.compare(password, user.password)) {
            const payload: JwtPayload = {username}
            const accessToken: string = await this.jwtService.sign(payload);
            return {accessToken};
        } else {
            throw new UnauthorizedException('please check your account again');
        }
    }
}
