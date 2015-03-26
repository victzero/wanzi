var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
var config = require('../config');
var pool = require('./daonPool').pool;

var seedData = [{
  decade: '1970s',
  artist: 'Debby Boone',
  song: 'You Light Up My Life',
  weeksAtOne: 10
}, {
  decade: '1980s',
  artist: 'Olivia Newton-John',
  song: 'Physical',
  weeksAtOne: 10
}, {
  decade: '1990s',
  artist: 'Mariah Carey',
  song: 'One Sweet Day',
  weeksAtOne: 16
}];

console.log('starting')
pool.acquire(function(err, db) {
  if (err) {
    throw err;
  } else {
    var songs = db.collection('songs');

    // Note that the insert method can take either an array or a dict.

    songs.insert(seedData, function(err, result) {

      if (err) throw err;

      /*
       * Then we need to give Boyz II Men credit for their contribution
       * to the hit "One Sweet Day".
       */

      songs.update({
          song: 'One Sweet Day'
        }, {
          $set: {
            artist: 'Mariah Carey ft. Boyz II Men'
          }
        },
        function(err, result) {

          if (err) throw err;

          /*
           * Finally we run a query which returns all the hits that spend 10 or
           * more weeks at number 1.
           */

          songs.find({
            weeksAtOne: {
              $gte: 10
            }
          }).sort({
            decade: 1
          }).toArray(function(err, docs) {

            if (err) throw err;

            docs.forEach(function(doc) {
              console.log(
                'In the ' + doc['decade'] + ', ' + doc['song'] + ' by ' + doc['artist'] +
                ' topped the charts for ' + doc['weeksAtOne'] + ' straight weeks.'
              );
            });

            // Since this is an example, we 'll clean up after ourselves.
            songs.drop(function(err) {
              if (err) throw err;
            });
          });
        }
      );
    });
  }
});