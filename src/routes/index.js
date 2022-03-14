import express from 'express'
import apiRoutes from '../components/routes';

const Router = express.Router();

Router.use('/api/v1', apiRoutes);

export default Router
