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

    static getById(id) {
        return this.query("SELECT * FROM comments WHERE comment_id = ?", [id])
            .then(result => result.length > 0
                    ? result.map(row => this.tableToModel(row))
                    : Promise.reject("not found")
                )
    }

    static update(comment) {
        return this.query(`
            UPDATE comments
            SET writer_id = ?, idea_id = ?, content = ?
            WHERE comment_id = ?
        `, [comment.writerId, comment.ideaId, comment.content, comment.id])
    }

    static delete(id) {
        return this.query("DELETE FROM comments WHERE comment_id = ?", [id])
    }
}