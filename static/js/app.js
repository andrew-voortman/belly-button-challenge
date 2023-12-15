// import sample.json from: https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

// code that runs once (only on page load or refresh),
// function does not run until called at the end of code.
function init(){
    // this checks that our initial function runs.
    console.log("The Init() function ran");

    // create dropdownmenu using d3
    let dropDownMenu = d3.select('#selDataset');

    // Fetch data from api using d3 and console log the data.
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        // create an array of id names
        let names = data.names;
        
        // Add names to dropdownmenu
        names.forEach((name) => {
            // console.log(name);
            dropDownMenu.append('option').text(name).property('value', name);
        });

        // choose default id to run on page open/refresh
        let name = names[0];
        
        // run functions to generate plots with default id = 940
        summary(name);
        bar(name);
        bubble(name);
    });
        
}

// create a function that utilizes metadata information to create a summary of
// all data available for the selected id
function summary(selectedID){
    // Fetch data from api using d3.
    d3.json(url).then((data) => {

        // retrieve an array of metadata objects
        let metadata = data.metadata;

        // filter based on value of the selection
        let selected = metadata.filter(i => i.id == selectedID);
        
        // get the first index of the array
        let selectedData = selected[0];
        
        // clear html element using d3
        d3.select("#sample-metadata").html("");

        // Use Object.entries to return an array of the each key/value
        Object.entries(selectedData).forEach(([key, value]) => {
            // code to append and makes list, paragraph, text/linebreaks at id='sample-meta'
            d3.select("#sample-metadata").append('h5').text(`${key}: ${value}`);
        });
    });
};

function bar(selectedID){
    // code that makes bar chart at id='bar'
    d3.json(url).then((data) => {
        
        let samples = data.samples;

        let sampleFilter = samples.filter(i => i.id == selectedID);
        let sample = sampleFilter[0];
        console.log('sample', sample);

        let otu_ids = sample.otu_ids;
        let otu_labels = sample.otu_labels;
        let sample_values = sample.sample_values;
        console.log('ids', otu_ids);
        console.log('labels', otu_labels);
        console.log('sample values', sample_values);

        let bartrace = [{
            x: sample_values.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).map(ids => `OTU ${ids}`).reverse(),
            text: otu_labels.slice(0,10).reverse(),
            type: 'bar',
            orientation: 'h'
        }];

        let layout = {
            title: `Top 10 OTUs for id: ${selectedID}`,
            
        };

        Plotly.newPlot('bar', bartrace, layout);
    });
    // checking to see if function is running
    //console.log(`This function generates bar chart of ${selectedID} `)
}

function bubble(selectedID){
    // code that makes scatter plot at id='bubble'
    d3.json(url).then((data) => {
        
        let samples = data.samples;

        let sampleFilter = samples.filter(i => i.id == selectedID);
        let sample = sampleFilter[0];

        let otu_ids = sample.otu_ids;
        let otu_labels = sample.otu_labels;
        let sample_values = sample.sample_values;

        let bubbletrace = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
              size: sample_values,
              color: otu_ids,
              colorscale: 'Blues'
            }
        }];

        let layout = {
            title: `Amount of Bacteria Found for id: ${selectedID}`
        };

        Plotly.newPlot('bubble', bubbletrace, layout);
    // checking to see if function is running
    console.log(`This function generates scatter plot of ${selectedID} `)
    });
};

// create a function that runs whenever the dropdown is changed
// this function is in the HTML and is called with an input called 'this.value'
// that comes from the select element (dropdown (#selDataSet))
function optionChanged(newID){
    // code that updates graphics
    // recall each function and set input to the new id
    summary(newID)
    bar(newID)
    bubble(newID)

};

// function called, runs init instructions
// runs only on load and refresh of browser page
init()