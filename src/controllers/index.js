import authRoutes from './auth';
import userRoutes from './user';

export default (app) => {
  authRoutes(app);
  userRoutes(app);
};
