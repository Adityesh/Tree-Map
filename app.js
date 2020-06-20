// API url : https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json


const createChart = async () => {

    const response = await fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json')
    const data = await response.json();

    const height = 600;
    const width = 900;
    const padding = 20;


    // Tooltip
    const tooltip = d3.select(".container")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .attr('id', 'tooltip')
    .style('opacity', 0.9)

    const svg = d3.select('.container')
                .append('svg')
                .attr('height', height)
                .attr('width', width)

    const treemap = d3.treemap().size([width, height]).paddingInner(1);
    const sumSize = (d) => d;
    const root = d3.hierarchy(data)
      .eachBefore(function(d) {
        d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name; 
      })
      .sum(d => d.value)
      .sort(function(a, b) { return b.height - a.height || b.value - a.value; });



    treemap(root);

    const cell = svg.selectAll('g')
                .data(root.leaves())
                .enter()
                .append('g')                    
                .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const tile = cell.append('rect')
                .attr('class', 'tile')
                .attr('data-name', (d) => d.data.name)
                .attr('data-category', (d) => d.data.category)
                .attr('data-value', (d) => d.data.value)
                .attr('width', d => d.x1 - d.x0)
                .attr('height', d => d.y1 - d.y0)
                .attr('fill', d => color(d.data.category))
                .on("mouseover", function(d){return tooltip.style("visibility", "visible").attr('data-date', d[0])})
                .on("mousemove", function(d){return tooltip.style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 28) + "px").html(() => {
                    
                    return `<strong><span>Name: ${d.data.name}</span><br><span>Category: ${d.data.category}</span><br>Value: <span>${d.data.value}</span></strong>`
                }).attr('data-value', () => {
                    return d.data.value;
                })})
                .on("mouseout", function(d){return tooltip.style("visibility", "hidden")})

    cell.append('text').selectAll('tspan')
    .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
                .enter()
                .append('tspan')
                .attr('x', 4)
                .attr('font-size', '10px')
                .attr('y', (d, i) => 13 + i * 10 )
                .text(d => d)

    const categories = root.leaves().map(data => data.data.category).filter((item, index, arr) => {
        return arr.indexOf(item) === index;
    })

    const legendSize = 20;
    const legendWidth = 200
    const legendHeight = (legendSize + 2) * categories.length;
    const legend = d3.select('#legend')
        .append('svg')
        .attr('class', 'legend')
        .attr('width', legendWidth)
        .attr('height', legendHeight)
        .style('display', 'flex')


        legend.selectAll('rect')
            .data(categories)
            .enter()
            .append('rect')
            .attr('class', 'legend-item')
            .attr('fill',d => color(d))
            .attr('x', legendSize / 2)
            .attr('y', (_, i) => i * (legendSize + 1) + 10)
            .attr('width', legendSize)
            .attr('height', legendSize)
        legend.append('g')
            .selectAll('text')
            .data(categories)
            .enter()
            .append('text')
            .attr('fill', 'black')
            .attr('x', legendSize * 2)
            .attr('y', (_, i) => i * (legendSize + 1) + 25)
            .text(d => d)
    }


createChart();