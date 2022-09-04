const express = require("express");

const app = express();

//set static folder
app.use(express.static("public"));

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port ${port}`));