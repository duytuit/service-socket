import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { RoomsService } from 'src/rooms/rooms.service';

@Module({
  providers: [ChatGateway,RoomsService]
})
export class ChatModule {}
