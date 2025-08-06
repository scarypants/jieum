import express from "express"
import bcrypt from "bcryptjs"
import validator from "validator"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
import { UserModel } from "../models/UserModel.mjs"

export class AuthenticationController {
    static middleware = express.Router()
    static routes = express.Router()
    static secret = process.env.JWT_SECRET

    static {
        this.middleware.use(this.AuthenticationProvider)
        this.routes.post("/", this.authenticate)
    }

    /**
     * JWT 인증 미들웨어
     *
     * 요청 헤더의 Authorization 필드에서 Bearer 토큰을 추출하여 검증합니다.
     * 유효한 토큰일 경우, 디코딩된 사용자 정보를 req.authenticatedUser에 저장합니다.
     * 토큰이 없거나 유효하지 않은 경우, 401 상태 코드와 에러 메시지를 반환합니다.
     *
     * @private
     * @param {express.Request} req
     * @param {express.Response} res
     * @param {express.NextFunction} next
     */
    static async AuthenticationProvider(req, res, next) {
        const authHeader = req.headers.authorization
        if (authHeader) {
            try {
                const token = authHeader && authHeader.startsWith("Bearer ")
                ? authHeader.split(" ")[1]
                : null

                if (!token) {
                    return res.status(401).json({ message: "인증 실패 - 잘못된 토큰 형식입니다." })
                }

                const decoded = jwt.verify(token, AuthenticationController.secret)
                req.authenticatedUser = decoded
                console.log(JSON.stringify(req.authenticatedUser))
            } catch (error) {
                if (error.name === "TokenExpiredError") {
                    res.status(401).json({ message: "인증 실패 - 토큰이 만료되었습니다." })
                } else if (error.name === "JsonWebTokenError") {
                    res.status(401).json({ message: "인증 실패 - 유효하지 않은 토큰입니다." })
                } else if (error.name === "NotBeforeError") {
                    res.status(401).json({ message: "인증 실패 - 아직 유효하지 않은 토큰입니다." })
                } else {
                    res.status(500).json({ message: "인증 처리 중 서버 에러가 발생했습니다." })
                }
                return
            }
        } else {
            return res.status(401).json({ message: "인증 실패 -  토큰이 없습니다." })
        }
        next()
    }

    /**
     * 로그인 핸들러
     * 
     * @type {express.RequestHandler}
     * @openapi
     *  /api/auth:
     *      post:
     *          summary: 아이디와 비밀번호로 로그인
     *          tags: [인증]
     *          security: []
     *          requestBody:
     *              required: true
     *              content:
     *                  application/json:
     *                      schema:
     *                          $ref: "#/components/schemas/UserCredentials"
     *          responses:
     *              '200':
     *                  $ref: "#/components/responses/LoginSuccessful"
     *              '400':
     *                  $ref: "#/components/responses/Error"
     *              '500':
     *                  $ref: "#/components/responses/Error"
     */
    static async authenticate(req, res) {
        try {
            const loginId = req.body.loginId
            const password = req.body.password

            // 유효성 검사
            if (!loginId || !validator.isAlphanumeric(loginId)) {
                res.status(400).json({ message: "유효한 아이디를 입력해주세요." })
                return
            }
            if (!password || !validator.isLength(password, { min: 8 })) {
                res.status(400).json({ message: "비밀번호는 최소 8자 이상이어야 합니다." })
                return
            }

            const user = await UserModel.getByLoginId(loginId)

            if (!user) {
                res.status(400).json({ message: "아이디 또는 비밀번호가 잘못되었습니다." })
                return
            }

            console.log(JSON.stringify(user))

            if (await bcrypt.compare(password, user.password)) {
                const token = jwt.sign(
                    { id: user.id, role: user.role }, 
                    process.env.JWT_SECRET, 
                    { expiresIn: "1h" }
                )
                res.status(200).json({ token })
            } else {
                res.status(400).json({ message: "아이디 또는 비밀번호가 잘못되었습니다." })
            }
        } catch (error) {
            switch (error) {
                case "not found":
                    res.status(400).json({ message: "아이디 또는 비밀번호가 잘못되었습니다." })
                    break;
                default:
                    console.error(error)
                    res.status(500).json({ message: "로그인 처리 중 서버 에러가 발생했습니다." })
                    break;
            }
        }
    }

    /**
     * 권한 제한 미들웨어 생성기
     * 
     * @param {Array<"member" | "admin">} allowedRoles
     * @returns {express.RequestHandler}
     */
    static restrict(allowedRoles) {
        return function (req, res, next) {
            if (req.authenticatedUser) {
                if (allowedRoles.includes(req.authenticatedUser.role)) {
                    next()
                } else {
                    res.status(403).json({ message: "접근 거부 - 권한이 없습니다." })
                }
            } else {
                res.status(401).json({ message: "인증 필요 - 로그인 후 접근하세요." })
            }
        }
    }
}