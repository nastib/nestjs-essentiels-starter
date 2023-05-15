import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AdminRoute, GetUserEmail } from 'src/auth';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @AdminRoute()
  @Get()
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getMe(@GetUserEmail() email: string) {
    return await this.userService.getMe(email);
  }
}
