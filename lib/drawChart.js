
    var header = $('#title');
    var graphic = $('#graphic');
    var frequencyController = $('#frequencyController');
    var navigation = $('#navigation');
    var legend = $('#legend');
    var footer = $("#footer");

    var width;
    var height;
    var dvc = {}; // global object variable to contain all variables prefixed with 'dvc.'
    var pymChild = null;


    var frequency = $('input[name="freq"]:checked').val(),
        naturalScale = $('input[name="zoom"]')[0].checked,
        level = 0,
        selection = "Overview";

    var y,
        yExtent,
        yAxis,
        line;

    var alcol;

    var indexOrder = {"GEKS": 0, "unit_price": 1, "daily_chained": 2, "clip": 3 }

    //then, onload, check if the web browser can handle 'inline svg'
    if (Modernizr) {

            graphic.empty();

            // open and load configuration file.
            d3.json("config1.json", function(error, json) {

                dvc = json

                // Title
                // Each time the data file is updated need to set a new lastUpdate data in the config file
                d3.select("#title")
                  .append("label")
                  .attr("class", "title")
                  .text("Research indices using web scraped data: " + dvc.essential.lastUpdate + " update");


                // navigation buttons
                d3.select('#overview')
                  .on('click', (function (e) {
                        d3.select('.active').classed('active', false);
                        d3.select(this).classed('active', true)
                        if (level != 0) UpHome();
                      })
                  )

                d3.select('#legend')
                    .selectAll("input")
                    .data(dvc.essential.legendLabels)
                    .enter()
                    .append('label')
                        .attr('for',function(d,i){ return 'line-' + i; })
                        .attr("test", function(d,i){ console.log('line-' + i + "index: " + d); })
                        .text(function(d) { return d; })
                    .append("input")
                        .property("checked", function(d, i) {
                            return (i < 1); // Final should be i < 2
                        })
                        .attr("class", "idxOption")
                        .attr("id" , function(d,i) { return 'line-' + i; })
                        .attr("type", "checkbox")
                        .attr("name", function(d,i) { return 'line-' + i; })
                        .on("click", showIndexes);

                readData();

            })  // read config file

        } // end if
        else
        {
            // use pym to create iframe containing fallback image (which is set as default)
            pymChild = new pym.Child();
            if (pymChild) {
                pymChild.sendHeight();
            }
        }

        function changeFreq(rb) {
            // Global Settings
            frequency = rb.value;
            drawGraphic();

        }

        function changeScale(cb) {
            // Global Settings
            naturalScale = cb.checked;
            // Update with transition
            updateGraphic();
        }

        function showIndexes() {
            // Show/Hide Indexes
            d3.selectAll('.' + this.name).classed("opaque", !this.checked);

        }

        function changeLevel(id) {
            // Global Settings
            level = level + 1;
            selection = id.replace(/\d/g,'').split(' ')[0];
            // Show child button
            d3.select("#child").style("visibility", "visible").html(id.replace(/\d/g,'')).classed("active", true);
            d3.select("#overview").classed("active", false);
            // Draw from scratch
            drawGraphic();
        }

        function UpHome() {
            // Global Settings
            selection = "Overview";
            level = 0;
            // Hide child button
            d3.select("#child").style("visibility", "hidden");
            // Draw from scratch
            drawGraphic();
        }


        function drawGraphic() {

            graphic.empty();


            var threshold_md = 800;
            var threshold_sm = dvc.optional.mobileBreakpoint;

            var innerPadding_values = { // May need to make dynamic" && ie 2 charts displayed. Could put this in with button creation.
                //  t    r    b    l
                "sm":[ 50 , 25 , 50 , 40 ],
                "md":[ 35 , 10 , 40 , 40 ],
                "lg":[ 35 , 20 , 50 , 40 ]
            }

            //set variables for chart dimensions dependent on width of #graphic. Could put this in with button creation
            if (graphic.width() < threshold_sm) {
                var margin = {top: dvc.optional.margin_sm[0], right: dvc.optional.margin_sm[1], bottom: dvc.optional.margin_sm[2], left: dvc.optional.margin_sm[3]};
                var graphicWidth = graphic.width()/* - margin.left - margin.right*/;

                var innerPadding = { top : innerPadding_values.sm[0] ,  right : innerPadding_values.sm[1] ,  bottom : innerPadding_values.sm[2] ,  left : innerPadding_values.sm[3] }

                var numberColumns = dvc.essential.numColumns_sm_md_lg[0];

                var outerSvgWidth = graphicWidth / numberColumns,
                    outerSvgHeight = outerSvgWidth;
                width = outerSvgWidth - innerPadding.left - innerPadding.right;
                height = outerSvgHeight - innerPadding.top - innerPadding.bottom;

                var xAxisTextFormat = dvc.optional.xAxisTextFormat_sm_md_lg[0];

            } else if (graphic.width() < threshold_md){
                var margin = {top: dvc.optional.margin_md[0], right: dvc.optional.margin_md[1], bottom: dvc.optional.margin_md[2], left: dvc.optional.margin_md[3]};
                var graphicWidth = graphic.width()/* - margin.left - margin.right*/;

                var innerPadding = { top : innerPadding_values.md[0] ,  right : innerPadding_values.md[1] ,  bottom : innerPadding_values.md[2] ,  left : innerPadding_values.md[3] }

                var numberColumns = dvc.essential.numColumns_sm_md_lg[1];

                var outerSvgWidth = graphicWidth / numberColumns,
                    outerSvgHeight = outerSvgWidth;
                width = outerSvgWidth - innerPadding.left - innerPadding.right;
                height = outerSvgHeight - innerPadding.top - innerPadding.bottom;

                var xAxisTextFormat = dvc.optional.xAxisTextFormat_sm_md_lg[1];

            } else {
                var margin = {top: dvc.optional.margin_lg[0], right: dvc.optional.margin_lg[1], bottom: dvc.optional.margin_lg[2], left: dvc.optional.margin_lg[3]}
                var graphicWidth = graphic.width()/* - margin.left - margin.right*/;

                var innerPadding = { top : innerPadding_values.lg[0] ,  right : innerPadding_values.lg[1] ,  bottom : innerPadding_values.lg[2] ,  left : innerPadding_values.lg[3] }


                var numberColumns = dvc.essential.numColumns_sm_md_lg[2];

                var outerSvgWidth = graphicWidth / numberColumns,
                    outerSvgHeight = outerSvgWidth;
                width = outerSvgWidth - innerPadding.left - innerPadding.right;
                height = outerSvgHeight - innerPadding.top - innerPadding.bottom;

                var xAxisTextFormat = dvc.optional.xAxisTextFormat_sm_md_lg[2];
            }

            var fmt = dvc.essential.fmt;

            var currentData = dvc.graphic_data_full[frequency][level][selection];

            // define X, Y GLOBAL scales
            var x = d3.time.scale().range([0, width]).domain(d3.extent(currentData, function(d) { return d3.time.format(fmt).parse(d.date) } ));
            // console.log(x.domain());

            indexes = []
            $("input:checkbox[class=idxOption]:checked").get().forEach(function(cb) {
                indexes.push(cb.name)
            })



            yExtent = d3.extent(currentData, function(d) {
                if (+d.value !== 0)
                    return +d.value
            });


            yExtent[0] = Math.floor(yExtent[0]/10)*10;
            yExtent[1] = Math.ceil(yExtent[1]/10)*10;



            y = d3.scale.linear().range([height , 0]).domain(yExtent);

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .tickFormat(function (d, i) {
                    var textFmt = d3.time.format(xAxisTextFormat);
                    return textFmt(d);
                })
                .tickPadding(5);

            xAxis.tickValues(x.ticks(Math.max(width/80, 2)));

            yAxis = d3.svg.axis()
                .scale(y)
                .ticks(Math.max(height/50, 2))
                .orient("left");


            line = d3.svg.line()
                .defined(function(d) { return d.value != ''; })
                .x(function(d) { return x(d3.time.format(fmt).parse(d.date)); })
                .y(function(d) { return y(+d.value); });


            var dataByCategory = d3.nest()
                .key(function(d) { return d.category; })
                .key(function(d) { return d.index; })
                .entries(currentData);
            // console.log(dataByCategory);

            var div = d3.select("#graphic").selectAll(".chart").data(dataByCategory)

            div.enter().append("div").attr("class", "chart")
                .append("svg").append("g")

            var svg = div.select("svg")
                  .attr("width", outerSvgWidth )
                  .attr("height", outerSvgHeight )


            // Add category label on top of each graph
            svg.append("text")
                .attr('class', 'text')
                .attr("y" , 10)
                .style("fill" , "#666")
                .style("font-size" , ".9em")
                .attr('transform', 'translate(20,0)')
                .text(function(d){ return d.key.replace(/^[^(a-zA-Z)]*/g,''); });

            var g = svg.select("g")
                .attr("class", "graphArea")
                .attr("transform", "translate(" + innerPadding.left + "," + innerPadding.top + ")")


            g.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + (height + innerPadding.bottom/3) + ")")
                .call(xAxis);

            var gAxis = g.append("g")
              .attr("class", "y axis")
              .call(yAxis)

            yticks = g.select('.y')
                      .selectAll('.tick')
                      .append('svg:line')
                      .attr( 'y0' , 0 )
                      .attr( 'y1' , 0 )
                      .attr( 'x1' , 0 )
                      .attr( 'x2', width);

            lines = g.selectAll(".index").data(function (d) { return d.values})
                    .enter().append("g").attr("class", "index");

            lines.append("path")
              .attr("class", function(d) { return 'line line-' + indexOrder[d.key]; }) // line-X and index-X to be changed with index code
              .attr("test", function(d, i) { console.log(d.key); })
              .attr("d", function(d) {
                return line(d.values);
            })


            if (naturalScale) {
                d3.selectAll(".chart").each(function(d) {
                    var ymin = Math.floor(d3.min(d.values.map(function(index) {
                        return d3.min(index.values, function(c) {
                            if (+c.value !== 0)
                                return +c.value})
                    })));
                    var ymax = Math.ceil(d3.max(d.values.map(function(index) {
                        return d3.max(index.values, function(c) {return +c.value})
                    })));



                    if (ymax%2 != 0)
                        ymax = ymax + 1

                    if (ymin%2 != 0)
                        ymin = ymin - 1



                    var newExtent = [ymin, ymax]



                    y.domain(newExtent);

                    values = yAxis.scale().ticks(yAxis.ticks()[0])

                    while (values[values.length-1] < ymax) {

                        ymax++;
                        newExtent = [ymin, ymax]
                        y.domain(newExtent);
                        values = yAxis.scale().ticks(yAxis.ticks()[0])
                    }

                    while (values[0] > ymin) {

                        ymin--;
                        newExtent = [ymin, ymax]
                        y.domain(newExtent);
                        values = yAxis.scale().ticks(yAxis.ticks()[0])
                    }


                    d3.select(this).select("g.y.axis").call(yAxis)


                    // Move the ticks
                    d3.select(this).select("g.y.axis").selectAll('line').attr( 'x2', width)

                    // Move the indexes
                    d3.select(this).selectAll("g.index").selectAll("path").attr("d", function(d) {
                        return line(d.values);
                    });
                })
            }

            // Add '%' to the first graph of each row
            svg.filter(function(d, i) { return i%numberColumns == 0 })
                .append("text")
                .attr("class" , "label")
                .attr("x" , innerPadding.left/2)
                .attr("y" , innerPadding.top-10)
                .style("font-size" , "10px" )
                .style("font-weight" , "normal" )
                .style("text-anchor" , "start" )
                .text(dvc.essential.yAxisLabel);

            if (level == 0) {

                svg.append("rect")
                 .attr('class', 'squares')
                 .attr('id', function(d){ return d.key.replace(/^[^(a-zA-Z)]*/g,'').split(' ')[0]; })
                .attr('transform', 'translate(0,0)')
                .attr("width", outerSvgWidth)
                .attr("height", outerSvgHeight)
                .on("mouseover", function(){d3.select(this).style("stroke-width", 4);})
                .on("mouseout", function(){d3.select(this).style("stroke-width", 0);})
                .on("click", function (d) {
                  changeLevel(d.key);
                });
            }

            d3.selectAll(".idxOption").each(showIndexes);

        }

        function updateGraphic() {

            var currentData = dvc.graphic_data_full[frequency][level][selection];


            if (naturalScale) {
                d3.selectAll(".chart").each(function(d) {
                    var ymin = Math.floor(d3.min(d.values.map(function(index) {
                        return d3.min(index.values, function(c) {
                            if (+c.value !== 0)
                                return +c.value})
                    })));

                    alcol = d.values
                    var ymax = Math.ceil(d3.max(d.values.map(function(index) {
                        return d3.max(index.values, function(c) {return +c.value})
                    })));



                    if (ymax%2 != 0)
                        ymax = ymax + 1

                    if (ymin%2 != 0)
                        ymin = ymin - 1



                    var newExtent = [ymin, ymax]

                    



                    y.domain(newExtent);

                    values = yAxis.scale().ticks(yAxis.ticks()[0])

                    while (values[0] > ymin) {

                        ymin--;
                        newExtent = [ymin, ymax]
                        y.domain(newExtent);
                        values = yAxis.scale().ticks(yAxis.ticks()[0])
                        // console.log(values)

                    }

                    while (values[values.length-1] < ymax) {

                        ymax++;
                        newExtent = [ymin, ymax]
                        y.domain(newExtent);
                        values = yAxis.scale().ticks(yAxis.ticks()[0])
                        
                    }

                    d3.select(this).select("g.y.axis").transition().duration(1500).call(yAxis)


                    // Move the ticks
                    d3.select(this).select("g.y.axis").selectAll('line').transition().duration(100).attr( 'x2', width)

                    // Move the indexes
                    d3.select(this).selectAll("g.index").selectAll("path").transition().duration(1500).attr("d", function(d) {
                        return line(d.values);
                    });
                })
            } else {
                d3.selectAll(".chart").each(function(d) {


                    y.domain(yExtent);

                    d3.select(this).select("g.y.axis").transition().duration(1500).call(yAxis)


                    // Move the ticks
                    d3.select(this).select("g.y.axis").selectAll('line').transition().duration(100).attr( 'x2', width)

                    // Move the indexes
                    d3.select(this).selectAll("g.index").selectAll("path").transition().duration(1500).attr("d", function(d) {
                        return line(d.values);
                    });
                })


            }
        }

        function readData() {
            json_url = "data/data.json";
            d3.json(json_url, function(error, data) {
                dvc.graphic_data_full = data;
                pymChild = new pym.Child({renderCallback: drawGraphic});
            }) // end d3.json
        }// end readData()
