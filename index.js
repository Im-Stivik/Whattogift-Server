import bp from "body-parser";
import express from "express";
import mongoose from "mongoose";

const app = express();

app.use(bp.urlencoded({extended:false}));
app.use(bp.json());

const mongoUrl = "mongodb+srv://whattogift-user:Mkp5WGrms4P816po@cluster0.m9pscxs.mongodb.net/whattogiftdb?retryWrites=true&w=majority";

const port = 3001;

//connect the controller to the app
import accountRouter from "./controllers/account.js";
app.use("/account", accountRouter);

import companyRouter from "./controllers/company.js";
app.use("/company", companyRouter);

mongoose.connect(mongoUrl)
.then(result => {
    console.log(result);
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    }
    );
})
.catch(error => {console.log(error)});

