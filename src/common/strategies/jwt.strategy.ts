import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
    console.log('JwtStrategy initialized with secret:', process.env.JWT_SECRET || 'supersecret');
  }

  async validate(payload: any) {
    try{
    console.log('JWT PAYLOAD:', payload);
    return { user_id: payload.sub, username: payload.username, role: payload.role };
    } catch (err) {
      console.error('Error in JWT validate:', err);
      throw err;
    }
  }
}
