export default {
    development: {
        saml: {
            app: {
                name: 'Passport SAML',
                port: process.env.PORT || 3000,
                frontend_port: process.env.FRONTEND_PORT || 5173,
                database_host: process.env.DATABASE_HOST || 'localhost',
                database_port: process.env.DATABASE_PORT || 5432,
            },
            passport: {
                strategy: 'saml',
                saml: {
                    path: process.env.SAML_PATH || '/login/callback',
                    logoutUrl: process.env.SAML_LOGOUT_URL || 'https://openidp.feide.no/simplesaml/saml2/idp/SingleLogoutService.php',
                    entryPoint: process.env.SAML_ENTRY_POINT || 'https://openidp.feide.no/simplesaml/saml2/idp/SSOService.php',
                    issuer: process.env.SAML_ISSUER || 'passport-saml',
                    cert: process.env.SAML_CERT || null
                }
            }
        },
        local: {
            app: {
                name: 'Passport LOCAL',
                port: process.env.PORT || 3000,
                frontend_port: process.env.FRONTEND_PORT || 5173,
                database_host: process.env.DATABASE_HOST || 'localhost',
                database_port: process.env.DATABASE_PORT || 5432,
            },
            passport: {
                strategy: 'local'
            }
        }
    },

};