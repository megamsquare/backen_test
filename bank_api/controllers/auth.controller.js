import auth_model from '../models/user.model.js';
import status_code from 'http-status';
import error from '../errors_handler/index.js';
import account_model from '../models/account.model.js';
import crypto from 'crypto';
import token from '../models/token.model.js';
import jwt from 'jsonwebtoken';
import cache from '../db/connect_redis.js';

async function sign_up(req, res) {
    // Varriable to hold account created
    let account_details;

    // Checking if Email exists, throw error if it exists
    const emailAlreadyExists = await auth_model.findOne({ email: req.body.email });
    if (emailAlreadyExists) {
        res.status(status_code.BAD_REQUEST).json({ message: error.EmailExists });
        return;
    }

    // Checking if Username exists, throw error if it exists
    const usernameAlreadyExists = await auth_model.findOne({ username: req.body.username });
    if (usernameAlreadyExists) {
        res.status(status_code.BAD_REQUEST).json({ message: error.UsernameExists });
        return;
    }

    // Saving user information
    const user = await auth_model.create({ ...req.body });

    // Creating account object to save
    const save_account = {
        userId: user._id,
        preAmount: 0,
        curraMount: 1000000
    }

    if (user) {
        // Saving user account details
        account_details = await account_model.create({ ...save_account });
    }

    //return defined details as json response for user
    res.status(status_code.CREATED).json({ data: { user, account: account_details } });
}

async function sign_in(req, res) {
    const { email, password } = req.body;
    const isRefresh = {};
    let refreshToken;
    let existingToken;
    if (!email || !password) {
        res.status(status_code.BAD_REQUEST).json({ message: error.ProvideLoginDetails });
        return;
    }

    const user = await auth_model.findOne({ email });
    if (!user) {
        res.status(status_code.BAD_REQUEST).json({ message: error.InvalidEmail });
        return;
    }

    const is_password_correct = await user.comparePassword(password);
    if (!is_password_correct) {
        res.status(status_code.BAD_REQUEST).json({ message: error.InvalidPassword });
        return;
    }

    isRefresh.check = false;

    const access_token = await user.create_jwt(isRefresh);

    const refresh_cache = await cache.redis_client.get(user.username);

    if (refresh_cache) {
        existingToken = JSON.parse(refresh_cache);
    } else {
        existingToken = await token.findOne({ userId: user._id });
    }

    if (existingToken) {
        await cache.redis_client.set(user.username, JSON.stringify(existingToken), {
            EX: 60 * 60 * 24,
            NX: true
        });
        if (!existingToken.isValid) {
            res.status(status_code.UNAUTHORIZED).json({ message: 'Your token is invalid' })
            return;
        }
        isRefresh.check = true;
        isRefresh.refreshToken = existingToken.refreshToken;
        const refreshJWT = await user.create_jwt(isRefresh);
        res.status(status_code.OK).json({
            data: { firstName: user.firstName, lastName: user.lastName },
            access_token: access_token,
            refreshToken: refreshJWT
        });
        return;
    }

    refreshToken = crypto.randomBytes(40).toString('hex');
    const userToken = { userId: user._id, refreshToken: refreshToken };

    const saved_refresh = await token.create(userToken);

    if (saved_refresh) {
        await cache.redis_client.set(user.username, JSON.stringify(saved_refresh), {
            EX: 60 * 60 * 24,
            NX: true
        });
    }

    isRefresh.check = true;
    isRefresh.refreshToken = refreshToken;

    const refreshJWT = await user.create_jwt(isRefresh)

    res.status(status_code.OK).json({
        data: { firstName: user.firstName, lastName: user.lastName },
        access_token: access_token,
        refreshToken: refreshJWT
    });
}

async function refresh_token(req, res) {
    const { refreshToken } = req.body;
    let user_refresh;
    if (!refreshToken) {
        res.status(status_code.BAD_REQUEST).json({ message: error.RefreshTokenExists });
        return;
    }

    try {
        const isRefresh = {};
        const payload = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET_KEY);
        const user = await auth_model.findOne({ _id: payload.userId })
        isRefresh.check = false;
        const access_token = await user.create_jwt(isRefresh);
        const refresh_cache = await cache.redis_client.get(payload.username);
        if (refresh_cache) {
            user_refresh = JSON.parse(refresh_cache);
        } else {
            user_refresh = await token.findOne({ userId: payload.userId });
            await cache.redis_client.set(payload.username, JSON.stringify(user_refresh), {
            EX: 60 * 60 * 24,
            NX: true
        });
        }

        if (!user_refresh.isValid || user_refresh.refreshToken !== payload.refresh) {
            res.status(status_code.UNAUTHORIZED).json({ message: 'Your token is invalid' });
        }
        isRefresh.check = true;
        isRefresh.refreshToken = user_refresh.refreshToken;
        const refreshJWT = await user.create_jwt(isRefresh);
        res.status(status_code.OK).json({
            data: { firstName: user.firstName, lastName: user.lastName },
            access_token: access_token,
            refreshToken: refreshJWT
        });
        return;
    } catch (err) {
        console.log(err);
        res.status(status_code.UNAUTHORIZED).json({ message: err })
    }
}

const authController = {
    sign_up,
    sign_in,
    refresh_token
};

export default authController;