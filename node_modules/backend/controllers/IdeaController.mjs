import express from "express"
import validator from "validator"
import { AuthenticationController } from "./AuthenticationController.mjs"

export class IdeaController {
    static routes = express.Router()

    static {
        this.routes.get("/", this.getIdeas)
        this.routes.get("/:id", this.getIdea)
        this.routes.get("/me", AuthenticationController.restrict(["member", "admin"]), this.getMyIdeas)
        this.routes.post("/", AuthenticationController.restrict(["member", "admin"]), this.createIdea)
        this.routes.patch("/:id", AuthenticationController.restrict(["member", "admin"]), this.updateIdea)
        this.routes.delete("/:id", AuthenticationController.restrict(["member", "admin"]), this.deleteIdea)
    }

    static async getIdeas(req, res) {
        try {

        } catch (error) {

        }
    }

    static async getIdea(req, res) {
        try {

        } catch (error) {

        }
    }

    static async getMyIdeas(req, res) {
        try {

        } catch (error) {

        }
    }

    static async createIdea(req, res) {
        try {

        } catch (error) {
            
        }
    }

    static async updateIdea(req, res) {
        try {

        } catch (error) {
            
        }
    }

    static async deleteIdea(req, res) {
        try {

        } catch (error) {
            
        }
    }

}