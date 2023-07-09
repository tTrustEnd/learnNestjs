import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'decorator/customize';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        return super.canActivate(context);
    }


    handleRequest(err, user, info, context: ExecutionContext) {
        const request: Request = context.switchToHttp().getRequest();
        // You can throw an exception based on either "info" or "err" arguments
        if (err || !user) {
            throw err || new UnauthorizedException("Token không hợp lệ hoặc không có bearer token");
        }
        const targetMethod = request.method
        const targetMethodEnpoint = request.route?.path as string
        // if (targetMethod === "GET" && targetMethodEnpoint === "/api/v1/auth/account" ||
        //     targetMethod === "POST" && targetMethodEnpoint === "/api/v1/auth/logout"
        // ) {
        //     return user
        // }

        const permissions = user?.permissions ?? []
        let isExit = permissions.find(permissions => targetMethod === permissions.method
            && targetMethodEnpoint === permissions.apiPath
        )
        if (targetMethodEnpoint.startsWith('/api/v1/auth'))  isExit = true; 
        if (!isExit)
            throw new ForbiddenException("Bạn không có quyền truy cập enpoint này")
        return user
    }
}
