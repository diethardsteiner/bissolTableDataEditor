function bissolCreateSelect(myCdeContainerId, myDashboardObjectId, myLabelText, myData, cdeParam){
//NOTE: if myData has more than one column, the first one will then we used as the id and the second on as value 
    
    console.log(myDashboardObjectId + " with following values: " + JSON.stringify(myData));
    
    // 1. Check if data is available
    if(myData.length > 0){ 
        
        var myLabel = '<label for="' + myDashboardObjectId + '">' + myLabelText + '</label>';
        
        var myOptions = '<option disabled selected>Please select an option...</option>';
        
        $.each(myData, function(i, val){
            if(val.length>1){    
                myOptions += '<option value="' + val[0] + '">' + val[1] + '</option>'; 
            } else {
                myOptions += '<option value="' + val[0] + '">' + val[0] + '</option>'; 
            }
            
        });      
        
        var mySelect = '<select id="' + myDashboardObjectId  + '" class="form-control">' 
            + myOptions + '</select>';
            
        // Check if select exists 
        // if it exists ...
        if($('#' + myDashboardObjectId).length){
            Dashboards.fireChange(cdeParam,null);
        } 
                       
        $('#' + myCdeContainerId).empty() // empty in case there is already a select
        $('#' + myCdeContainerId).append(myLabel + mySelect);
        
        $('#' + myDashboardObjectId).on('change', function(){
            Dashboards.fireChange(cdeParam, $( this ).find('option:selected').val());
        });
    } 
    // if no data is available remove any existing selects
    else {
        $('#' + myCdeContainerId).empty();
        Dashboards.fireChange(cdeParam,null);
    }   
}

//---------------------- checkbox -----------------------//

function bissolCreateCheckboxSet(myCdeContainerId, myDashboardObjectId, myLabelText, myData, cdeParam){
    
    // create main container which holds all the checkboxes
    var myCheckboxSetContainer = '<div id="' + myDashboardObjectId + '"><label>' + myLabelText + '</label></div>';
    
    // 1. Check if data is available
    if(myData.length > 0){  
        
        var myCheckboxes = '';
        $.each(myData, function(i, val){
            myCheckboxes += 
            '<div class="checkbox">' + 
            '<label>' + 
            '<input type="checkbox" name="' + cdeParam + '" value="' + myData[i][0] + '"></input>' +
            myData[i][0] + '</label>' +
            '</div>'; 
        });
        
        // Check if checkbox exists       
        if($('#' + myDashboardObjectId).length){
            Dashboards.fireChange(cdeParam,'');        
        } 
        
        $('#' + myCdeContainerId).empty(); //if checkbox exists remove
        $('#' + myCdeContainerId).append(myCheckboxSetContainer);
        $('#' + myDashboardObjectId).append(myCheckboxes);
              
        $('#' + myDashboardObjectId).find('input[type=checkbox]').on('change', function(){
            
            var myCheckedValues = [];
            
            $('#' + myDashboardObjectId + ' input:checkbox:checked').each(function() {
                myCheckedValues.push($(this).val());
            });
 
            // fire change
            Dashboards.fireChange(cdeParam,myCheckedValues);
            console.log('Setting parameter ' + cdeParam + ' to: ' + myCheckedValues);
        });

    } 
    // if no data is available remove any existing selects
    else {
        $('#' + myCdeContainerId).empty();
        Dashboards.fireChange(cdeParam,'');
    }
} 

// [OPEN] make bootstrap style dynamic, make button type dynamic
/**
 * The idea is that the button only shows up when a given CDE parameter has a value.
 * Use a Freeform Component to listen to this CDE parameter and call bissolCreateButton()
 * in the Custom Script property
 **/
 
function bissolCreateButton(myCdeContainerId, myDashboardObjectId, myLabelText, cdeParamIncoming, cdeParam){

    var myExistingButtons = $('#' + myDashboardObjectId);
    
    if(!!Dashboards.getParameterValue(cdeParamIncoming) && Dashboards.getParameterValue(cdeParamIncoming).length > 0){
        // check if select already exists otherwise create   
        if(myExistingButtons.length === 0){           
            $('#' + myCdeContainerId).append('<button type="submit" id="' + myDashboardObjectId + '" class="btn btn-primary bissolConfigSubmit">' + myLabelText + '</button>');
            
            $('#' + myDashboardObjectId).on('click', function(){
                Dashboards.fireChange(cdeParam,'save');
            });
        }
    } else {
        // remove button
        $('#' + myCdeContainerId).empty();
    }

}
