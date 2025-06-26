import mysql from "mysql2/promise"

/**
 * 데이터베이스 관련 기능을 제공하는 클래스입니다.
 *
 * 이 클래스는 내부에서 MySQL 커넥션 풀을 사용하여
 * 효율적으로 데이터베이스에 접근하고 쿼리를 실행합니다.
 */
export class DatabaseModel extends Object {
    static connection

    // MySQL 커넥션 풀을 설정하여 데이터베이스에 연결합니다.
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
     * SQL 쿼리를 실행하고 결과를 반환합니다.
     * 
     * 이 메서드는 내부의 커넥션 풀을 통해 SQL 쿼리를 실행하고,
     * 결과를 Promise 형태로 반환합니다.
     *
     * @param {string} sql - 실행할 SQL 쿼리 문자열
     * @param {Array<any>} values - 쿼리에 전달할 값 배열
     * @returns {Promise<any>} 실행 결과를 담은 Promise 객체
     */
    static query(sql, values) {
        return this.connection.query(sql, values)
            .then(([result]) => result)
    }
}
