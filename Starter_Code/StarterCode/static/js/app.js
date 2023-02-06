//The goal is to create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.


//Use the D3 library to read in samples.json from the URL https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

//create a bar chart plot for the landing page using Id 940
function plot() {
    d3.json(url).then((data)=> {
    let x = data.samples[0].sample_values.slice(0,10).reverse();
    let y = data.samples[0].otu_ids.slice(0,10).reverse();
    let labels = data.samples[0].otu_labels.slice(0,10).reverse();
    let trace = {
        x: x,
        y: y,
        text: labels,
        type: "bar",
        orientation: "h"
    };
    let data1 = [trace];
    let layout = {
        title: "Top 10 OTUs",
        xaxis: {title: "Sample Values"},
        yaxis: {type:"category", title: "OTU ID"}
    };
    Plotly.newPlot("bar", data1, layout);
    });
};



//create a bubble chart plot for the landing page using Id 940
function bubble() {
    d3.json(url).then((data)=> {
    let x = data.samples[0].otu_ids;
    let y = data.samples[0].sample_values;
    let labels = data.samples[0].otu_labels;
    let trace = {
        x: x,
        y: y,
        text: labels,
        mode: "markers",
        marker: {
            size: y,
            color: x
        }
    };
    let data1 = [trace];
    let layout = {
        title: "OTU ID vs Sample Values",
        xaxis: {title: "OTU ID"},
        yaxis: {title: "Sample Values"}
    };
    Plotly.newPlot("bubble", data1, layout);
    });
};


//Call ChangePlot() when a new sample is selected from the dropdown menu
d3.selectAll("#selDataset").on("change", optionChanged);


//create a function that will update the plots and metadata when a new sample is selected from the dropdown menu
function optionChanged() {
    d3.json(url).then((data)=> {
        let dropdown = d3.select("#selDataset");
        let names = data.names;
        for (var i=0;i<names.length;i++){
            dropdown.append("option").text(names[i]).property("value", names[i]);
        };
            let dataset= dropdown.property("value");
            if (dataset == names[i]){
            let x = data.samples[i].sample_values.slice(0,10).reverse();
            let y = data.samples[i].otu_ids.slice(0,10).reverse();
            let labels = data.samples[i].otu_labels.slice(0,10).reverse();
            let trace = {
                x: x,
                y: y,
                text: labels,
                type: "bar",
                orientation: "h"
            };
            let data1 = [trace];
            let layout = {
                title: "Top 10 OTUs",
                xaxis: {title: "Sample Values"},
                yaxis: {type:"category", title: "OTU ID"}
            };
            Plotly.restyle("bar", data1, layout);
            
            let bubble_x = data.samples[i].otu_ids;
            let bubble_y = data.samples[i].sample_values;
            let bubble_labels = data.samples[i].otu_labels;
            let bubble_trace = {
                x: bubble_x,
                y: bubble_y,
                text: bubble_labels,
                mode: "markers",
                marker: {
                    size: y,
                    color: x
                }
            };
            let bubble_data = [bubble_trace];
            let bubble_layout = {
                title: "OTU ID vs Sample Values",
                xaxis: {title: "OTU ID"},
                yaxis: {title: "Sample Values"}
            };
            Plotly.restyle("bubble", bubble_data, bubble_layout);
        };
    });

};



    
plot();
bubble();
