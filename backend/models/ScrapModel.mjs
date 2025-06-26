import { DatabaseModel } from "./DatabaseModel.mjs";

export class ScrapModel extends DatabaseModel {

    constructor(id, userId, ideaId) {
        super()
        this.id = id
        this.userId = userId
        this.ideaId = ideaId
    }

    static tableToModel(row) {
        row["scrap_id"],
        row["user_id"],
        row["idea_id"]
    }

    static create(scrap) {
        return this.query(`
                INSERT INTO scraps
                (user_id, idea_id)
                VALUES (?, ?)
            `, [scrap.userId, scrap.ideaId])
    }

    static delete(id) {
        return this.query("DELETE FROM scraps WHERE id = ?", [id])
    }
}