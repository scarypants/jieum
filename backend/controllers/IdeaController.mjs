import express from "express"
import validator from "validator"
import { AuthenticationController } from "./AuthenticationController.mjs"
import { IdeaDetailsModel } from "../models/IdeaDetailsModel.mjs"
import { IdeaModel } from "../models/IdeaModel.mjs"
import { TagModel } from "../models/TagModel.mjs"
import { IdeaTagModel } from "../models/IdeaTagModel.mjs"

export class IdeaController {
    static routes = express.Router()

    static {
        this.routes.get("/", this.getIdeas)
        this.routes.get("/me", AuthenticationController.AuthenticationProvider, AuthenticationController.restrict(["member", "admin"]), this.getMyIdeas)
        this.routes.get("/:id", this.getIdea)
        this.routes.post("/", AuthenticationController.AuthenticationProvider, AuthenticationController.restrict(["member", "admin"]), this.createIdea)
        this.routes.patch("/:id", AuthenticationController.AuthenticationProvider, AuthenticationController.restrict(["member", "admin"]), this.updateIdea)
        this.routes.patch("/:id/views", AuthenticationController.AuthenticationProvider, AuthenticationController.restrict(["member", "admin"]), this.updateViewCount)
        this.routes.patch("/:id/scraps", AuthenticationController.AuthenticationProvider, AuthenticationController.restrict(["member", "admin"]), this.updateScrapCount)
        this.routes.patch("/:id/comments", AuthenticationController.AuthenticationProvider, AuthenticationController.restrict(["member", "admin"]), this.updateCommentCount)
        this.routes.delete("/:id", AuthenticationController.AuthenticationProvider, AuthenticationController.restrict(["member", "admin"]), this.deleteIdea)
    }

    /**
     * 
     * @type {express.RequestHandler}
     * @openapi
     *  /api/ideas:
     *      get:
     *          summary: 모든 아이디어 목록 가져오기
     *          tags: [아이디어]
     *          security: []
     *          parameters:
     *              - name: category
     *                in: query
     *                description: 카테고리 이름
     *                schema:
     *                    type: string
     *              - name: search
     *                in: query
     *                description: 제목 또는 태그 이름
     *                schema:
     *                    type: string
     *              - name: sort
     *                in: query
     *                description: 정렬 기준 (조회수순, 스크랩순, 댓글많은순, 최신순)
     *                schema:
     *                    type: string
     *                    example: latest
     *          responses:
     *              '200':
     *                  description: 아이디어 목록
     *                  content:
     *                      application/json:
     *                          schema:
     *                              type: array
     *                              items:
     *                                  type: object
     *                                  required:
     *                                      - idea
     *                                      - writer
     *                                      - category
     *                                  properties:
     *                                      idea:
     *                                          $ref: "#/components/schemas/Idea"
     *                                      writer:
     *                                          $ref: "#/components/schemas/UserNickname"
     *                                      category:
     *                                          $ref: "#/components/schemas/CategoryName"
     *                                      tags:
     *                                          type: array
     *                                          items:
     *                                              type: object
     *                                              properties:
     *                                                  ideaTag:
     *                                                      $ref: "#/components/schemas/IdeaTag"
     *                                                  tag:
     *                                                      $ref: "#/components/schemas/Tag"
     *                                      comments:
     *                                          type: array
     *                                          items:
     *                                              type: object
     *                                              properties:
     *                                                  comment:
     *                                                      $ref: "#/components/schemas/Comment"
     *                                                  commentWriter:
     *                                                      $ref: "#/components/schemas/UserNickname"
     *              '400':
     *                  $ref: "#/components/responses/Error"
     *              '500':
     *                  $ref: "#/components/responses/Error"
     *              default:
     *                  $ref: "#/components/responses/Error"
     */
    static async getIdeas(req, res) {
        try {
            const category = req.query.category ?? null
            const search = req.query.search ?? null
            const sort = req.query.sort ?? "latest"
            console.log(category, search, sort)

            // 유효성 검사
            if (category && (typeof category !== 'string' || category.trim() === '')) {
                res.status(400).json({ message: "카테고리는 빈 문자열이 아닌 문자열만 가능합니다." })
                return
            }
            if (!["views", "scraps", "comments", "latest"].includes(sort)) {
                res.status(400).json({ message: "올바른 정렬 기준을 선택해주세요." })
                return
            }            

            const ideas = await IdeaDetailsModel.getAll({ category, search, sort })
            console.log(JSON.stringify(ideas))
            res.status(200).json(ideas)
        } catch (error) {
            switch (error) {
                case "not found":
                    res.status(400).json({ message: "결과 데이터가 없습니다." })
                    break;
                default:
                    console.error(error)
                    res.status(500).json({ message: "데이터베이스에서 아이디어 데이터를 가져오는데 실패했습니다." })
                    break;
            }
        }
    }

