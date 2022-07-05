const authController = require("../../controllers/auth/auth.controller");

let app;
let router;
module.exports=(injectedApp,injectedRouter)=>{
    app=injectedApp;
    router=injectedRouter;
    
    router.post('/register', authController.createUser);

    router.get('/test', function (req, res) {
        res.send("query string aaa found");
    });

    router.post('/forgot-password', authController.forgotPassword);

    router.post('/reset-password', authController.resetPassword);
    
    router.all('/token',app.oauth.token());

    return router
}

