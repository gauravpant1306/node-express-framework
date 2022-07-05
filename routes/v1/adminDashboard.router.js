const {getCurrentUser}=require("../../middleware/getCurrentUser");
const adminDashboardController = require("../../controllers/adminDashboard/adminDashboard.controller");

let app;
let router;
module.exports=(injectedApp,injectedRouter)=>{
    app=injectedApp;
    router=injectedRouter;
    
    router.post('/add-insurer', app.oauth.authenticate(), adminDashboardController.addCompany);

    return router
}
