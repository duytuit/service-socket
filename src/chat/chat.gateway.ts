import { UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoomsService } from 'src/rooms/rooms.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private users: number = 0;

  constructor(private roomsService: RoomsService) {}

  handleConnection(client: Socket) {
      this.users++;
      this.server.emit('users', this.users);
      console.log('a user connected');
  }

  handleDisconnect(client: Socket) {
      this.users--;
      this.server.emit('users', this.users);
      console.log('user disconnected');
  }

//   @UseGuards(JwtAuthGuard)
  @SubscribeMessage('createRoom')
  handleCreateRoom(client: Socket, payload: { room: string }) {
      const room = this.roomsService.createRoom(payload.room);
      client.join(room.name);
      this.server.to(room.name).emit('roomCreated', room);
  }

//   @UseGuards(JwtAuthGuard)
  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, payload: { room: string, username: string }) {
      const room = this.roomsService.joinRoom(payload.room, payload.username);
      client.join(room.name);
      this.server.to(room.name).emit('userJoined', { room: room.name, username: payload.username });
  }

//   @UseGuards(JwtAuthGuard)
  @SubscribeMessage('chat')
  handleMessage(client: Socket, payload: { room: string, sender: string, message: string }): void {
      this.server.to(payload.room).emit('chat', payload);
  }
}
