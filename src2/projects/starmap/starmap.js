import './starmap.css';
import galaxy from './galaxy.svg';

import * as d3 from 'd3';

import data from './data.json';

var w = window.innerWidth;
var h = window.innerHeight;
var l = d3.min([w,h]) * 0.9;
var s = l/200;

var ciScale = d3.scaleLinear()
  .domain([d3.max(data, function(d) {return d.ci;}), d3.min(data, function(d) {return d.ci;})])
  .range([0,1]);

var absmagScale = d3.scaleLinear()
  .domain([d3.max(data, function(d) {return d.absmag;}), d3.min(data, function(d) {return d.absmag;})])
  .range([0,1]);

var svg = d3.select('body')
  .append('svg')
  .attr('viewBox', [0, 0, w, h]);
  // .attr('width', w)
  // .attr('height', h);

svg.selectAll('circle')
  .data([10,20,30,40,50,60,70,80,90])
  .enter().append('circle')
    .attr('class', 'distances')
    .attr('cx', w/2)
    .attr('cy', h/2)
    .attr('r', function(d) {
      return d * l/200;
    })

svg.selectAll('line')
  .data([80, 90])
  .enter().append('line')
    .attr('class', 'distlablines')
    .attr('x1', function(d) { return w/2 + d * l/200; })
    .attr('x2', function(d) { return w/2 + d * l/200; })
    .attr('y1', function(d) { return h/2; })
    .attr('y2', function(d) { return h/2 + 83 * l/200; })

svg.append('line')
  .attr('x1', function(d) { return w/2 + 80 * l/200; })
  .attr('x2', function(d) { return w/2 + 90 * l/200; })
  .attr('y1', function(d) { return h/2 + 83 * l/200; })
  .attr('y2', function(d) { return h/2 + 83 * l/200; })
  .style('stroke', '#888');

svg.append('text')
  .attr('class', 'label')
  .attr('x', w/2 + 85 * l/200)
  .attr('y', h/2 + 88 * l/200)
  .text('10 light-years')

svg.append('text')
  .attr('class', 'label')
  .attr('x', w/2) 
  .attr('y', h/2 + (106) * l/200 )
  .style('text-anchor', 'middle')
  .style('fill', '#333')
  .text('Data sources: https://github.com/astronexus/HYG-Database, http://phl.upr.edu/projects/habitable-exoplanets-catalog/data/database')

svg.append('text')
  .attr('class', 'label')
  .style('text-anchor', 'start')
  .attr('x', w/2 - 98 * l/200)
  .attr('y', l/17)
  .text('All known stars within 100 light-years, flattened to')

svg.append('text')
  .attr('class', 'label')
  .style('text-anchor', 'start')
  .attr('x', w/2 - 98 * l/200)
  .attr('y', l/17 + 4 * l/200)
  .text('the plane of the Milky Way, with the')

svg.append('text')
  .attr('class', 'label')
  .style('text-anchor', 'start')
  .attr('x', w/2 - 98 * l/200)
  .attr('y', l/17 + 8 * l/200)
  .text('distance from the Sun preserved.')

svg.append('text')
  .attr('class', 'label')
  .style('text-anchor', 'start')
  .attr('x', w/2 - 98 * l/200)
  .attr('y', l/17 + 12 * l/200)
  .text('Like a gently squashed')

svg.append('text')
  .attr('class', 'label')
  .style('text-anchor', 'start')
  .attr('x', w/2 - 98 * l/200)
  .attr('y', l/17 + 16 * l/200)
  .text('pincushion.')

svg.append('text')
  .attr('class', 'label')
  .style('text-anchor', 'end')
  .attr('x', w/2 + 98 * l/200)
  .attr('y', l/17)
  .text('Star systems with one or more habitable planets:')

svg.append('text')
  .attr('class', 'label')
  .style('text-anchor', 'end')
  .attr('x', w/2 + 92 * l/200)
  .attr('y', l/17 + 8 * l/200)
  .text('Conservative estimate:')

svg.append('circle')
  .attr('class', 'habitable')
  .attr('cx', w/2 + 96 * l/200)
  .attr('cy', l/17 + 7 * l/200)
  .attr('r', s*1.35) 

svg.append('text')
  .attr('class', 'label')
  .style('text-anchor', 'end')
  .attr('x', w/2 + 92 * l/200)
  .attr('y', l/17 + 12 * l/200)
  .text('Optimistic estimate:')

  svg.append('circle')
  .attr('class', 'habitablish')
  .attr('cx', w/2 + 96 * l/200)
  .attr('cy', l/17 + 11 * l/200)
  .attr('r', s*1.35)

svg.append('circle')
  .attr('cx', w/2)
  .attr('cy', h/2)
  .attr('r', s)
  .attr('class', 'sun');

svg.selectAll('circle')
  .data(data)
  .enter().append('circle')
    .attr('class', 'stars')
    .attr('cx', function(d) {
      return w/2 + Math.cos(d.rad + Math.PI/2 % (Math.PI*2)) * d.ly * l/200;
    })
    .attr('cy', function(d) {
      return h/2 - Math.sin(d.rad + Math.PI/2 % (Math.PI*2)) * d.ly * l/200;
    })
    .attr('r', function(d) { return Math.pow(20 - d.absmag, 2)/300 * s; })
    .attr('fill', function(d) {
      if (d.ci) {
        return d3.interpolateRdYlBu(ciScale(d.ci));
      } else {
        return d3.interpolateRdYlBu(absmagScale(d.absmag));
      }
    })
    .each(function(d, i, j) {
      if (d["H_1"] != null) {
        svg.append('circle')
          .attr('class', 'habitable')
          .attr('cx', function() {
            return w/2 + Math.cos(d.rad + Math.PI/2 % (Math.PI*2)) * d.ly * l/200;
          })
          .attr('cy', function() {
            return h/2 - Math.sin(d.rad + Math.PI/2 % (Math.PI*2)) * d.ly * l/200;
          })
          .attr('r', function() { return Math.pow(20 - d.absmag, 2)/300 * s + s * 1.5; });
      } else if (d["H_2"] != null) {
        svg.append('circle')
          .attr('class', 'habitablish')
          .attr('cx', function() {
            return w/2 + Math.cos(d.rad + Math.PI/2 % (Math.PI*2)) * d.ly * l/200;
          })
          .attr('cy', function() {
            return h/2 - Math.sin(d.rad + Math.PI/2 % (Math.PI*2)) * d.ly * l/200;
          })
          .attr('r', function() { return Math.pow(20 - d.absmag, 2)/300 * s + s * 1.5; });
      }
    });

d3.select('svg').append('g')
  .html(galaxy)
  .attr('class', 'galaxy');

const galaxyMap = d3.select('.galaxy svg')
  .attr('x', `${w/2 - l/2 + l/40}px`)
  .attr('y', `${h/2 + l/2 - l/12 - l/40}px`)
  .attr('width', l/12)
  .attr('height', l/12);

d3.select('svg').append('circle')
    .style('fill', "#fdb813")
    .attr('cx', w/2 - l/2 + l/40 + l/24)
    .attr('cy', h/2 + l/2 - l/12 - l/40 + l/24 + l/36)
    .attr('r', s)
    .attr('stroke', 'black')
    .attr('stroke-width', 5.5);