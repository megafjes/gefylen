import * as d3 from 'd3';

export function test() {
  var w = 1000;
  var h = 1000;

  var sx = 100;
  var sy = 50;
  var v = 100;
  var d = 300;
  var b = d/2;

  function calc() {
    return v/20 + d/150;
  }

  var o = calc();

  var svg = d3.select('body').append('svg')
    .attr('width', w)
    .attr('height', h);

  svg.append('path')
    .attr('class', 'line')
    .attr('d', `M ${sx} ${sy} C ${sx+b+o} ${sy}, ${sx+d-b+o} ${sy+v}, ${sx+d} ${sy+v}`);

  sy = 70;
  svg.append('path')
    .attr('class', 'line')
    .attr('d', `M ${sx} ${sy} C ${sx+b-o} ${sy}, ${sx+d-b-o} ${sy+v}, ${sx+d} ${sy+v}`);

  sy = 100;
  d = 100;
  var b = d/2;
  var o = calc();

  svg.append('path')
    .attr('class', 'line')
    .attr('d', `M ${sx} ${sy} C ${sx+b+o} ${sy}, ${sx+d-b+o} ${sy+v}, ${sx+d} ${sy+v}`);

  sy = 120;
  svg.append('path')
    .attr('class', 'line')
    .attr('d', `M ${sx} ${sy} C ${sx+b-o} ${sy}, ${sx+d-b-o} ${sy+v}, ${sx+d} ${sy+v}`);


  sy = 200;
  v = 200;
  var b = d/2;
  var o = calc();

  svg.append('path')
    .attr('class', 'line')
    .attr('d', `M ${sx} ${sy} C ${sx+b+o} ${sy}, ${sx+d-b+o} ${sy+v}, ${sx+d} ${sy+v}`);

  sy = 220;
  svg.append('path')
    .attr('class', 'line')
    .attr('d', `M ${sx} ${sy} C ${sx+b-o} ${sy}, ${sx+d-b-o} ${sy+v}, ${sx+d} ${sy+v}`);
}