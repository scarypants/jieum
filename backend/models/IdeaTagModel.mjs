import { DatabaseModel } from "./DatabaseModel.mjs";

export class IdeaTagModel extends DatabaseModel {

    constructor(id, ideaId, tagId) {
        super()
        this.id = id
        this.ideaId = ideaId
        this.tagId = tagId
    }

    static tableToModel(row) {
        return new IdeaTagModel(
            row["idea_tag_id"],
            row["idea_id"],
            row["tag_id"]
        )
    }

    static create(ideaTag) {
        return this.query(`
                INSERT INTO ideas_tags
                (idea_id, tag_id)
                VALUES (?, ?)
            `, [ideaTag.ideaId, ideaTag.tagId])
    }

    static deleteByIdeaId(ideaId) {
        return this.query("DELETE FROM ideas_tags WHERE idea_id = ?", [ideaId])
    }

    static delete(id) {
        return this.query("DELETE FROM ideas_tags WHERE idea_tag_id = ?", [id])
    }
}