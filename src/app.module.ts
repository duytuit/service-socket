import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';
import { RoomsModule } from './rooms/rooms.module';
import { ConfigModule } from '@nestjs/config';
import { ChatGateway } from './chat/chat.gateway';
import { RoomsService } from './rooms/rooms.service';
import configuration from './config/configuration';

@Module({
  imports: [ 
     ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration]
      }),
      ChatModule, 
      AuthModule, 
      UsersModule, 
      RoomsModule
  ],
  controllers: [
    AppController
  ],
  providers: [
    ChatGateway,
    AppService,
    RoomsService,
  ],
})
export class AppModule {}
