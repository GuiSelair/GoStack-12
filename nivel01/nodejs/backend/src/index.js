const express = require("express");
const cors = require("cors")
const app = express();

app.use(express.json());
app.use(cors())

app.get("/", (request, response) => {
    return response.json({status: "hello"})
})

app.listen(3333, () => console.log(">👀 Server Up on http://localhost:3333"))