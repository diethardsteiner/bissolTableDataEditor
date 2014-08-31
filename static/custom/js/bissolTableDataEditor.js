
// icons
var removeIcon = '<span class="glyphicon glyphicon-minus-sign remove-row" data-toggle="modal" data-target="#myDeleteModal"></span>';
//var addIcon = '<span class="glyphicon glyphicon-plus-sign add-row"></span>';
var saveIcon = '<span class="glyphicon glyphicon-floppy-disk save-row" data-toggle="modal" data-target="#myUpdateModal"></span>';

function bissolFetchConfig(param_config_id){
    // the CDA metadata object is empty in case there are no records returned by the query
    console.log('The config id is: ' +  param_config_id);
    //testing
    /**
    $.getJSON("http://localhost:8080/pentaho/api/repos/bissolTableDataEditor/static/custom/config/bissolTableDataEditorConfig.json", function(json) {
        console.log(json); 
    });
    **/

    

    var myJNDI = '';
    var mySchema = '';
    var myTable = '';
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
    
    
    var mySchemaAndTable = '';
    if(mySchema !== ''){
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
    var myColNamesEditableDelimited = myColNamesEditable.join(','); 
    
    var myColTypesEditable = [];
    $.each(myMetadata, function(i, val){
        if(val.isEditable){
            myColNamesEditable.push(val.colType);
        }
    });
    var myColTypesEditableDelimited = myColTypesEditable.join(','); 
    
    var myGenericSelectQuery = "SELECT " + param_col_names_visible_delimited + " FROM " + mySchemaAndTable;
    
    console.log('Fetching config data for table: ' + myTable);
    console.log('The id column is: ' + myIdColumn);    
    console.log('Generating SQL select query: ' + myGenericSelectQuery);
    
    
    // make config values available globally by storing their values in parameters
    Dashboards.setParameter('param_db_connection', myJNDI);
    Dashboards.setParameter('param_db_schema', mySchema);
    Dashboards.setParameter('param_db_table', myTable);
    Dashboards.setParameter('param_db_schematable', mySchemaAndTable);
    //Dashboards.setParameter('param_metadata', myMetadata);
    Dashboards.setParameter('param_col_names', myColNames);
    Dashboards.setParameter('param_col_names_visible', myColNamesVisible);
    Dashboards.setParameter('param_col_names_visible_delimited', myColNamesVisibleDelimited);
    Dashboards.setParameter('param_col_names_editable', myColNamesEditable);
    Dashboards.setParameter('param_col_names_editable_delimited', myColNamesEditableDelimited);
    Dashboards.setParameter('param_col_types_editable', myColTypesEditable);
    Dashboards.setParameter('param_col_types_editable_delimited', myColTypesEditableDelimited);
    Dashboards.setParameter('param_col_types', myColTypes);
    Dashboards.setParameter('param_id_column', myIdColumn);
    
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

function bissolFetchConfigServerSide(result_metadata){
    
    // in this case we source the config metadata via Kettle server side

    var myJNDI = result_fetch_config[0][0];
    var mySchema = result_fetch_config[0][1];
    var myTable = result_fetch_config[0][2];
    var mySchemaAndTable = result_fetch_config[0][3];
    var myIdColumn = result_fetch_config[0][4];
    var myColNamesDelimited = result_fetch_config[0][5];
    var myColTypesDelimited = result_fetch_config[0][6];
    var myColNamesVisibleDelimited = result_fetch_config[0][7];
    var myColNamesEditableDelimited = result_fetch_config[0][8];
    var myColTypesEditableDelimited = result_fetch_config[0][9];
    var myGenericSelectQuery = result_fetch_config[0][10];
    
    var myColNames = myColNamesDelimited.split(',');
    var myColTypes = myColTypesDelimited.split(',');
    var myColNamesVisible = myColNamesVisibleDelimited.split(',');
    var myColNamesEditable = myColNamesEditableDelimited.split(',');
    var myColTypesEditable = myColTypesEditableDelimited.split(',');
    
    console.log('Fetching config data for table: ' + myTable);
    console.log('The id column is: ' + myIdColumn);    
    console.log('Generating SQL select query: ' + myGenericSelectQuery);
    
    
    // make config values available globally by storing their values in parameters
    Dashboards.setParameter('param_db_connection', myJNDI);
    Dashboards.setParameter('param_db_schema', mySchema);
    Dashboards.setParameter('param_db_table', myTable);
    Dashboards.setParameter('param_db_schematable', mySchemaAndTable);
    //Dashboards.setParameter('param_metadata', myMetadata);
    Dashboards.setParameter('param_col_names', myColNames);
    Dashboards.setParameter('param_col_names_visible', myColNamesVisible);
    Dashboards.setParameter('param_col_names_visible_delimited', myColNamesVisibleDelimited);
    Dashboards.setParameter('param_col_names_editable', myColNamesEditable);
    Dashboards.setParameter('param_col_names_editable_delimited', myColNamesEditableDelimited);
    Dashboards.setParameter('param_col_types_editable', myColTypesEditable);
    Dashboards.setParameter('param_col_types_editable_delimited', myColTypesEditableDelimited);
    Dashboards.setParameter('param_col_types', myColTypes);
    Dashboards.setParameter('param_id_column', myIdColumn);
    
    Dashboards.fireChange('param_sql_select', myGenericSelectQuery);
    
}

function bissolBuildTable(data) {
    // no reason to define param_config_id as a function arguement as it is already set as a parameter value

    var myData = data;
    
    // empty in case table already exists
    $('#html_table_editor').empty();
    $('#html_new_record').empty(); 
    
    // create modals
    bissolCreateModal(
        'html_table_editor'
        , 'myDeleteModal'
        , 'Deletion'
        , 'Do you really want to delete this record?'
        , 'myDeleteButton'
        , 'Delete'
    );
    
    bissolCreateModal(
        'html_table_editor'
        , 'myUpdateModal'
        , 'Update'
        , 'Do you really want to update this record?'
        , 'myUpdateButton'
        , 'Update'
    );
   
    // prepare table basic structure
    $('#html_table_editor').append('<table id="myTableEditor" class="display"><thead><tr></tr></thead><tbody></tbody></table>');

    // add table header cells
    /**
    $.each(param_metadata, function( i, val ){
        if(param_metadata[i].isVisible){
            $('#html_table_editor table > thead > tr').append('<th>' + val.colName + '</th>');
        }
    });
    **/
   
    $.each(param_col_names_visible, function( i, val ){
        $('#html_table_editor table > thead > tr').append('<th>' + val + '</th>');
    });

    // add table body
    $.each(myData, function( i, val ){

        // add row
        $('#html_table_editor table > tbody').append('<tr></tr>');
        
        $.each(myData[i], function( j, value ){
        
            // add cells within row    
            //if(param_metadata[j].isEditable){
            if($.inArray(param_col_names_visible[j], param_col_names_editable) > -1){
                $('#html_table_editor > table > tbody > tr:last')
                .append('<td><span contenteditable title="Content editable"'
                //+ ' data-name="'  + param_metadata[j].colName + '"'
                //+ ' data-type="' + param_metadata[j].colType + '">' 
                + ' data-name="'  + param_col_names[j] + '"'
                + ' data-type="' + param_col_types[j] + '">'
                + value + '</span></td>');
            } else {
                $('#html_table_editor > table > tbody > tr:last')
                .append('<td><span class="content-non-editable" title="Content not editable"'
                //+ ' data-name="'  + param_metadata[j].colName + '"'
                //+ ' data-type="' + param_metadata[j].colType + '">'  
                + ' data-name="'  + param_col_names[j] + '"'
                + ' data-type="' + param_col_types[j] + '">'  
                + value + '</span></td>');                
            }
        
        });
    });
    
    // add remove and save icon
    $('#html_table_editor table > thead > tr > th:first').before('<th></th>'); // add extra cell to header
    $('#html_table_editor table > tbody > tr').find('td:first').before('<td>' + removeIcon + saveIcon + '</td>');
 
    // for base table
    bissolSaveRow();
    bissolRemoveRow();
    bissolNewRecord();
    
    $('#html_table_editor table > tbody > tr').on('click', function() {
        
        // remove existing hightlight
        $('#html_table_editor table > tbody > tr > td').removeClass( "row-highlight" );
        // highligh this row
        $(this).find("td").addClass( "row-highlight" );
        
    });
}
   
function bissolNewRecord(){    
    
    // Add new record button
    $('#html_new_record').prepend('<button type="button" class="btn btn-primary btn-lg btn-block btde-button" id="new-record-button">New Record</button>');

    // add event listeners
    $('#new-record-button').on('click', function() {
        // clear way
        $('#html_table_editor').empty();
        $('#new-record-button').remove();
        
        // create a dedicated panel
        var myNewRecordPanel =
            '<div class="panel panel-default" id="new-record-panel">'
            +'    <div class="panel-heading">New Record</div>'
            +'    <div class="panel-body">'
            +'    </div>'
            +'</div>';
    
        $('#html_new_record').append(myNewRecordPanel); 
        
        // create input elements
        var myFormInput = '';

        $.each(param_col_names_editable, function(i, val){    
            
                myFormInput +=
                '<div class="form-group">'
                + '    <label for="' + val + '">' + val + '</label>'
                + '    <input type="email" class="form-control" '
                + ' id="' + val + '" '
                + ' placeholder="Enter ' + val + '" '
                + ' data-type="' + param_col_types_editable[i] + '"/>' 
                +'</div>';
        });
        
        $('#new-record-panel div.panel-body').append(myFormInput); 
        
        // add Save Record button
        $('#new-record-panel').append('<div id="new-record-save-button-div"><button type="button" class="btn btn-primary btn-lg btn-block" id="new-record-save-button">Save Record</button><div>');

        // add Save Record button event
        $('#new-record-save-button').on('click', function() {
            
            var myNewRecordData = [];
            var myNewRecordColTypes = [];
            var myNewRecordColNames = [];
            
            $.each(param_col_names_editable, function(i, val){ 
                    
                    myNewRecordData.push($('#new-record-panel #' + val).val());
                    myNewRecordColTypes.push(param_col_types_editable[i]);
                    myNewRecordColNames.push(val);

            });  

            //Dashboards.setParameter('param_db_connection', myJNDI); // should be already set
            Dashboards.fireChange('param_new_record', myNewRecordData.join('|'));
            Dashboards.setParameter('param_col_types_delimited', myNewRecordColTypes.join('|'));
            Dashboards.setParameter('param_col_names_delimited', myNewRecordColNames.join('|'));

            // clear new record table and display standard table editor again
            $('#new-record-panel').remove();
            Dashboards.fireChange('param_sql_select', param_sql_select);

        });


    });
     
}

function bissolRemoveRow() {
    $('#myDeleteButton').on('click', function() { 
        
        //var myId = $(this).parent().parent().find('span[data-name="' + param_id_column + '"]').text();
        //console.log($('#html_table_editor table > tbody > tr > td.row-highlight'));
        var myId = $('#html_table_editor table > tbody > tr > td.row-highlight').find('span[data-name="' + param_id_column + '"]').text();
        var myQuery = 'DELETE FROM ' + param_db_schematable + ' WHERE ' + param_id_column + ' = ' + myId;
        console.log('The query to submit is: ' + myQuery);

        //Dashboards.setParameter('param_db_connection', myJNDI); // not necessary, should be already set
        Dashboards.fireChange('param_sql_update', myQuery);
        
        $('#html_table_editor table > tbody > tr > td.row-highlight').parent().remove();

    });   
}

function bissolSaveRow() { 
    //.save-row
    $('#myUpdateButton').on('click', function() { 

        // 1) get data from html table
        var myValueArray = [];
        //var mySpanArray = $(this).parent().parent().find('span[contenteditable]');
        var mySpanArray = $('#html_table_editor table > tbody > tr > td.row-highlight').find('span[contenteditable]');

        $.each(mySpanArray, function(i, val){
            myValueArray.push($.text(this));
        });
        
        // 2) get data types from html table
        var myColTypesArray = [];
        
        $.each(mySpanArray, function(i, val){
            myColTypesArray.push($(this).attr('data-type'));
        });
        
        // 3) get col names from html table
        var myColNamesArray = [];
        
        $.each(mySpanArray, function(i, val){
            myColNamesArray.push($(this).attr('data-name'));
        });
        
        var myQuery = '';
                    
        //var myId = $(this).parent().parent().find('span[data-name="' + param_id_column + '"]').text();
        var myId = $('#html_table_editor table > tbody > tr > td.row-highlight').find('span[data-name="' + param_id_column + '"]').text();
        // prepare update string
        var myUpdateString = '';

        $.each(myValueArray, function(i, val){
            if(myColTypesArray[i].toUpperCase()==='STRING'){ 
                myUpdateString += myColNamesArray[i] + "='" + val + "'";
            } else {
                myUpdateString += myColNamesArray[i] + "=" + val;
            }
            if( i < (myValueArray.length - 1)) {
                myUpdateString += ",";
            }
        });

        myQuery = 'UPDATE ' + param_db_schematable + ' SET ' + myUpdateString + ' WHERE ' + param_id_column + ' = ' + myId;    

        console.log('This query will be executed: ' + myQuery);

        //Dashboards.setParameter('param_db_connection', myJNDI); // should be already set
        Dashboards.fireChange('param_sql_update', myQuery);
        
    }); 

}
