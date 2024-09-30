import fs from 'fs';

export class UserManager {
    constructor(file) {
        this.file = file;
    }

    async init() {
        try {const exists = await fs.promises.access(this.file);
            console.log('El archivo existe');
        } catch (err) {
            console.log('El archivo NO existe');
            await fs.promises.writeFile(this.file, JSON.stringify([]));
        }
    }

    async #readUsersFile() {
        const users = await fs.promises.readFile(this.file, 'utf-8');
        return JSON.parse(users);
    }

    async createUser(data) {
        const users = await this.#readUsersFile();
        users.push(data);
        await fs.promises.writeFile(this.file, JSON.stringify(users));
        console.log('Usuario agregado');
    }

    async getUsers() {
        return await this.#readUsersFile();
    }
}