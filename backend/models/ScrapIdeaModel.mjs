import { DatabaseModel } from "./DatabaseModel.mjs";
import { ScrapModel } from "./ScrapModel.mjs"
import { IdeaModel } from "./IdeaModel.mjs"

export class ScrapIdeaModel extends DatabaseModel {

    constructor(scrap, idea) {
        super()
        this.scrap = scrap
        this.idea = idea
    }

    static tableToModel(row) {
        return new ScrapIdeaModel(
            ScrapModel.tableToModel(row.scraps),
            IdeaModel.tableToModel(row.ideas)
        )
    }

    static getByUserId(userId) {
        return this.query(`
                SELECT scraps.*, ideas.*
                FROM scraps
                JOIN ideas ON scraps.idea_id = ideas.idea_id
                WHERE scraps.user_id = ? AND ideas.deleted = 0
            `, [userId])
                .then(result => result.length > 0
                        ? result.map(row => this.tableToModel(row))
                        : Promise.reject("not found")
                    )
    }
}