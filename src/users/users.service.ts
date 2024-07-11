import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    private users: User[] = [];

    async findOne(username: string): Promise<User | undefined> {
        return this.users.find(user => user.username === username);
    }

    async create(username: string, password: string): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = { id: Date.now(), username, password: hashedPassword };
        this.users.push(user);
        return user;
    }
}
