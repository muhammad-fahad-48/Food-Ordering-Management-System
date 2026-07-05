const express = require('express');

const app = express();

app.use(express.json());
//frontend part
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));


//API starts here
//this include get post put and del api
require('./customerAPI')(app);
//get post del
require('./CategoriesAPI')(app);
//get post del
require('./restaurantAPI')(app);
//get post put del
require('./fooditemAPI')(app);
//get post put del
require('./customerOrdersAPI')(app);
//get post put
require('./paymentAPI')(app);

//these include only get api
require('./customerAddressAPI')(app);
require('./cartAPI')(app);
require('./cartItemAPI')(app);
require('./orderDetailAPI')(app);
require('./deliveryAgentAPI')(app);
require('./deliveryAPI')(app);
require('./reviewAPI')(app);
require('./adminAPI')(app);
require('./orderStatusAPI')(app);
require('./couponAPI')(app);


app.get('/', (req, res) => {
    res.send('Welcome to Online Food Ordering API');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});