const connection = require('../database/connection');

function indexMovies(req, res) {
    const sql = 'SELECT * FROM movies';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching movies:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
}

function showMovie(req, res) {
    const movieId = req.params.id;
    const sqlMovie = 'SELECT * FROM movies WHERE id = ?';
    const sqlReviews = 'SELECT * FROM reviews WHERE movie_id = ?';

    connection.query(sqlMovie, [movieId], (err, results) => {
        if (err) {
            console.error('Error fetching movie details:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        const movie = results[0];

        connection.query(sqlReviews, [movieId], (err, results) => {
            if (err) {
                console.error('Error fetching reviews:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'No reviews found for this movie' });
            }
            movie.reviews = results;
            res.json(movie);
        });
    });
}

// function reviewsMovie(req, res) {
//     const movieId = req.params.id;
//     const sql = 'SELECT * FROM reviews WHERE movie_id = ?';

//     connection.query(sql, [movieId], (err, results) => {
//         if (err) {
//             console.error('Error fetching reviews:', err);
//             return res.status(500).json({ error: 'Database error' });
//         }
//         if (results.length === 0) {
//             return res.status(404).json({ error: 'No reviews found for this movie' });
//         }
//         res.json(results);
//     });
// }

module.exports = {
    indexMovies,
    showMovie
};