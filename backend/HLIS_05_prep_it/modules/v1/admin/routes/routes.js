const Admin = require('../controller/admin');  

const adminRoute = (app) => {
    app.post("/v1/admin/login", Admin.login_admin);
    app.post("/v1/admin/create-product", Admin.createProduct);
    app.post("/v1/admin/edit-product", Admin.editProduct);
    app.post("/v1/admin/delete-product", Admin.deleteProduct);
    app.post("/v1/admin/update-status", Admin.updateStatus);


    // ----------Get API's------------------
    app.get("/v1/admin/product-listing", Admin.productListing);
    app.get("/v1/admin/show-orders", Admin.showOrders);
    

};

module.exports = adminRoute;    


