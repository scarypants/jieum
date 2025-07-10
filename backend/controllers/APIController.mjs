import express from "express"
import swaggerJSDoc from "swagger-jsdoc"
import swaggerUI from "swagger-ui-express"
import * as ApiValidator from "express-openapi-validator"
import { AuthenticationController } from "./AuthenticationController.mjs"
import { CategoryController } from "./CategoryController.mjs"
import { CommentController } from "./CommentController.mjs"
import { IdeaController } from "./IdeaController.mjs"
import { ScrapController } from "./ScrapController.mjs"
import { UserController } from "./UserController.mjs"
import { InquiryController } from "./InquiryController.mjs"

const options = {
    failOnErrors: true,
    definition: {
        openapi: "3.0.0",
        info: {
            version: "1.0.0",
            title: "지음 API",
            description: "지음 프로젝트의 백엔드와 상호작용하기 위한 JSON REST API"
        },
        components: {
            securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT"
            }
        }
        },
    },
    apis: ["./controllers/*.{js,mjs,yaml}", "./components.yaml"]
}

const specification = swaggerJSDoc(options)

export class APIController {
    static routes = express.Router() 

    static {
        /**
         * Swagger UI 문서 제공 라우트
         * 
         * @openapi
         *  /api/docs:
         *      get:
         *          summary: "자동 생성 문서 뷰"
         *          tags: [문서]
         *          responses:
         *              '200': 
         *                  description: "문서 페이지"
         */
        this.routes.use("/docs", swaggerUI.serve, swaggerUI.setup(specification))

        this.routes.get("/spec", (req, res) => {
            res.status(200).json(specification)
        })

        // 요청/응답 유효성 검사 미들웨어 설정
        this.routes.use(ApiValidator.middleware({
            apiSpec: specification,
            validateRequests: true,
            validateResponses: true,
        }))

        // 유효성 검사 오류 핸들러
        this.routes.use((err, req, res, next) => {
            console.error("Global Error: ", err.stack || err)
            res.status(err.status || 500).json({
                message: err.message
            })
        })

        this.routes.use("/users", UserController.routes)
        this.routes.use("/auth", AuthenticationController.routes)

        // 추가 API 컨트롤러
        this.routes.use("/categories", CategoryController.routes)
        this.routes.use("/comments", CommentController.routes)
        this.routes.use("/ideas", IdeaController.routes)
        this.routes.use("/scraps", ScrapController.routes)
        this.routes.use("/inquiries", InquiryController.routes)
    }
}