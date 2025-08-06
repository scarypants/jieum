import { DatabaseModel } from "./DatabaseModel.mjs";

export class ScrapModel extends DatabaseModel {

    constructor(id, userId, ideaId) {
        super()
        this.id = id
        this.userId = userId
        this.ideaId = ideaId
    }

    static tableToModel(row) {
        return new ScrapModel(
            row["scrap_id"],
            row["user_id"],
            row["idea_id"]
        )
    }

    static create(scrap) {
        return this.query(`
                INSERT INTO scraps
                (user_id, idea_id)
                VALUES (?, ?)
            `, [scrap.userId, scrap.ideaId])
    }

    static getById(id) {
        return this.query("SELECT * FROM scraps WHERE scrap_id = ?", [id])
            .then(result => result.length > 0
                    ? this.tableToModel(result[0].scraps)
                    : Promise.reject("not found")
                )
    }

    static delete(id) {
        return this.query("DELETE FROM scraps WHERE scrap_id = ?", [id])
    }
}