function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    var url = `/metadata/${sample}`
    var dictdata = {}
d3.json(url).then(function(data){
  
dictdata = data

d3.select('#sample-metadata').html("")
Object.entries(dictdata).forEach(([key, value]) =>{

  d3.select('#sample-metadata').append('p').text(key + ": " + value)
})
var level = data['WFREQ'];

// Trig to calc meter point
var degrees = 180 - (20 * level),
     radius = .5;
var radians = degrees * Math.PI / 180;

var x = radius * Math.cos(radians);
var y = radius * Math.sin(radians);

// Path: may have to change to create a better triangle
var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
     pathX = String(x),
     space = ' ',
     pathY = String(y),
     pathEnd = ' Z';
var path = mainPath.concat(pathX,space,pathY,pathEnd);

var data = [{ type: 'scatter',
   x: [0], y:[0],
    marker: {size: 28, color:'850000'},
    showlegend: false,
    name: 'Wash Frequency',
    text: level,
    hoverinfo: 'text+name'},
  { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9,50/9, 50],
  rotation: 90,
  text: ['8-9', '7-8', '6-7', '5-6','4-5', '3-4','2-3','1-2','0-1',''],
  textinfo: 'text',
  textposition:'inside',
  marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                         'rgba(140, 202, 42, .5)', 'rgba(180, 209, 95, .5)',
                         'rgba(200, 206, 145, .5)', 'rgba(210, 226, 202, .5)', 'rgba(230, 236, 202, .5)'
                         , 'rgba(236, 240, 212, .5)', 'rgba(242, 240, 232, .5)',
                         'rgba(255, 255, 255, 0)']},
  labels: ['8-9', '7-8', '6-7', '5-6','4-5', '3-4','2-3','1-2','0-1',''],
  hoverinfo: 'label',
  hole: .5,
  type: 'pie',
  showlegend: false
}];

var layout = {
  shapes:[{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000'
      }
    }],
  title: '<b>Belly Button Washing Frequency</b><br>Scrubs per Week',
 autosize:true,
  xaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]},
  yaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]}
};

Plotly.newPlot('gauge', data, layout);

})
    // Use `.html("") to clear any existing metadata
    
  //  
  
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    console.log(d3.select('#bubble').width)
    d3.json(`/samples/${sample}`).then((data) => {
      layout = {autosize:true,
        height:600
        
        
      }
      trace = {
        x:data['otu_ids'],
        y:data['sample_values'],
        mode:'markers',
        marker:{
          size: data['sample_values'],
          color:data['otu_ids']
        },
        text:data['otu_labels']

        
        

      }
      Plotly.newPlot('bubble', [trace], layout)
      
      layout2 = {
       
      }

      trace2 = {
        labels:data['otu_ids'].slice(0,10),
        values:data['sample_values'].slice(0,10),
        type:'pie',
        hovertext:data['otu_labels'].slice(0,10),

      }

     
      Plotly.newPlot('pie', [trace2], layout2)
    })
}



function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    
    sampleNames.forEach((sample) => {
      selector
        .append("option") 
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

