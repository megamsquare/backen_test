import express from 'express';
import transferController from '../controllers/transfer.controller.js';

const routes = express.Router();

routes.post('/', transferController.transfer_to)

export default routes;

