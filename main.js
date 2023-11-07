let keyframes = [{
        activeVerse: 1,
        activeLines: [1, 2, 3, 4],
        svgUpdate: () => {
            updateBarChart("Casualties of School Shootings in USA by Year");
            hoverBarLabels();
        }
    },
    {
        activeVerse: 2,
        activeLines: [1, 2, 3, 4],
        svgUpdate: () => pieChart()
    },
    {
        activeVerse: 3,
        activeLines: [1, 2, 3, 4],
        svgUpdate: () => weapons()
    },
    {
        activeVerse: 4,
        activeLines: [1, 2, 3]
    },
    {
        activeVerse: 4,
        activeLines: [4],
        svgUpdate: () => weapons_scroll()
    },
    {
        activeVerse: 5,
        activeLines: [1],
        svgUpdate: () => updateBarChart("Casualties of School Shootings in USA by Year")
    },
    {
        activeVerse: 5,
        activeLines: [2, 3],
        svgUpdate: () => makeSandyBarHoverable()
    },
    {
        activeVerse: 5,
        activeLines: [4],
        svgUpdate: () => resetSandy()
    },
    {
        activeVerse: 6,
        activeLines: [1, 2, 3, 4],
        svgUpdate: () => shootings_map()
    },
    {
        activeVerse: 7,
        activeLines: [1, 2, 3, 4]
    }
]

// TODO define global variables
let svg = d3.select("#svg");
let keyframeIndex = 0;

const width = 12000;
const height = 800;

let chart;
let chartWidth;
let chartHeight;

let xScale;
let yScale;
var isChartLoaded = false;


// TODO add event listeners to the buttons
document.getElementById("forward-button").addEventListener("click", forwardClicked);
document.getElementById("backward-button").addEventListener("click", backwardClicked);

function forwardClicked() {
    // TODO define behaviour when the forwards button is clicked
    if (keyframeIndex < keyframes.length - 1) {
        keyframeIndex++;
        drawKeyframe(keyframeIndex);
    }

}

function backwardClicked() {
    // TODO define behaviour when the backwards button is clicked
    if (keyframeIndex > 0) {

        if (keyframeIndex == 8) {
            isChartLoaded = true;
            updateBarChart("Casualties of School Shootings in USA by Year");

        }
        if (keyframeIndex == 4) {
            scrollRightColumnToCoordinates(0, 0);
        }
        if (keyframeIndex == 5) {
            weapons();
        }
        keyframeIndex--;
        drawKeyframe(keyframeIndex);

    }

}

function drawKeyframe(kfi) {
    // TODO get keyframe at index position
    let kf = keyframes[kfi];
    // TODO reset any active lines
    resetActiveLines();
    // TODO update the active verse
    updateActiveVerse(kf.activeVerse);
    // TODO update any active lines
    for (line of kf.activeLines) {
        updateActiveLine(kf.activeVerse, line)
    }
    // TODO update the svg
    if (kf.svgUpdate) {
        kf.svgUpdate();
    }
}

// TODO write a function to reset any active lines
function resetActiveLines() {
    // Reset the active-line class for all of the lines
    d3.selectAll(".line").classed("active-line", false);
}

// TODO write a function to update the active verse
function updateActiveVerse(id) {
    // Reset the current active verse - in some scenarios you may want to have more than one active verse, but I will leave that as an exercise for you to figure out
    d3.selectAll(".verse").classed("active-verse", false);
    d3.selectAll(".colum").style("color", "white");
    d3.selectAll(".fallen").style("color", "white");

    // Update the class list of the desired verse so that it now includes the class "active-verse"
    d3.select("#verse" + id).classed("active-verse", true);

    d3.select("#verse" + id).selectAll(".colum").style("color", "rgb(231, 23, 23)");
    d3.select("#verse" + id).selectAll(".fallen").style("color", "rgb(231, 23, 23)");

    // Scroll the column so the chosen verse is centred
    scrollLeftColumnToActiveVerse(id);
}

// TODO write a function to update the active line
function updateActiveLine(vid, lid) {
    // Select the correct verse
    let thisVerse = d3.select("#verse" + vid);
    // Update the class list of the relevant lines
    thisVerse.select("#line" + lid).classed("active-line", true);
}

