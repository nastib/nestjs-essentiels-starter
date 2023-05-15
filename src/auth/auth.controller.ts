import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  Session,
} from '@nestjs/common';
import { UserRoles, UserSession } from './types';
import { AuthService } from './auth.service';
import { AuthSignupDto, AuthSigninDto } from './dto';
import { PublicRoute } from './decorators';

@PublicRoute()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: AuthSignupDto, @Session() session: UserSession) {
    const { id, email, roles } = await this.authService.signup(dto);

    return this.serializeSession(id, email, roles, session);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() dto: AuthSigninDto, @Session() session: UserSession) {
    const { id, email, roles } = await this.authService.signin(
      dto.email,
      dto.password,
    );

    return this.serializeSession(id, email, roles, session);
  }

  private serializeSession(
    id: number,
    email: string,
    roles: UserRoles[],
    session: UserSession,
  ) {
    session.user = {
      userId: id,
      email: email,
      roles: roles.map((item) => item.name),
    };

    return { ...session };
  }
}
