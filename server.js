const express = require('express');
const app = express();

const connectDb = require('./config/db');
// Connect database
connectDb()

// Init Middleware
app.use(express.json({extended: false}));


const PORT = process.env.PORT || 8000;
app.get('/', (req, res) => res.send('API running'));

// Define routes
app.use('/api/users/', require('./routes/api/users'));
app.use('/api/profile/', require('./routes/api/profile'))
app.use('/api/posts/', require('./routes/api/posts'))
app.use('/api/auth/', require('./routes/api/auth'))

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));