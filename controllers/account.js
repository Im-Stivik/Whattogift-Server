//basic set for controller
import  express  from "express";
import  account  from "../models/account.js";

const  app  = express();

app.get("/ping", async (req, res) => {
    try {
        res.status(200).json({ message: "pong" });
    } catch (error) {
        res.status(500).send(error);
    }
});


export default app;
