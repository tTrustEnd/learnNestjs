import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { StatelessService } from './stateless/stateless.service';
import { StatelessModule } from './stateless/stateless.module';

@Module({
  imports: [
    // MongooseModule.forRoot('mongodb+srv://hoidanit:Z9bUEB7sNoatKG0j@cluster0.ls1fl27.mongodb.net/'),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),

    ConfigModule.forRoot({
      isGlobal: true
    }),

    UsersModule,
    AuthModule,
    StatelessModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