// TODO write a function to scroll the left column to the right place
function scrollLeftColumnToActiveVerse(id) {
    // TODO select the div displaying the left column content
    var leftColumn = document.querySelector(".left-column-content");

    // TODO select the verse we want to display
    var activeVerse = document.getElementById("verse" + id);

    // TODO calculate the bounding rectangles of both of these elements
    var verseRect = activeVerse.getBoundingClientRect();
    var leftColumnRect = leftColumn.getBoundingClientRect();

    // TODO calculate the desired scroll position
    var desiredScrollTop = verseRect.top + leftColumn.scrollTop - leftColumnRect.top - (leftColumnRect.height - verseRect.height) / 2;

    // TODO call this function when updating the active verse
    leftColumn.scrollTo({
        top: desiredScrollTop,
        behavior: 'smooth'
    })
}

function scrollRightColumnToCoordinates(x, y) {
    // TODO select the div displaying the right column content
    var rightColumn = document.querySelector(".right-column");

    // TODO call this function when you want to scroll to specific coordinates
    rightColumn.scrollTo({
        left: x,
        top: y,
        behavior: 'smooth'
    });
}

function initialiseSVG() {

    svg.attr("width", width);
    svg.attr("height", height);

    svg.selectAll("*").remove();

    const margin = { top: 60, right: 30, bottom: 50, left: 50 };
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

    // Add x-axis
    chart.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text");

    // Add y-axis
    chart.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale))
        .selectAll("text");

    // Add title
    svg.append("text")
        .attr("id", "chart-title")
        .attr("x", width / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("fill", "white")
        .text("");
}

function updateBarChart(title = "") {
    svg.selectAll("*").remove();
    scrollRightColumnToCoordinates(0, 0)


    svg.attr("width", width);
    svg.attr("height", height);

    const margin = { top: 200, right: 30, bottom: 50, left: 50 };
    chartWidth = 2100 - margin.left - margin.right;
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

    // Add x-axis
    chart.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text");

    // Add y-axis
    chart.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale))
        .selectAll("text");

    // Add title
    svg.append("text")
        .attr("id", "chart-title")
        .attr("x", 1000)
        .attr("y", 175)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("fill", "white")
        .text("");

    // Add x-axis title
    svg.append("text")
        .attr("class", "x-axis-title")
        .attr("x", 1000)
        .attr("y", height - 5)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("fill", "white")
        .text("Year (1999-2023)");
    // Add y-axis title
    svg.append("text")
        .attr("class", "y-axis-title")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("fill", "white")
        .text("Total # of Casualties");

    d3.csv("../../data/casualties_year.csv")
        .then(function(data) {
            // TODO Update the xScale domain to match new order
            // TODO Update the yScale domain for new values
            xScale.domain(data.map(d => d["year"]));
            yScale.domain([0, d3.max(data, d => d["total_casualties"])]).nice();

            let colorScale = d3.scaleLinear()
                .domain([0, d3.max(data, function(d) {
                    return parseInt(d["total_casualties"]);
                })])
                .range([255, 0]);

            // TODO select all the existing barsv
            const bars = chart.selectAll(".bar")
                .data(data, d => d["year"]);


            // TODO remove any bars no longer in the dataset
            // for removing bars - you want the height to go down to 0 and the y value to change too. Then you can call .remove()
            bars.exit()
                .transition().duration(500)
                .attr("height", 0)
                .attr("y", chartHeight)
                .transition().duration(500)
                .remove();

            // TODO move any bars that already existed to their correct spot
            // for moving existing bars - you'll have to update their x, y, and height values
            bars.transition().duration(500).attr("x", d => xScale(d['year']))
                .attr("y", d => yScale(d["total_casualties"]))
                .attr("height", d => chartHeight - yScale(d["total_casualties"]))
                .attr("fill", "#999");


            // TODO Add any new bars
            bars.enter().append("rect")
                .attr("class", "bar")
                .attr("x", d => xScale(d["year"]))
                .attr("y", chartHeight) // Set initial y position below the chart so we can't see it
                .attr("width", xScale.bandwidth())
                .attr("height", 0) // Set initial height to 0 so there is nothing to display
                .attr("fill", function(d) {
                    let f = colorScale(d["total_casualties"])
                    if (d["year"] != 1999 && d["year"] != 2012) {
                        return "rgb(" + 255 + "," + f + "," + f + ")";
                    } else {
                        return "red";
                    }
                })
                .transition() // Declare we want to do a transition
                .duration(1000) // This one is going to last for one second
                .attr("y", d => yScale(d["total_casualties"])) // Update the y value so that the bar is in the right location vertically
                .attr("height", d => chartHeight - yScale(d["total_casualties"])); // Update the height value

            // TODO update the x and y axis
            chart.select(".x-axis")
                .transition()
                .duration(500)
                .call(d3.axisBottom(xScale));

            chart.select(".y-axis")
                .transition()
                .duration(500)
                .call(d3.axisLeft(yScale));


            // TODO update the title
            var text = svg.select("#chart-title")
                .text(title);

            if (isChartLoaded) {
                // Change the color of bars if the chart is fully loaded
                isChartLoaded = false;
                highlightColour("2012", "white");
            }
        })

}

