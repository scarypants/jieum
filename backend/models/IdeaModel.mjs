import { DatabaseModel } from "./DatabaseModel.mjs";

export class IdeaModel extends DatabaseModel {

    constructor(id, writerId, categoryId, title, content, date, createdAt, viewCount, scrapCount, commentCount, deleted) {
        super()
        this.id = id
        this.writerId = writerId
        this.categoryId = categoryId
        this.title = title
        this.content = content
        this.date = date
        this.createdAt = createdAt
        this.viewCount = viewCount
        this.scrapCount = scrapCount
        this.commentCount = commentCount
        this.deleted = deleted
    }

    static tableToModel(row) {
        return new IdeaModel(
            row["idea_id"],
            row["writer_id"],
            row["category_id"],
            row["title"],
            row["content"],
            row["date"],
            row["created_at"],
            row["view_count"],
            row["scrap_count"],
            row["comment_count"],
            row["deleted"]
        )
    }

    static create(idea) {
        return this.query(`
                INSERT INTO ideas
                (writer_id, category_id, title, content)
                VALUES (?, ?, ?, ?)
            `, [idea.writerId, idea.categoryId, idea.title, idea.content])
    }

    static getById(id) {
        return this.query("SELECT * FROM ideas WHERE idea_id = ?", [id])
            .then(result => result.length > 0
                    ? result.map(row => this.tableToModel(row))
                    : Promise.reject("not found")
                )
    }

    static getWriterIdById(id) {
        return this.query("SELECT ideas.writer_id FROM ideas WHERE idea_id =?", [id])
            .then(result => result.length > 0
                    ? result.map(row => this.tableToModel(row))
                    : Promise.reject("not found")
                )
    }

    static update(idea) {
        return this.query(`
                UPDATE ideas
                SET category_id = ?, title = ?, content = ?
                WHERE idea_id = ?
            `, [idea.categoryId, idea.title, idea.content, idea.id])
    }

    static addViewCount(id) {
        return this.query("UPDATE ideas SET view_count = view_count + 1 WHERE idea_id = ?", [id])
    }

    static addScrapCount(id) {
        return this.query("UPDATE ideas SET scrap_count = scrap_count + 1 WHERE idea_id = ?", [id])
    }

    static subScrapCount(id) {
        return this.query("UPDATE ideas SET scrap_count = scrap_count - 1 WHERE idea_id = ?", [id])
    }

    static addCommentCount(id) {
        return this.query("UPDATE ideas SET comment_count = comment_count + 1 WHERE idea_id = ?", [id])
    }

    static subCommentCount(id) {
        return this.query("UPDATE ideas SET comment_count = comment_count - 1 WHERE idea_id = ?", [id])
    }

    static delete(id) {
        return this.query("UPDATE ideas SET deleted = 1 WHERE idea_id = ?", [id])
    }
}