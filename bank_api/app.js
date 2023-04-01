import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import auth_router from './routes/auth.route.js';
import transfer_router from './routes/transfer.route.js';
import account_route from './routes/account.route.js';
import authenticate_user from './middleware/auth.middleware.js';
import rete_limit from 'express-rate-limit';
import helmet from 'helmet';
import not_found from './middleware/not_found.middleware.js';
import caching from './db/connect_redis.js';

// Database
import db from './db/connect_db.js';

const port = process.env.PORT || 3500;

const app = express();

// Rate limiting
app.set('trust proxy', 1);
app.use(
    rete_limit({
        windowMs: 15 * 60 * 1000, // 15 minites
        max: 100, // limit each IP to 100 request per windowMS
        message: "You can't make any more requests at the moment. Try again later",
    })
);

app.use(express.json());
app.use(helmet())

// Routes
app.use('/api/v1/auth', auth_router);
app.use('/api/v1/transfer', authenticate_user.verify_token, authenticate_user.verify_permission('user'), transfer_router);
app.use('/api/v1/account', authenticate_user.verify_token, account_route);

app.use(not_found);

const start = async () => {
    try {
        await caching.connect_redis();
        await db(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`Server is listening to port ${port}...`);
        });
    } catch (error) {
        console.log(`server error: ${error}`);
    }
};

start();