import { DatabaseModel } from "./DatabaseModel.mjs";

export class InquiryModel extends DatabaseModel {

    constructor(id, userId, deleted) {
        super()
        this.id = id
        this.userId = userId
        this.deleted = deleted
    }

    static tableToModel(row) {
        return new InquiryModel(
            row["inquiry_id"],
            row["user_id"],
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

    static delete(id) {
        return this.query("DELETE FROM inquiries WHERE inquiry_id = ?", [id])
    }
}