    /**
     * 
     * @type {express.RequestHandler}
     * @openapi
     *  /api/ideas/{id}:
     *      get:
     *          summary: 특정 아이디어 가져오기
     *          tags: [아이디어]
     *          security: []
     *          parameters:
     *              - name: id
     *                in: path
     *                description: 아이디어 ID
     *                required: true
     *                schema:
     *                    type: number
     *                    example: 1
     *          responses:
     *              '200':
     *                  description: 아이디어
     *                  content:
     *                      application/json:
     *                          schema:
     *                              type: object
     *                              required:
     *                                  - idea
     *                                  - writer
     *                                  - category
     *                              properties:
     *                                  idea:
     *                                      $ref: "#/components/schemas/Idea"
     *                                  writer:
     *                                      $ref: "#/components/schemas/UserNickname"
     *                                  category:
     *                                      $ref: "#/components/schemas/CategoryName"
     *                                  tags:
     *                                      type: array
     *                                      items:
     *                                          type: object
     *                                          properties:
     *                                              ideaTag:
     *                                                  $ref: "#/components/schemas/IdeaTag"
     *                                              tag:
     *                                                  $ref: "#/components/schemas/Tag"
     *                                  comments:
     *                                      type: array
     *                                      items:
     *                                          type: object
     *                                          properties:
     *                                              comment:
     *                                                  $ref: "#/components/schemas/Comment"
     *                                              commentWriter:
     *                                                  $ref: "#/components/schemas/UserNickname"
     *              '400':
     *                  $ref: "#/components/responses/Error"
     *              '500':
     *                  $ref: "#/components/responses/Error"
     *              default:
     *                  $ref: "#/components/responses/Error"
     */
    static async getIdea(req, res) {
        try {
            const id = req.params.id

            // 유효성 검사
            if (!id || !validator.isNumeric(String(id))) {
                res.status(400).json({ message: "올바른 ID를 입력하세요." })
                return
            }

            const idea = await IdeaDetailsModel.getById(id)
            res.status(200).json(idea)
        } catch (error) {
            switch (error) {
                case "not found":
                    res.status(400).json({ message: "결과 데이터가 없습니다." })
                    break;
                default:
                    console.error(error)
                    res.status(500).json({ message: "데이터베이스에서 아이디어 데이터를 가져오는데 실패했습니다." })
                    break;
            }
        }
    }

    /**
     * 
     * @type {express.RequestHandler}
     * @openapi
     *  /api/ideas/me:
     *      get:
     *          summary: 내 아이디어 목록 가져오기
     *          tags: [아이디어]
     *          security:
     *              - bearerAuth: []
     *          parameters:
     *              - name: sort
     *                in: query
     *                description: 정렬 기준 (조회수순, 스크랩순, 댓글많은순, 최신순)
     *                schema:
     *                    type: string
     *                    example: latest
     *          responses:
     *              '200':
     *                  description: 내 아이디어 목록
     *                  content:
     *                      application/json:
     *                          schema:
     *                              type: array
     *                              items:
     *                                  type: object
     *                                  required:
     *                                      - idea
     *                                      - writer
     *                                      - category
     *                                  properties:
     *                                      idea:
     *                                          $ref: "#/components/schemas/Idea"
     *                                      writer:
     *                                          $ref: "#/components/schemas/UserNickname"
     *                                      category:
     *                                          $ref: "#/components/schemas/CategoryName"
     *                                      tags:
     *                                          type: array
     *                                          items:
     *                                              type: object
     *                                              properties:
     *                                                  ideaTag:
     *                                                      $ref: "#/components/schemas/IdeaTag"
     *                                                  tag:
     *                                                      $ref: "#/components/schemas/Tag"
     *                                      comments:
     *                                          type: array
     *                                          items:
     *                                              type: object
     *                                              properties:
     *                                                  comment:
     *                                                      $ref: "#/components/schemas/Comment"
     *                                                  commentWriter:
     *                                                      $ref: "#/components/schemas/UserNickname"
     *              '400':
     *                  $ref: "#/components/responses/Error"
     *              '500':
     *                  $ref: "#/components/responses/Error"
     *              default:
     *                  $ref: "#/components/responses/Error"
     */
    static async getMyIdeas(req, res) {
        try {
            const sort = req.query.sort ?? "latest"

            // 유효성 검사
            if (!["views", "scraps", "comments", "latest"].includes(sort)) {
                res.status(400).json({ message: "올바른 정렬 기준을 선택해주세요." })
                return
            }

            const ideas = await IdeaDetailsModel.getByWriterId(req.authenticatedUser.id, sort)
            res.status(200).json(ideas)
        } catch (error) {
            switch (error) {
                case "not found":
                    res.status(400).json({ message: "결과 데이터가 없습니다." })
                    break;
                default:
                    console.error(error)
                    res.status(500).json({ message: "데이터베이스에서 아이디어 데이터를 가져오는데 실패했습니다." })
                    break;
            }
        }
    }

