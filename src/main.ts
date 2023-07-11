import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { JwtAuthGuard } from './stateless/passport/stateless.jwt.auth.guard';
import { TransformInterceptor } from './core/transform.interceptor';
import cookieParser = require('cookie-parser');
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  app.useStaticAssets(join(__dirname,'..', '../public'))
  app.setBaseViewsDir(join(__dirname, '..', 'views')); //view 
  app.setViewEngine('ejs');
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    // forbidNonWhitelisted: true
    }));
  const reflector = app.get(Reflector)
  app.useGlobalGuards(new JwtAuthGuard(reflector))
  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  app.enableCors({
    "origin": true,
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204,
    credentials:true
    });
    app.use(helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          imgSrc: [`'self'`, 'data:', 'apollo-server-landing-page.cdn.apollographql.com'],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
          manifestSrc: [`'self'`, 'apollo-server-landing-page.cdn.apollographql.com'],
          frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
        },
      },
    }));

  

  app.use(cookieParser())

  //config versioning
  app.setGlobalPrefix('api')
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion:['1']
  });
  await app.listen(configService.get<string>('PORT'));
}
bootstrap();
