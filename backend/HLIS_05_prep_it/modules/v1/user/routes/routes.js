const User = require('../controller/user');  

const customerRoute = (app) => {

    app.post("/v1/user/signup", User.signUp);
    app.post("/v1/user/validate-otp", User.validateOTP);
    app.post("/v1/user/login", User.login);
    app.post("/v1/user/logout", User.logout);

    app.get("/v1/user/get-products-list", User.getProductsList);
    app.post("/v1/user/get-product-details/:id", User.getProductById);
    app.post("/v1/user/products-filter", User.itemFiltering);
    app.get("/v1/user/get-category-list", User.getCategoryList);
    app.post("/v1/user/add-to-cart", User.addToCart);
    app.get("/v1/user/get-cart-items", User.getCartItems);
    app.post("/v1/user/place-order", User.placeOrder);
    app.post("/v1/user/add-delivery-address", User.addDeliveryAddress);


    // app.post("/v1/user/show-all-blogs", User.showAllBlogs);
    // app.post("/v1/user/delete-blog", User.deleteBlog);
    // app.post("/v1/user/update-blog/:id", User.updateBlog);
    // app.post("/v1/user/get-tags", User.getTags);
    

};
   

module.exports = customerRoute;



