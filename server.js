const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
// const HOST = process.env.HOST || 'localhost';

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
