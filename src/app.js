import { UserManager } from "./UserManager";

const manager1 = new UserManager();
manager1.createUser({
    firstName: 'Fermin',
    lastName: 'Corredera',
    userName: 'FCorredera99',
    password: '132asd5',
})
console.log (manager1.getUsers());