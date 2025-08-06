import { DatabaseModel } from "./DatabaseModel.mjs";

export class InquiryModel extends DatabaseModel {

    constructor(id, userId, status, deleted) {
        super()
        this.id = id
        this.userId = userId
        this.status = status
        this.deleted = deleted
    }

    static tableToModel(row) {
        return new InquiryModel(
            row["inquiry_id"],
            row["user_id"],
            row["status"],
            row["deleted"]
        )
    }

    static create(userId) {
        return this.query(`
                INSERT INTO inquiries
                (user_id)
                VALUES (?)
            `, [userId])
    }

    static update(id, status) {
        return this.query(`
                UPDATE inquiries
                SET status = ?
                WHERE inquiry_id = ?
            `, [status, id])
    }

    static delete(id) {
        return this.query("DELETE FROM inquiries WHERE inquiry_id = ?", [id])
    }
}