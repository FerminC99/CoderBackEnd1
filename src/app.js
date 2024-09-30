import { UserManager } from "./UserManager.js";

const manager1 = new UserManager('./users_manager.json');

await manager1.init(); 

await manager1.createUser({
    firstName: 'Fermin',
    lastName: 'Corredera',
    age: '99',
    course: 'BackEnd',
})
console.log (await manager1.getUsers());






