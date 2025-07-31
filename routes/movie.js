const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'List of movies' });
});

router.get('/:id', (req, res) => {
    const movieId = req.params.id;
    res.json({ message: `Details of movie with ID: ${movieId}` });
});

module.exports = router;