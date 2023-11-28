function routes(app, config, passport) {

    const isLoggedIn = (req, res, next) => {
        if (req.isAuthenticated())
            return next();
        res.status(401).json({ error: 'Not authenticated' });
    };

    app.get('/api/saml/login',
    passport.authenticate(config.passport.strategy,
        {
            successRedirect: 'http://localhost:5173',
            failureRedirect: 'http://localhost:5173/login'
        })
    );

    app.post(config.passport.saml.path,
        passport.authenticate(config.passport.strategy,
            {
                failureRedirect: '/',
                failureFlash: true,
            }),
        function (req, res) {
            res.redirect('http://localhost:5173');
        }
    );

    app.get('/api/saml/logout/callback', passport.logoutSamlCallback);

    app.get('/api/saml/logout', isLoggedIn, passport.logoutSaml);

    app.post('/api/login', function (req, res, next) {
        passport.authenticate('local', (err, user, info) => {
            if (err)
                return next(err);
            if (!user)
                return res.status(401).json(info);
            req.logIn(user, err => {
                if (err)
                    return next(err);
                return res.json(req.user);
            })
        })(req, res, next);
    });

    app.delete('/api/logout', isLoggedIn, function (req, res) {
        req.logout(() => { res.end(); });
    });

    app.get('/api/session', function (req, res) {
        if (req.isAuthenticated())
            res.status(200).json(req.user);
        else
            res.status(401).json({ error: 'Unauthenticated user!' });
    });
}

export default function (app, config, passport, strategy) {
    if (strategy === 'saml' || strategy === 'local') {
        routes(app, config, passport);
    } else {
        throw new Error('Invalid passport strategy');
    }
}