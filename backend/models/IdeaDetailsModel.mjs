import { DatabaseModel } from "./DatabaseModel.mjs"
import { IdeaModel } from "./IdeaModel.mjs"
import { UserModel } from "./UserModel.mjs"
import { CategoryModel } from "./CategoryModel.mjs"
import { TagModel } from "./TagModel.mjs"
import { CommentModel } from "./CommentModel.mjs"

export class IdeaDetailsModel extends DatabaseModel {

    constructor(idea, writer, category, tags, comments) {
        super()
        this.idea = idea
        this.writer = writer
        this.category = category
        this.tags = tags
        this.comments = comments
    }

    static getAll({ category: category, search: search, sort: sort } = {}) {
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
            JOIN users AS writer ON ideas.writer_id = writer.user_id
            JOIN categories ON ideas.category_id = categories.category_id
            LEFT JOIN ideas_tags ON ideas.idea_id = ideas_tags.idea_id
            LEFT JOIN tags ON ideas_tags.tag_id = tags.tag_id
            LEFT JOIN comments ON ideas.idea_id = comments.idea_id
            LEFT JOIN users AS comment_writer ON comments.writer_id = comment_writer.user_id
            WHERE ideas.deleted = 0
            AND writer.deleted = 0
            AND categories.deleted = 0
            AND (comment_writer.deleted = 0 OR comment_writer.deleted IS NULL)
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
                sql += ` ORDER BY ideas.view_count DESC`
                break;
            case "scraps":
                sql += ` ORDER BY ideas.scrap_count DESC`
                break;
            case "comments":
                sql += ` ORDER BY ideas.comment_count DESC`
                break;
            case "latest":
            default:
                sql += ` ORDER BY ideas.created_at DESC`
                break;
        }

        return this.query(sql, values)
            .then(result => {
                if (result.length === 0) return Promise.reject("not found")

                const ideaMap = new Map()

                for (const row of result) {
                    const ideaId = row.ideas.idea_id

                    if (!ideaMap.has(ideaId)) {
                        ideaMap.set(ideaId, {
                            idea: IdeaModel.tableToModel(row.ideas),
                            writer: UserModel.tableToModel({ nickname: row.writer.writer_nickname }),
                            category: CategoryModel.tableToModel({ name: row.categories.name }),
                            tags: [],
                            comments: []
                        })
                    }

                    const current = ideaMap.get(ideaId)

                    if (row.tags.tag_id && !current.tags.find(tag => tag.tag_id === row.tags.tag_id)) {
                        current.tags.push(TagModel.tableToModel(row.tags))
                    }

                    if (row.comments.comment_id && !current.comments.find(c => c.comment.comment_id === row.comments.comment_id)) {
                        const commentObj = {
                            comment: CommentModel.tableToModel(row.comments),
                            commentWriter: UserModel.tableToModel({ nickname: row.comment_writer.comment_writer_nickname })
                        }

                        current.comments.push(commentObj)
                    }
                }

                return Array.from(ideaMap.values()).map(entry =>
                    new IdeaDetailsModel(
                        entry.idea,
                        entry.writer,
                        entry.category,
                        entry.tags,
                        entry.comments
                    )
                )
            })
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
            JOIN users AS writer ON ideas.writer_id = writer.user_id
            JOIN categories ON ideas.category_id = categories.category_id
            LEFT JOIN ideas_tags ON ideas.idea_id = ideas_tags.idea_id
            LEFT JOIN tags ON ideas_tags.tag_id = tags.tag_id
            LEFT JOIN comments ON ideas.idea_id = comments.idea_id
            LEFT JOIN users AS comment_writer ON comments.writer_id = comment_writer.user_id
            WHERE ideas.deleted = 0
            AND writer.deleted = 0
            AND categories.deleted = 0
            AND (comment_writer.deleted = 0 OR comment_writer.deleted IS NULL)
            AND ideas.idea_id = ?
        `, [id])
            .then(result => {
                if (result.length === 0) return Promise.reject("not found")

                const ideaMap = new Map()

                for (const row of result) {
                    const ideaId = row.ideas.idea_id

                    if (!ideaMap.has(ideaId)) {
                        ideaMap.set(ideaId, {
                            idea: IdeaModel.tableToModel(row.ideas),
                            writer: UserModel.tableToModel({ nickname: row.writer.writer_nickname }),
                            category: CategoryModel.tableToModel({ name: row.categories.name }),
                            tags: [],
                            comments: []
                        })
                    }

                    const current = ideaMap.get(ideaId)

                    if (row.tags.tag_id && !current.tags.find(tag => tag.tag_id === row.tags.tag_id)) {
                        current.tags.push(TagModel.tableToModel(row.tags))
                    }

                    if (row.comments.comment_id && !current.comments.find(c => c.comment.comment_id === row.comments.comment_id)) {
                        const commentObj = {
                            comment: CommentModel.tableToModel(row.comments),
                            commentWriter: UserModel.tableToModel({ nickname: row.comment_writer.comment_writer_nickname })
                        }

                        current.comments.push(commentObj)
                    }
                }

                const entry = Array.from(ideaMap.values())[0]
                return new IdeaDetailsModel(
                    entry.idea,
                    entry.writer,
                    entry.category,
                    entry.tags,
                    entry.comments
                )
            })
    }

    static getByWriterId(writerId, sort) {
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
            JOIN users AS writer ON ideas.writer_id = writer.user_id
            JOIN categories ON ideas.category_id = categories.category_id
            LEFT JOIN ideas_tags ON ideas.idea_id = ideas_tags.idea_id
            LEFT JOIN tags ON ideas_tags.tag_id = tags.tag_id
            LEFT JOIN comments ON ideas.idea_id = comments.idea_id
            LEFT JOIN users AS comment_writer ON comments.writer_id = comment_writer.user_id
            WHERE ideas.deleted = 0
            AND writer.deleted = 0
            AND categories.deleted = 0
            AND (comment_writer.deleted = 0 OR comment_writer.deleted IS NULL)
            AND ideas.writer_id = ?
        `
        
