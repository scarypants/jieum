import express from "express"
import validator from "validator"
import { AuthenticationController } from "./AuthenticationController.mjs"
import { CategoryModel } from "./../models/CategoryModel.mjs"

export class CategoryController {
    static routes = express.Router()

    static {
        this.routes.get("/", this.getCategories)
        this.routes.post("/", AuthenticationController.AuthenticationProvider, AuthenticationController.restrict(["admin"]), this.createCategory)
        this.routes.delete("/:id", AuthenticationController.AuthenticationProvider, AuthenticationController.restrict(["admin"]), this.deleteCategory)
    }

    /**
     * 
     * @type {express.RequestHandler}
     * @openapi
     *  /api/categories:
     *      get:
     *          summary: 모든 카테고리 목록 가져오기
     *          tags: [카테고리]
     *          security: []
     *          responses:
     *              '200':
     *                  description: 카테고리 목록
     *                  content:
     *                      application/json:
     *                          schema:
     *                              type: array
     *                              items:
     *                                  $ref: "#/components/schemas/Category"
     *              '400':
     *                  $ref: "#/components/responses/Error"
     *              '500':
     *                  $ref: "#/components/responses/Error"
     *              default:
     *                  $ref: "#/components/responses/Error"
     */
    static async getCategories(req, res) {
        try {
            const categories = await CategoryModel.getAll()
            res.status(200).json(categories)
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: "데이터베이스에서 카테고리 데이터를 가져오는데 실패했습니다." })
        }
    }

    /**
     * 
     * @type {express.RequestHandler}
     * @openapi
     *  /api/categories:
     *      post:
     *          summary: 새 카테고리 등록
     *          tags: [카테고리]
     *          security:
     *              - bearerAuth: []
     *          requestBody:
     *              required: true
     *              content:
     *                  application/json:
     *                      schema:
     *                          $ref: "#/components/schemas/CategoryName"
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
    static async createCategory(req, res) {
        try {
            const name = validator.escape(req.body.name)

            // 유효성 검사
            if (!name) {
                res.status(400).json({ message: "카테고리 이름을 입력하세요." })
                return
            }

            const category = new CategoryModel(
                null,
                name,
                0
            )
            
            const result = await CategoryModel.create(category)
            res.status(200).json({
                id: result.insertId,
                message: "성공적으로 카테고리가 등록되었습니다."
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: "카테고리 등록 중 서버 에러가 발생했습니다." })
        }
    }

    /**
     * 
     * @type {express.RequestHandler}
     * @openapi
     *  /api/categories/{id}:
     *      delete:
     *          summary: 특정 카테고리 삭제
     *          tags: [카테고리]
     *          security:
     *              - bearerAuth: []
     *          parameters:
     *              - name: id
     *                in: path
     *                description: 카테고리 ID
     *                required: true
     *                schema:
     *                    type: number
     *                    example: 1
     *          responses:
     *              '200':
     *                  $ref: "#/components/responses/Deleted"
     *              '400':
     *                  $ref: "#/components/responses/Error"
     *              '404':
     *                  $ref: "#/components/responses/NotFound"
     *              '500':
     *                  $ref: "#/components/responses/Error"
     *              default:
     *                  $ref: "#/components/responses/Error"
     */
    static async deleteCategory(req, res) {
        try {
            const id = req.params.id

            // 유효성 검사
            if (!id || !validator.isNumeric(String(id))) {
                res.status(400).json({ message: "올바른 ID를 입력하세요." })
                return
            }

            const result = await CategoryModel.delete(id)
            if (result.affectedRows == 1) {
                res.status(200).json({ message: "성공적으로 카테고리가 삭제되었습니다." }) 
            } else {
                res.status(404).json({ message: "삭제 실패: 카테고리를 찾을 수 없습니다." })
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "카테고리 삭제 중 서버 에러가 발생했습니다." })
        }
    }

}