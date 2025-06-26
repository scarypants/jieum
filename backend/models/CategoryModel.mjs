import { DatabaseModel } from "./DatabaseModel.mjs";

export class CategoryModel extends DatabaseModel {
    
    constructor(id, name, deleted) {
        super()
        this.id = id
        this.name = name
        this.deleted = deleted
    }

    static tableToModel(row) {
        return new CategoryModel(
            row["category_id"],
            row["name"],
            row["deleted"]
        )
    }

    static create(category) {
        return this.query(`
            INSERT INTO categories
            (name)
            VALUES (?)
        `, [category.name])
    }

    static getAll() {
        return this.query("SELECT * FROM categories WHERE deleted = 0")
            .then(result => result.map(row => this.tableToModel(row.categories)))
    }

    static update(category) {
        return this.query(`
            UPDATE categories
            SET name = ?
            WHERE id = ?
        `, [category.name, category.id])
    }

    static delete(id) {
        return this.query(`
            UPDATE categories
            SET deleted = 0
            WHERE id = ?
        `, [id])
    }
}