import async from 'async';
import jwt from 'jsonwebtoken';
import User from '../models/user';

export default (app) => {
  app.post('/login', (req, res) => {
    if (!req.body.email || !req.body.password) {
      return res.status(422).send({
        error: 'Missing parameters.'
      });
    }
    async.waterfall([
        (callback) => {
          User.findOne({
            email: req.body.email
          }).exec(function(err, doc){
            if(err){
              return callback({statusCode: 500, message: 'Error querying for user.'})
            }
            callback(null, doc);
          });

        },
        (user, callback) => {
          if (!user) {
            return callback({ statusCode: 404, message: 'No user found.' })
          }
          if (user.validPassword(req.body.password)) {
            callback(null, user);
          } else {
            callback({ statusCode: 403, message: 'Invalid password.' })
          }
        }
      ],
      (err, user) => {
        if (err) {
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
      });
  });

  app.post('/signup', (req, res) => {
    if (!req.body.email || !req.body.password || !req.body.firstName || !req.body.lastName) {
      return res.status(422).send({
        error: 'Missing parameters.'
      });
    }
    async.waterfall([
        (callback) => {
          let user = new User({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName
          });
          user.password = user.generateHash(req.body.password);
          user.save((err, doc) => {
            // status code for taken email
            if (err) {
              if (err.code === 11000) {
                return callback({ statusCode: 409, message: 'This email is already taken.' })
              } else {
                return callback({ statusCode: 500, message: 'Error saving user.' })
              }
            }
            callback(null, doc);
          });
        }
      ],
      (err, user) => {
        if (err) {
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
      });
  });
}
