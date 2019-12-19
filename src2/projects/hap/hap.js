import * as d3 from 'd3';
var MongoClient = require('mongodb').MongoClient;

function getMovie() {
  MongoClient.connect('mongodb://gorm:706403@167.71.6.65:27017', function(err, dbs) {
    if (err) throw err;
    var coll = dbs.db('hap').collection('hap')
    console.log(coll.find().sort({weightIndex:+1}).limit(1))
  })
}

d3.select('body')
  .append('button')
    .text('Happen on a movie!')
    .on('click', getMovie)
