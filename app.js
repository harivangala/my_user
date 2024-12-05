const express = require('express');
require('dotenv').config();
const allRoutes = require('./routes/index');

const port = 3000;
const app = express();

app.use(express.json());
app.use('/app', allRoutes);

app.listen(port, () => {
    console.log(`Server running at port: ${port}`);
})