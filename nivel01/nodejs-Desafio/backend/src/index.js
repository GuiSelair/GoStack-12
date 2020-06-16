const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (request, response) => {
    return response.json({status: "hello"})
})

app.listen(3333, () => console.log(">👀 Server Up on http://localhost:3333"))