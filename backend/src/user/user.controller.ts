import {
  Controller,
  Body,
  Get,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  getAllUsers() {
    return this.userService.findAllUsers();
  }

  @UseGuards(AuthGuard)
  @Get('/profile')
  getProfile(@Req() request: Request) {
    return this.userService.getProfile(request);
  }

  @Post()
  createNewUser(@Body() body: CreateUserDto) {
    return this.userService.createUser(body);
  }
}
