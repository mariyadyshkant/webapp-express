const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const connection = require('./database/db.js');

function initialize(passport) {
    // strategia passport per il login
    passport.use('login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, function (email, password, done) {
        // Verifica se l'email esiste nel database
        connection.query('SELECT * FROM users WHERE email = ?', [email], function (err, results) {
            // Gestione errore DB
            if (err) return done(err);
            // Verifica se l'email è già registrata
            if (results.length === 0) return done(null, false, { message: 'Nessun utente trovato' });
            // Prendi l'utente dai risultati
            const user = results[0];
            // Confronta la password con la password hashata nel database
            // utilizzando il metodo bcrypt.compare()
            bcrypt.compare(password, user.password, function (err, isMatch) {
                // Gestione errore hash
                if (err) return done(err);
                // Verifica se la password è corretta
                // Se la password è corretta, restituisci l'oggetto utente
                // Se la password è errata, restituisci false al callback done
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Password errata' });
                }
            });
        });
    }));


    // Strategia di registrazione
    passport.use('register', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, email, password, done) {

        // Verifica se l'email è già registrata
        connection.query('SELECT * FROM users WHERE email = ?', [email], function (err, results) {
            // Gestione errore DB
            if (err) return done(err);
            // Verifica se l'email è già registrata
            if (results.length > 0) return done(null, false, { message: 'Email già registrata' });

            // Hash della password prima di memorizzarla
            bcrypt.hash(password, 10, function (err, hashedPassword) {
                // Gestione errore hash
                if (err) return done(err);

                // Crea un nuovo oggetto utente
                const newUser = {
                    username: req.body.username,
                    email: email,
                    password: hashedPassword
                };

                // Inserisci il nuovo utente nel database
                connection.query('INSERT INTO users SET ?', newUser, function (err, result) {
                    if (err) return done(err);
                    newUser.id = result.insertId;
                    // Restituisci il nuovo oggetto utente
                    // al callback done
                    return done(null, newUser);
                });
            });
        });
    }));


    // Serializzare l'utente
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // Deserializzare l'utente
    passport.deserializeUser(function (id, done) {
        connection.query('SELECT * FROM users WHERE id = ?', [id], function (err, results) {
            if (err) return done(err);
            done(null, results[0]);
        });
    });
}

module.exports = initialize;