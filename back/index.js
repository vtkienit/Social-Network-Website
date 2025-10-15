import express from 'express';
import userRouter from './routes/users.js';
import connectDatabase from './database/connectDB.js';
import usersController from './controllers/users.js';
import authMiddleware from './middlewares/auth.js';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

connectDatabase.DB();

app.use('/users/add', usersController.createNewUser);

app.use('/users/login', authMiddleware.loginUser);

app.use('/users', authMiddleware.authenticate, userRouter);

app.use((req, res) => {
    res.status(404).send("Url không đúng!");
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000');
});
