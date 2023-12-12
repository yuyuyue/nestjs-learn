import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthenticationService } from './authentication.service';
import { SignInDto } from './dto/sign-in.dto';
import { AuthWhitelist } from 'src/common/decorator/auth-whitelist.decorator';

@AuthWhitelist()
@Controller('authentication')
export class AuthenticationController {
  @Inject()
  private readonly authenticationService: AuthenticationService;

  @Post('/sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.authenticationService.signUp(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authenticationService.signIn(signInDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  async refresh(@Body('token') token: string) {
    return await this.authenticationService.refresh(token);
  }
}
