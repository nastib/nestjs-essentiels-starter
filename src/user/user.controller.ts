import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { SessionGuard } from 'src/auth';
import { UserService } from './user.service';
import { GetUserEmail } from 'src/auth';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(SessionGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getMe(@GetUserEmail() email: string) {
    return await this.userService.getMe(email);
  }
}
