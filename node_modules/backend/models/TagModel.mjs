import { DatabaseModel } from "./DatabaseModel.mjs";

export class TagModel extends DatabaseModel {

    constructor(id, name) {
        super()
        this.id = id
        this.name = name
    }

    static tableToModel(row) {
        return new TagModel(
            row["tag_id"],
            row["name"]
        )
    }

    static create(tag) {
        return this.query(`
            INSERT INTO tags
            (name)
            VALUES (?)
        `, [tag.name])
    }

    static update(tag) {
        return this.query(`
            UPDATE tags
            SET name = ?
            WHERE id = ?
        `, [tag.name, tag.id])
    }
}