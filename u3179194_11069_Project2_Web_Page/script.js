/* Based on D3.js chart (with modifications) from Alan Duning's Block - https://bl.ocks.org/alandunning/cfb7dcd7951826b9eacd54f0647f48d3 */

(function () {
  var margin = { left: 80, right: 100, top: 50, bottom: 100 };

  var height = 400 - margin.top - margin.bottom;

  var width = 600 - margin.left - margin.right;

  var svg = d3v5
    .select('#yearlyHighs')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  var g = svg.append('g').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

  // Time parser for x-scale
  var parseTime = d3v5.timeParse('%Y');
  // For tooltip
  var bisectDate = d3v5.bisector(function (d) {
    return d.year;
  }).left;

  // Scales
  var x = d3v5.scaleTime().range([0, width]);
  var y = d3v5.scaleLinear().range([height, 0]);

  // Axis generators
  var xAxisCall = d3v5.axisBottom();
  var yAxisCall = d3v5
    .axisLeft()
    .ticks(6)
    .tickFormat(function (d) {
      return parseInt(d);
    });

  // Axis groups
  var xAxis = g
    .append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')');
  var yAxis = g.append('g').attr('class', 'y axis');

  // Y-Axis label
  yAxis
    .append('text')
    .attr('class', 'axis-title')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '.71em')
    .style('text-anchor', 'end')
    .attr('fill', '#5D6971');
  // .text('Yearly High (USD)');

  // Line path generator
  var line = d3v5
    .line()
    .x(function (d) {
      return x(d.year);
    })
    .y(function (d) {
      return y(d.value);
    });

  d3v5.json('bitcoinYearlyHighs.json').then(function (data) {
    // Data cleaning
    data.forEach(function (d) {
      d.year = parseTime(d.year);
      d.value = +d.value;
    });

    // Set scale domains
    x.domain(
      d3v5.extent(data, function (d) {
        return d.year;
      })
    );
    y.domain([
      d3v5.min(data, function (d) {
        return d.value;
      }) / 1.005,
      d3v5.max(data, function (d) {
        return d.value;
      }) * 1.005
    ]);

    // Generate axes once scales have been set
    xAxis.call(xAxisCall.scale(x));
    yAxis.call(yAxisCall.scale(y));

    // Add line to chart
    g.append('path')
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', '#008fd5')
      .attr('stroke-with', '3px')
      .attr('d', line(data));

    // Tooltip Code
    var focus = g
      .append('g')
      .attr('class', 'focus')
      .style('display', 'none');

    focus
      .append('line')
      .attr('class', 'x-hover-line hover-line')
      .attr('y1', 0)
      .attr('y2', height);

    focus
      .append('line')
      .attr('class', 'y-hover-line hover-line')
      .attr('x1', 0)
      .attr('x2', width);

    focus.append('circle').attr('r', 7.5);

    focus
      .append('text')
      .attr('x', 15)
      .attr('dy', '.31em');

    g.append('rect')
      .attr('class', 'overlay')
      .attr('width', width)
      .attr('height', height)
      .on('mouseover', function () {
        focus.style('display', null);
      })
      .on('mouseout', function () {
        focus.style('display', 'none');
      })
      .on('mousemove', mousemove);

    function mousemove () {
      var x0 = x.invert(d3v5.mouse(this)[0]);

      var i = bisectDate(data, x0, 1);

      var d0 = data[i - 1];

      var d1 = data[i];

      var d = x0 - d0.year > d1.year - x0 ? d1 : d0;
      focus.attr('transform', 'translate(' + x(d.year) + ',' + y(d.value) + ')');
      focus.select('text').text(d.value);
      focus.select('.x-hover-line').attr('y2', height - y(d.value));
      focus.select('.y-hover-line').attr('x2', -x(d.year));
    }
  });
})();

/* Based on D3.js chart (with modifications) from Yong Lee's Block - https://bl.ocks.org/Qizly/8f6ba236b79d9bb03a80 */

/* Dynamic/Interactiviy elements based on tutorial "Mastering Data Visualization in D3.js by Adam Jones" */

/* I could not work out why the options element would only work when cycling down the list - requires a page refresh to reset to Full Year ??? */

