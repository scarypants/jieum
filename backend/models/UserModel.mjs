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
                    ? this.tableToModel(result[0].users)
                    : Promise.reject("not found")
                )
    }

    static getLoginIdDup(loginId) {
        return this.query("SELECT * FROM users WHERE login_id = ? AND deleted = 0", [loginId])
            .then(result => result.length > 0
                    ? this.tableToModel(result[0].users)
                    : null
                )
    }

    static getNicknameDup(nickname) {
        return this.query("SELECT * FROM users WHERE nickname = ? AND deleted = 0", [nickname])
            .then(result => result.length > 0
                    ? this.tableToModel(result[0].users)
                    : null
                )
    }

    static getById(id) {
        return this.query("SELECT * FROM users WHERE user_id = ? AND deleted = 0", [id])
            .then(result => result.length > 0
                    ? this.tableToModel(result[0].users)
                    : Promise.reject("not found")
                )
    }

    static update(user) {
        return this.query(`
            UPDATE users
            SET nickname = ?, login_id = ?, password = ?
            WHERE user_id = ?
        `, [user.nickname, user.loginId, user.password, user.id])
    }

    static updateRole(id, role) {
        return this.query(`
            UPDATE users
            SET role = ?
            WHERE user_id = ?
        `, [role, id])
    }

    static delete(id) {
        return this.query(`
            UPDATE users
            SET deleted = 1
            WHERE user_id = ?
        `, [id])
    }
}