function buildTable(myCdeContainerId, myDashboardObjectId, data, metadata, jndi, schema, table, idColumn) {
    
    // [OPEN] source the config data - everything hard coded at the moment
    
    // get data
    var myMetadata = metadata;
    var myData = data;
    //[OPEN] -- map properly
    var myJDNI = 'psqllocaltest';
    var mySchema = 'public';
    var myTable = 'employees';
    var myIdColumn = 'id';
    // the metadata object is empty in case there are no records returned by the query
    // hence use info from tableeditor config
    // JSON.parse()
    var myConfigMetadata = [{"colIndex":0,"colType":"Integer","colName":"id"},{"colIndex":1,"colType":"String","colName":"firstname"},{"colIndex":2,"colType":"String","colName":"lastname"}];

    //console.log('My data: ' + JSON.stringify(myData));

    // check if query returned metadata results 
    if(myMetadata.length === 0){
        myMetadata = myConfigMetadata;
    } 


    //console.log(JSON.stringify(myMetadata));
    
    if(mySchema !== 'undefined'){
        myTable = mySchema + '.' + myTable;
    }
    
    var myColNames = [];
    
    $.each(myMetadata, function( i, val ){
            myColNames.push(val.colName);
    });  
    //console.log(myColNames);
    
    var myColTypes = [];
    $.each(myMetadata, function( i, val ){
            myColTypes.push(val.colType);
    });  
    //console.log(myColTypes);
    
    // empty in case table already exists
    $('#' + myCdeContainerId).empty();       
   
    // prepare table basic structure
    $('#' + myCdeContainerId).append('<table id="' + myDashboardObjectId + '" class="table table-striped"><thead><tr></tr></thead><tbody></tbody></table>');

    // add table header cells
    $.each(myMetadata, function( i, val ){
            $('#tableeditor > table > thead > tr').append('<th>' + val.colName + '</th>');
    });

    // add table body
    $.each(myData, function( i, val ){

        // add row
        $('#tableeditor > table > tbody').append('<tr></tr>');
        
        $.each(myData[i], function( j, value ){
        
            // add cells within row       
            $('#tableeditor > table > tbody > tr:last')
            .append('<td><span contenteditable data-name="' + myMetadata[j].colName + '">' 
            + value + '</span></td>');       
        
        });
    });
    
    // icons
    var removeIcon = '<span class="glyphicon glyphicon-minus-sign remove-row"></span>';
    //var addIcon = '<span class="glyphicon glyphicon-plus-sign add-row"></span>';
    var saveIcon = '<span class="glyphicon glyphicon-floppy-disk save-row"></span>';
    
    // add remove and save icon
    $('#tableeditor > table > thead > tr > th:first').before('<th></th>'); // add extra cell to header
    $('#tableeditor > table > tbody > tr').find('td:first').before('<td>' + removeIcon + saveIcon + '</td>');
    
  
    
    $('#' + myCdeContainerId).append('<button type="button" class="btn btn-primary btn-lg btn-block" id="newrecordbutton">New record</button>');
    
    // for base table
    bissolSaveRow();
    bissolRemoveRow();


    // add event listeners
    $('#newrecordbutton').on('click', function() {
        
        if($('#newrecord').length === 0){
            
            // add code for new data entry
            $('#tableeditor > table > tbody').append('<tr class="newrecord"></tr>');
        
            $.each(myMetadata, function( i, val ){
                $('#tableeditor > table > tbody > tr:last')
                    .append('<td><span contenteditable data-name="' + myMetadata[i].colName + '"></span></td>');  
            });
            
            // add add icon - note special td id to mark new record
            $('#tableeditor > table > tbody > tr:last > td:first').before('<td id="newrecord">' + saveIcon + '</td>');            
        
            // add save icon event listener
            bissolSaveRow();
            
        }
	});
    
    function bissolRemoveRow() { 
        $('.remove-row').on('click', function() { 
            //[OPEN]: make data-name id dynamic, also adjust query
            var myId = $(this).parent().parent().find('span[data-name="' + myIdColumn + '"]').text();
            var myQuery = 'DELETE FROM ' + myTable + ' WHERE ' + myIdColumn + ' = ' + myId;
            console.log('The query to submit is: ' + myQuery);
            
            Dashboards.setParameter('param_db_connection', myJDNI);
            Dashboards.fireChange('param_sql_update', myQuery);
            
            //remove row
            $(this).parent().parent().remove();
        });
    
    }
    
    function bissolSaveRow() { 
        
        $('.save-row').on('click', function() { 
            
            var myValueArray = [];
            
            var mySpanArray = $(this).parent().parent().find('span:not(.add-row):not(.save-row):not(.remove-row)');
            
            $.each(mySpanArray, function(i, val){
                myValueArray.push($.text(this));
            });
            
            
            // make sure strings are quoted
            var sqlValueString = [];
            $.each(myValueArray, function(i, val){
                if(myColTypes[i]=='String'){ 
                    sqlValueString.push("'" + val + "'");
                } else {
                    sqlValueString.push(val);
                }
            });
            
            // prepare update string
            var myUpdateString = '';
            $.each(myValueArray, function(i, val){
                if(myColTypes[i]=='String'){ 
                    myUpdateString += myColNames[i] + "='" + val + "'";
                } else {
                    myUpdateString += myColNames[i] + "=" + val;
                }
                if( i < (myValueArray.length - 1)) {
                    myUpdateString += ",";
                }
            });
            
            // [OPEN] make dynamic
            var myQuery = '';
            if( $(this).parent().attr("id") == 'newrecord' ){
                myQuery = 'INSERT INTO ' + myTable + ' (' + myColNames.toString()  + ')  VALUES (' + sqlValueString.toString() + ')'; 
            } else {
                var myId = $(this).parent().parent().find('span[data-name="' + myIdColumn + '"]').text();
                myQuery = 'UPDATE ' + myTable + ' SET ' + myUpdateString + ' WHERE ' + myIdColumn + ' = ' + myId;    
            }
                    
            console.log('This query will be executed: ' + myQuery);
            
            Dashboards.setParameter('param_db_connection', myJDNI);
            Dashboards.fireChange('param_sql_update', myQuery);
            
            //in case the row is a new record remove the specific class and id and add the remove icon
            if( $(this).parent().attr("id") == 'newrecord' ){
                //$(this).parent().parent().removeClass('newrecord');
                $(this).parent().parent().removeAttr('class');
                $(this).parent().parent().removeClass('newrecord');
                $(this).parent().removeAttr('id');
                $(this).before(removeIcon);
                // add remove row event listener to newly created remove icon
                bissolRemoveRow();
            }           
        }); 
    
    }
    
    
}
