import express from "express";
import config from "@repo/backend-common/config";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello from http-backend!");
});

app.listen(config.PORT, () => {
    console.log(`http-backend listening on port ${config.PORT}`);
});
