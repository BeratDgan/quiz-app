import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

//cors middleware to allow cross-origin requests
app.use(cors());

// express.json() middleware to parse JSON bodies
app.use(express.json());

const PORT = process.env.PORT;

//Connect to MongoDB using the connection string from .env file
mongoose.connect(process.env.DB_CONN, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

//promise block to handle the connection
.then(() => {
    console.log('MongoDB connected successfully');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
}); 


//for checking server working
app.get('/', (req, res) => {
    res.send('API is running');
});

//listen requests coming from the port
//when the server starts, it will send a message to the console
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
