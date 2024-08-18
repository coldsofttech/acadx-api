require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const apiRoutes = require('./routes/api');

app.use('/api', apiRoutes);

app.listen(port, () => {
    console.log(`AcadX API running on http://localhost:${port}`);
});
