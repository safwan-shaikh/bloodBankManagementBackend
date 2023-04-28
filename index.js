const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser')
const cors = require('cors');

const app = express();

//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors());



app.listen(8080, () => {
    console.log('Server started on port 8080');
});
