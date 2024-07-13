import { UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import axios from 'axios';
import { Server, Socket } from 'socket.io';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoomsService } from 'src/rooms/rooms.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private users: number = 0;

  constructor(private roomsService: RoomsService) {

  }

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
      console.log(room);
      if(room){
        client.join(room.name);
        this.server.to(room.name).emit('userJoined', { room: room.name, username: payload.username });
      }else{
        this.server.emit('warning', {status:false});
      }
  }

  //   @UseGuards(JwtAuthGuard)
  @SubscribeMessage('chat')
  handleMessage(client: Socket, payload: { room: string, sender: string, message: string }): void {
    this.server.to(payload.room).emit('chat', payload);
    if(this.isJson(payload.message)){
      const info = JSON.parse(payload.message);
      if (info.status == 'out') {
        this.sendData(payload.message);
      }
    }
  }
  async sendData(message: any) {
    try {
      console.log(message);
      const rs = await axios.post(
        'http://192.168.207.6:8088/check_device/store',
        message,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log(rs.data);
    } catch (error) {
      console.log(error);
    }
  }
   isJson(str) {
      try {
          JSON.parse(str);
      } catch (e) {
          return false;
      }
      return true;
  }
}
