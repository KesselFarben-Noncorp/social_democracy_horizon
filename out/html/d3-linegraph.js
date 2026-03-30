/*
 * generating a line graph of multiple parties with multiple dates...
 * Fixed for chronological sorting and data consistency.
 * */

function addMonths(date, months) {
    date = new Date(date);
    var d = date.getDate();
    date.setMonth(date.getMonth() + months);
    if (date.getDate() != d) {
      date.setDate(0);
    }
    return date;
}

d3.linegraph = function(noTicks, noDots, parties, partyColors, partyNames, dataMax, dataMin, additionalMonths) {
    /* Default params */
    if (!parties) {
        parties = ['spd', 'kpd', 'ddp', 'z', 'dvp', 'dnvp', 'nsdap', 'other'];
    }
    if (!partyColors) {
        partyColors = {'spd': '#E3000F', 'kpd': '#8B0000', 'ddp': '#DCCA4A', 'z': '#000', 'dvp': '#D5AC27', 'dnvp': '#3f7bc1', 'nsdap': '#954B00', 'other': '#a0a0a0'};
    }
    if (!partyNames) {
        partyNames = {'spd': 'SPD', 'kpd': 'KPD', 'ddp': 'DDP', 'z': 'Z + BVP', 'dvp': 'DVP', 'dnvp': 'DNVP', 'nsdap': 'NSDAP', 'other': 'Others'};
    }
    if (!additionalMonths) {
        additionalMonths = 10;
    }

    // Dimensions
    var width = 500;
    var height = 400;
    var marginTop = 20;
    var marginRight = 80; // Increased to fit labels better
    var marginBottom = 50;
    var marginLeft = 40;

    function linegraph(dataset) {
      dataset.each(function (data) {
        // --- 1. DATA PRE-PROCESSING (The Fix for Jaggedness) ---
        // Ensure all dates are Date objects and SORT them chronologically
        data.forEach(d => {
            d.dateObj = (d.date instanceof Date) ? d.date : new Date(d.date);
        });
        data.sort((a, b) => a.dateObj - b.dateObj);

        const dates = data.map(d => d.dateObj);
        const maxDate = d3.max(dates);
        const minDate = d3.min(dates) || new Date(1928, 0);

        // --- 2. SCALES & AXES ---
        const xScale = d3.scaleUtc(
            [minDate, addMonths(maxDate, additionalMonths)], 
            [marginLeft, width - marginRight]
        );

        var xaxis = d3.axisBottom()
            .tickFormat(d3.timeFormat('%b %Y'))
            .tickValues(dates)
            .scale(xScale);

        if (noTicks) {
            xaxis = d3.axisBottom()
                .tickFormat(d3.timeFormat('%b %Y'))
                .ticks(d3.timeYear.every(1))
                .scale(xScale);
        }

        if (dataMax === undefined || dataMax === null) {
            const maxVal = d3.max(data, d => {
                return d3.max(parties, p => d[p]);
            });
            dataMax = maxVal + 5;
            dataMin = 0;
        }
        const yScale = d3.scaleLinear([dataMin, dataMax], [height - marginBottom, marginTop]);

        var svg = d3.select(this);

        // --- 3. DRAW AXES ---
        svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(xaxis)
            .selectAll("text")
            .attr("text-anchor", "end")
            .attr("dx", "-0.8em")
            .attr("dy", "0.1em")
            .attr("transform", "rotate(-30)");

        svg.append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(yScale));

        // --- 4. LINE GENERATOR ---
        const lineGenerator = (party) => d3.line()
            .defined(d => d[party] !== null && !isNaN(d[party])) // Skip missing data
            .x(d => xScale(d.dateObj))
            .y(d => yScale(d[party]))
            .curve(d3.curveMonotoneX); // Smooths the path slightly for readability

        // --- 5. DRAW LINES ---
        for (const party of parties) {
            svg.append("path")
                .datum(data) 
                .attr("fill", "none")
                .attr("stroke", partyColors[party])
                .attr("stroke-width", 1.5)
                .attr("class", party + " party-line")
                .attr("id", party + "-line")
                .attr("d", lineGenerator(party))
                .on("mouseover", function() {
                    d3.selectAll(".party-line").attr("stroke-width", 0.1);
                    d3.selectAll(".party-node").attr("fill-opacity", 0.1);
                    d3.selectAll(".party-label").attr("opacity", 0.1);
                    
                    d3.select(this).attr("stroke-width", 4);
                    d3.selectAll("." + party + "-node").attr("fill-opacity", 1);
                    d3.selectAll("." + party + "-label").attr("opacity", 1);
                })
                .on("mouseout", function() {
                    d3.selectAll(".party-line").attr("stroke-width", 1.5);
                    d3.selectAll(".party-node").attr("fill-opacity", 1);
                    d3.selectAll(".party-label").attr("opacity", 1);
                });
        }

        // --- 6. DRAW NODES ---
        if (!noDots) {
            parties.forEach(party => {
                svg.selectAll(".node-" + party)
                    .data(data.filter(d => d[party] !== null))
                    .enter().append("circle")
                    .attr("class", party + " " + party + "-node party-node")
                    .attr("fill", partyColors[party])
                    .attr("r", 3.5)
                    .attr("cx", d => xScale(d.dateObj))
                    .attr("cy", d => yScale(d[party]))
                    .on("mouseover", function() {
                        d3.selectAll(".party-line").attr("stroke-width", 0.1);
                        d3.selectAll(".party-node").attr("fill-opacity", 0.1);
                        d3.selectAll(".party-label").attr("opacity", 0.1);
                        
                        d3.select("#" + party + "-line").attr("stroke-width", 4);
                        d3.selectAll("." + party + "-node").attr("fill-opacity", 1);
                        d3.selectAll("." + party + "-label").attr("opacity", 1);
                    })
                    .on("mouseout", function() {
                        d3.selectAll(".party-line").attr("stroke-width", 1.5);
                        d3.selectAll(".party-node").attr("fill-opacity", 1);
                        d3.selectAll(".party-label").attr("opacity", 1);
                    });
            });
        }

        // --- 7. DRAW LABELS ---
        parties.forEach(party => {
            const lastDataPoint = data[data.length - 1];
            if (lastDataPoint[party] !== undefined) {
                svg.append("text")
                    .datum(lastDataPoint)
                    .attr("class", party + "-label party-label")
                    .attr("x", xScale(lastDataPoint.dateObj) + 8)
                    .attr("y", yScale(lastDataPoint[party]) + 4)
                    .attr("font-size", "11px")
                    .attr("fill", partyColors[party] === '#000' ? '#333' : partyColors[party])
                    .text(partyNames[party])
                    .on("mouseover", function() {
                        d3.selectAll(".party-line").attr("stroke-width", 0.1);
                        d3.selectAll(".party-node").attr("fill-opacity", 0.1);
                        d3.selectAll(".party-label").attr("opacity", 0.1);
                        
                        d3.select("#" + party + "-line").attr("stroke-width", 4);
                        d3.selectAll("." + party + "-node").attr("fill-opacity", 1);
                        d3.select(this).attr("opacity", 1);
                    })
                    .on("mouseout", function() {
                        d3.selectAll(".party-line").attr("stroke-width", 1.5);
                        d3.selectAll(".party-node").attr("fill-opacity", 1);
                        d3.selectAll(".party-label").attr("opacity", 1);
                    });
            }
        });

      });
    }

    // Getters/Setters
    linegraph.width = function(value) { if (!arguments.length) return width; width = value; return linegraph; };
    linegraph.height = function(value) { if (!arguments.length) return height; height = value; return linegraph; };
    linegraph.parties = function(value) { if (!arguments.length) return parties; parties = value; return linegraph; };
    linegraph.partyNames = function(value) { if (!arguments.length) return partyNames; partyNames = value; return linegraph; };
    linegraph.partyColors = function(value) { if (!arguments.length) return partyColors; partyColors = value; return linegraph; };

    return linegraph;
};
