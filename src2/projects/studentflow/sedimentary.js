import * as d3 from 'd3';
import * as d3Array from 'd3-array';

export function sedimentary() {
  const w = 1000;
  const h = 300;
  const smoothing = 0.25;

  const students = [];
  const cumulativeGround = new Map();
  for (let kull = 2006; kull <= 2019; kull++) {
    const activeStudentCount = new Map();
    let under;
    for (let year = kull + 0.5; year <= 2019; year += 0.5) {
      let remaining;
      if (year > kull + 5) {
        remaining = Math.floor(Math.random() * 100 / (year - kull));
      } else {
        remaining = Math.floor(Math.random() * 100) + 100;
      }
      activeStudentCount.set(year, remaining);
      under = (cumulativeGround.get(year)) === undefined ? 0 : cumulativeGround.get(year);
      cumulativeGround.set(year, remaining + under);
    }
    students.push({
      yearStarted: kull, 
      progression: activeStudentCount,
      cumulative: new Map(cumulativeGround)
    });
  }

  const x = d3.scaleLinear()
    .domain([d3.min(students.map(v => v.yearStarted))+0.5, 
      d3.max(students.map(v => v.yearStarted))])
    .range([0, w]);

  const y = d3.scaleLinear()
    .domain([0,  d3Array.greatest(cumulativeGround.values())])
    .range([h-14, 14]); // flipped
    
  const xExp = d3.scaleLinear().range([0, w]);
  const yExp = d3.scaleLinear().range([h-14, 14]);

  const svg = d3.select('body').append('svg')
    .attr('viewBox', [0, 0, w, h]);

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

  svg.selectAll('path .layer')
    .data(students)
    .enter().append('path')
      .attr('class', d => `layer clickable unexpanded ${d.yearStarted}`)
      .attr('d', drawStackLayer)
      .style('fill', (d, i) => d3.schemeTableau10[i%7])
      .style('stroke', (d, i) => d3.schemeTableau10[i%7])
      .on('click', function(d) {
        const graph = d3.select(this);
        if (graph.classed('clickable')) {
          if (graph.classed('unexpanded')) { 
            expand(d, graph);
          } else { 
            contract(d, graph); 
          }
        }
      });

  svg.selectAll('path .timeline')
    .data(students)
    .enter().append('path')
      .attr('class', 'timeline')
      .attr('d', d => drawTimelines(d, x, y));

  svg.selectAll('text .year-label')
    .data(students)
    .enter().append('text')
      .attr('class', 'year-label label')
      .attr('x', d => x(d.yearStarted + 0.5) + 5)
      .attr('y', h)
      .text(d => `${d.yearStarted.toString().slice(2)}/${(d.yearStarted + 1).toString().slice(2)}`);

  // svg.selectAll('text .stack-label')
  //   .data(Array.from(students[students.length - 1].cumulative.entries()))
  //   .enter().append('text')
  //     .attr('class', 'stack-label label')
  //     .attr('x', d => { 
  //       const xPos = x(d[0]);
  //       if (xPos < 10) {
  //         return 1;
  //       } else if (xPos > (w -10)) {
  //         return w - 1;
  //       } else {
  //         return xPos;
  //       }
  //     })
  //     .attr('y', d => y(d[1]) - 4)
  //     .text(d => d[1])
  //     .attr('text-anchor', d => {
  //       const xPos = x(d[0]);
  //       if (xPos < 10) {
  //         return 'start';
  //       } else if (xPos > (w -10)) {
  //         return 'end';
  //       } else {
  //         return 'middle';
  //       }
  //     })

  // TODOS
  
  // add numbers above the top of stack or expanded (somehow)

  // add invisible click layer
  
  // add custom gradients (test transition gradients first)

  function expand(d, graph) {
    const timelines = d3.selectAll('.timeline');
    xExp.domain([d.yearStarted + 0.5, d3.max(Array.from(d.progression.keys()))]);
    yExp.domain([0, d3.max(Array.from(d.progression.values()))]);
       
    graph.raise()
      .classed('unexpanded', false);

    svg.selectAll('.layer.unexpanded')
      .classed('clickable', false)
      .transition('graph-expand')
      .duration(500)
      .style('opacity', 0);

    graph.transition()
      .duration(500)
      .attr('d', drawExpandedLayer(d));
    
    timelines.raise()
      .each(function() {
        d3.select(this)
          .attr('d', p => drawTimelines(p, x, y, d, true))
          .transition('timeline')
          .duration(500)
          .attr('d', p => drawTimelines(p, xExp, yExp, d));
      });

    svg.selectAll('.year-label')
      .each(function() {
        d3.select(this)
          .transition()
          .duration(500)
          .attr('x', d => xExp(d.yearStarted + 0.5) + 5);
      });
  }

  function contract(d, graph) {
    const timelines = d3.selectAll('.timeline');

    graph.classed('unexpanded', true);

    svg.selectAll('.layer')
      .classed('clickable', true)
      .transition('graph-contract')
        .duration(500)
        .style('opacity', 1)

    graph.transition()
      .duration(500)
      .attr('d', drawStackLayer(d))

    timelines.raise()
      .each(function() {
        d3.select(this)
          .transition('timeline')
            .duration(500)
            .attr('d', p => drawTimelines(p, x, y, d, true))
          .transition('timeline')
            .duration(250)
            .attr('d', p => drawTimelines(p, x, y))
      })

    svg.selectAll('.year-label')
      .each(function() {
        d3.select(this)
          .transition()
          .duration(500)
          .attr('x', d => x(d.yearStarted + 0.5) + 5);
      });
  }

  function drawTimelines(d, xFunc, yFunc, expanded=null, limited=false) {
    const j = d.yearStarted + 0.5;
    if (d.cumulative.get(j)) {
      const path = d3.path();
      const lineX = xFunc(j) + 0.5;
      let top = yFunc(d.cumulative.get(j));
      let bottom = yFunc(0);
      if (limited && expanded.progression.has(j)) {
        top = yFunc(expanded.cumulative.get(j));
        bottom = yFunc(expanded.cumulative.get(j) - expanded.progression.get(j));
      } else if (expanded && expanded.progression.has(j)) {
        top = yFunc(expanded.progression.get(j));
      } else if (expanded) {
        return null;
      }

      path.moveTo(lineX, top);
      path.lineTo(lineX, bottom);
      return path;
    } else {
      return null;
    }
  }

  function drawExpandedLayer(d) {
    const tops = Array.from(d.progression.entries());
    const path = d3.path();
    const ground = yExp(0);
    let previous;
    tops.forEach((v, i) => {
      if (i === 0) {
        path.moveTo(xExp(v[0]), yExp(v[1]))
        path.lineTo(xExp(v[0]), yExp(v[1]))
      } else {
        path.bezierCurveTo(xExp(previous[0]+smoothing), yExp(previous[1]),
                           xExp(v[0]-smoothing), yExp(v[1]),
                           xExp(v[0]), yExp(v[1]));
      }
      previous = v;
    })
    path.lineTo(xExp(d3.max(Array.from(d.progression.keys()))), ground);
    tops.reverse().forEach((v,i) => {
      if (i === 0) {
        path.lineTo(xExp(v[0]), ground);
      } else {
        path.bezierCurveTo(xExp(previous[0]), ground, 
                           xExp(v[0]), ground, 
                           xExp(v[0]), ground);
      }
      previous = v;
    });
    path.closePath();
    return path;
  }

  function drawStackLayer(d) {
    const newStudents = d.progression.get(d.yearStarted+0.5);
    const startGround = d.cumulative.get(d.yearStarted+0.5) - newStudents;
    const endYear = d3.max(Array.from(d.progression.keys()));
    const xEnd = x(endYear);
    const endStudents = d.progression.get(endYear);
    const endGround = d.cumulative.get(endYear) - endStudents;
    const xStart = x(d.yearStarted+0.5);
    const tops = Array.from(d.cumulative.entries()).filter(v => v[0] > d.yearStarted);
    const bottoms = tops.map(v => [v[0], v[1] - d.progression.get(v[0])]);
    const path = d3.path();

    const curve = (a, p, previous, reverse=false) => {
      const s = reverse ? -smoothing : smoothing;
      return a.forEach((v, i) => {
        let r;
        if (i === 0) {
          r = p.lineTo(x(v[0]), y(v[1]));
        } else {
          r = p.bezierCurveTo(x(previous[0]+s), y(previous[1]), 
                              x(v[0]-s), y(v[1]), 
                              x(v[0]), y(v[1]));
        }
        previous = v;
        return r;
      });
    }

    if (tops.length) {
      path.moveTo(xStart, y(startGround + newStudents));
      curve(tops, path, [d.yearStarted+0.5, y(startGround + newStudents)]);
      path.lineTo(xEnd, y(endGround));
      curve(bottoms.reverse(), path, [endYear, y(endGround)], true);
      path.closePath();
    }
    return path;
  }
}
