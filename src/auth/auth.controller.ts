import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  Session,
} from '@nestjs/common';
import { UserSession } from './types';
import { AuthService } from './auth.service';
import { AuthSignupDto } from './dto';
import { AuthSigninDto } from './dto';
import { Role } from './enums';
import { PublicRoute } from './decorators';

@PublicRoute()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: AuthSignupDto, @Session() session: UserSession) {
    const { id, email } = await this.authService.signup(dto);
    return this.serializeSession(id, email, session);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() dto: AuthSigninDto, @Session() session: UserSession) {
    const { id, email } = await this.authService.signin(
      dto.email,
      dto.password,
    );
    return this.serializeSession(id, email, session);
  }

  private serializeSession(id: number, email: string, session: UserSession) {
    session.user = {
      userId: id,
      email: email,
      roles: [Role.ADMIN],
    };

    return { ...session };
  }
}
