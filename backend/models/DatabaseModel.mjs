import mysql from "mysql2/promise"

export class DatabaseModel extends Object {
    static connection

    // Set up the database connection with a connection pool.
    static {
        this.connection = mysql.createPool({
            host: "localhost",
            user: "jieum-user",
            password: "jieum",
            database: "jieum",
            nestTables: true,
        })
    }

    /**
     * 
     *
     * @param {string} sql
     * @param {Array<any>} values
     * @returns {Promise<any>}
     */
    static query(sql, values) {
        return this.connection.query(sql, values)
            .then(([result]) => result)
    }
}
