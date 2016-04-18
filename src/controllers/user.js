import async from 'async';
import jwt from 'jsonwebtoken';
import User from '../models/user';

export default (app) => {
  app.get('/users', (req, res) => {
    User.find().exec(function(err, docs){
      if(docs && docs.length) {
        docs = docs.map((doc, index) => {
          doc.firstName = doc.decrypt(doc.firstName);
          doc.lastName = doc.decrypt(doc.lastName);
          doc.email = doc.decrypt(doc.email);
          return doc;
        });
      res.send(docs);
      } else if (!docs.length) {
        res.status(404).send('No users found.')
      } else {
        res.status(500).send('Error querying for users.')
      }
    });
  });
}
