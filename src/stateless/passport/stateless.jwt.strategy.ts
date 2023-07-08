import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RolesService } from '@/roles/roles.service';
import { User } from '@/users/schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    //https://stackoverflow.com/a/50983040
    constructor(protected configService: ConfigService,
        private rolesService:RolesService
        ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("JWT_ACCESS_TOKEN_SECRET"),
        });
    }

    async validate(payload: any) {
        const { _id, name, email, role } = payload;
        //req.user
        const userRole = role as unknown as {_id:string; name:string}
        const temp = (await this.rolesService.findOne(userRole._id)).toObject()
        return {
        _id,
        name,
        email,
        role,
        permissions:temp?.permissions?? []
        };
    }
}