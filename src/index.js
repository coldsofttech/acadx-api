require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
    origin: process.env.FRONT_END_DOMAIN,
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

const routes = require('./routes/api');

app.use('/v1/api', routes);

app.listen(port, () => {
    console.log(`AcadX API running on http://localhost:${port}`);
});
