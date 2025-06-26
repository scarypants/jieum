import express from "express"
import validator from "validator"
import { AuthenticationController } from "./AuthenticationController.mjs"
import { ScrapModel } from "../models/ScrapModel.mjs"
import { ScrapIdeaModel } from "../models/ScrapIdeaModel.mjs"

export class ScrapController {
    static routes = express.Router()

    static {
        this.routes.get("/", AuthenticationController.restrict(["member", "admin"]), this.getScraps)
        this.routes.post("/", AuthenticationController.restrict(["member", "admin"]), this.createScrap)
        this.routes.delete("/:id", AuthenticationController.restrict(["member", "admin"]), this.deleteScrap)
    }

    /**
     * 
     * @type {express.RequestHandler}
     * @openapi
     *  /api/scraps:
     *      get:
     *          summary: 모든 스크랩 목록 가져오기
     *          tags: [스크랩]
     *          security:
     *              - bearerAuth: []
     *          responses:
     *              '200':
     *                  description: 스크랩 목록
     *                  content:
     *                      application/json:
     *                          schema:
     *                              type: array
     *                              items:
     *                                  type: object
     *                                  required:
     *                                      - scrap
     *                                      - idea
     *                                  properties:
     *                                      post:
     *                                          $ref: "#/components/schemas/Scrap"
     *                                      user:
     *                                          $ref: "#/components/schemas/Idea"
     *              '400':
     *                  $ref: "#/components/responses/Error"
     *              '500':
     *                  $ref: "#/components/responses/Error"
     *              default:
     *                  $ref: "#/components/responses/Error"
     */
    static async getScraps(req, res) {
        try {
            const scraps = await ScrapIdeaModel.getByUserId(req.authenticatedUser.id)
            res.status(200).json(scraps)
        } catch (error) {
            console.error(error)
            res.status(500).json({
                message: "데이터베이스에서 스크랩 데이터를 가져오는데 실패했습니다."
            })
        }
    }

    /**
     * 
     * @type {express.RequestHandler}
     * @openapi
     *  /api/scraps:
     *      post:
     *          summary: 새 스크랩 저장
     *          tags: [스크랩]
     *          security:
     *              - bearerAuth: []
     *          requestBody:
     *              required: true
     *              content:
     *                  application/json:
     *                      schema:
     *                          $ref: "#/components/schemas/Scrap"
     *          responses:
     *              '200':
     *                  $ref: "#/components/responses/Created"
     *              '500':
     *                  $ref: "#/components/responses/Error"
     *              default:
     *                  $ref: "#/components/responses/Error"
     */
    static async createScrap(req, res) {
        try {
            const userId = req.body.writerId
            const ideaId = req.body.ideaId

            if (!userId || userId != req.authenticatedUser.id || !validator.isNumeric(userId)) {
                res.status(400).json({ message: "올바른 사용자 ID를 입력하세요." })
                return
            }
            if (!ideaId || !validator.isNumeric(ideaId)) {
                res.status(400).json({ message: "올바른 아이디어 ID를 입력하세요." })
                return
            }
            const scrap = new ScrapModel(
                null,
                userId,
                ideaId
            )
            
            const result = await ScrapModel.create(scrap)
            res.status(200).json({
                id: result.insertId,
                message: "성공적으로 스크랩이 저장되었습니다."
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({
                message: "스크랩 저장 중 서버 에러가 발생했습니다.",
                errors: [error]
            })
        }
    }

    /**
     * 
     * @type {express.RequestHandler}
     * @openapi
     *  /api/scraps/{id}:
     *      delete:
     *          summary: 특정 스크랩 삭제
     *          tags: [스크랩]
     *          security:
     *              - bearerAuth: []
     *          parameters:
     *              - name: id
     *                in: path
     *                description: 스크랩 ID
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
     */
    static async deleteScrap(req, res) {
        try {
            const id = req.params.id

            if (!id || !validator.isNumeric(id)) {
                res.status(400).json({ message: "올바른 ID를 입력하세요." })
                return
            }

            const result = await ScrapModel.delete(id)
            if (result.affectedRows == 1) {
                res.status(200).json({ message: "성공적으로 스크랩이 삭제되었습니다." }) 
            } else {
                res.status(404).json({ message: "삭제 실패: 스크랩을 찾을 수 없습니다." })
            }
            
        } catch (error) {
            console.log(error)
            res.status(500).json({
                message: "스크랩 삭제 중 서버 에러가 발생했습니다.",
                errors: [error]
            })
        }
    }

}