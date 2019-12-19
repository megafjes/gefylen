import './giants.css';

import * as d3 from 'd3';
import * as topojson from 'topojson';
import * as d3Projections from 'd3-geo-projection';

import grid from './target.json';
import world from './110m.json';

const tau = Math.PI * 2;
const mmod = (n, m) => ((n % m) + m) % m;

const w = window.innerWidth;
const h = window.innerHeight;
const mapScale = Math.min(w, h)/(1.55);
const giantNumber = 200;
const giantRepresents = d3.sum(grid.map(v => d3.sum(v, d => (d > 0) ? d : 0))) / giantNumber;

const ranking = rank();

const projection = d3Projections.geoPeirceQuincuncial()
  .translate([mapScale/2+1,mapScale/2+1])
  .rotate([-20, -90, 0]) 
  .scale(mapScale*1.41/tau); 

const barHeights = d3.scaleSqrt(
  [0, d3.max(grid, d => d3.max(d))],
  [0, 3]);

const path = d3.geoPath()
  .projection(projection);

function rank() {
  const rows = grid.length;
  const cols = grid[0].length;
  const checkRange = 3; // Possible checkRange values: 3, 5, 9, 15
  // TODO: hierarchical method to find starting points. 
  // Recursive function checking if latlong bounding box contains less than giantRepresents
  // if so, return object with info
  // if not, call function for each of the four quadrants of the box.
  const metaGrid = Array.from(Array(rows/checkRange), (v, mrow) => {
    return Array.from(Array(cols/checkRange), (v, mcol) => {
      const checkGrid = Array.from(Array(checkRange), (v, crow) => {
        return Array.from(Array(checkRange), (v, ccol) => {
          const checkValue = grid[mrow * checkRange + crow][mcol * checkRange + ccol];
          return (checkValue >= 0) ? checkValue : 0;
        });
      });
      return {
        centroidRow: mrow * checkRange + Math.floor(checkRange/2),
        centroidCol: mcol * checkRange + Math.floor(checkRange/2),
        value: d3.sum(checkGrid.map(v => d3.sum(v)))
      };
    })
  });
  return metaGrid.flat()
    .sort((a,b) => d3.descending(a.value, b.value))
    .filter(v => v.value > 0)
    .slice(0,giantNumber);
}

const mostPopulatedSquare = grid.flat()
  .sort((a,b) => d3.descending(a, b))
  .slice(0,giantNumber);

console.log(mostPopulatedSquare)

const svg = d3.select('body')
  .append('svg')
  .attr('width', mapScale+2)
  .attr('height', mapScale+2); 

svg.append('rect')
  .attr('x', 1)
  .attr('y', 1)
  .attr('width', mapScale)
  .attr('height', mapScale)
  .attr('class', 'border');

svg.selectAll("path")
  .data(topojson.feature(world, world.objects.countries).features)
  .enter().append("path")
  .attr("d", path)
  .attr('class', 'map');

// svg.selectAll('g')
//   .data(grid)
//   .enter()
//   .append('g')
//     .selectAll('circle')
//     .data((d, i) => (d.map(x => ({'data': x, 'row': i }))))
//     .enter()
//     .append('circle')
//       .attr('cx', (d,i) => projection([i-180, 90-d.row])[0])
//       .attr('cy', (d,i) => projection([i-180, 90-d.row])[1])
//       .attr('r', d => {
//         if (d.data >= 0) {
//           return barHeights(d.data);
//         } else {
//           return 0;
//         }
//       });

svg.selectAll('path .starting-point')
  .data(ranking)
  .enter().append('path')
    .attr('d', d => {
      const x = d.centroidCol-180;
      const y = 90-d.centroidRow;
      console.log(projection([x, y]))
      const path = d3.path();
      path.moveTo(projection([x, y]));
      path.lineTo(projection([(x+181) % 360 - 180, y]));
      path.lineTo(projection([(x+181) % 360 - 180, (y+1) % 180]));
      path.lineTo(projection([x, (y+1) % 180]));
      path.closePath();
      return path;
    })
    .style('fill', (d,i) => d3.schemeTableau10[i%10])
    // .style('fill', (d,i) => d3.interpolateReds((giantNumber*2-i)/(giantNumber*2)));