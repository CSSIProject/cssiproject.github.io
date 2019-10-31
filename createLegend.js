
// create legend colors for a map

let createLegend = function(cols,labs,elementname='legend-body',containername='legend',orientation = "horizontal"){
    // Set up legend overlay
    // a list of colours and values
    //var cols = ["#d53e4f","#fc8d59","#fee08b","#ffffbf","#e6f598","#99d594","#3288bd"];
    //var labs = ['-100','-80','-60',"-40","-20","0","20"];
        
        if(orientation == "horizontal"){

            var values = document.createElement('div');
            var keys = document.createElement('div');
            var items = document.createElement('div');
            for (i = 0; i < labs.length; i++) {
                var lab = labs[i];
                var col = cols[i];
                var key = document.createElement('span');
                var value = document.createElement('span');
                key.className = 'legend-key';
                key.style.backgroundColor = col;
                key.style.marginRight = '0.1rem';          
                value.innerHTML = lab;
                value.style['text-align'] = 'right';
                value.style['writing-mode'] = 'vertical-rl';
                value.style.marginRight = '0.1rem';
                values.appendChild(value);
                keys.appendChild(key);
            };
            items.append(keys);
            items.append(values);
            items.style.marginTop = '0.2rem';
        }else if(orientation == "vertical"){
            var items = document.createElement('div');

            for (i = 0; i < labs.length; i++) {
                var lab = labs[i];
                var col = cols[i];
                var item = document.createElement('div');
                var key = document.createElement('span');
                key.className = 'legend-key';
                key.style.backgroundColor = col;
                var value = document.createElement('span');
                value.innerHTML = lab;
                item.appendChild(key);
                item.appendChild(value);
                items.appendChild(item);
            };

        }else{
            console.error("please select a valid orientation");
        };
        document.getElementById(elementname).innerHTML = items.outerHTML;
};

// modify the variables that can be selected based on forecast date


// creating a date jumper with selector

function createDateSelector(dates,elementname,today,short,mid){
    var dateselector = document.createElement('div');
    var jumpback = document.createElement('button');
    jumpback.className = 'btn-dark';
    jumpback.id = 'jumpbackdate';
    jumpback.innerHTML = "<<";
    var jumpforward = document.createElement('button');
    jumpforward.className = 'btn-dark';
    jumpforward.id = 'jumpforwarddate';
    jumpforward.innerHTML = ">>";
    var stepback = document.createElement('button');
    stepback.className = 'btn-dark';
    stepback.innerHTML = "<";
    stepback.id='backdate';
    console.log(stepback);
    var stepforward = document.createElement('button');
    stepforward.className = 'btn-dark';
    stepforward.id = 'fowarddate'; 
    stepforward.innerHTML = ">";

    var selector = document.createElement('select');
    selector.id = 'dateselect';
    var opt;
    for(i=0; i<dates.length; i++){
        opt = document.createElement('option');
        if(dates[i] < today){
            opt.className = 'histforecast';
            opt.disabled = true;
        }else if(dates[i] >= today & dates[i] < short){
            opt.className = 'shortforecast';
        }else if(dates[i] >= short & dates[i] < mid){
            opt.className = 'midforecast';
        }else{
            opt.className = 'longforecast';
        };
        opt.label = dateFormat(dates[i],"dddd dd mmmm");
        opt.value = i;
        if(dates[i] == today){opt.selected = true};
        opt.onclick = 'jumptodate(this)'; 
        selector.appendChild(opt);
    };
    dateselector.appendChild(jumpback);
    dateselector.appendChild(stepback);
    dateselector.appendChild(selector);
    dateselector.appendChild(stepforward);
    dateselector.appendChild(jumpforward);
document.getElementById(elementname).innerHTML = dateselector.innerHTML;
document.getElementById(elementname).style.display = "flex";
document.getElementById(elementname).style['justify-content'] = "space-between";
};

// a function to increment date by one
function datePlusOne(){
    let maxlen = document.getElementById('dateselect').length - 1;
    let temp = forecastdisplayIndex + 1;
    if(temp > maxlen){temp = maxlen};
    forecastdisplayIndex = temp;
    getforecastVar(document.getElementById('forecastplotvar'));
    document.getElementById('dateselect')[temp].selected=true;
};
// a function to step date back by one
function dateMinusOne(){
    let temp = forecastdisplayIndex - 1;
    if(temp < 7){temp = 7};
    forecastdisplayIndex = temp;
    getforecastVar(document.getElementById('forecastplotvar'));
    document.getElementById('dateselect')[temp].selected=true;
};
// a function to jump forward to next date set
function dateJumpForward(){

};
// a function to jump back to last date set
function dateJumpBackward(){

};
// a function to jump to a given date
function jumpToDate(){

};


