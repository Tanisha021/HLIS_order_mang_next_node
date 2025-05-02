const User = require('../controller/user');  

const customerRoute = (app) => {

    app.post("/v1/user/signup", User.signUp);
    app.post("/v1/user/validate-otp", User.validateOTP);
    app.post("/v1/user/login", User.login);
    app.post("/v1/user/logout", User.logout);

    app.post("/v1/user/get-products-list", User.getProductsList);
    app.post("/v1/user/get-product-details/:id", User.getProductById);
    app.post("/v1/user/products-filter", User.itemFiltering);


    // app.post("/v1/user/show-all-blogs", User.showAllBlogs);
    // app.post("/v1/user/delete-blog", User.deleteBlog);
    // app.post("/v1/user/update-blog/:id", User.updateBlog);
    // app.post("/v1/user/get-tags", User.getTags);
    

};
   

module.exports = customerRoute;



