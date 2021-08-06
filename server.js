const express = require("express")
const router = require("./router")
const cors = require("cors")
require("dotenv").config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(router)

const port = process.env.PORT || 4000

app.listen(port, () => {
  console.log("running on port 4000")
})
