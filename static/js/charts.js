function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

//Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
       PANEL.append("h5").text(`${key.toUpperCase()}: ${value}`);
    });
});
}

// ---------------Deliverable 1--------------------------------

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
        var sampleChart = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
        var filterResult = sampleChart.filter(matchObj =>matchObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
        var result = filterResult[0];


    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
        var otuIds = result.otu_ids;
        var otuLabels = result.otu_labels;
        var sampleValue = result.sample_values;


    // 7. Create the yticks for the bar chart.

    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIds.slice(0,10).reverse().map(function (elem) {return `OTU ${elem}`});
    var xticks = sampleValue.slice(0,10).reverse();
    var labels = otuLabels.slice(0,10).reverse();
   

    // 8. Create the trace for the bar chart. 
    var trace1 = {
      x: xticks,
      y: yticks,
      
      text:labels,
      orientation: "h",
      type: "bar"
    };
    // 9. Create the layout for the bar chart. 
    var barData =[trace1]
    var barLayout = {
      title:  "Top 10 Bacteria Culture Found",
     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData ,barLayout);
  //});
//}

//------------------Deliverable 2--------------------------

// Bar and Bubble charts

    // Deliverable 1 Step 10. Use Plotly to plot the data with the layout. 
    //Plotly.newPlot(); 

    // 1. Create the trace for the bubble chart.
    var trace2 = {
        x: otuIds,
        y: sampleValue,
        
        text: otuLabels,
        mode: "markers",
        marker: {
          size: sampleValue,
          color: otuIds,
          colorscale: 'RdBu',
         
    }
  };
    // 2. Create the layout for the bubble chart.
    var bubbleData= [trace2]
    var bubbleLayout = {
      title:"Bacteria Culture Per Sample",
      xaxis:{title:"OTU ID"},
     
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

 
    1. //Create a variable that filters the metadata array for the object with the desired sample number.
        var metadata = data.metadata;
        var filterMetadata = metadata.filter(matchObj =>matchObj.id == sample);

    // 2. Create a variable that holds the first sample in the metadata array.
        var metadatArray = filterMetadata[0];

    // 3. Create a variable that holds the washing frequency.
        var frequency = parseInt(metadatArray.wfreq);


    // 4. Create the trace for the gauge chart.
    var gaugeData= [
      {
        value: frequency,
        title: { text: "Belly Button Washing Frequency<br>Scrubs per Week" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {  
          axis: {range: [null,10]},
          steps: [
            { range :[0,2], color:"red"},
            { range :[2,4], color:"orange"},
            { range :[4,6], color:"yellow"},
            { range :[6,8], color:"yellowgreen"},
            { range :[8,10],color:"green"}
          ]
        }
      }
    ];
   
    
    // 5. Create the layout for the gauge chart.
    
    var gaugeLayout = { width: 460, height: 300, margin: {t: 0, b: 0}
  };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}