import './hive.css';
import world from './ne_50m_land.json';
import cities from './cities.csv';
// import world from './110m.json';

import * as d3 from 'd3';
import * as topojson from 'topojson';
import * as d3Projections from 'd3-geo-projection';

var w = 800;
var h = 800;
var m = d3.min([w,h]);

var scale = d3.scalePow().exponent(0.5)
  .domain([0, d3.max(cities, function(d) {return d.population;})])
  .range([0,1]);

cities.sort(function(x,y) {
  return d3.descending(x.population, y.population);
});

var projection = d3.geoOrthographic()
  // .rotate([-7,-56,0]) //northwestern europe
  // .scale(2800);
  .rotate([-81,-27,0])
  .scale(1500);
var path = d3.geoPath().projection(projection);

var svg = d3.select('body').append('svg')
  .attr('id', 'svg')
  .attr('width', w)
  .attr('height', h);

svg.selectAll('path')
  .data(world.features)
  .enter().append('path')
  .attr('d', path)
  .attr('class', 'map');

var hexes = {
  "type": "FeatureCollection",
  "features": []
}

for (var d of cities) {
  var lat = d.latitude;
  var lon = d.longitude; 
  var pop = scale(d.population) * 2.5;
  var lonpop = pop * Math.cos(Math.PI / 3); 
  var latpop = pop * Math.sin(Math.PI / 3);
  var correction = Math.cos(lat*Math.PI/180);

  hexes.features.push({
    "type": "Feature",
    "properties": {"population": d.population},
    "geometry": {
      "type": "Polygon",
      "coordinates": [[
        [lon + (pop)/correction, lat],
        [lon + (lonpop)/correction, lat - latpop],
        [lon - (lonpop)/correction, lat - latpop],
        [lon - (pop)/correction, lat],
        [lon - (lonpop)/correction, lat + latpop],
        [lon + (lonpop)/correction, lat + latpop],
        [lon + (pop)/correction, lat]
      ]]
    }
  })
  // break;
}

svg.append('g')
  .attr('class', 'hexes')
  .selectAll('path .hex')
    .data(hexes.features)
    .enter().append('path')
    .attr('d', path)
    .attr('class', 'hex')
    // .style('opacity', function(d) {
    //   return scale(d.properties.population); 
    // });


// svg.append('g')
//   .attr('class', 'hexes')
//   .selectAll('g .hex')
//   .data(hexes.features)
//   .enter().append('g')
//   .each(function(d) {
//     svg.append('path')
//       .attr('d', path)
//       .attr('class', 'hex');
//   });