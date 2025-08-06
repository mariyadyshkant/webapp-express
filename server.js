const express = require('express');
const app = express();
const connection = require('./database/connection');
const movieRoutes = require('./routes/movie');

const session = require('express-session');
const passport = require('passport');
const initializePassport = require('./auth/passport-config');


const cors = require('cors');
const PORT = process.env.PORT || 3000;
// const HOST = process.env.HOST || 'localhost';

app.use(cors(
    // {
    //     origin: 'http://localhost:3000', // Allow all origins for simplicity, adjust as needed
    //     methods: ['GET', 'POST', 'PUT', 'DELETE'],
    //     allowedHeaders: ['Content-Type', 'Authorization'],
    //     credentials: true // Allow credentials if needed
    // }
));

// chiama la funzione initialize che abbiamo creato nel file passport-config.js
initializePassport(passport);

// Configura il middleware express-session
app.use(session({
    secret: 'your_secret_key', // sostituisci con una chiave segreta inventata
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // imposta su true se utilizzi https
}));

// Inizializza il middleware Passport.js
app.use(passport.initialize());
// Inizializza il middleware della sessione Passport.js
app.use(passport.session());


app.use(cors({
    origin: 'http://localhost:5175', // Consenti richieste dalla tua app React
    credentials: true, // Consenti credenziali (cookie, intestazioni di autorizzazione, ecc.)
}));


app.use(express.json());
app.use('/api/movies', movieRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to your Express server!',
        status: 'Server is running successfully'
    });
});



app.post('/register', passport.authenticate('register'), function (req, res) {
    res.json({ message: 'Registrazione riuscita', user: req.user });
});

app.post('/login', passport.authenticate('login'), function (req, res) {
    res.json({ message: 'Login riuscito', user: req.user });
});