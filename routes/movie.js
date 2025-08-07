const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

router.get('/', movieController.indexMovies);
router.get('/:id', movieController.showMovie);
router.post('/:id', movieController.addReview);
// router.get('/:id/reviews', movieController.reviewsMovie);

module.exports = router;