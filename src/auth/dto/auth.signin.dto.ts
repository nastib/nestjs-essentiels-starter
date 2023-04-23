import { AuthSignupDto } from './auth.signup.dto';
import { PartialType } from '@nestjs/mapped-types';
export class AuthSigninDto extends PartialType(AuthSignupDto) {}
