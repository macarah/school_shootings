weapons();
barChart();
pieChart();
shootings_map();


function shootings_map() {


    var map;

    //color scale by year

    document.addEventListener("DOMContentLoaded", function() {
        // Set the initial view to cover the United States
        map = L.map('map').setView([35.92, -90.2], 5);

        var tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });

        tileLayer.addTo(map);

        // Add title to the map
        var mapTitle = document.createElement('h2');
        mapTitle.innerHTML = 'School Shootings in the United States: 2012-Present';
        document.getElementById('map').appendChild(mapTitle);


        d3.csv("../../data/school-shootings-data.csv")
            .then(function(csv) {
                data = csv;
                addMarkers();
            })
            .catch(function(error) {
                console.error("Error loading data:", error);
            });
    });

    var data;

    //add markers of high schools
    function addMarkers() {
        data.forEach(function(d) {
            var marker = L.circleMarker([+d.lat, +d.long]);
            marker.setStyle({
                radius: 8,
                color: "#878E76",
                weight: 0.75
            });

            // content for the popup
            var pContent = `<strong>School Name:</strong> ${d.school_name}<br><strong>Date:</strong> ${d.date}<br><strong># Killed:</strong> ${d.killed}
            <br><strong># Injured:</strong> ${d.injured}<br><strong>Total Casualties:</strong> ${d.casualties}`;

            // Add popup 
            marker.bindPopup(pContent);

            marker.addTo(map);
        });
    }
}



function weapons() {

    d3.csv("../../data/weapons.csv").then(function(data) {
        const width = 12000;
        const height = 1000;
        const margin = { top: 50, right: 50, bottom: 50, left: 50 };

        let svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .style("margin-left", "25px");
        // X and Y scales
        const xScale = d3.scaleBand()
            .domain(data.map(d => d.weapon))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => +d.count)])
            .nice()
            .range([height - margin.bottom, margin.top]);

        // Line generator
        const line = d3.line()
            .x(d => xScale(d.weapon) + xScale.bandwidth() / 2)
            .y(d => yScale(+d.count));

        // Draw line plot
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#878E76")
            .attr("stroke-width", 2)
            .attr("d", line);

        // Draw circles for data points
        svg.selectAll("circle")
            .data(data)
            .enter().append("g")
            .attr("class", "data-point")
            .attr("transform", d => "translate(" + (xScale(d.weapon) + xScale.bandwidth() / 2) + "," + yScale(+d.count) + ")")
            .each(function(d) {
                d3.select(this).append("circle")
                    .attr("r", 5)
                    .attr("fill", function() {
                        if (d.weapon === "handgun" || d.weapon === "hunting rifle" || d.weapon === "pistol" || d.weapon === "revolver" || d.weapon === "rifle" || d.weapon === "sniper rifle") {
                            return "red";
                        } else {
                            return "#878E76";
                        }
                    });

                // Add image only if weapon is "handgun"
                if (d.weapon === "handgun") {
                    d3.select(this).append("image")
                        .attr('xlink:href', '../../images/handgun.png') // Replace with the path to your image file
                        .attr('width', 150) // Set the width of the image
                        .attr('height', 150) // Set the height of the image
                        .attr('x', 20) // Adjust the horizontal position of the image relative to the circle
                        .attr('y', -30); // Adjust the vertical position of the image relative to the circle
                }
                if (d.weapon === "hunting rifle") {
                    d3.select(this).append("image")
                        .attr('xlink:href', '../../images/hunting rifle.png') // Replace with the path to your image file
                        .attr('width', 270) // Set the width of the image
                        .attr('height', 270) // Set the height of the image
                        .attr('x', 20) // Adjust the horizontal position of the image relative to the circle
                        .attr('y', -200); // Adjust the vertical position of the image relative to the circle
                }
                if (d.weapon === "pistol") {
                    d3.select(this).append("image")
                        .attr('xlink:href', '../../images/pistol.png') // Replace with the path to your image file
                        .attr('width', 200) // Set the width of the image
                        .attr('height', 200) // Set the height of the image
                        .attr('x', 20) // Adjust the horizontal position of the image relative to the circle
                        .attr('y', -180); // Adjust the vertical position of the image relative to the circle
                }
                if (d.weapon === "revolver") {
                    d3.select(this).append("image")
                        .attr('xlink:href', '../../images/revolver.png') // Replace with the path to your image file
                        .attr('width', 200) // Set the width of the image
                        .attr('height', 200) // Set the height of the image
                        .attr('x', 20) // Adjust the horizontal position of the image relative to the circle
                        .attr('y', -180); // Adjust the vertical position of the image relative to the circle
                }
                if (d.weapon === "rifle") {
                    d3.select(this).append("image")
                        .attr('xlink:href', '../../images/rifle.png') // Replace with the path to your image file
                        .attr('width', 200) // Set the width of the image
                        .attr('height', 200) // Set the height of the image
                        .attr('x', -20) // Adjust the horizontal position of the image relative to the circle
                        .attr('y', -240); // Adjust the vertical position of the image relative to the circle
                }
                if (d.weapon === "sniper rifle") {
                    d3.select(this).append("image")
                        .attr('xlink:href', '../../images/sniper rifle.png') // Replace with the path to your image file
                        .attr('width', 250) // Set the width of the image
                        .attr('height', 250) // Set the height of the image
                        .attr('x', -200) // Adjust the horizontal position of the image relative to the circle
                        .attr('y', -240); // Adjust the vertical position of the image relative to the circle
                }
            });


        // Y-axis
        svg.append("g")
            .attr("transform", "translate(" + margin.left + ",0)")
            .call(d3.axisLeft(yScale));

        // X-axis label
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height - 10)
            .attr("text-anchor", "middle")
            .text("Weapon");

        // Y-axis label
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", 20)
            .attr("text-anchor", "middle")
            .text("# of School Shootings Responsible for:");

        // Chart title
        svg.append("text")
            .attr("x", margin.left)
            .attr("y", margin.top / 2)
            .attr("text-anchor", "start")
            .style("font-size", "24px")
            .text("Weapons Used in School Shootings");

    })
}