    /**
     * 
     * @type {express.RequestHandler}
     * @openapi
     *  /api/ideas:
     *      post:
     *          summary: 새 아이디어 등록
     *          tags: [아이디어]
     *          security:
     *              - bearerAuth: []
     *          requestBody:
     *              required: true
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          required:
     *                              - idea
     *                          properties:
     *                              idea:
     *                                  $ref: "#/components/schemas/IdeaSummary"
     *                              tags:
     *                                  type: array
     *                                  items:
     *                                      $ref: "#/components/schemas/TagName"
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
    static async createIdea(req, res) {
        try {
            const { categoryId, title, content } = req.body.idea
            const rawTags = req.body.tags

            // 유효성 검사
            if (!categoryId || !validator.isNumeric(String(categoryId))) {
                res.status(400).json({ message: "올바른 카테고리 ID를 입력하세요." })
                return
            }
            if (!title?.trim() || !content?.trim()) {
                res.status(400).json({ message: "제목과 내용을 모두 입력해주세요." })
                return
            }

            const idea = new IdeaModel(
                null,
                req.authenticatedUser.id,
                categoryId,
                validator.escape(title),
                validator.escape(content)
            )

            const result = await IdeaModel.create(idea)
            const ideaId = result.insertId

            if (Array.isArray(rawTags) && rawTags.length > 0) {
                const tags = Array.from(new Set(
                    rawTags
                        .map(tag => typeof tag?.name === 'string' ? validator.escape(tag.name.trim()) : '')
                        .filter(tag => tag)
                ))

                for (const name of tags) {
                    let tagRecord = await TagModel.getByName(name)
                    let tagId

                    // 이미 존재하는 태그라면 해당 태그 ID 이용하고 존재하지 않는다면 생성
                    if (tagRecord) {
                        tagId = tagRecord.id
                    } else {
                        const newTag = new TagModel(null, name)
                        const result = await TagModel.create(newTag)
                        tagId = result.insertId
                    }

                    // Idea Tag 테이블로 연결
                    const ideaTag = new IdeaTagModel(null, ideaId, tagId)
                    await IdeaTagModel.create(ideaTag)
                }
            }

            res.status(200).json({
                id: ideaId,
                message: "성공적으로 아이디어가 등록되었습니다."
            })
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "아이디어 등록 중 서버 에러가 발생했습니다." })
        }
    }

    /**
     * 
     * @type {express.RequestHandler}
     * @openapi
     *  /api/ideas/{id}:
     *      patch:
     *          summary: 아이디어 수정
     *          tags: [아이디어]
     *          security:
     *              - bearerAuth: []
     *          parameters:
     *              - name: id
     *                in: path
     *                description: 아이디어 ID
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
     *                              - idea
     *                          properties:
     *                              idea:
     *                                  $ref: "#/components/schemas/IdeaPatchSummary"
     *                              tags:
     *                                  type: array
     *                                  items:
     *                                      $ref: "#/components/schemas/TagName"
     *          responses:
     *              '200':
     *                  $ref: "#/components/responses/Updated"
     *              '400':
     *                  $ref: "#/components/responses/Error"
     *              '403':
     *                  $ref: "#/components/responses/Forbidden"
     *              '500':
     *                  $ref: "#/components/responses/Error"
     *              default:
     *                  $ref: "#/components/responses/Error"
     */
    static async updateIdea(req, res) {
        try {
            const id = req.params.id
            const { writerId, categoryId, title, content } = req.body.idea
            const rawTags = req.body.tags   // 수정 여부와 관계 없는 모든 태그
            console.log(JSON.stringify(rawTags))

            // 유효성 검사
            if (!id || !validator.isNumeric(String(id))) {
                res.status(400).json({ message: "올바른 ID를 입력하세요." })
                return
            }
            if (!categoryId || !validator.isNumeric(String(categoryId))) {
                res.status(400).json({ message: "올바른 카테고리 ID를 입력하세요." })
                return
            }
            if (!title?.trim() || !content?.trim()) {
                res.status(400).json({ message: "제목과 내용을 모두 입력해주세요." })
                return
            }

            // 아이디어 작성자만 수정 가능
            if (req.authenticatedUser.id != writerId) {
                res.status(403).json({ message: "접근 거부: 권한이 없습니다." })
                return
            }

            const idea = new IdeaModel(
                id,
                req.authenticatedUser.id,
                categoryId,
                validator.escape(title),
                validator.escape(content)
            )
            await IdeaModel.update(idea)

            if (Array.isArray(rawTags) && rawTags.length > 0) {
                const tags = Array.from(new Set(
                    rawTags
                        .map(tag => typeof tag?.name === 'string' ? validator.escape(tag.name.trim()) : '')
                        .filter(tag => tag)
                ))

                await IdeaTagModel.deleteByIdeaId(id)

                for (const name of tags) {
                    let tagRecord = await TagModel.getByName(name)
                    let tagId

                    // 이미 존재하는 태그라면 해당 태그 ID 이용하고 존재하지 않는다면 생성
                    if (tagRecord) {
                        tagId = tagRecord.id
                    } else {
                        const newTag = new TagModel(null, name)
                        const result = await TagModel.create(newTag)
                        tagId = result.insertId
                    }

                    // Idea Tag 테이블로 연결
                    const ideaTag = new IdeaTagModel(null, id, tagId)
                    await IdeaTagModel.create(ideaTag)
                }
            }

            res.status(200).json({ message: "성공적으로 아이디어가 수정되었습니다." }) 
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: "아이디어 수정 중 서버 에러가 발생했습니다." })
        }
    }

    /**
     * 
     * @type {express.RequestHandler}
     * @openapi
     *  /api/ideas/{id}/views:
     *      patch:
     *          summary: 아이디어 조회수 1 추가
     *          tags: [아이디어]
     *          security:
     *              - bearerAuth: []
     *          parameters:
     *              - name: id
     *                in: path
     *                description: 아이디어 ID
     *                required: true
     *                schema:
     *                    type: number
     *                    example: 1
     *          responses:
     *              '200':
     *                  $ref: "#/components/responses/Updated"
     *              '400':
     *                  $ref: "#/components/responses/Error"
     *              '404':
     *                  $ref: "#/components/responses/NotFound"
     *              '500':
     *                  $ref: "#/components/responses/Error"
     *              default:
     *                  $ref: "#/components/responses/Error"
     */
    static async updateViewCount(req, res) {
        try {
            const id = req.params.id

            // 유효성 검사
            if (!id || !validator.isNumeric(String(id))) {
                res.status(400).json({ message: "올바른 ID를 입력하세요." })
                return
            }

            const result = await IdeaModel.addViewCount(id)
            if (result.affectedRows == 1) {
                res.status(200).json({ message: "성공적으로 조회수가 추가되었습니다." }) 
            } else {
                res.status(404).json({ message: "수정 실패: 아이디어를 찾을 수 없습니다." })
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "아이디어 조회수 수정 중 서버 에러가 발생했습니다." })
        }
    }

    /**
     * 
     * @type {express.RequestHandler}
     * @openapi
     *  /api/ideas/{id}/scraps:
     *      patch:
     *          summary: 아이디어 스크랩수 1 추가/감소
     *          tags: [아이디어]
     *          security:
     *              - bearerAuth: []
     *          parameters:
     *              - name: id
     *                in: path
     *                description: 아이디어 ID
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
     *                              - action
     *                          properties:
     *                              action:
     *                                  type: string
     *                                  example: add
     *          responses:
     *              '200':
     *                  $ref: "#/components/responses/Updated"
     *              '400':
     *                  $ref: "#/components/responses/Error"
     *              '404':
     *                  $ref: "#/components/responses/NotFound"
     *              '500':
     *                  $ref: "#/components/responses/Error"
     *              default:
     *                  $ref: "#/components/responses/Error"
     */
    static async updateScrapCount(req, res) {
        try {
            const id = req.params.id
            const action = req.body.action

            // 유효성 검사
            if (!id || !validator.isNumeric(String(id))) {
                res.status(400).json({ message: "올바른 ID를 입력하세요." })
                return
            }

            if (action == "add") {
                const result = await IdeaModel.addScrapCount(id)
                if (result.affectedRows == 1) {
                    res.status(200).json({ message: "성공적으로 스크랩수가 추가되었습니다." }) 
                } else {
                    res.status(404).json({ message: "수정 실패: 아이디어를 찾을 수 없습니다." })
                }
            } else if (action == "sub") {
                const result = await IdeaModel.subScrapCount(id)
                if (result.affectedRows == 1) {
                    res.status(200).json({ message: "성공적으로 스크랩수가 감소되었습니다." }) 
                } else {
                    res.status(404).json({ message: "수정 실패: 아이디어를 찾을 수 없습니다." })
                }
            } else {
                res.status(400).json({ message: "올바른 Action을 입력하세요. (add 또는 sub)" })
                return
            }
            
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "아이디어 스크랩수 수정 중 서버 에러가 발생했습니다." })
        }
    }

    /**
     * 
     * @type {express.RequestHandler}
     * @openapi
     *  /api/ideas/{id}/comments:
     *      patch:
     *          summary: 아이디어 댓글수 1 추가/감소
     *          tags: [아이디어]
     *          security:
     *              - bearerAuth: []
     *          parameters:
     *              - name: id
     *                in: path
     *                description: 아이디어 ID
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
     *                              - action
     *                          properties:
     *                              action:
     *                                  type: string
     *                                  example: add
     *          responses:
     *              '200':
     *                  $ref: "#/components/responses/Updated"
     *              '400':
     *                  $ref: "#/components/responses/Error"
     *              '404':
     *                  $ref: "#/components/responses/NotFound"
     *              '500':
     *                  $ref: "#/components/responses/Error"
     *              default:
     *                  $ref: "#/components/responses/Error"
     */
    static async updateCommentCount(req, res) {
        try {
            const id = req.params.id
            const action = req.body.action

            // 유효성 검사
            if (!id || !validator.isNumeric(String(id))) {
                res.status(400).json({ message: "올바른 ID를 입력하세요." })
                return
            }

            if (action == "add") {
                const result = await IdeaModel.addCommentCount(id)
                if (result.affectedRows == 1) {
                    res.status(200).json({ message: "성공적으로 댓글수가 추가되었습니다." }) 
                } else {
                    res.status(404).json({ message: "수정 실패: 아이디어를 찾을 수 없습니다." })
                }
            } else if (action == "sub") {
                const result = await IdeaModel.subCommentCount(id)
                if (result.affectedRows == 1) {
                    res.status(200).json({ message: "성공적으로 댓글수가 감소되었습니다." }) 
                } else {
                    res.status(404).json({ message: "수정 실패: 아이디어를 찾을 수 없습니다." })
                }
            } else {
                res.status(400).json({ message: "올바른 Action을 입력하세요. (add 또는 sub)" })
                return
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "아이디어 댓글수 수정 중 서버 에러가 발생했습니다." })
        }
    }

    /**
     * 
     * @type {express.RequestHandler}
     * @openapi
     *  /api/ideas/{id}:
     *      delete:
     *          summary: 특정 아이디어 삭제
     *          tags: [아이디어]
     *          security:
     *              - bearerAuth: []
     *          parameters:
     *              - name: id
     *                in: path
     *                description: 아이디어 ID
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
    static async deleteIdea(req, res) {
        try {
            const id = req.params.id

            // 유효성 검사
            if (!id || !validator.isNumeric(String(id))) {
                res.status(400).json({ message: "올바른 ID를 입력하세요." })
                return
            }

            // 작성자 또는 관리자만 아이디어 삭제 가능
            const idea = await IdeaModel.getById(id)
            if (idea.writerId != req.authenticatedUser.id && req.authenticatedUser.role != "admin") {
                res.status(403).json({ message: "접근 거부: 권한이 없습니다." })
                return
            }

            await IdeaTagModel.deleteByIdeaId(id)
            const result = await IdeaModel.delete(id)
            if (result.affectedRows == 1) {
                res.status(200).json({ message: "성공적으로 카테고리가 삭제되었습니다." }) 
            } else {
                res.status(404).json({ message: "삭제 실패: 카테고리를 찾을 수 없습니다." })
            }
        } catch (error) {
            switch (error) {
                case "not found":
                    res.status(400).json({ message: "결과 데이터가 없습니다." })
                    break;
                default:
                    console.error(error)
                    res.status(500).json({ message: "카테고리 삭제 중 서버 에러가 발생했습니다." })
                    break;
            }
        }
    }
}