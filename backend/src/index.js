const express = require ("express");
const cookieParser = require("cookie-parser");
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());

//Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});



//routes
app.use('/api/sessions', require('../routes/session.route'));
app.use('/api/users', require('../routes/user.route'));
app.use('/api/auth', require('../routes/auth.route'));


const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Listening on port ${PORT}`));

