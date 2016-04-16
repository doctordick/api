import async from 'async';
import jwt from 'jsonwebtoken';
import User from '../models/user';

export default (app) => {
  app.post('/login', (req, res) => {
    if(!req.body.email || !req.body.password){
      return res.status(422).send({
        error: 'Missing parameters.'
      });
    }
    async.waterfall([
      (callback) => {
        User.findOne({
          email: req.body.email 
        }).exec(callback);
      },
      (user, callback) => {
        if(!user){
          return callback({statusCode: 404, message: 'No user found.'})
        }
        if(user.validPassword(req.body.password)){
          callback(null, user);
        } else {
          callback({statusCode: 403, message: 'Invalid password.'})
        }
      }],
      (err, user) => {
        if(err) {
          return res.status(err.statusCode).send({
            error: err.message
          });
        }
        res.send({
          success: {
            user: user, 
            token: jwt.sign(user, process.env.TOKEN_SECRET, {
              expiresIn: '7d'
            })
          }
        })
      }
    );
  });
  
  app.post('/signup', (req, res) => {

  });
} 