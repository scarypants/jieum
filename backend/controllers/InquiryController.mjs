import express from "express"
import validator from "validator"
import { AuthenticationController } from "./AuthenticationController.mjs"
import { InquiryUserModel } from "../models/InquiryUserModel.mjs"
import { InquiryModel } from "../models/InquiryModel.mjs"

export class InquiryController {
    static routes = express.Router()

    static {
        this.routes.get("/", AuthenticationController.AuthenticationProvider, AuthenticationController.restrict(["admin"]), this.getInquires)
        this.routes.post("/", AuthenticationController.AuthenticationProvider, AuthenticationController.restrict(["admin", "member"]), this.createInquiry)
        this.routes.patch("/:id", AuthenticationController.AuthenticationProvider, AuthenticationController.restrict(["admin"]), this.updateInquiryStatus)
        this.routes.delete("/:id", AuthenticationController.AuthenticationProvider, AuthenticationController.restrict(["admin"]), this.deleteInquiry)
    }

    /**
     * 
     * @type {express.RequestHandler}
     * @openapi
     *  /api/inquiries:
     *      get:
     *          summary: 모든 문의사항 목록 가져오기
     *          tags: [문의사항]
     *          security:
     *              - bearerAuth: []
     *          responses:
     *              '200':
     *                  description: 문의사항 목록
     *                  content:
     *                      application/json:
     *                          schema:
     *                              type: array
     *                              items:
     *                                  type: object
     *                                  required:
     *                                      - inquiry
     *                                      - user
     *                                  properties:
     *                                      scrap:
     *                                          $ref: "#/components/schemas/Inquiry"
     *                                      idea:
     *                                          $ref: "#/components/schemas/User"
     *              '400':
     *                  $ref: "#/components/responses/Error"
     *              '500':
     *                  $ref: "#/components/responses/Error"
     *              default:
     *                  $ref: "#/components/responses/Error"
     */
    static async getInquires(req, res) {
        try {
            const inquiries = await InquiryUserModel.getAll()
            res.status(200).json(inquiries)
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: "데이터베이스에서 문의사항 데이터를 가져오는데 실패했습니다." })
        }
    }

    /**
     * 
     * @type {express.RequestHandler}
     * @openapi
     *  /api/inquiries:
     *      post:
     *          summary: 새 문의사항 등록
     *          tags: [문의사항]
     *          security:
     *              - bearerAuth: []
     *          responses:
     *              '200':
     *                  $ref: "#/components/responses/Created"
     *              '500':
     *                  $ref: "#/components/responses/Error"
     *              default:
     *                  $ref: "#/components/responses/Error"
     */
    static async createInquiry(req, res) {
        try {
            const userId = req.authenticatedUser.id
            
            const result = await InquiryModel.create(userId)
            res.status(200).json({
                id: result.insertId,
                message: "성공적으로 문의사항이 등록되었습니다."
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "문의사항 등록 중 서버 에러가 발생했습니다." })
        }
    }

    /**
     * 
     * @type {express.RequestHandler}
     * @openapi
     *  /api/inquiries/{id}:
     *      patch:
     *          summary: 문의사항 상태 수정
     *          tags: [문의사항]
     *          security:
     *              - bearerAuth: []
     *          parameters:
     *              - name: id
     *                in: path
     *                description: 문의사항 ID
     *                required: true
     *                schema:
     *                    type: number
     *                    example: 1
     *          requestBody:
     *              required: true
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          required:
     *                              - status
     *                          properties:
     *                              status:
     *                                  type: string
     *                                  example: completed
     *                                  
     *          responses:
     *              '200':
     *                  $ref: "#/components/responses/Updated"
     *              '400':
     *                  $ref: "#/components/responses/Error"
     *              '500':
     *                  $ref: "#/components/responses/Error"
     *              default:
     *                  $ref: "#/components/responses/Error"
     */
    static async updateInquiryStatus(req, res) {
        try {
            const id = req.params.id
            const status = req.body.status

            // 유효성 검사
            if (!id || !validator.isNumeric(String(id))) {
                res.status(400).json({ message: "올바른 ID를 입력하세요." })
                return
            }
            if (!status || !["processing", "completed".includes(status)]) {
                res.status(400).json({ message: "올바른 상태를 입력하세요." })
                return
            }

            const result = await InquiryModel.update(id, status)
            if (result.affectedRows == 1) {
                res.status(200).json({ message: "성공적으로 문의사항 상태가 수정되었습니다." }) 
            } else {
                res.status(404).json({ message: "수정 실패: 문의사항을 찾을 수 없습니다." })
            }
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: "문의사항 상태 수정 중 서버 에러가 발생했습니다." })
        }
    }

    /**
     * 
     * @type {express.RequestHandler}
     * @openapi
     *  /api/inquiries/{id}:
     *      delete:
     *          summary: 특정 문의사항 삭제
     *          tags: [문의사항]
     *          security:
     *              - bearerAuth: []
     *          parameters:
     *              - name: id
     *                in: path
     *                description: 문의사항 ID
     *                required: true
     *                schema:
     *                    type: number
     *                    example: 1
     *          responses:
     *              '200':
     *                  $ref: "#/components/responses/Deleted"
     *              '404':
     *                  $ref: "#/components/responses/NotFound"
     *              '500':
     *                  $ref: "#/components/responses/Error"
     *              default:
     *                  $ref: "#/components/responses/Error"
     */
    static async deleteInquiry(req, res) {
        try {
            const id = req.params.id

            // 유효성 검사
            if (!id || !validator.isNumeric(String(id))) {
                res.status(400).json({ message: "올바른 ID를 입력하세요." })
                return
            }

            const result = await InquiryModel.delete(id)
            if (result.affectedRows == 1) {
                res.status(200).json({ message: "성공적으로 문의사항이 삭제되었습니다." }) 
            } else {
                res.status(404).json({ message: "삭제 실패: 문의사항을 찾을 수 없습니다." })
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "문의사항 삭제 중 서버 에러가 발생했습니다." })
        }
    }
}