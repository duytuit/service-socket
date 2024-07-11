import { Injectable } from '@nestjs/common';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomsService {
    private rooms: Room[] = [];

    createRoom(name: string): Room {
        const room = { id: Date.now(), name, users: [] };
        this.rooms.push(room);
        return room;
    }

    getRoom(name: string): Room {
        return this.rooms.find(room => room.name === name);
    }

    joinRoom(name: string, username: string): Room {
        const room = this.getRoom(name);
        if (room && !room.users.includes(username)) {
            room.users.push(username);
        }
        return room;
    }
}
