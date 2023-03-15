const express = require("express");
const cors = require("cors");
const app = express();
const routes = require('./routes/routes');
require('dotenv').config();

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use("/", routes);

const port = process.env.PORT || 3004

app.listen(port, () => {
    console.log(`open at ${port}`);
    console.log(`IF DEPLOY MAKE SURE THE ENV IS UPDATED! \n${process.env.apiUrl}`)
});
