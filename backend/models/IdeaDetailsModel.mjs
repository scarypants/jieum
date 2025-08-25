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
                COALESCE(tags_agg.tags, JSON_ARRAY()) AS tags,
                COALESCE(comments_agg.comments, JSON_ARRAY()) AS comments
            FROM ideas
            JOIN users AS writer ON ideas.writer_id = writer.user_id
            JOIN categories ON ideas.category_id = categories.category_id
            LEFT JOIN (
                SELECT dt.idea_id,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', dt.tag_id,
                        'name', dt.tag_name
                    )
                ) AS tags
                FROM (
                    SELECT DISTINCT ideas_tags.idea_id, tags.tag_id, tags.name AS tag_name
                    FROM ideas_tags
                    JOIN tags ON ideas_tags.tag_id = tags.tag_id
                ) dt 
                GROUP BY dt.idea_id
            ) tags_agg ON tags_agg.idea_id = ideas.idea_id
            LEFT JOIN (
                SELECT dc.idea_id,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'comment', JSON_OBJECT(
                            'id', dc.comment_id,
                            'writerId', dc.writer_id,
                            'ideaId', dc.idea_id,
                            'content', dc.content
                        ),
                        'commentWriter', JSON_OBJECT(
                            'nickname', dc.writer_nickname
                        )
                    )
                ) AS comments
                FROM (
                    SELECT DISTINCT
                        comments.comment_id, comments.idea_id, comments.writer_id, comments.content,
                        comment_writer.nickname AS writer_nickname
                    FROM comments
                    LEFT JOIN users AS comment_writer ON comments.writer_id = comment_writer.user_id
                    WHERE (comment_writer.deleted = 0 OR comment_writer.deleted IS NULL)
                ) dc
                GROUP BY dc.idea_id
            ) comments_agg ON comments_agg.idea_id = ideas.idea_id
            WHERE ideas.deleted = 0
            AND writer.deleted = 0
            AND categories.deleted = 0
        `

        const values = []

        if (category) {
            sql += ' AND categories.name = ?'
            values.push(category)
        }

        if (search) {
            sql += ` AND (ideas.title LIKE ? 
                OR EXISTS (
                    SELECT 1 FROM ideas_tags
                    JOIN tags ON ideas_tags.tag_id = tags.tag_id
                    WHERE ideas_tags.idea_id = ideas.idea_id
                    AND tags.name LIKE ?
                )
            )`
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

                return result.map(row => new IdeaDetailsModel(
                    IdeaModel.tableToModel(row.ideas),
                    UserModel.tableToModel({ nickname: row.writer.writer_nickname }),
                    CategoryModel.tableToModel({ name: row.categories.name }),
                    JSON.parse(row.tags || '[]').map(tag => TagModel.tableToModel({ tag_id: tag.id, name: tag.name })),
                    JSON.parse(row.comments || '[]').map(comment => ({
                        comment: CommentModel.tableToModel({
                            comment_id: comment.comment.id,
                            writer_id:  comment.comment.writerId,
                            idea_id:    comment.comment.ideaId,
                            content:    comment.comment.content
                        }),
                        commentWriter: UserModel.tableToModel({ nickname: comment.commentWriter.nickname })
                    }))
                ));
        })
    }

    static getById(id) {
        return this.query(`
            SELECT 
                ideas.*, 
                writer.nickname AS writer_nickname, 
                categories.name,
                COALESCE(tags_agg.tags, JSON_ARRAY()) AS tags,
                COALESCE(comments_agg.comments, JSON_ARRAY()) AS comments
            FROM ideas
            JOIN users AS writer ON ideas.writer_id = writer.user_id
            JOIN categories ON ideas.category_id = categories.category_id
            LEFT JOIN (
                SELECT dt.idea_id,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', dt.tag_id,
                        'name', dt.tag_name
                    )
                ) AS tags
                FROM (
                    SELECT DISTINCT ideas_tags.idea_id, tags.tag_id, tags.name AS tag_name
                    FROM ideas_tags
                    JOIN tags ON ideas_tags.tag_id = tags.tag_id
                ) dt 
                GROUP BY dt.idea_id
            ) tags_agg ON tags_agg.idea_id = ideas.idea_id
            LEFT JOIN (
                SELECT dc.idea_id,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'comment', JSON_OBJECT(
                            'id', dc.comment_id,
                            'writerId', dc.writer_id,
                            'ideaId', dc.idea_id,
                            'content', dc.content
                        ),
                        'commentWriter', JSON_OBJECT(
                            'nickname', dc.writer_nickname
                        )
                    )
                ) AS comments
                FROM (
                    SELECT DISTINCT
                        comments.comment_id, comments.idea_id, comments.writer_id, comments.content,
                        comment_writer.nickname AS writer_nickname
                    FROM comments
                    LEFT JOIN users AS comment_writer ON comments.writer_id = comment_writer.user_id
                    WHERE (comment_writer.deleted = 0 OR comment_writer.deleted IS NULL)
                ) dc
                GROUP BY dc.idea_id
            ) comments_agg ON comments_agg.idea_id = ideas.idea_id
            WHERE ideas.deleted = 0
            AND writer.deleted = 0
            AND categories.deleted = 0
            AND ideas.idea_id = ?
            LIMIT 1
        `, [id])
            .then(result => {
                if (result.length === 0) return Promise.reject("not found")
                const row = result[0];
                console.log(JSON.stringify(row.comments))

                return new IdeaDetailsModel(
                    IdeaModel.tableToModel(row.ideas),
                    UserModel.tableToModel({ nickname: row.writer.writer_nickname }),
                    CategoryModel.tableToModel({ name: row.categories.name }),
                    JSON.parse(row.tags || '[]').map(tag => TagModel.tableToModel({ tag_id: tag.id, name: tag.name })),
                    JSON.parse(row.comments || '[]').map(comment => ({
                        comment: CommentModel.tableToModel({
                            comment_id: comment.comment.id,
                            writer_id:  comment.comment.writerId,
                            idea_id:    comment.comment.ideaId,
                            content:    comment.comment.content
                        }),
                        commentWriter: UserModel.tableToModel({ nickname: comment.commentWriter.nickname })
                    }))
                )
            })
    }
}