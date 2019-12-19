import * as d3 from 'd3';

export function sedimentary() {
  const w = 1000;
  const h = 1000;

  const students = {};
  for (let kull = 2006; kull <= 2019; kull++) {
    students[kull.toString()] = {};
    for (let year = kull + 0.5; year <= 2019; year += 0.5) {
      let remaining;
      if (year > kull + 5) {
        remaining = Math.floor(Math.random() * 100 / (year - kull));
      }
      else {
        remaining = Math.floor(Math.random() * 100) + 100;
      }
      
      students[kull.toString()][year.toString()] = remaining;
    }
  }

  const years = Object.keys(students).map((v) => parseInt(v));
  const x = d3.scaleLinear()
    .domain([d3.min(years)-0.25, d3.max(years)+0.25])
    .range([0, w]);

  const simul = {}
  for (let kull in students) {
    for (let year in students[kull]) {
      if (year in simul) {
        simul[year] += students[kull][year];
      }
      else {
        simul[year] = students[kull][year];
      }
    }
  }
  const maxSimultaneousStudents = d3.max(Object.values(simul));

  const y = d3.scaleLinear()
    .domain([0, maxSimultaneousStudents])
    .range([0, h/2]);
  
  const yFlip = d3.scaleLinear()
    .domain([0, maxSimultaneousStudents])
    .range([h/4, 0]);

  const rounding = (x(d3.min(years) + 0.5) - x(d3.min(years)))/2;

  class Kull {
    constructor(kull) {
      this.yearStarted = Object.keys(kull)[0];
      this.mass = Object.entries(kull[this.yearStarted])
        .sort((x, y) => d3.ascending(parseFloat(x[0]), parseFloat(y[0])));
      this.path = this.pathMaker(this.mass);
    }

    pathMaker(m) {
      return;
    }
  }

  class Students {
    constructor(data) {
      this.data = data;
      this.kull = this.data.map(k => new Kull(k))
    } 
  }

  const svg = d3.select('body').append('svg')
    .attr('width', w)
    .attr('height', h);

  // const svgDefs = svg.append('defs');
  // const gradient = svgDefs.append('linearGradient')
  //   .attr('id', 'ageGradient')
  //   .attr('gradientUnits', 'userSpaceOnUse')
  //   .attr('spreadMethod', 'pad')
  //   .attr('x1', 0)
  //   .attr('x2', '50%')
  //   .attr('y1', 0)
  //   .attr('y2', 0);;

  // gradient.append('stop')
  //   .attr('class', 'stop-start')
  //   .attr('offset', '0');

  // gradient.append('stop')
  //   .attr('class', 'stop-end')
  //   .attr('offset', x(d3.min(years) + 5) - x(d3.min(years)));


  const ground = {};
  for (let kull in students) {
    ground[kull] = {};
    for (let year in students[kull]) {
      ground[kull][year] = 0;
    }
  }
  let previousKull = false;

  svg.selectAll('path')
    .data(d3.keys(students).sort(function(x, y) {
      return d3.ascending(parseInt(x), parseInt(y)); 
    }))
    .enter().append('path')
    .attr('class', 'layer')
    .attr('d', function(kull) {
      let str = '';
      let previousYear = false;
      for (let year of d3.keys(students[kull]).sort(function(x, y) {
        return d3.ascending(parseFloat(x), parseFloat(y));
      })) {
        if (previousKull == false) {
          ground[kull][year] = 0;
        } else {
          ground[kull][year] = ground[previousKull][year]
        }
        if (!(year in ground[kull])) { 
        }
        const current = students[kull][year];
        const below = ground[kull][year];

        if (str === '') {
          str += `M ${x(parseFloat(year)).toString()} ${yFlip(below).toString()} ` +
            // `C ${x(parseFloat(year)-0.25).toString()} ${yFlip(below).toString()}, ${x(parseFloat(year)-0.25).toString()} ${yFlip(below).toString()}, ${x(parseFloat(year-0.25)).toString()} ${yFlip(current/2 + below).toString()} ` +
            `C ${x(parseFloat(year)-0.25).toString()} ${yFlip(below).toString()}, ${x(parseFloat(year)-0.25).toString()} ${yFlip(current + below).toString()}, ${x(parseFloat(year)).toString()} ${yFlip(current + below).toString()} `;
        }

        // if (str === '') { 
        //   str += `M ${x(parseFloat(year)).toString()} ${yFlip(below).toString()} ` +
        //     `L ${x(parseFloat(year)).toString()} ${yFlip(current + below).toString()} `;
        // }
        else {
          str += `C ${(x(parseFloat(previousYear))+rounding).toString()} ${yFlip(ground[kull][previousYear]).toString()}, `+
            `${(x(parseFloat(year))-rounding).toString()} ${yFlip(current + below).toString()}, `+
            `${x(parseFloat(year)).toString()} ${yFlip(current + below).toString()}`;
        }
        previousYear = year;
        ground[kull][year] += current;
      }
      previousYear = false;
      for (let year of d3.keys(ground[kull]).sort((x, y) => {
        return d3.descending(parseFloat(x), parseFloat(y));
      })) {
        if (previousKull === false) {
          str += `L ${x(parseFloat(year)).toString()} ${yFlip(0).toString()} `;
        }
        else {
          if (previousYear === false) {
            str += `L ${x(parseFloat(year)).toString()} ${yFlip(ground[previousKull][year]).toString()}`;
          }
          else {
            str += `C ${(x(parseFloat(previousYear))-rounding).toString()} ${yFlip(ground[previousKull][previousYear]).toString()}, ` +
              `${(x(parseFloat(year))+rounding).toString()} ${yFlip(ground[previousKull][year]).toString()}, ` +
              `${x(parseFloat(year)).toString()} ${yFlip(ground[previousKull][year]).toString()}`;
          }
        }
        previousYear = year;
      } 

      previousKull = kull;

      return str;
    })
    .style('fill', (d, i) => d3.schemeTableau10[i%7]);
}
