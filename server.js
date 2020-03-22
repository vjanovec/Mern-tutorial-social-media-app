const express = require('express');
const app = express();

const PORT = process.env.PORT || 8000;
app.get('/', (req, res) => res.send('API running'));


// MONGO
// mongodb+srv://devconnector:9w7fYWpn543ddomg@devconnecter-sqr2h.mongodb.net/test?retryWrites=true&w=majority

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));