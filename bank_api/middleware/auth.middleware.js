import jwt from 'jsonwebtoken';
import error from '../errors_handler/index.js';
import status_code from 'http-status';

function verify_token(req, res, next) {
    let token;
    const auth_header = req.headers.authorization;
    if (!auth_header || !auth_header.startsWith('Bearer')) {
        res.status(status_code.UNAUTHORIZED).json({ message: error.Unauthentication })
        return;
    }

    token = auth_header.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // attach user to routes
        req.user = { userId: payload.userId, role: payload.role }
        next();
    } catch (err) {
        res.status(status_code.UNAUTHORIZED).json({ message: error.Unauthentication });
        return;
    }
}

function verify_permission(role) {
    return (req, res, next) => {
        if (!role.includes(req.user.role)) {
            res.status(status_code.UNAUTHORIZED).json({ message: error.UnauthorizedRoute })
            return;
        }
        next();
    };
}

const auth = {
    verify_token,
    verify_permission
}

export default auth;