import { DatabaseModel } from "./DatabaseModel.mjs";

export class IdeaModel extends DatabaseModel {

    constructor(id, writerId, categoryId, title, content, date, createdAt, views, scraps, deleted) {
        super()
        this.id = id
        this.writerId = writerId
        this.categoryId = categoryId
        this.title = title
        this.content = content
        this.date = date
        this.createdAt = createdAt
        this.views = views
        this.scraps = scraps
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
            row["views"],
            row["scraps"],
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

    static update(idea) {
        return this.query(`
                UPDATE ideas
                SET category_id = ?, title = ?, content = ?
                WHERE id = ?
            `, [idea.categoryId, idea.title, idea.content, idea.id])
    }

    static delete(id) {
        return this.query("UPDATE ideas SET deleted = 1 WHERE id = ?", [id])
    }
}