import { DatabaseModel } from "./DatabaseModel.mjs";

export class UserModel extends DatabaseModel {

    constructor(id, role, nickname, loginId, password, deleted) {
        super()
        this.id = id
        this.role = role
        this.nickname = nickname
        this.loginId = loginId
        this.password = password
        this.deleted = deleted
    }

    static tableToModel(row) {
        return new UserModel(
            row["user_id"],
            row["role"],
            row["nickname"],
            row["login_id"],
            row["password"],
            row["deleted"]
        )
    }

    static create(user) {
        return this.query(`
            INSERT INTO users
            (nickname, login_id, password)
            VALUES (?, ?, ?)
        `, [user.nickname, user.loginId, user.password])
    }

    static getAll() {
        return this.query("SELECT * FROM users WHERE deleted = 0")
            .then(result => result.map(row => this.tableToModel(row.users)))
    }

    static getByLoginId(loginId) {
        return this.query("SELECT * FROM users WHERE login_id = ? AND deleted = 0", [loginId])
            .then(result => result.length > 0
                    ? result.map(row => this.tableToModel(row))
                    : Promise.reject("not found")
                )
    }

    static getById(id) {
        return this.query("SELECT * FROM users WHERE id = ? AND deleted = 0", [id])
            .then(result => result.length > 0
                    ? result.map(row => this.tableToModel(row))
                    : Promise.reject("not found")
                )
    }

    static update(user) {
        return this.query(`
            UPDATE users
            SET role = ?, nickname = ?, login_id = ?, password = ?
            WHERE id = ?
        `, [user.role, user.nickname, user.loginId, user.password, user.id])
    }

    static delete(id) {
        return this.query(`
            UPDATE users
            SET deleted = 0
            WHERE id = ?
        `, [id])
    }
}