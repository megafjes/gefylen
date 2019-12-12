import "./experiments.css";
import * as d3 from 'd3';

const tau = Math.PI * 2;
const w = 400;
const h = 400;
var colors = d3.scaleOrdinal(d3.schemeYlOrBr[3]);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(function () {
  
  const flex = d3.select('body')
    .append("div")
      .attr("class", "container")
    .append("div")
      .attr("class", "flex")

  const svgs = Array.from(d3.range(4), function() {
    return flex.append("div")
        .attr("class", "svg")
      .append('svg')
        .attr('width', 400)
        .attr('height', 400);  
  })
  
  asteroids(svgs[0]);
  beeswarm(svgs[1]);
})()

function asteroids(svg) {
  var dataset = Array.from(d3.range(100), function(d) { return {name: d}} );
  
  var mouse;

  svg.on("mousemove", function () {
    mouse = d3.mouse(this);
  })

  var asteroidSim = d3.forceSimulation(dataset)
    .alphaDecay(0)
    .force("test", d3.forceRadial(100))
    .force("charge", d3.forceManyBody().strength(-0.8))
    .force("orbit", function() {
      for (var i = 0, n = dataset.length, node, k = 0.002; i < n; i++) {
        node = dataset[i];
        node.vx += node.y * k;
        node.vy -= node.x * k;
      }
    })
    .force("mouse", function() {
      for (var i = 0, n = dataset.length, node, k = 1; i < n; i++) {
        node = dataset[i];
        if (mouse) {
          var distance = Math.hypot(mouse[0]-w/2 - node.x, mouse[1]-h/2 - node.y);
          if (distance < 20) {
            node.vx += -k * (mouse[0]-w/2 - node.x)/distance;
            node.vy += -k * (mouse[1]-h/2 - node.y)/distance;
          }
        }
      }
    });
  
  var nodes = svg.append("g")
      .attr("transform", `translate(${w/2} ${h/2})`)
    .selectAll("circle")
    .data(dataset)
    .enter()  
    .append("circle")
      .attr("r", 2)
      .style("fill", "black")

  asteroidSim.on("tick", function() {
    nodes.attr("cx", function(d) { return d.x })
         .attr("cy", function(d) { return d.y });
  })
}

async function beeswarm(svg) {
  var bee; 
  var direction = Math.random() * tau;

  var dataset = Array.from(d3.range(100), function(d) { return {name: d}});

  var beeswarmSim = d3.forceSimulation(dataset)
    .alphaDecay(0)
    .force("charge", d3.forceManyBody().strength(0.11))
    .force("collision", d3.forceCollide(8))
    .force("center", d3.forceCenter().x(0).y(0))
    .force("walk", function() {
      if (bee) {
        direction += (Math.random()-0.5) * 0.1 * tau;
        bee.fx = bee.x + Math.cos(direction);
        bee.fy = bee.y + Math.sin(direction); 
      }
    })

  var nodes = svg.append("g")
      .attr("transform", `translate(${w/2} ${h/2})`)
    .selectAll("circle")
    .data(dataset)
    .enter()  
    .append("circle")
      .attr("class", "bee")
      .attr("r", 5)
      .attr("fill", function (d,i) { return colors(Math.floor(Math.random()*3)) });

  beeswarmSim.on("tick", function() {
    nodes.attr("cx", function(d) { return d.x })
      .attr("cy", function(d) { return d.y });
  })

  while (true) {
    bee = dataset[Math.floor(Math.random() * dataset.length)];
    direction = Math.random() * tau;
    await sleep(300 + Math.random() * 600);
    bee.fx = null;
    bee.fy = null;
    bee = null;
    await sleep(1000 + Math.random() * 6000);
  }
}