const express = require('express');
const app = express();
const connection = require('./database/connection');

const PORT = process.env.PORT || 3000;
// const HOST = process.env.HOST || 'localhost';

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to your Express server!',
        status: 'Server is running successfully'
    });
});