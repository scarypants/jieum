import express from "express"
import validator from "validator"
import bcrypt from "bcryptjs"
import { AuthenticationController } from "./AuthenticationController.mjs"
import { UserModel } from "../models/UserModel.mjs"

export class UserController {
    static routes = express.Router()

    static {
        this.routes.get("/", AuthenticationController.AuthenticationProvider, AuthenticationController.restrict(["admin"]), this.getUsers)
        this.routes.get("/me", AuthenticationController.AuthenticationProvider, AuthenticationController.restrict(["member", "admin"]), this.getMyInfo)
        this.routes.get("/:id", AuthenticationController.AuthenticationProvider, AuthenticationController.restrict(["admin"]), this.getUser)
        this.routes.post("/", this.createUser)
        this.routes.patch("/:id/role", AuthenticationController.AuthenticationProvider, AuthenticationController.restrict(["admin"]), this.updateUserRole)
        this.routes.patch("/:id", AuthenticationController.AuthenticationProvider, AuthenticationController.restrict(["member", "admin"]), this.updateUserDetails)
        this.routes.delete("/:id", AuthenticationController.AuthenticationProvider, AuthenticationController.restrict(["admin"]), this.deleteUser)
    }

    /**
     * 
     * @type {express.RequestHandler}
     * @openapi
     *  /api/users:
     *      get:
     *          summary: 모든 사용자 목록 가져오기
     *          tags: [사용자]
     *          security:
     *              - bearerAuth: []
     *          responses:
     *              '200':
     *                  description: 사용자 목록
     *                  content:
     *                      application/json:
     *                          schema:
     *                              type: array
     *                              items:
     *                                  $ref: "#/components/schemas/User"
     *              '400':
     *                  $ref: "#/components/responses/Error"
     *              '500':
     *                  $ref: "#/components/responses/Error"
     *              default:
     *                  $ref: "#/components/responses/Error"
     */
    static async getUsers(req, res) {
        try {
            const users = await UserModel.getAll()
            res.status(200).json(users)
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: "데이터베이스에서 사용자 데이터를 가져오는데 실패했습니다." })
        }
    }

    /**
     * 
     * @type {express.RequestHandler}
     * @openapi
     *  /api/users/{id}:
     *      get:
     *          summary: 특정 사용자 불러오기
     *          tags: [사용자]
     *          security:
     *              - bearerAuth: []
     *          parameters:
     *              - name: id
     *                in: path
     *                description: 사용자 ID
     *                required: true
     *                schema:
     *                    type: number
     *                    example: 1
     *          responses:
     *              '200':
     *                  description: 사용자 정보
     *                  content:
     *                      application/json:
     *                          schema:
     *                              $ref: "#/components/schemas/User"
     *              '400':
     *                  $ref: "#/components/responses/Error"
     *              '500':
     *                  $ref: "#/components/responses/Error"
     *              default:
     *                  $ref: "#/components/responses/Error"
     */
    static async getUser(req, res) {
        try {
            const id = req.params.id

            // 유효성 검사
            if (!id || !validator.isNumeric(String(id))) {
                res.status(400).json({ message: "올바른 ID를 입력하세요." })
                return
            }
            const user = await UserModel.getById(id)
            res.status(200).json(user)
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: "데이터베이스에서 사용자 데이터를 가져오는데 실패했습니다." })
        }
    }

    /**
     * 
     * @type {express.RequestHandler}
     * @openapi
     *  /api/users/me:
     *      get:
     *          summary: 내 프로필 정보 불러오기
     *          tags: [사용자]
     *          security:
     *              - bearerAuth: []
     *          responses:
     *              '200':
     *                  description: 사용자 정보
     *                  content:
     *                      application/json:
     *                          schema:
     *                              $ref: "#/components/schemas/User"
     *              '400':
     *                  $ref: "#/components/responses/Error"
     *              '500':
     *                  $ref: "#/components/responses/Error"
     *              default:
     *                  $ref: "#/components/responses/Error"
     */
    static async getMyInfo(req, res) {
        try {
            const user = await UserModel.getById(req.authenticatedUser.id)
            res.status(200).json(user)
        } catch (error) {
            console.error(error)
            res.status(500).json({
                message: "데이터베이스에서 사용자 데이터를 가져오는데 실패했습니다."
            })
        }
    }

    /**
     * 
     * @type {express.RequestHandler}
     * @openapi
     *  /api/users:
     *      post:
     *          summary: 회원가입
     *          tags: [사용자]
     *          security: []
     *          requestBody:
     *              required: true
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          required:
     *                              - nickname
     *                              - loginId
     *                              - password
     *                          properties:
     *                              nickname:
     *                                  type: string
     *                                  example: 미소
     *                              loginId:
     *                                  type: string
     *                                  example: miso
     *                              password:
     *                                  type: string
     *                                  example: adminmiso
     *          responses:
     *              '200':
     *                  $ref: "#/components/responses/Created"
     *              '400':
     *                  $ref: "#/components/responses/Error"
     *              '409':
     *                  $ref: "#/components/responses/Conflict"
     *              '500':
     *                  $ref: "#/components/responses/Error"
     *              default:
     *                  $ref: "#/components/responses/Error"
     */
    static async createUser(req, res) {
        try {
            const nickname = validator.escape(req.body.nickname)
            const loginId = req.body.loginId
            const password = req.body.password

            // 유효성 검사
            if (!nickname) {
                res.status(400).json({ message: "닉네임을 입력해주세요." })
                return
            }
            if (!loginId || !validator.isAlphanumeric(String(loginId))) {
                res.status(400).json({ message: "유효한 아이디를 입력해주세요. (영문, 숫자만 가능)" })
                return
            }
            if (!password || !validator.isLength(password, { min: 8 })) {
                res.status(400).json({ message: "비밀번호는 최소 8자 이상이어야 합니다." })
                return
            }

            // 중복 검사
            const isNicknameDup = await UserModel.getNicknameDup(nickname)
            const isLoginIdDup = await UserModel.getLoginIdDup(loginId)
            if (isNicknameDup) {
                res.status(409).json({ message: "이미 존재하는 닉네임입니다." })
                return
            }
            if (isLoginIdDup) {
                res.status(409).json({ message: "이미 존재하는 아이디입니다." })
                return
            }

            const user = new UserModel(
                null,
                "member",
                nickname,
                loginId,
                password,
                0
            )
            
            // 비밀번호 해시
            if (!user.password.startsWith("$2a")) {
                user.password = bcrypt.hashSync(user.password)
            }

            const result = await UserModel.create(user)
            res.status(200).json({
                id: result.insertId,
                message: "성공적으로 회원가입 되었습니다."
            })
        } catch (error) {
            console.error(error.stack)
            res.status(500).json({ message: "회원가입 중 서버 에러가 발생했습니다." })
        }
    }

    /**
     * 
     * @type {express.RequestHandler}
     * @openapi
     *  /api/users/{id}/role:
     *      patch:
     *          summary: 특정 사용자 역할 수정
     *          tags: [사용자]
     *          security:
     *              - bearerAuth: []
     *          parameters:
     *              - name: id
     *                in: path
     *                description: 사용자 ID
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
     *                              - role
     *                          properties:
     *                              role:
     *                                  type: string
     *                                  example: admin
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
    static async updateUserRole(req, res) {
        try {
            const id = req.params.id
            const role = req.body.role

            // 유효성 검사, 역할만 수정 가능
            if (!req.params.id || !validator.isNumeric(String(req.params.id))) {
                res.status(400).json({ message: "올바른 ID를 입력하세요." })
                return
            }
            if (!role || !(role == "admin" || role == "member")) {
                res.status(400).json({ message: "유효한 역할을 지정해주세요. (회원 또는 관리자)" })
                return
            }

            const result = await UserModel.updateRole(id, role)
            if (result.affectedRows == 1) {
                res.status(200).json({ message: "성공적으로 사용자 정보가 수정되었습니다." }) 
            } else {
                res.status(404).json({ message: "수정 실패: 사용자를 찾을 수 없습니다." })
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "사용자 정보 수정 중 서버 에러가 발생했습니다." })
        }
    }

    /**
     * 
     * @type {express.RequestHandler}
     * @openapi
     *  /api/users/{id}:
     *      patch:
     *          summary: 특정 사용자 정보 수정
     *          tags: [사용자]
     *          security:
     *              - bearerAuth: []
     *          parameters:
     *              - name: id
     *                in: path
     *                description: 사용자 ID
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
     *                              - nickname
     *                              - loginId
     *                              - password
     *                          properties:
     *                              nickname:
     *                                  type: string
     *                                  example: 미소
     *                              loginId:
     *                                  type: string
     *                                  example: miso
     *                              password:
     *                                  type: string
     *                                  example: adminmiso
     *          responses:
     *              '200':
     *                  $ref: "#/components/responses/Updated"
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
    static async updateUserDetails(req, res) {
        try {
            // 사용자 자신의 정보만 수정 가능
            if (req.params.id != req.authenticatedUser.id) {
                res.status(403).json({ message: "접근 거부: 권한이 없습니다." })
                return
            }

            const nickname = validator.escape(req.body.nickname)
            const loginId = req.body.loginId
            const password = req.body.password

            // 유효성 검사, 닉네임, 아이디, 비밀번호 수정 가능
            if (!req.params.id || !validator.isNumeric(String(req.params.id))) {
                res.status(400).json({ message: "올바른 ID를 입력하세요." })
                return
            }
            if (!nickname) {
                res.status(400).json({ message: "닉네임을 입력해주세요." })
                return
            }
            if (!loginId || !validator.isAlphanumeric(loginId)) {
                res.status(400).json({ message: "유효한 아이디를 입력해주세요. (영문, 숫자만 가능)" })
                return
            }
            if (!password || !validator.isLength(password, { min: 8 })) {
                res.status(400).json({ message: "비밀번호는 최소 8자 이상이어야 합니다." })
                return
            }
            
            const user = new UserModel(
                req.params.id,
                req.authenticatedUser.role,
                nickname,
                loginId,
                password,
                0
            )

            if (!user.password.startsWith("$2a")) {
                user.password = bcrypt.hashSync(user.password)
            }

            const result = await UserModel.update(user)
            if (result.affectedRows == 1) {
                res.status(200).json({ message: "성공적으로 사용자 정보가 수정되었습니다." }) 
            } else {
                res.status(404).json({ message: "수정 실패: 사용자를 찾을 수 없습니다." })
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "사용자 정보 수정 중 서버 에러가 발생했습니다." })
        }
    }

    /**
     * 
     * @type {express.RequestHandler}
     * @openapi
     *  /api/users/{id}:
     *      delete:
     *          summary: 특정 사용자 삭제
     *          tags: [사용자]
     *          security:
     *              - bearerAuth: []
     *          parameters:
     *              - name: id
     *                in: path
     *                description: 사용자 ID
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
    static async deleteUser(req, res) {
        try {
            const id = req.params.id

            // 유효성 검사
            if (!id || !validator.isNumeric(String(id))) {
                res.status(400).json({ message: "올바른 ID를 입력하세요." })
                return
            }

            const result = await UserModel.delete(id)
            if (result.affectedRows == 1) {
                res.status(200).json({ message: "성공적으로 사용자가 삭제되었습니다." }) 
            } else {
                res.status(404).json({ message: "삭제 실패: 사용자를 찾을 수 없습니다." })
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "사용자 삭제 중 서버 에러가 발생했습니다." })
        }
    }

}