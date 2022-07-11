const {getCurrentUser}=require("../../middleware/getCurrentUser");
const customerDashboardController = require("../../controllers/dashboard/customerDashboard.controller");

let app;
let router;
module.exports=(injectedApp,injectedRouter)=>{
    app=injectedApp;
    router=injectedRouter;
    
    router.get('/', app.oauth.authenticate(),getCurrentUser(), customerDashboardController.viewCustomerDashboard);

    router.get('/add-data', app.oauth.authenticate(), customerDashboardController.addData);

    return router
}