function pieChart() {

    d3.csv("../../data/race_col.csv")
        .then(function(data) {
            const width = 1800;
            const height = 600;
            const cellpadding = 3;


            let svg = d3.select("body")
                .append("svg")
                .attr("width", width)
                .attr("height", height);


            const margin = { top: 60, right: 380, bottom: 50, left: 50 };
            chartWidth = width - margin.left - margin.right;
            chartHeight = height - margin.top - margin.bottom;


            chart = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            xScale = d3.scaleBand()
                .domain([])
                .range([0, chartWidth])
                .padding(0.1);

            yScale = d3.scaleLinear()
                .domain([])
                .nice()
                .range([chartHeight, 0]);

            // Select the dataset you want to use for the pie chart
            const dataset = data;

            // Set up pie chart parameters
            const radius = Math.min(chartWidth, chartHeight) / 2;
            const colors = d3.scaleOrdinal(d3.schemeCategory10);
            const pie = d3.pie().value(d => d.race_count);

            // Create an arc generator
            const arc = d3.arc()
                .innerRadius(0)
                .outerRadius(radius);

            // Remove existing bars
            chart.selectAll(".bar").remove();

            // Create arcs for the pie chart segments
            const arcs = chart.selectAll(".arc")
                .data(pie(dataset))
                .enter()
                .append("g")
                .attr("class", "arc")
                .attr("transform", `translate(${chartWidth / 2},${chartHeight / 2})`);

            // Append paths for the arcs
            arcs.append("path")
                .attr("d", arc)
                .attr("fill", d => {
                    if (d.data.race === "white") return "#878E76";
                    else if (d.data.race === "black") return "#D4E1DC";
                    else if (d.data.race === "hispanic") return "#8D9D90";
                    else if (d.data.race === "asian") return "#9DB4AB";
                    else if (d.data.race === "american_indian_alaska_native") return "#EFF1F1";
                    else return "#999";
                })
                .transition()
                .duration(1000) // Transition duration in milliseconds
                .attrTween("d", function(d) {
                    var interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
                    return function(t) {
                        return arc(interpolate(t));
                    };
                });


            // Add title
            svg.append("text")
                .attr("id", "chart-title")
                .attr("x", width / 2)
                .attr("y", 20)
                .attr("text-anchor", "end")
                .style("font-size", "18px")
                .style("fill", "black")
                .text("");
            // Update the chart title
            svg.select("#chart-title")
                .style("opacity", 0) // Start with opacity 0 (invisible)
                .transition()
                .duration(1000) // Title transition duration in milliseconds
                .style("opacity", 1)
                .text("Columbine High School Demographics (1999)"); // Change the title accordingly
            // Create a legend
            const legend = svg.append("g")
                .attr("class", "legend")
                .attr("transform", "translate(" + (width - 540) + "," + 20 + ")");

            const legendData = ["White", "Hispanic", "Asian", "Black", "American Indian/Alaska Native"];

            const legendRectSize = 18; // Size of legend color squares
            const legendSpacing = 4; // Space between legend entries

            // Create legend items
            const legends = legend.selectAll(".legend-item")
                .data(legendData)
                .enter()
                .append("g")
                .attr("class", "legend-item")
                .attr("transform", (d, i) => "translate(-170," + i * (legendRectSize + legendSpacing) + ")");

            // Add colored squares to legend
            legends.append("rect")
                .attr("width", legendRectSize)
                .attr("height", legendRectSize)
                .style("fill", d => {
                    if (d === "White") return "#878E76";
                    else if (d === "Black") return "#D4E1DC";
                    else if (d === "Hispanic") return "#8D9D90";
                    else if (d === "Asian") return "#9DB4AB";
                    else if (d === "American Indian/Alaska Native") return "#EFF1F1";
                    else return "#999";
                });
            // Append an image
            svg.append("image")
                .attr("xlink:href", '../../images/columbine_victims.png') // Replace with the path to your image file
                .attr("x", width / 2 + 200) // Adjust the x-coordinate to position the image horizontally
                .attr("y", height / 2 - 150) // Adjust the y-coordinate to position the image vertically
                .attr("width", 500) // Set the width of the image
                .attr("height", 500); // Set the height of the image


            // Add text labels to legend
            legends.append("text")
                .attr("x", legendRectSize + legendSpacing)
                .attr("y", legendRectSize / 2)
                .attr("dy", "0.35em")
                .text(d => d)
                .style("fill", "black");



        })

}


