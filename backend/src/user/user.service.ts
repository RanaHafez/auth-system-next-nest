import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoggerService } from './user.logger';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import type { JwtPayload } from 'src/auth/auth.guard';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly logger: LoggerService,
  ) {}

  findAllUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({ email });
    return user;
  }

  async createUser(dto: CreateUserDto) {
    const password = dto.password;
    const salt = 10;
    const hash = await bcrypt.hash(password, salt);
    const user = { name: dto.name, email: dto.email, passwordHash: hash };
    const newUser = this.usersRepository.create(user);
    await this.usersRepository.save(newUser);

    const { passwordHash, ...safeUser } = newUser;
    return safeUser;
  }

  async getProfile(request: Request) {
    const reqUser = request['user'] as JwtPayload;
    const user = await this.usersRepository.findOneBy({ id: reqUser.sub });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async updatePassword(passwordHash: string, id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    user.passwordHash = passwordHash;
    await this.usersRepository.save(user);
  }
}
