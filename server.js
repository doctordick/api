if(process.env.NODE_ENV !== 'production'){
  require('dotenv').load();
}
require('./src/config/mongoose');

import express from 'express';
import routes from './src/controllers/index';
import bodyParser from 'body-parser';
import http from 'http';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('port', (process.env.PORT || 5000));

routes(app);

// handle any route to ping the server
app.get('/ping', (req, res) => {
  res.send('pong');
});

const host = (process.env.NODE_ENV === 'production' ? 'drdick-api.herokuapp.com' : 'localhost')
const port = (process.env.NODE_ENV === 'production' ? null : app.get('port'));

// ping server every 30 seconds
setInterval(() => {
  const start = new Date().getTime();
  console.log('Pinging server...');
  http.get({
    host: host,
    path: '/ping',
    port: port
  }, (res) => {
    var body = '';
    res.on('data', function(chunk) {
      body += chunk;
    });
    res.on('end', function() {
      console.log(body);
      let responseTime = new Date().getTime() - start;
      console.log('Server response in', responseTime, 'milliseconds');
    });
  })
}, 30000);

app.listen(app.get('port'), () => {
  console.log('Listening on port', app.get('port'));
});