function shootings_map() {
    // Remove existing content inside global svg
    svg.selectAll("*").remove();
    scrollRightColumnToCoordinates(0, 0)
    var map;
    var data;
    const margin = { top: 175, right: 30, bottom: -20, left: 50 };


    // Set up the map within the global SVG element
    var mapContainer = svg.append('foreignObject')
        .attr('width', 1200 - margin.left - margin.right)
        .attr('height', height - margin.top - margin.bottom)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .append('xhtml:div')
        .style('width', '100%')
        .style('height', '100%');


    // Initialize Leaflet map
    map = L.map(mapContainer.node()).setView([39.8283, -98.5795], 5);

    var tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    tileLayer.addTo(map);


    // Add title to the map
    var mapTitle = mapContainer.append('h2')
        .style('text-align', 'center')
        .style('font-size', '18px')
        .style('color', 'black')
        .text('School Shootings in the United States: 2012-Present');

    // Load CSV data and add markers
    d3.csv("../../data/school-shootings-data.csv")
        .then(function(csv) {
            data = csv;
            console.log("Data loaded" + data);
            addMarkers();
        })
        .catch(function(error) {
            console.error("Error loading data:", error);
        });

    //add markers of high schools
    var index = 0;

    // Add markers of high schools
    function addMarkers() {
        console.log("Adding markers");
        data.forEach(function(d) {
            var marker = L.marker([+d.lat, +d.long]);

            // Content for the popup
            var pContent = `<strong>School Name:</strong> ${d.school_name}<br><strong>Date:</strong> ${d.date}<br><strong># Killed:</strong> ${d.killed}
            <br><strong># Injured:</strong> ${d.injured}<br><strong>Total Casualties:</strong> ${d.casualties}`;

            // Add popup 
            marker.bindPopup(pContent);
            marker.addTo(map);
        });
    }
}



function weapons() {
    scrollRightColumnToCoordinates(0, 0)
    d3.csv("../../data/weapons.csv").then(function(data) {
        svg.selectAll("*").remove();
        const margin = { top: 50, right: 50, bottom: 0, left: 50 };


        // X and Y scales
        const xScale = d3.scaleBand()
            .domain(data.map(d => d.weapon))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => +d.count)])
            .nice()
            .range([height - margin.bottom, margin.top + 150]);

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
                        .transition()
                        .delay(500) // Delay before the transition starts in milliseconds
                        .duration(1000)
                        .attr('xlink:href', '../../images/handgun.png') // Replace with the path to your image file
                        .attr('width', 150) // Set the width of the image
                        .attr('height', 150) // Set the height of the image
                        .attr('x', 20) // Adjust the horizontal position of the image relative to the circle
                        .attr('y', -30); // Adjust the vertical position of the image relative to the circle
                }
                if (d.weapon === "hunting rifle") {
                    d3.select(this).append("image")
                        .transition()
                        .delay(1300) // Delay before the transition starts in milliseconds
                        .duration(1000)
                        .attr('xlink:href', '../../images/hunting rifle.png') // Replace with the path to your image file
                        .attr('width', 270) // Set the width of the image
                        .attr('height', 270) // Set the height of the image
                        .attr('x', 20) // Adjust the horizontal position of the image relative to the circle
                        .attr('y', -200); // Adjust the vertical position of the image relative to the circle
                }
                if (d.weapon === "pistol") {
                    d3.select(this).append("image")
                        .transition()
                        .delay(700) // Delay before the transition starts in milliseconds
                        .duration(1000)
                        .attr('xlink:href', '../../images/pistol.png') // Replace with the path to your image file
                        .attr('width', 200) // Set the width of the image
                        .attr('height', 200) // Set the height of the image
                        .attr('x', 20) // Adjust the horizontal position of the image relative to the circle
                        .attr('y', -180); // Adjust the vertical position of the image relative to the circle
                }
                if (d.weapon === "revolver") {
                    d3.select(this).append("image")
                        .transition()
                        .delay(900) // Delay before the transition starts in milliseconds
                        .duration(1000)
                        .attr('xlink:href', '../../images/revolver.png') // Replace with the path to your image file
                        .attr('width', 200) // Set the width of the image
                        .attr('height', 200) // Set the height of the image
                        .attr('x', 20) // Adjust the horizontal position of the image relative to the circle
                        .attr('y', -180); // Adjust the vertical position of the image relative to the circle
                }
                if (d.weapon === "rifle") {
                    d3.select(this).append("image")
                        .transition()
                        .delay(1100) // Delay before the transition starts in milliseconds
                        .duration(1000)
                        .attr('xlink:href', '../../images/rifle.png') // Replace with the path to your image file
                        .attr('width', 200) // Set the width of the image
                        .attr('height', 200) // Set the height of the image
                        .attr('x', -20) // Adjust the horizontal position of the image relative to the circle
                        .attr('y', -240); // Adjust the vertical position of the image relative to the circle
                }
                if (d.weapon === "sniper rifle") {
                    d3.select(this).append("image")
                        .transition()
                        .delay(1500) // Delay before the transition starts in milliseconds
                        .duration(1000)
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
            .attr("y", 12)
            .attr("text-anchor", "middle")
            .text("# of School Shootings Responsible for:")
            .style("fill", "white");

        // Chart title
        svg.append("text")
            .attr("x", margin.left)
            .attr("y", 175)
            .attr("text-anchor", "start")
            .style("font-size", "24px")
            .style("fill", "white")
            .text("Weapons Used in School Shootings");

    })
}