function barChart() {
    const w = 2000;
    const h = 900;
    const cellpadding = 3;

    let svg = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .style("margin-left", "25px"); // Adjust the margin as needed


    // Add chart title
    svg.append("text")
        .attr("x", w / 2)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .text("Casualties of School Shootings in USA by Year");

    d3.csv("../../data/casualties_year.csv")
        .then(function(data) {
            console.log(data);

            //make a scale
            let yScale = d3.scaleLinear()
                .domain([0, d3.max(data, function(d) {
                    return parseInt(d["total_casualties"]);
                })])
                .range([0, h / 2.5]);

            let colorScale = d3.scaleLinear()
                .domain([0, d3.max(data, function(d) {
                    return parseInt(d["total_casualties"]);
                })])
                .range([255, 0]);

            svg.selectAll("rect")
                .data(data)
                .enter()
                .append("rect")
                .attr("width", w / data.length - cellpadding)
                .attr("height", function(d) {
                    return yScale(d["total_casualties"]);
                })
                .attr("fill", function(d) {
                    let f = colorScale(d["total_casualties"])
                    if (d["year"] != 1999 && d["year"] != 2012) {
                        return "rgb(" + 255 + "," + f + "," + f + ")";
                    } else {
                        return "red";
                    }
                })
                .attr("x", function(d, i) { //spreads it/spaces it horizontally
                    return w / data.length * i;
                })
                .attr("y", function(d) { //to flip the bars or else they hang from top
                    return h / 2 - yScale(d["total_casualties"]);
                })

            // Append labels above bars
            /*
            svg.selectAll("text.bar-label")
                .data(data)
                .enter()
                .append("text")
                .text(function(d) {
                    return d["total_casualties"];
                })
                .attr("class", "bar-label")
                .attr("x", function(d, i) {
                    return w / data.length * (i + 0.5); // Center the text above each bar
                })
                .attr("y", function(d) {
                    return h / 2 - yScale(d["total_casualties"]) - 10; // Adjust the vertical position as needed
                })
                .attr("text-anchor", "middle") // Center the text horizontally
                .style("font-size", "14px"); // Adjust the font size as needed
            */

            svg.selectAll("text")
                .data(data)
                .enter()
                .append("text")
                .text(function(d) {
                    return d.year;
                })
                .attr("transform", function(d, i) {
                    return "translate(" + (w / data.length * (i + .3)) + "," + ((h / 2) + 9) + ")rotate(45)"
                })


        });

}