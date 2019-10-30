// create a legend for a map

let createlegendtitle = function(labels,values){
    var selector = document.createElement('select')
    for (i = 0; i < labels.length; i++) {
        var opt = document.createElement('option');
        opt.innerHTML = labels[i];
        opt.value = values[i];
        
}



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