
// icons
var removeIcon = '<span class="glyphicon glyphicon-minus-sign remove-row"></span>';
//var addIcon = '<span class="glyphicon glyphicon-plus-sign add-row"></span>';
var saveIcon = '<span class="glyphicon glyphicon-floppy-disk save-row"></span>';

function bissolFetchConfig(param_config_id){
    // the CDA metadata object is empty in case there are no records returned by the query

    //testing
    /**
    $.getJSON("http://localhost:8080/pentaho/api/repos/bissolTableDataEditor/static/custom/config/bissolTableDataEditorConfig.json", function(json) {
        console.log(json); 
    });
    **/

    console.log('Fetching Config Data ...');

    var myJNDI = '';
    var mySchema = '';
    var myTable = '';
    var mySchemaAndTable = '';
    var myMetadata = [];

    $.getJSON("../../../api/repos/bissolTableDataEditor/static/custom/config/bissolTableDataEditorConfig.json", function(json) {
        for (var i = 0; i < json.length; i++) {
            if(json[i].configId === param_config_id){
                myJNDI = json[i].dbConnection;
                mySchema = json[i].dbSchema;
                myTable = json[i].dbTable;
                myMetadata = json[i].metadata;
                //console.log('jndi: ' + myJNDI + ', schema: ' + mySchema + ', table: ' + myTable);
                //console.log(myMetadata);               
            }
        }
    });
    
    if(mySchema !== 'undefined'){
        mySchemaAndTable = mySchema + '.' + myTable;
    } else {
        mySchemaAndTable = myTable;
    }
        
 
    var myColNames = [];
    
    $.each(myMetadata, function(i, val){
        myColNames.push(val.colName);
    }); 
    //console.log(myColNames);
    
    var myColTypes = [];
    $.each(myMetadata, function(i, val){
        myColTypes.push(val.colType);
    });  
    //console.log(myColTypes);
    
    //find out which column is the key column
    var myIdColumn = '';
    $.each(myMetadata, function(i, val){
        if(val.isPrimaryKey){
            myIdColumn = val.colName;
        }
    });  
    
    var myColNamesVisible = [];
    $.each(myMetadata, function(i, val){
        if(val.isVisible){
            myColNamesVisible.push(val.colName);
        }
    });
    var myColNamesVisibleDelimited = myColNamesVisible.join(','); // comma delimeted for SQL query

    var myColNamesEditable = [];
    $.each(myMetadata, function(i, val){
        if(val.isEditable){
            myColNamesEditable.push(val.colName);
        }
    });
    var myColNamesEditableDelimited = myColNamesEditable.join('|'); 
    
    // make config values available globally by storing their values in parameters
    Dashboards.setParameter('param_db_connection', myJNDI);
    Dashboards.setParameter('param_db_schema', mySchema);
    Dashboards.setParameter('param_db_table', myTable);
    Dashboards.setParameter('param_db_schematable', mySchemaAndTable);
    Dashboards.setParameter('param_metadata', myMetadata);
    Dashboards.setParameter('param_col_names', myColNames);
    Dashboards.setParameter('param_col_names_visible', myColNamesVisible);
    Dashboards.setParameter('param_col_names_visible_delimited', myColNamesVisibleDelimited);
    Dashboards.setParameter('param_col_names_editable', myColNamesEditable);
    Dashboards.setParameter('param_col_names_editable_delimited', myColNamesEditableDelimited);
    Dashboards.setParameter('param_col_types', myColTypes);
    Dashboards.setParameter('param_id_column', myIdColumn);
    
    myGenericSelectQuery = "SELECT " + param_col_names_visible_delimited + " FROM " + mySchemaAndTable;
    console.log('Generating SQL select query ...');
    Dashboards.fireChange('param_sql_select', myGenericSelectQuery);
    /**
    return {
        myJNDI: myJNDI
        , mySchema: mySchema
        , myTable: myTable
        , mySchemaAndTable: mySchemaAndTable
        , myMetadata: myMetadata
        , myColNames: myColNames
        , myColTypes: myColTypes
        , myIdColumn: myIdColumn
    };
    **/
    
}

