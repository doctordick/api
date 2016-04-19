import async from 'async';
import request from 'request';
export default (app) => {
  app.get('/locations', (req, res) => {
    let keyword = req.query.keyword || 'std test';
    let results = [];

    if (!req.query.location) {
      return res.status(422).send('Missing parameter.');
    }


    async.waterfall([
      (callback) => {
        let placesApi = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=" + process.env.PLACES_API_KEY + "&location=" + req.query.location + "&radius=10000&keyword=" + keyword;
        request(placesApi, (err, res, body)=>{
          if(err){
            return callback({ statusCode: 500, message: 'Error requesting Google API.'});
          }
          callback(null, res, body);
        });
      }, (res, body, callback) => {
        try {
          body = JSON.parse(body);
        } catch (err) {
          callback({ statusCode: 502, message: 'Error parsing Google API response.'});
        }
        async.eachLimit(body.results, 10, (place, cb) => {
          let detailsApi = "https://maps.googleapis.com/maps/api/place/details/json?placeid=" + place.place_id + "&key=" + process.env.PLACES_API_KEY;
          request(detailsApi, (err, res, body) => {
            if (err) {
              console.log(err.stack);
              return cb();
            }
            try {
              body = JSON.parse(body);
            } catch (err) {
              console.log(err.stack);
              return cb();
            }
            if(!body.result.geometry || !body.result.geometry.location){
              return cb();
            } 
            let result = { id: body.result.id, name: body.result.name, location: body.result.geometry.location, address: body.result.formatted_address, phoneNumber: body.result.formatted_phone_number};
            if(body.result.opening_hours){
              if(body.result.opening_hours.open_now){
                result.open = body.result.opening_hours.open_now;
              }
              if(body.result.opening_hours.weekday_text){
                result.weekdayText = body.result.opening_hours.weekday_text;
              }
            };

            results.push(result);
            cb();
          });
        }, callback);
      }
    ], (err) => {
      if (err) {
        return res.status(err.statusCode).send(err.message);
      }
      res.send(results);
    });
  });
}
