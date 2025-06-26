import express from "express"
import cors from "cors"
import { APIController } from "./controllers/APIController.mjs"
import { AuthenticationController } from "./controllers/AuthenticationController.mjs"

const app = express()
const port = 8080

// Enable cross-origin resource sharing (CORS) and preflight OPTIONS requests
app.use(cors({
    origin: true,
}))

// Middleware setup here
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// Use routes (from controllers)
app.use("/api", APIController.routes)

app.listen(port, () => {
    console.log("Backend started on http://localhost:" + port)
})