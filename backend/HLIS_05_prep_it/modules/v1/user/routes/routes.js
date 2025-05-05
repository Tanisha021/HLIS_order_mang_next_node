const User = require('../controller/user');  

const customerRoute = (app) => {

    // --------AUTH API's------------------

    app.post("/v1/user/signup", User.signUp);
    app.post("/v1/user/validate-otp", User.validateOTP);
    app.post("/v1/user/login", User.login);
    app.post("/v1/user/logout", User.logout);

    // ---------POST API's------------------
    
    app.post("/v1/user/get-product-details/:id", User.getProductById);
    app.post("/v1/user/products-filter", User.itemFiltering);
    app.post("/v1/user/add-to-cart", User.addToCart);
    app.post("/v1/user/place-order", User.placeOrder);
    app.post("/v1/user/add-delivery-address", User.addDeliveryAddress);
    app.post("/v1/user/update-profile", User.updateProfile);

    // --------GET API's------------------

    app.get("/v1/user/get-products-list", User.getProductsList);
    app.get("/v1/user/get-cart-items", User.getCartItems);
    app.get("/v1/user/get-user-info", User.getUserInfo);
    app.get("/v1/user/get-delivery-address", User.get_delivery_address);
    app.get("/v1/user/get-category-list", User.getCategoryList);

    

};
   

module.exports = customerRoute;



