import './mapmaker.css';
import world from './110m.json';

import * as d3 from 'd3';
import * as rough from './roughjs/rough.umd';
import * as topojson from 'topojson';
import * as d3Projections from 'd3-geo-projection';

var w = 800;
var h = 800;
var m = d3.min([w,h]);

var projection = d3Projections.geoPolyhedralWaterman(); 
var path = d3.geoPath().projection(projection);

d3.select('body').append('svg')
  .attr('id', 'svg')
  .attr('width', w)
  .attr('height', h);

var svg = document.getElementById('svg');

var rsvg = rough.svg(svg); 

svg.append(rsvg.rectangle(0,0,w,h, {
  stroke: 'none',
  roughness: 0.5,
  fill: '#333',
  fillStyle: 'hachure',
}));

var countries = topojson.feature(world, world.objects.countries).features;

for (let feature of countries) {
  svg.appendChild(rsvg.path(path(feature), {
    roughness: 0.5,
    fill: '#fff',
    fillStyle: 'solid',
    simplification: 0.1,
    stroke: 'none'
  }));
}

// for (let feature of countries) {
//   svg.appendChild(rsvg.path(path(feature), {
//     roughness: 0.5,
//     fill: '#333',
//     fillStyle: 'solid', 
//     fillWeight: 1,
//     // hachureAngle: 41,
//     simplification: 0.1,
//   }));
// }