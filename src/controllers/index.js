import authRoutes from './auth';
import userRoutes from './user';
import geoLocation from './location';

export default (app) => {
  authRoutes(app);
  userRoutes(app);
  geoLocation(app);
};
