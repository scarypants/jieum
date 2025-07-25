import express from "express"
import validator from "validator"
import { AuthenticationController } from "./AuthenticationController.mjs"
import { ScrapModel } from "../models/ScrapModel.mjs"
import { ScrapIdeaModel } from "../models/ScrapIdeaModel.mjs"

export class ScrapController {
    static routes = express.Router()

    static {
        this.routes.get("/", AuthenticationController.AuthenticationProvider, AuthenticationController.restrict(["member", "admin"]), this.getScraps)
        this.routes.post("/", AuthenticationController.AuthenticationProvider, AuthenticationController.restrict(["member", "admin"]), this.createScrap)
        this.routes.delete("/:id", AuthenticationController.AuthenticationProvider, AuthenticationController.restrict(["member", "admin"]), this.deleteScrap)
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
     *                                      scrap:
     *                                          $ref: "#/components/schemas/Scrap"
     *                                      idea:
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
            res.status(500).json({ message: "데이터베이스에서 스크랩 데이터를 가져오는데 실패했습니다." })
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
     *                          type: object
     *                          required:
     *                              - ideaId
     *                          properties:
     *                              ideaId:
     *                                  type: number
     *                                  example: 1
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
            const ideaId = req.body.ideaId

            // 유효성 검사
            if (!ideaId || !validator.isNumeric(String(ideaId))) {
                res.status(400).json({ message: "올바른 아이디어 ID를 입력하세요." })
                return
            }

            const scrap = new ScrapModel(
                null,
                req.authenticatedUser.id,
                ideaId
            )
            
            const result = await ScrapModel.create(scrap)
            res.status(200).json({
                id: result.insertId,
                message: "성공적으로 스크랩이 저장되었습니다."
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "스크랩 저장 중 서버 에러가 발생했습니다." })
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
     *              '403':
     *                  $ref: "#/components/responses/Forbidden"
     *              '404':
     *                  $ref: "#/components/responses/NotFound"
     *              '500':
     *                  $ref: "#/components/responses/Error"
     *              default:
     *                  $ref: "#/components/responses/Error"
     */
    static async deleteScrap(req, res) {
        try {
            const id = req.params.id

            // 유효성 검사
            if (!id || !validator.isNumeric(String(id))) {
                res.status(400).json({ message: "올바른 ID를 입력하세요." })
                return
            }

            // 스크랩한 사용자만 스크랩 삭제 가능
            const scrap = await ScrapModel.getById(id)
            if (req.authenticatedUser.id != scrap.userId) {
                res.status(403).json({ message: "접근 거부: 권한이 없습니다." })
                return
            }

            const result = await ScrapModel.delete(id)
            if (result.affectedRows == 1) {
                res.status(200).json({ message: "성공적으로 스크랩이 삭제되었습니다." }) 
            } else {
                res.status(404).json({ message: "삭제 실패: 스크랩을 찾을 수 없습니다." })
            }
            
        } catch (error) {
            switch (error) {
                case "not found":
                    res.status(400).json({ message: "결과 데이터가 없습니다." })
                    break;
                default:
                    console.error(error)
                    res.status(500).json({ message: "스크랩 삭제 중 서버 에러가 발생했습니다." })
                    break;
            }
        }
    }

}