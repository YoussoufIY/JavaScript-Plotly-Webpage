//The goal is to dynamic plots that will update when a new sample is selected from the dropdown menu


//Use the D3 library to read in samples.json from the URL https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";


//create a bar chart plot for the landing page using Id 940
function init() {
    d3.json(url).then((data)=> {
    let bar_x = data.samples[0].sample_values.slice(0,10).reverse();
    let bar_y = data.samples[0].otu_ids.slice(0,10).reverse();
    let bar_labels = data.samples[0].otu_labels.slice(0,10).reverse();
    let bar_trace = {
        x: bar_x,
        y: bar_y,
        text: bar_labels,
        type: "bar",
        orientation: "h"
    };
    let bar_data = [bar_trace];
    let bar_layout = {
        title: "Top 10 OTUs",
        xaxis: {title: "Sample Values"},
        yaxis: {type:"category", title: "OTU ID"}
    };
    Plotly.newPlot("bar", bar_data, bar_layout);
    
    //bubble chart
    let bubble_x = data.samples[0].otu_ids;
    let bubble_y = data.samples[0].sample_values;
    let bubble_labels = data.samples[0].otu_labels;
    let bubble_trace = {
        x: bubble_x,
        y: bubble_y,
        text: bubble_labels,
        mode: "markers",
        marker: {
            size: bubble_y,
            color: bubble_x
        }
    };
    let bubble_data = [bubble_trace];
    let bubble_layout = {
        title: "OTU ID vs Sample Values",
        xaxis: {title: "OTU ID"},
        yaxis: {title: "Sample Values"}
    };
    Plotly.newPlot("bubble", bubble_data, bubble_layout);

    });

};



//create a selector for the dropdown menu to select a new sample
function selector() {
    d3.json(url).then((data)=> {
        let dropdown = d3.select("#selDataset");
        let names = data.names;
        for (var i=0;i<names.length;i++){
            dropdown.append("option").text(names[i]).property("value", names[i]);
        };
    });
}	
selector();

//Call optionChanged() when a new sample is selected from the dropdown menu
d3.selectAll("#selDataset").on("change", optionChanged);





// //create a function called optionChanged() with the new sample as a parameter to update the plots using plotly.restyle()
function optionChanged(newSample) {
    d3.json(url).then((data)=> {
        let samples = data.samples;
        let resultArray = samples.filter(sampleObj => sampleObj.id == newSample);
        let result = resultArray[0];
        console.log(result)
        let bar_x = result.sample_values.slice(0,10).reverse();
        console.log(bar_x)
        let bar_y = result.otu_ids.slice(0,10).reverse();
        let bar_labels = result.otu_labels.slice(0,10).reverse();
        Plotly.restyle("bar", "x", [bar_x]);
        Plotly.restyle("bar", "y", [bar_y]);
        Plotly.restyle("bar", "text", [bar_labels]);

        let bubble_x = result.otu_ids;
        let bubble_y = result.sample_values;
        let bubble_labels = result.otu_labels;
        Plotly.restyle("bubble", "x", [bubble_x]);
        Plotly.restyle("bubble", "y", [bubble_y]);
        Plotly.restyle("bubble", "text", [bubble_labels]);
        Plotly.restyle("bubble", "marker.size", [bubble_y]);
        Plotly.restyle("bubble", "marker.color", [bubble_x]);
    });
};

init();