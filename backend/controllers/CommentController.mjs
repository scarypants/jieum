import express from "express"
import validator from "validator"
import { AuthenticationController } from "./AuthenticationController.mjs"
import { CommentModel } from "../models/CommentModel.mjs"

export class CommentController {
    static routes = express.Router()

    static {
        this.routes.post("/", AuthenticationController.AuthenticationProvider, AuthenticationController.restrict(["member", "admin"]), this.createComment)
        this.routes.delete("/:id", AuthenticationController.AuthenticationProvider, AuthenticationController.restrict(["member", "admin"]), this.deleteComment)
    }

    /**
     * 
     * @type {express.RequestHandler}
     * @openapi
     *  /api/comments:
     *      post:
     *          summary: 새 댓글 등록
     *          tags: [댓글]
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
     *                              - content
     *                          properties:
     *                              ideaId:
     *                                  type: number
     *                                  example: 1
     *                              content:
     *                                  type: string
     *                                  example: 아이디어 잘 보고 갑니다.
     *          responses:
     *              '200':
     *                  $ref: "#/components/responses/Created"
     *              '400':
     *                  $ref: "#/components/responses/Error"
     *              '500':
     *                  $ref: "#/components/responses/Error"
     *              default:
     *                  $ref: "#/components/responses/Error"
     */
    static async createComment(req, res) {
        try {
            const ideaId = req.body.ideaId
            const content = validator.escape(req.body.content)

            // 유효성 검사
            if (!ideaId || !validator.isNumeric(String(ideaId))) {
                res.status(400).json({ message: "올바른 아이디어 ID를 입력하세요." })
                return
            }
            if (!content) {
                res.status(400).json({ message: "내용을 입력하세요." })
                return
            }

            const comment = new CommentModel(
                null,
                req.authenticatedUser.id,
                ideaId,
                content
            )
            
            const result = await CommentModel.create(comment)
            res.status(200).json({
                id: result.insertId,
                message: "성공적으로 댓글이 등록되었습니다."
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "댓글 등록 중 서버 에러가 발생했습니다." })
        }
    }

    /**
     * 
     * @type {express.RequestHandler}
     * @openapi
     *  /api/comments/{id}:
     *      delete:
     *          summary: 특정 댓글 삭제
     *          tags: [댓글]
     *          security:
     *              - bearerAuth: []
     *          parameters:
     *              - name: id
     *                in: path
     *                description: 댓글 ID
     *                required: true
     *                schema:
     *                    type: number
     *                    example: 1
     *          responses:
     *              '200':
     *                  $ref: "#/components/responses/Deleted"
     *              '400':
     *                  $ref: "#/components/responses/Error"
     *              '403':
     *                  $ref: "#/components/responses/Forbidden"
     *              '404':
     *                  $ref: "#/components/responses/NotFound"
     *              '500':
     *                  $ref: "#/components/responses/Error"
     *              default:
     *                  $ref: "#/components/responses/Error"
     */
    static async deleteComment(req, res) {
        try {
            const id = req.params.id

            // 유효성 검사
            if (!id || !validator.isNumeric(String(id))) {
                res.status(400).json({ message: "올바른 ID를 입력하세요." })
                return
            }

            // 댓글 작성자 또는 관리자만 댓글 삭제 가능
            const comment = await CommentModel.getById(id)
            if (req.authenticatedUser.id != comment.writerId && req.authenticatedUser.role != "admin") {
                res.status(403).json({ message: "접근 거부: 권한이 없습니다." })
                return
            }

            const result = await CommentModel.delete(id)
            if (result.affectedRows == 1) {
                res.status(200).json({ message: "성공적으로 댓글이 삭제되었습니다." }) 
            } else {
                res.status(404).json({ message: "삭제 실패: 댓글을 찾을 수 없습니다." })
            }
        } catch (error) {
            switch (error) {
                case "not found":
                    res.status(400).json({ message: "결과 데이터가 없습니다." })
                    break;
                default:
                    console.error(error)
                    res.status(500).json({ message: "댓글 삭제 중 서버 에러가 발생했습니다." })
                    break;
            }
        }
    }
}