function weapons_scroll() {
    scrollRightColumnToCoordinates(0, 0);
    scrollRightColumnToCoordinates(12000, 0);
}


function pieChart() {
    scrollRightColumnToCoordinates(0, 0)
    d3.csv("../../data/race_col.csv")
        .then(function(data) {

            svg.selectAll("*").remove();

            const margin = { top: 150, right: 30, bottom: 50, left: 50 };
            chartWidth = 2100 - margin.left - margin.right;
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
                .attr("transform", `translate(${chartWidth / 4},${chartHeight / 1.7})`);

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
                .attr("x", chartWidth / 4 + 200)
                .attr("y", 175)
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
                .style("fill", "white")
                .text("Columbine High School Demographics (1999)"); // Change the title accordingly
            // Create a legend
            const legend = svg.append("g")
                .attr("class", "legend")
                .attr("transform", "translate(" + (200) + "," + 220 + ")");

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
                .transition()
                .duration(1000)
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
                .attr("id", "colum-victims")
                .transition()
                .duration(1000)
                .attr("xlink:href", '../../images/columbine_victims.png') // Replace with the path to your image file
                .attr("x", 2100 / 2 - 150) // Adjust the x-coordinate to position the image horizontally
                .attr("y", height / 2 - 100) // Adjust the y-coordinate to position the image vertically
                .attr("width", 300) // Set the width of the image
                .attr("height", 500); // Set the height of the image



            // Add text labels to legend
            legends.append("text")
                .attr("x", legendRectSize + legendSpacing)
                .attr("y", legendRectSize / 2)
                .attr("dy", "0.35em")
                .text(d => d)
                .style("fill", "white");



        })

}

async function initialise() {
    initialiseSVG();

    // TODO draw the first keyframe
    drawKeyframe(keyframeIndex);
    makeColumbineBarHoverable();
    expandImage();

}

function expandImage() {
    d3.selectAll(".fallen").on("mouseover", () => {
        svg.select("#colum-victims")
            .transition()
            .duration(1000)
            .attr("x", 0) // Adjust the x-coordinate to position the image horizontally
            .attr("y", 20) // Adjust the y-coordinate to position the image vertically
            .attr("width", 1200) // Set the width of the image
            .attr("height", 900); // Set the height of the image

    });

    d3.selectAll(".fallen").on("mouseout", () => {
        svg.select("#colum-victims")
            .transition()
            .duration(1000)
            .attr("x", 2100 / 2 - 150) // Adjust the x-coordinate to position the image horizontally
            .attr("y", height / 2 - 100) // Adjust the y-coordinate to position the image vertically
            .attr("width", 300) // Set the width of the image
            .attr("height", 500); // Set the height of the image

    });

}

