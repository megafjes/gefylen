import * as d3 from 'd3';
import './style.css';
import Monkey from './mkk.jpg';

(function () {
  d3.select('body')
    .append('img')
      .attr('src', Monkey);
})()