        switch(sort) {
            case "views":
                sql += ` ORDER BY ideas.view_count DESC`
                break;
            case "scraps":
                sql += ` ORDER BY ideas.scrap_count DESC`
                break;
            case "comments":
                sql += ` ORDER BY ideas.comment_count DESC`
                break;
            case "latest":
            default:
                sql += ` ORDER BY ideas.created_at DESC`
                break;
        }

        return this.query(sql, writerId)
            .then(result => {
                if (result.length === 0) return Promise.reject("not found")

                const ideaMap = new Map()

                for (const row of result) {
                    const ideaId = row.ideas.idea_id

                    if (!ideaMap.has(ideaId)) {
                        ideaMap.set(ideaId, {
                            idea: IdeaModel.tableToModel(row.ideas),
                            writer: UserModel.tableToModel({ nickname: row.writer.writer_nickname }),
                            category: CategoryModel.tableToModel({ name: row.categories.name }),
                            tags: [],
                            comments: []
                        })
                    }

                    const current = ideaMap.get(ideaId)

                    if (row.tags.tag_id && !current.tags.find(tag => tag.tag_id === row.tags.tag_id)) {
                        current.tags.push(TagModel.tableToModel(row.tags))
                    }

                    if (row.comments.comment_id && !current.comments.find(c => c.comment.comment_id === row.comments.comment_id)) {
                        const commentObj = {
                            comment: CommentModel.tableToModel(row.comments),
                            commentWriter: UserModel.tableToModel({ nickname: row.comment_writer.comment_writer_nickname })
                        }

                        current.comments.push(commentObj)
                    }
                }

                return Array.from(ideaMap.values()).map(entry =>
                    new IdeaDetailsModel(
                        entry.idea,
                        entry.writer,
                        entry.category,
                        entry.tags,
                        entry.comments
                    )
                )
            })
    }
}