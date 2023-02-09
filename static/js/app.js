//The goal is to dynamic plots that will update when a new sample is selected from the dropdown menu


//Use the D3 library to read in samples.json from the URL https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";


//create an init function that will display all of the charts for the default sample (ID 940)
function init() {
    d3.json(url).then((data)=> {
    //Bar chart
    let bar_x = data.samples[0].sample_values.slice(0,10).reverse();
    let bar_y = data.samples[0].otu_ids.slice(0,10).reverse();
    let bar_labels = data.samples[0].otu_labels.slice(0,10).reverse();
    let bar_trace = {
        x: bar_x,
        y: bar_y.map(otu_id => `OTU ${otu_id}`),
        text: bar_labels,
        type: "bar",
        orientation: "h"
    };
    let bar_data = [bar_trace];
    let bar_layout = {
        title: "Top 10 OTUs",
        xaxis: {title: "Sample Values"},
        yaxis: {type:"category"}
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

    //Create a custome gauge chart which displays the washing frequency of the subject
    d3.json(url).then((data)=> {
        let metadata = data.metadata;
        let resultArray = metadata.filter(sampleObj => sampleObj.id == 940);
        let result = resultArray[0];

        let var_data = [{
            type: "indicator",
            mode: "gauge",
            value: result.wfreq,
            title: { text: "Belly Button Washing Frequency", font: { size: 24 } },
            
            gauge: {
                axis:{ range:[null, 9], tickwidth:1, tickcolor:"black",dtick: 1,nticks:9,tick0:0,ticks:"",ticktext: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9"]
                ,tickvals:[0,1,2,3,4,5,6,7,8,9],tickmode:"array"},
                bar: { color: "transparent" },
                range: { min: 0, max: 9 },
                showticklabels:true,
                ticklabelstep:1,
                bgcolor:"white",
                borderwidth:2,
                bordercolor:"gray",
                steps:[
                    { range: [0, 1], color: "#FAF5EF" },
                    { range: [1, 2], color: "#FFF1E6" },
                    { range: [2, 3], color: "#E7DECC" },
                    { range: [3, 4], color: "#E2E868" },
                    { range: [4, 5], color: "#D0DF00" },
                    { range: [5, 6], color: "#7A9A01" },
                    { range: [6, 7], color: "#669900" },
                    { range: [7,8], color: "#339900" },
                    { range: [8,9], color: "#336633" }],
            }
        }];
        var theta = 165 - 15*result.wfreq
        var r = 0.5
        var x_head = r * Math.cos(Math.PI/180*theta)
        var y_head = r * Math.sin(Math.PI/180*theta)

        let var_layout = {  width: 600, height: 500, margin: { t: 25, r: 25, l: 25, b: 25 },
        xaxis: {range: [0, 1], showgrid: false, 'zeroline': false, 'visible': false},
        yaxis: {range: [0, 1], showgrid: false, 'zeroline': false, 'visible': false},
        showlegend: false,
        annotations: [{ax:0.5, ay:0.25, axref:'x', yref:'y', showarrow:true, arrowhead:2, text:"Scrubs per Week", x:0.5+x_head, y:y_head, arrowcolor: 'red', arrowheadsize:1,
        axref:"x",ayref:'y', font: { size: 20 }}],
        font: { color: "black", family: "Arial" } };
        Plotly.newPlot('gauge', var_data, var_layout);

    //Display the sample metadata, i.e., an individual's demographic information
    
        let panel = d3.select("#sample-metadata");
        panel.html("");
        Object.entries(result).forEach(([key, value]) => {      
        panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    });
};
   
//Selector for the dropdown menu to select a new sample
function selector() {
    d3.json(url).then((data)=> {
    //d3.select("#selDataset") is a method that selects the dropdown menu on the page
        let dropdown = d3.select("#selDataset");
        console.log(dropdown)
        let names = data.names;
        console.log(names)
        for (var i=0;i<names.length;i++){
        //.append("option") is a method that appends a new option element to the dropdown menu
        //.text(names[i]) is a method that sets the text of the option element to the name of the sample
        //.property("value", names[i]) is a method that sets the value of the option element to the name of the sample
            dropdown.append("option").text(names[i]).property("value", names[i]);
            console.log(dropdown);
        };
        console.log(dropdown);
    });
}	
selector();

//Function to update the charts and metadata when a new sample is selected
function optionChanged(newSample) {
    d3.json(url).then((data)=> {
        let samples = data.samples;
        //filter() is a method that filters the samples array for the object with the id that matches the newSample
        let resultArray = samples.filter(sampleObj => sampleObj.id == newSample);
        let result = resultArray[0];
        console.log(result)
        let bar_x = result.sample_values.slice(0,10).reverse();
        console.log(bar_x)
        let bar_y = result.otu_ids.slice(0,10).reverse();
        let bar_labels = result.otu_labels.slice(0,10).reverse();
        let bar_trace = {
            x: bar_x,
            y: bar_y.map(otu_id => `OTU ${otu_id}`),
            text: bar_labels,
            type: "bar",
            orientation: "h"
        };
        let bar_data = [bar_trace];
        let bar_layout = {
            title: "Top 10 OTUs",
            xaxis: {title: "Sample Values"},
            yaxis: {type:"category"}
        };
        Plotly.newPlot("bar", bar_data, bar_layout);

        let bubble_x = result.otu_ids;
        let bubble_y = result.sample_values;
        let bubble_labels = result.otu_labels;
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
  //Create a custome gauge chart which displays the washing frequency of the subject
  d3.json(url).then((data)=> {
    let metadata = data.metadata;
    let resultArray = metadata.filter(sampleObj => sampleObj.id == newSample);
    let result = resultArray[0];

    let var_data = [{
        type: "indicator",
        mode: "gauge",
        value: result.wfreq,
        title: { text: "Belly Button Washing Frequency", font: { size: 24 } },
        
        gauge: {
            axis:{ range:[null, 9], tickwidth:1, tickcolor:"black",dtick: 1,nticks:9,tick0:0,ticks:"",ticktext: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9"]
            ,tickvals:[0,1,2,3,4,5,6,7,8,9],tickmode:"array"},
            bar: { color: "transparent" },
            range: { min: 0, max: 9 },
            showticklabels:true,
            ticklabelstep:1,
            bgcolor:"white",
            borderwidth:2,
            bordercolor:"gray",
            steps:[
                { range: [0, 1], color: "#FAF5EF" },
                { range: [1, 2], color: "#FFF1E6" },
                { range: [2, 3], color: "#E7DECC" },
                { range: [3, 4], color: "#E2E868" },
                { range: [4, 5], color: "#D0DF00" },
                { range: [5, 6], color: "#7A9A01" },
                { range: [6, 7], color: "#669900" },
                { range: [7,8], color: "#339900" },
                { range: [8,9], color: "#336633" }],
        }
    }];
    var theta = 165 - 15*result.wfreq
    var r = 0.5
    var x_head = r * Math.cos(Math.PI/180*theta)
    var y_head = r * Math.sin(Math.PI/180*theta)

    let var_layout = {  width: 600, height: 500, margin: { t: 25, r: 25, l: 25, b: 25 },
    xaxis: {range: [0, 1], showgrid: false, 'zeroline': false, 'visible': false},
    yaxis: {range: [0, 1], showgrid: false, 'zeroline': false, 'visible': false},
    showlegend: false,
    annotations: [{ax:0.5, ay:0.25, axref:'x', yref:'y', showarrow:true, arrowhead:2, text:"Scrubs per Week", x:0.5+x_head, y:y_head, arrowcolor: 'red', arrowheadsize:1,
    axref:"x",ayref:'y', font: { size: 20 }}],
    font: { color: "black", family: "Arial" } };
    
    Plotly.newPlot('gauge', var_data, var_layout);

//Display the sample metadata, i.e., an individual's demographic information

    let panel = d3.select("#sample-metadata");
    panel.html("");
    Object.entries(result).forEach(([key, value]) => {      
    panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
};



init();