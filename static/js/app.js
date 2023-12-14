// OUTLINE
// Note:  The Bootcampspot/Canvas instructions are much improved compared to the 
// past so make sure to read those instructions from top to bottom.
// 1.  Webpage will have the following:
//     *  Dropdown that will allow selection of a name/id (created with D3.js)
//     *  Horizontal bar chart that shows data related to only the id (created with Plotly.js)
//     *  Bubble chart shows data related only to id (created with Plotly.js)
//     *  Summary section that only shows data related to id (created with D3.js)
//     *  Optional Gauge Chart (use reference to template in Canvas)
// 2.  So every graphic needs the id and the only part that is independent is the dropdown
// 3.  The dropdown has many options so it needs created dynamically based on what is in the data file
// 4.  The page will load with a default selected id but needs to update based on the dropdown selection
//     *  This tells me that I need to run code once with a default id and then the same code again with an id from the dropdown.
//     *  This sounds like a good time to use a function like  `createPlot(id)`
// 5.  Note:  The html already has several things built-in:
//     a.  you are given empty divs with ids called:
//         *  `selDataset` ==> used for the dropdown
//         *  `sample-metadata` ==> used for the summary data section
//         *  `bar` ==> used for the horizontal bar chrt
//         *  `gauge` ==> (optional) used for gauge chart
//         *  `bubble` ==> used for bubble chart
//     b.  There is an inline event handler in the html.  It looks like this:
//         `<select id="selDataset" onchange="optionChanged(this.value)"></select>`
//         This line of code is part of the dropdown, aka in html terms a `select`
//         If you look up the code for a select it is made up of options (dropdown entries)
//         and values associated with each option.  The value for the select is based on what option is selected.
//         i.e.  Dropdown has selected 'Subject 940' and maybe the value associated with this is `940`.
//               The '940' is captured by using 'this.value'... So 'this.value' captures the current selection value.
//               The 'optionChanged()' is a function that you need to make in your app.js that updates
//               some type of data filter that filters the data only related to '940' and then that 
//               data is used in all the charts.
//     c.  On Day 3 we covered event handlers from the js file but I don't think we covered inline event handlers in the html.  
//         The only differene is where we call them but otherwise they work the same.
//     d.  You already have the data connected - notice the names list matches the id's used in the 
//         other data structures below.  Inspect the data - there are several sections - which one would 
//         be used for each chart?  Look at the images in the readme and matchup the data.  There is not
//         much that needs done except filtering and ordering of the existing data.


// STRATEGIES
// 1.  Inside-Out:  Generate each chart by assuming an ID/name then refactor the code to 
//                  work for any ID/name coming from the function.  I typically do this practice.
// 2.  Outside-In:  Generate the control (dropdown) and how the control interacts with the other parts.
//                  I gave you the basics of how it interacts above.  You could generate the dropdown
//                  and then see in the console the ID/names update as you make a change.  Then you could
//                  make your chart code.

// Overall, the above are the two steps you need to do (1.  Make plots with data, 2. make dropdown that passes id to functions)
// You could do it in either order.  The code provided is only one way and the way that I thought would be the easiest 
// to implement since it will be similar to class activities.  

// SAMPLE STRUCTURE
// 1.  Check inspector console to see if each function is running on page load


// import sample.json from: https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

// function that contains instructions at page load/refresh
// function does not run until called
function init(){
    // code that runs once (only on page load or refresh)
    // this checks that our initial function runs.
    // console.log("The Init() function ran")

    // create dropdown/select
    let dropdownMenu = d3.select('#selDataset');

    // Fetch data from api and console log.
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        // create an array of id names
        let names = data.names;
        
        
        names.forEach((name) => {
            // console.log(name);
            dropdownMenu.append('option').text(name).property('value', name);
        });

        // choose default id to run on page open/refresh
        let name = names[0];

        summary(name);
        bar(name);
        bubble(name);
        // gauge(name);
    });

    // run functions to generate plots with default id = 940
    summary(selectedID)
    bar(selectedID)
    bubble(selectedID)
    
}

function summary(selectedID){
    // code that makes list, paragraph, text/linebreaks at id='sample-meta'
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        // retrieve an array of metadata objects
        let metadata = data.metadata;

        // filter based on value of the selection
        let selected = metadata.filter(i => i.id == selectedID);
        console.log(selected);
        
        let selectedData = metadata[0];
        
        // clear the 
        d3.select("#sample-metadata").html("");

        // Use Object.entries to return an array of the given object's properties
        Object.entries(selectedData).forEach(([key, value]) => {
            d3.select("#sample-metadata").append('h5').text(`${key}: ${value}`);
        });
        // checking to see if function is running
        // console.log(`This function generates summary info of ${selectedID} `)
    });
}

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
    console.log(`This function generates bar chart of ${selectedID} `)
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
}


//function guage(selectedID){
    // let metadata = data.metadata;

    // let metadataFilter = metadata.filter(i => i.id == selectedID);
    // let theData = metadataFilter[0];
//}



// function that runs whenever the dropdown is changed
// this function is in the HTML and is called with an input called 'this.value'
// that comes from the select element (dropdown)
function optionChanged(newID){
    // code that updates graphics
    // one way is to recall each function
    summary(newID)
    bar(newID)
    bubble(newID)

};

// function called, runs init instructions
// runs only on load and refresh of browser page
init()