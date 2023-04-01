import express from 'express';
import authController from '../controllers/auth.controller.js';

const routes = express.Router();

routes.post('/sign_up', authController.sign_up);
routes.post('/sign_in', authController.sign_in);
routes.post('/refresh', authController.refresh_token);

export default routes;