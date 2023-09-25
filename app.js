const path = require('path');
const cors = require('cors');

const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const errorController = require('./controllers/error');

const User=require('./models/user');



const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

 const adminRoutes = require('./routes/admin');
 const shopRoutes = require('./routes/shop');
// const userRoutes = require('./routes/user');
// const expenseRoutes = require('./routes/expense');



app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use((req,res,next)=>{
    User.findById("650e8fd830acafc534c88d99")
    .then(user=>{
        req.user=user; 
        next();
    })
    .catch(err=>{
        console.log(err)
    });
    
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
// app.use(userRoutes);
// app.use(expenseRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://kamalesh5112:Kamal2000@cluster0.7yk6gtm.mongodb.net/shop?retryWrites=true&w=majority').then(result=>{
    console.log('Connected')
    User.findOne().then(user=>{
        if(!user){
            const user=new User({
                name:'Kamalesh',
                email:'Kamalesh@gmail.com',
                cart:{
                    items:[]
                }
            });
            user.save()
        }
    })
    
    app.listen(3000);
}).catch(err=>{
    console.log(err)
})