function bissolBuildTable(myCdeContainerId, myDashboardObjectId, data) {
    // no reason to define param_config_id as a function arguement as it is already set as a parameter value
    
    //var myTableConfig = bissolFetchConfig(param_config_id);
    /**
    var myJNDI = myTableConfig.myJNDI;
    var mySchema = myTableConfig.mySchema;
    var myTable = myTableConfig.myTable;
    var mySchemaAndTable = myTableConfig.mySchemaAndTable;
    var myMetadata = myTableConfig.myMetadata;
    var myColNames = myTableConfig.myColNames;
    var myColTypes = myTableConfig.myColTypes;
    var myIdColumn = myTableConfig.myIdColumn;
    **/
   
    var myJNDI = param_db_connection;
    var mySchema = param_db_schema;
    var myTable = param_db_table;
    var mySchemaAndTable = param_db_schematable;
    var myMetadata = param_metadata;
    var myColNames = param_col_names;
    var myColTypes = param_col_types;
    var myIdColumn = param_id_column;
    var myConfigId = param_config_id;
    var myData = data;
    
    // empty in case table already exists
    $('#' + myCdeContainerId).empty();       
   
    // prepare table basic structure
    $('#' + myCdeContainerId).append('<table id="' 
            + myDashboardObjectId 
            + '" class="table table-striped"><thead><tr></tr></thead><tbody></tbody></table>');

    // add table header cells
    $.each(myMetadata, function( i, val ){
        if(myMetadata[i].isVisible){
            $('#tableeditor > table > thead > tr').append('<th>' + val.colName + '</th>');
        }
    });

    // add table body
    $.each(myData, function( i, val ){

        // add row
        $('#tableeditor > table > tbody').append('<tr></tr>');
        
        $.each(myData[i], function( j, value ){
        
            // add cells within row    
            if(myMetadata[j].isEditable){
                $('#tableeditor > table > tbody > tr:last')
                .append('<td><span contenteditable '
                + ' data-name="'  + myMetadata[j].colName + '"'
                + ' data-type="' + myMetadata[j].colType + '">' 
                + value + '</span></td>');
            } else {
                $('#tableeditor > table > tbody > tr:last')
                .append('<td><span class="content-non-editable" '
                + ' data-name="'  + myMetadata[j].colName + '"'
                + ' data-type="' + myMetadata[j].colType + '">'  
                + value + '</span></td>');                
            }
        
        });
    });
    
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
        
            $.each(myMetadata, function(i, val){
                if(myMetadata[i].isEditable){
                    $('#tableeditor > table > tbody > tr:last')
                    .append('<td><span contenteditable '
                    + ' data-name="'  + myMetadata[i].colName + '"'
                    + ' data-type="' + myMetadata[i].colType + '">' 
                    + '</span></td>');
                } else {
                    $('#tableeditor > table > tbody > tr:last')
                    .append('<td><span class="content-non-editable" '
                    + ' data-name="'  + myMetadata[i].colName + '"'
                    + ' data-type="' + myMetadata[i].colType + '">' 
                    + '</span></td>');       
                }
            });
    
            // add add icon - note: special td id to mark new record
            $('#tableeditor > table > tbody > tr:last > td:first').before('<td id="newrecord">' + saveIcon + '</td>');            
        
            // add save icon event listener
            bissolSaveRow();
            
        }
	});
        
}

function bissolChangeNewRowToStdRow(result_new_id){
    
    console.log('changing new row to standard row');
    console.log('the new id is: ' + result_new_id[0][0]);
    
    $('td[id="newrecord"]').parent().find('span[data-name="id"]').text(result_new_id[0][0]);
    
    //in case the row is a new record remove the specific class and id and add the remove icon
    $('td[id="newrecord"]').parent().removeAttr('class');
    $('td[id="newrecord"]').parent().removeClass('newrecord');
    $('td[id="newrecord"]').parent().removeAttr('id');
    $('td[id="newrecord"] > span').before(removeIcon);
    // add remove row event listener to newly created remove icon
    bissolRemoveRow();  
}

