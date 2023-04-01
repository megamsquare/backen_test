import express from 'express';
import accountController from '../controllers/account.controller.js';
import authenticate_user from '../middleware/auth.middleware.js';

const routes = express.Router(); 

routes.get('/balance', authenticate_user.verify_permission('user'), accountController.get_balance);
routes.get('/get_all', authenticate_user.verify_permission('admin'), accountController.get_all_acct);

export default routes;

