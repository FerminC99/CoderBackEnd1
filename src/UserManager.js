export class UserManager {
    static users = [];

    constructor(){}

    createUser(data) {
        UserManager.users.push(data);
    }

    getUsers() {
        return UserManager.users;
    }

    validateUsers() {}
}