function makeSandyBarHoverable() {
    scrollRightColumnToCoordinates(600, 0)
    highlightColour("2012", "white");
    svg.select("#bacon-image").remove()
        .transition().duration(300);
    svg.select("#barden-image").remove()
        .transition().duration(300);
    // Append an image
    svg.append("image")
        .attr("id", "sandy-news")
        .transition()
        .duration(1000)
        .attr("xlink:href", '../../images/sandy_news.webp') // Replace with the path to your image file
        .attr("x", 500) // Adjust the x-coordinate to position the image horizontally
        .attr("y", 250) // Adjust the y-coordinate to position the image vertically
        .attr("width", 600) // Set the width of the image
        .attr("height", 500); // Set the height of the image



};

function resetSandy() {
    scrollRightColumnToCoordinates(600, 0)
    svg.select("#sandy-news").remove()
        .transition().duration(300);

    svg.append("image")
        .attr("id", "bacon-image")
        .transition()
        .duration(1000)
        .attr("xlink:href", '../../images/bacon-image.png') // Replace with the path to your image file
        .attr("x", 650) // Adjust the x-coordinate to position the image horizontally
        .attr("y", 150) // Adjust the y-coordinate to position the image vertically
        .attr("width", 400) // Set the width of the image
        .attr("height", 500); // Set the height of the image
    svg.append("image")
        .attr("id", "barden-image")
        .transition()
        .duration(1000)
        .attr("xlink:href", '../../images/barden-image.png') // Replace with the path to your image file
        .attr("x", 1250) // Adjust the x-coordinate to position the image horizontally
        .attr("y", 150) // Adjust the y-coordinate to position the image vertically
        .attr("width", 400) // Set the width of the image
        .attr("height", 500); // Set the height of the image
}

function makeColumbineBarHoverable() {
    // Add a mouseover event listener
    d3.selectAll(".colum").on("mouseover", () => {
        highlightColour("1999", "white");
        // Append an image
        svg.append("image")
            .attr("id", "colum-news")
            .transition()
            .duration(1000)
            .attr("xlink:href", '../../images/colum-news.jpeg') // Replace with the path to your image file
            .attr("x", 300) // Adjust the x-coordinate to position the image horizontally
            .attr("y", 150) // Adjust the y-coordinate to position the image vertically
            .attr("width", 600) // Set the width of the image
            .attr("height", 500); // Set the height of the image
    });

    // Add a mouseout event listener
    d3.selectAll(".colum").on("mouseout", () => {
        resetBarColor("1999");
        svg.select("#colum-news").remove();
    });

};

function highlightColour(year, highlightColour) {
    // TODO select bar that has the right value
    // TODO update it's fill colour
    svg.selectAll(".bar").filter(d => d.year !== year)
        .transition() // call transition immediately before the attribute that you are changing
        .duration(1000) // decide how long you want that transition to last in milliseconds
        .attr("fill", "");
}
// Function to reset the bar color
function resetBarColor(year) {
    d3.csv("../../data/casualties_year.csv")
        .then(function(data) {
            let colorScale = d3.scaleLinear()
                .domain([0, d3.max(data, function(d) {
                    return parseInt(d["total_casualties"]);
                })])
                .range([255, 0]);

            svg.selectAll(".bar").filter(d => d.year !== year)
                .transition() // call transition immediately before the attribute that you are changing
                .duration(300) // decide how long you want that transition to last in milliseconds
                .attr("fill", function(d) {
                    let f = colorScale(d["total_casualties"])
                    if (d["year"] != 1999 && d["year"] != 2012) {
                        return "rgb(" + 255 + "," + f + "," + f + ")";
                    } else {
                        return "red";
                    }
                })
        })
};

function hoverBarLabels() {
    var div = d3.select("body").append("div")
        .attr("class", "tooltip-donut")
        .style("opacity", 0);

    d3.csv("../../data/casualties_year.csv")
        .then(function(data) {
            chart.selectAll(".bar")
                .on("mouseover", function(d) {
                    console.log(data[""])
                    d3.select(this).transition()
                        .duration('50')
                        .attr('opacity', '.85');
                    div.transition()
                        .duration(50)
                        .style("opacity", 1);
                    div.html(data["total_casualties"])
                        .style("left", (d3.event.pageX + 10) + "px")
                        .style("top", (d3.event.pageY + 15) + "px");

                })
                .on("mouseout", function() {
                    d3.select(this).transition()
                        .duration('50')
                        .attr('opacity', '1');
                    div.transition()
                        .duration('50')
                        .style("opacity", 0);
                });
        })
}

initialise();