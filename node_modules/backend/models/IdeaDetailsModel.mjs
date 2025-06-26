import { DatabaseModel } from "./DatabaseModel.mjs"
import { IdeaModel } from "./IdeaModel.mjs"
import { UserModel } from "./UserModel.mjs"
import { CategoryModel } from "./CategoryModel.mjs"
import { TagModel } from "./TagModel.mjs"
import { CommentModel } from "./CommentModel.mjs"
import { IdeaTagModel } from "./IdeaTagModel.mjs"

export class IdeaDetailsModel extends DatabaseModel {

    constructor(idea, writer, category, ideaTag, tag, comment, commentWriter) {
        super()
        this.idea = idea
        this.writer = writer
        this.category = category
        this.ideaTag = ideaTag
        this.tag = tag
        this.comment = comment
        this.commentWriter = commentWriter
    }

    static tableToModel(row) {
        return new IdeaDetailsModel(
            IdeaModel.tableToModel(row.ideas),
            UserModel.tableToModel(row.writer),
            CategoryModel.tableToModel(row.categories),
            IdeaTagModel.tableToModel(row.ideas_tags),
            TagModel.tableToModel(row.tags),
            CommentModel.tableToModel(row.comments),
            UserModel.tableToModel(row.comment_writer)
        )
    }

    static getAll({ category, search, sort } = {}) {
        let sql = `
            SELECT 
                ideas.*, 
                writer.nickname AS writer_nickname, 
                categories.name, 
                ideas_tags.*, 
                tags.*, 
                comments.*, 
                comment_writer.nickname AS comment_writer_nickname
            FROM ideas
            JOIN users AS writer ON ideas.writer_id = writer.id
            JOIN categories ON ideas.category_id = categories.id
            JOIN ideas_tags ON ideas.id = ideas_tags.idea_id
            JOIN tags ON ideas_tags.tag_id = tags.id
            JOIN comments ON ideas.id = comments.idea_id
            JOIN users AS comment_writer ON comments.writer_id = comment_writer.id
            WHERE ideas.deleted = 0
            AND writer.deleted = 0
            AND categories.deleted = 0
            AND comment_writer.deleted = 0
        `

        const values = []

        if (category) {
            sql += ' AND categories.name = ?'
            values.push(category)
        }

        if (search) {
            sql += ` AND (ideas.title LIKE ? OR tags.name LIKE ?)`
            values.push(`%${search}%`, `%${search}%`)
        }

        switch(sort) {
            case "views":
                sql += ` ORDER BY ideas.views DESC`
                break
            case "scraps":
                sql += ` ORDER BY ideas.scraps DESC`
                break
            case "latest":
            default:
                sql += ` ORDER BY ideas.created_at DESC`
                break
        }

        return this.query(sql, values)
            .then(result => result.length > 0
                    ? result.map(row => this.tableToModel(row))
                    : Promise.reject("not found")
                )
    }

    static getById(id) {
        return this.query(`
            SELECT 
                ideas.*, 
                writer.nickname AS writer_nickname, 
                categories.name, 
                ideas_tags.*, 
                tags.*, 
                comments.*, 
                comment_writer.nickname AS comment_writer_nickname
            FROM ideas
            JOIN users AS writer ON ideas.writer_id = writer.id
            JOIN categories ON ideas.category_id = categories.id
            JOIN ideas_tags ON ideas.id = ideas_tags.idea_id
            JOIN tags ON ideas_tags.tag_id = tags.id
            JOIN comments ON ideas.id = comments.idea_id
            JOIN users AS comment_writer ON comments.writer_id = comment_writer.id
            WHERE ideas.deleted = 0
            AND writer.deleted = 0
            AND categories.deleted = 0
            AND comment_writer.deleted = 0
            AND ideas.id = ?
        `, [id])
            .then(result => result.length > 0
                    ? result.map(row => this.tableToModel(row))
                    : Promise.reject("not found")
                )
    }

    static getByWriterId(writerId) {
        return this.query(`
            SELECT 
                ideas.*, 
                writer.nickname AS writer_nickname, 
                categories.name, 
                ideas_tags.*, 
                tags.*, 
                comments.*, 
                comment_writer.nickname AS comment_writer_nickname
            FROM ideas
            JOIN users AS writer ON ideas.writer_id = writer.id
            JOIN categories ON ideas.category_id = categories.id
            JOIN ideas_tags ON ideas.id = ideas_tags.idea_id
            JOIN tags ON ideas_tags.tag_id = tags.id
            JOIN comments ON ideas.id = comments.idea_id
            JOIN users AS comment_writer ON comments.writer_id = comment_writer.id
            WHERE ideas.deleted = 0
            AND writer.deleted = 0
            AND categories.deleted = 0
            AND comment_writer.deleted = 0
            AND ideas.writer_id = ?
        `, [writerId])
            .then(result => result.length > 0
                    ? result.map(row => this.tableToModel(row))
                    : Promise.reject("not found")
                )
    }
}