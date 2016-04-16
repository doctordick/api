if(process.env.NODE_ENV !== 'production'){
  require('dotenv').load();
}
require('./src/config/mongoose');

import express from 'express';
import routes from './src/controllers/index';
import bodyParser from 'body-parser'

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('port', (process.env.PORT || 5000));

routes(app);

app.listen(app.get('port'), () => {
  console.log('Listening on port', app.get('port'));
});
