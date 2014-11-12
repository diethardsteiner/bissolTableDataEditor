//function bissolCreateSelect(myCdeContainerId, myDashboardObjectId, myLabelText, myData, cdeParam){
function bissolCreateSelect(options){

    var myCdeContainerId = options.myCdeContainerId; // optional, can be id or class, so prefix selector accordingly. in case this is not specified, the output will be placed at current code position
    var myDashboardObjectId = options.myDashboardObjectId; // optional, do not prefix with #
    var myLabelText = options.myLabelText; // optional
    var myData = options.myData; // required
    var cdeParam = options.cdeParam; // optional
    var myDefaultValue = options.myDefaultValue; // optional

    //NOTE: if myData has more than one column, the first one will then we used as the id and the second on as value 
    
    //console.log(myDashboardObjectId + " with following values: " + JSON.stringify(myData));
    
    // 1. Check if data is available
    if(myData.length > 0){ 
        
        var myLabel = '';
        
        if(typeof myLabelText !== 'undefined'){
            myLabel += '<label for="' + myDashboardObjectId + '">' + myLabelText + '</label>';
        }
        
        if(typeof myDefaultValue === 'undefined' ){
            var myOptions = '<option disabled selected>Please select an option...</option>';
        } else {
            var myOptions = '<option value="' + myDefaultValue + '" selected>' + myDefaultValue + '</option>';
        }
        
        
        
        $.each(myData, function(i, val){
            if(val.length>1){    
                myOptions += '<option value="' + val[0] + '">' + val[1] + '</option>'; 
            } else {
                myOptions += '<option value="' + val[0] + '">' + val[0] + '</option>'; 
            }
            
        });      
        
        mySelectId = typeof myDashboardObjectId !== 'undefined' ? myDashboardObjectId : '';
        
        var mySelect = '<select id="' + mySelectId  + '" class="form-control">' + myOptions + '</select>';
            
        // Check if select exists 
        // if it exists ...
        if($(myDashboardObjectId).length){
            Dashboards.fireChange(cdeParam,null);
        } 
        
        if(typeof myCdeContainerId !== 'undefined'){               
            $(myCdeContainerId).empty(); // empty in case there is already a select
            $(myCdeContainerId).append(myLabel + mySelect);
        } else {
            return mySelect;
        }
        
        
        if(typeof cdeParam !== 'undefined'){
        
            $('#' + myDashboardObjectId).on('change', function(){
                mySelectedValue = $( this ).find('option:selected').val();
                Dashboards.fireChange(cdeParam, mySelectedValue);    
                console.log(cdeParam + 'set to: ' + mySelectedValue);
            });
        
        }
    } 
    // if no data is available remove any existing selects
    else {
        if(typeof myCdeContainerId !== 'undefined'){  
            $(myCdeContainerId).empty();
            if(typeof cdeParam !== 'undefined'){
                Dashboards.fireChange(cdeParam,null);
            }
        }
    }   
}

//---------------------- checkbox -----------------------//

//function bissolCreateCheckboxSet(myCdeContainerId, myDashboardObjectId, myLabelText, myData, cdeParam){
function bissolCreateCheckboxSet(options){
    var myCdeContainerId = options.myCdeContainerId;
    var myDashboardObjectId = options.myDashboardObjectId;
    var myLabelText = options.myLabelText;
    var myData = options.myData;
    var cdeParam = options.cdeParam;
    
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
            Dashboards.fireChange(cdeParam, myCheckedValues.join(','));
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
 
//function bissolCreateButton(myCdeContainerId, myDashboardObjectId, myLabelText, cdeParamIncoming, cdeParam){
function bissolCreateButton(options){

    var myCdeContainerId = options.myCdeContainerId;
    var myDashboardObjectId = options.myDashboardObjectId;
    var myLabelText = options.myLabelText;
    var cdeParamIncoming = options.cdeParamIncoming
    var cdeParam = options.cdeParam;
    
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