function bissolRemoveRow() {

    var myJNDI = param_db_connection;
    var mySchema = param_db_schema;
    var myTable = param_db_table;
    var mySchemaAndTable = param_db_schematable;
    var myMetadata = param_metadata;
    var myColNames = param_col_names;
    var myColTypes = param_col_types;
    var myIdColumn = param_id_column;
    
    $('.remove-row').on('click', function() { 
        
        var myId = $(this).parent().parent().find('span[data-name="' + myIdColumn + '"]').text();
        var myQuery = 'DELETE FROM ' + mySchemaAndTable + ' WHERE ' + myIdColumn + ' = ' + myId;
        console.log('The query to submit is: ' + myQuery);

        //Dashboards.setParameter('param_db_connection', myJNDI); // not necessary, should be already set
        Dashboards.fireChange('param_sql_update', myQuery);

        //remove row
        $(this).parent().parent().remove();
    });   
}

function bissolSaveRow() {
    
    var myJNDI = param_db_connection;
    var mySchema = param_db_schema;
    var myTable = param_db_table;
    var mySchemaAndTable = param_db_schematable;
    var myMetadata = param_metadata;
    var myColNames = param_col_names;
    var myColTypes = param_col_types;
    var myIdColumn = param_id_column;
    
    
    $('.save-row').on('click', function() { 

        // 1) get data from html table
        var myValueArray = [];
        var mySpanArray = $(this).parent().parent().find('span[contenteditable]');

        $.each(mySpanArray, function(i, val){
            myValueArray.push($.text(this));
        });
        
        // 2) get data types from html table
        // [?] We could just take this from the config as well
        var myColTypesArray = [];
        
        $.each(mySpanArray, function(i, val){
            myColTypesArray.push($(this).attr('data-type'));
        });
        
        // 3) get col names from html table
        // [?] We could just take this from the config as well
        var myColNamesArray = [];
        
        $.each(mySpanArray, function(i, val){
            myColNamesArray.push($(this).attr('data-name'));
        });
        
        var myQuery = '';
        
        if( $(this).parent().attr("id") == 'newrecord' ){
            
            // make sure strings are quoted
            /**
            var sqlValueString = [];
            $.each(myValueArray, function(i, val){
                if(myColTypes[i]=='String'){ 
                    sqlValueString.push("'" + val + "'");
                } else {
                    sqlValueString.push(val);
                }
            });
            
            myQuery = 'INSERT INTO ' + mySchemaAndTable + ' (' + myColNames.toString()  + ')  VALUES (' + sqlValueString.toString() + ')'; 
            **/
            
            //var new_record = '"' + myValueArray.join('","') + '"';
            var myNewRecord = myValueArray.join('|');
            var myColTypes = myColTypesArray.join('|');
            var myColNames = myColNamesArray.join('|');

            //Dashboards.setParameter('param_db_connection', myJNDI); // should be already set
            Dashboards.fireChange('param_new_record', myNewRecord);
            Dashboards.setParameter('param_col_types_delimited', myColTypes);
            Dashboards.setParameter('param_col_names_delimited', myColNames);
            //Dashboards.setParameter('param_config_id', param_config_id);
      
        } else {
            var myId = $(this).parent().parent().find('span[data-name="' + myIdColumn + '"]').text();
            
            // prepare update string
            var myUpdateString = '';
            
            $.each(myValueArray, function(i, val){
                if(myColTypesArray[i]==='String'){ 
                    myUpdateString += myColNamesArray[i] + "='" + val + "'";
                } else {
                    myUpdateString += myColNamesArray[i] + "=" + val;
                }
                if( i < (myValueArray.length - 1)) {
                    myUpdateString += ",";
                }
            });
            
            myQuery = 'UPDATE ' + mySchemaAndTable + ' SET ' + myUpdateString + ' WHERE ' + myIdColumn + ' = ' + myId;    
                        
            console.log('This query will be executed: ' + myQuery);
            
            //Dashboards.setParameter('param_db_connection', myJNDI); // should be already set
            Dashboards.fireChange('param_sql_update', myQuery);
        }

    }); 

}