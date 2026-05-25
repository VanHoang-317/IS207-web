const dotenv = require('dotenv');
dotenv.config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log("🔥 LISTEN CALLBACK FIRED");
    console.log(`Mode: ${process.env.NODE_ENV}`);
    console.log(`Port: ${PORT}`);
});
