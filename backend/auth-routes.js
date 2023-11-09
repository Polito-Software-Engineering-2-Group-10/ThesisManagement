function samlroutes(app, config, passport) {
    /// THESE ARE STILL WIP
    app.get('/login',
        passport.authenticate(config.passport.strategy,
            {
                successRedirect: '/',
                failureRedirect: '/login'
            })
    );

    app.post(config.passport.saml.path,
        passport.authenticate(config.passport.strategy,
            {
                failureRedirect: '/',
                failureFlash: true
            }),
        function (req, res) {
            res.redirect('/');
        }
    );

    app.get('/logout/callback', passport.logoutSamlCallback);

    app.get('/logout', passport.logoutSaml);

};

function localroutes(app, config, passport) {

    const isLoggedIn = (req, res, next) => {
        if (req.isAuthenticated())
            return next();
        res.status(401).json({ error: 'Not authenticated' });
    };

    app.post('/login', function (req, res, next) {
        passport.authenticate(config.passport.strategy, (err, user, info) => {
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

    app.delete('/logout', isLoggedIn, function (req, res) {
        req.logout(() => { res.end(); });
    });

    app.get('/session', function (req, res) {
        if (req.isAuthenticated())
            res.status(200).json(req.user);
        else
            res.status(401).json({ error: 'Unauthenticated user!' });
    });
}

export default function (app, config, passport, strategy) {
    if (strategy === 'saml') {
        samlroutes(app, config, passport);
    } else if (strategy === 'local') {
        localroutes(app, config, passport);
    } else {
        throw new Error('Invalid passport strategy');
    }
}