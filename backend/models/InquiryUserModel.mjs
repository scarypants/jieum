import { DatabaseModel } from "./DatabaseModel.mjs";
import { InquiryModel } from "./InquiryModel.mjs";
import { UserModel } from "./UserModel.mjs";

export class InquiryUserModel extends DatabaseModel {

    constructor(inquiry, user) {
        super()
        this.inquiry = inquiry
        this.user = user
    }

    static tableToModel(row) {
        return new InquiryUserModel(
            InquiryModel.tableToModel(row.inquiries),
            UserModel.tableToModel(row.users)
        )
    }

    static getAll() {
        return this.query(`
                SELECT inquiries.*, users.*
                FROM inquiries
                JOIN users ON inquiries.user_id = users.user_id
                WHERE inquiries.deleted = 0
            `,)
                .then(result => result.map(row => this.tableToModel(row)))            
    }
}