(function () {
  var h = 300;
  var w = 600;
  var padding = 40;

  function getDate (d) {
    var strDate = new String(d);

    var year = strDate.substr(0, 4);
    var month = strDate.substr(4, 2) - 1; // months start at 0
    var month = strDate.substr(4, 2) - 1; // months start at 0
    var day = strDate.substr(6, 2);

    return new Date(year, month, day);
  }

  function buildLine (ds) {
    var minDate = getDate(ds.closePrice[0]['month']);
    console.log(minDate);
    var maxDate = getDate(ds.closePrice[ds.closePrice.length - 1]['month']);
    console.log(maxDate);

    var tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    var xScale = d3.time
      .scale()
      .domain([minDate, maxDate])
      .range([padding + 5, w - padding]);

    var yScale = d3.scale
      .linear()
      .domain([
        0,
        d3.max(ds.closePrice, function (d) {
          return d.price;
        })
      ])
      .range([h - padding, 10]);

    var xAxisGen = d3.svg
      .axis()
      .scale(xScale)
      .orient('bottom')
      .tickFormat(d3.time.format('%b'));

    var yAxisGen = d3.svg
      .axis()
      .scale(yScale)
      .orient('left')
      .ticks(12);

    var lineFun = d3.svg
      .line()
      .x(function (d) {
        return xScale(getDate(d.month));
      })
      .y(function (d) {
        return yScale(d.price);
      })
      .interpolate('linear');

    var svg = d3
      .select('#allTimeHigh')
      .append('svg')
      .attr({ width: w, height: h, id: 'svg-' + ds.token });

    var yAxis = svg
      .append('g')
      .call(yAxisGen)
      .attr('class', 'y-axis')
      .attr('transform', 'translate(' + padding + ', 0)');

    var xAxis = svg
      .append('g')
      .call(xAxisGen)
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + (h - padding) + ')');

    var sparkline = svg
      .append('path')
      .transition()
      .duration(1000)
      .ease('linear')
      .attr({
        d: lineFun(ds.closePrice),
        stroke: '#008fd5',
        'stroke-width': 2,
        fill: 'none',
        class: 'path-' + ds.token
      });

    var dots = svg
      .selectAll('circle')
      .data(ds.closePrice)
      .enter()
      .append('circle')
      .attr({
        cx: function (d) {
          return xScale(getDate(d.month));
        },
        cy: function (d) {
          return yScale(d.price);
        },
        r: 4,
        fill: '#666666',
        class: 'circle-' + ds.token
      })
      .on('mouseover', function (d) {
        tooltip
          .transition()
          .duration(500)
          .style('opacity', 0.85);
        tooltip
          .html('<strong>Price $' + d.price + '</strong>')
          .style('left', d3.event.pageX + 'px')
          .style('top', d3.event.pageY - 28 + 'px');
      })
      .on('mouseout', function (d) {
        tooltip
          .transition()
          .duration(300)
          .style('opacity', 0);
      });
  }

  function updateLine (ds) {
    var minDate = getDate(ds.closePrice[0]['month']);
    var maxDate = getDate(ds.closePrice[ds.closePrice.length - 1]['month']);

    var xScale = d3.time
      .scale()
      .domain([minDate, maxDate])
      .range([padding + 5, w - padding]);

    var yScale = d3.scale
      .linear()
      .domain([
        0,
        d3.max(ds.closePrice, function (d) {
          return d.price;
        })
      ])
      .range([h - padding, 10]);

    var xAxisGen = d3.svg
      .axis()
      .scale(xScale)
      .orient('bottom')
      .tickFormat(d3.time.format('%b'))
      .ticks(ds.closePrice.length - 1);

    var yAxisGen = d3.svg
      .axis()
      .scale(yScale)
      .orient('left')
      .ticks(4);

    var lineFun = d3.svg
      .line()
      .x(function (d) {
        return xScale(getDate(d.month));
      })
      .y(function (d) {
        return yScale(d.price);
      })
      .interpolate('linear');

    var svg = d3.select('body').select('#svg-' + ds.token);

    var yAxis = svg.selectAll('g.y-axis').call(yAxisGen);

    var xAxis = svg.selectAll('g.x-axis').call(xAxisGen);

    var sparkline = svg
      .selectAll('.path-' + ds.token)
      .transition()
      .duration(1000)
      .ease('linear')
      .attr({
        d: lineFun(ds.closePrice),
        stroke: '#008fd5',
        'stroke-width': 2,
        fill: 'none'
      });

    // Update position of dots on options change
    var dots = svg
      .selectAll('.circle-' + ds.token)
      .transition()
      .duration(500)
      .ease('ease')
      .attr({
        cx: function (d) {
          return xScale(getDate(d.month));
        },
        cy: function (d) {
          return yScale(d.price);
        }
      });
  }

  function showHeader (ds) {
    d3.select('div#allTimeHigh')
      .append('h3')
      .attr('class', 'title')
      .text(ds.token + ' Monthly High Price (USD) (2017-2018)');
  }

  d3.json('CryptoAllTimeHigh.json', function (error, data) {
    if (error) {
      console.log(error);
    } else {
      // loaded json file correctly
    }

    data.contents.forEach(function (ds) {
      console.log(ds);
      buildLine(ds);
      showHeader(ds);
    });

    // add event listener
    d3.select('select').on('change', function (d, i) {
      var sel = d3.select('#date-option').node().value;

      data.contents.forEach(function (ds) {
        // filter array based on selection
        ds.closePrice.splice(0, ds.closePrice.length - sel);

        updateLine(ds);
      });
    });
  });
})();
