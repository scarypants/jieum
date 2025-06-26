import { DatabaseModel } from "./DatabaseModel.mjs";

export class CommentModel extends DatabaseModel {

    constructor(id, writerId, ideaId, content) {
        super()
        this.id = id
        this.writerId = writerId
        this.ideaId = ideaId
        this.content = content
    }

    static tableToModel(row) {
        return new CommentModel(
            row["comment_id"],
            row["writer_id"],
            row["idea_id"],
            row["content"]
        )
    }

    static create(comment) {
        return this.query(`
            INSERT INTO comments
            (writer_id, idea_id, content)
            VALUES (?, ?, ?)
        `, [comment.writerId, comment.ideaId, comment.content])
    }

    static update(comment) {
        return this.query(`
            UPDATE comments
            SET writer_id = ?, idea_id = ?, content = ?
            WHERE id = ?
        `, [comment.writerId, comment.ideaId, comment.content, comment.id])
    }

    static delete(id) {
        return this.query("DELETE FROM comments WHERE id = ?", [id])
    }
}