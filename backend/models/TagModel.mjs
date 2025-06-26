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

    static getByName(name) {
        return this.query(" SELECT * FROM tags WHERE name = ?", [name])
            .then(result => result.length > 0
                    ? this.tableToModel(result[0].tags)
                    : Promise.reject("not found")
                )
    }
}