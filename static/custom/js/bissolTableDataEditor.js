
// icons
var removeIcon = '<span class="glyphicon glyphicon-minus-sign remove-row" data-toggle="modal" data-target="#myDeleteModal"></span>';
//var addIcon = '<span class="glyphicon glyphicon-plus-sign add-row"></span>';
var saveIcon = '<span class="glyphicon glyphicon-floppy-disk save-row" data-toggle="modal" data-target="#myUpdateModal"></span>';


function bissolFetchConfigServerSide(conf){
    
    var config = JSON.parse(conf);

    Dashboards.setParameter('param_config', config);
    
    var myIdColumn = '';
    var myColIsAutoIncrement = '';
    var myColNamesVisible = [];
    
    config.metadata.forEach(function(elt, i) {
        if(elt.isPrimaryKey) myIdColumn = elt.colName;
        if(elt.isVisible) myColNamesVisible.push(elt.colName);
        if(elt.isAutoIncrement) myColIsAutoIncrement = elt.colName;
    });
    
    var mySchemaAndTable = '';
    if(config.dbSchema !== ''){
        mySchemaAndTable = config.dbSchema + '.' + config.dbTable;
    } else {
        mySchemaAndTable = config.dbTable;
    }

    
    var myMaxIdQuery = "SELECT MAX(" + myIdColumn + ") AS max_id FROM " + mySchemaAndTable;
    var myGenericSelectQuery = "SELECT " + myColNamesVisible.join(',') + " FROM " + mySchemaAndTable;
    
    
    // make config values available globally by storing their values in parameters
    Dashboards.setParameter('param_db_connection', config.dbConnection);
    Dashboards.setParameter('param_db_schema', config.dbSchema);
    Dashboards.setParameter('param_db_table', config.dbTable);
    Dashboards.setParameter('param_sql_max_id', myMaxIdQuery);
    Dashboards.setParameter('param_id_column', myIdColumn);
    Dashboards.setParameter('param_is_auto_increment', myColIsAutoIncrement);
    Dashboards.setParameter('param_db_schematable', mySchemaAndTable);
        
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
       
    param_config.metadata.forEach(function(elt, i) {
        if(elt.isVisible){
            $('#html_table_editor table > thead > tr').append('<th>' + elt.colName + '</th>');
        }    
    });

    // add table body
    myData.forEach(function(myDataRow, j) { 
    
        // add row
        $('#html_table_editor table > tbody').append('<tr></tr>');
    
        param_config.metadata.forEach(function(elt, i) {     
            
            if(elt.isVisible){
                
                if(elt.isEditable){
                    $('#html_table_editor > table > tbody > tr:last')
                    .append('<td><span contenteditable title="Content editable"'
                    + ' data-name="'  + elt.colName + '"'
                    + ' data-type="' + elt.colType + '">'
                    + myDataRow[i] + '</span></td>');
                } else {
                    $('#html_table_editor > table > tbody > tr:last')
                    .append('<td><span class="content-non-editable" title="Content not editable"'  
                    + ' data-name="'  + elt.colName + '"'
                    + ' data-type="' + elt.colType + '">'  
                    + myDataRow[i] + '</span></td>');
                }
                
                
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
        
        if(param_is_auto_increment == ''){
        
                // get max col id - quite a dummy action but does the purpose
                Dashboards.fireChange('param_id_column', param_id_column);
                
                myFormInput +=
                '<div class="form-group">'
                + '    <label for="' + param_id_column + '">' + param_id_column + '</label>'
                + '    <input class="form-control" '
                + ' id="' + param_id_column + '" '
                + ' placeholder="Enter ' + param_id_column + '" '
                + ' data-type="Integer"></input>' 
                +'</div>';          
        }
        
        var datetimeInputTypes = ['date','datetime','week','time'];
        var timeInputTypes = ['datetime','time'];
        param_config.metadata.forEach(function(elt, i) {
            if(elt.isEditable){
                
                if(datetimeInputTypes.indexOf(elt.inputType) > -1){
                    myFormInput +=
                    '<div class="form-group">'
                    + '    <label for="' + elt.colName + '">' + elt.colName + '</label>'
                    + '    <div class="input-group date" id="' + elt.colName + '">'
                    + '         <input type="text" class="form-control"' 
                       + (elt.isRequired ? ' required ' : '') + ' data-type="' + elt.colType + '"/>'
                    + '          <span class="input-group-addon">'
                    + '               <span class="glyphicon glyphicon-' + (timeInputTypes.indexOf(elt.inputType) > -1 ? 'time' : 'calendar') + '"></span>'
                    + '           </span>'
                    + '     </div>'
                    + '</div>'
                    ;
                } else {
                    var valType = elt.inputType == '' ? 'text' : elt.inputType;
                    
                    myFormInput +=
                    '<div class="form-group">'
                    + '    <label for="' + elt.colName + '">' + elt.colName + '</label>'
                    + '    <input class="form-control" '
                    + ' type="' + valType + '" '
                    + ' id="' + elt.colName + '" '
                    + ' placeholder="Enter ' + elt.colName + '" '
                    + (elt.isRequired ? ' required ' : '')
                    + (elt.validationPattern !== '' ? ' pattern="' + elt.validationPattern + '" ' : '')
                    + (elt.validationTitle !== '' ? ' title="' + elt.validationTitle + '" ' : '')
                    + ' data-type="' + elt.colType + '"/>' 
                    +'</div>';    
                }
               
            } 
        });
        
        $('#new-record-panel div.panel-body').append(myFormInput); 
        
        //initialize date pickers -- not an ideal solution right now
        param_config.metadata.forEach(function(elt, i) {
            if(elt.isEditable){
                if(elt.inputType === 'date'){
                    $('#' + elt.colName).datetimepicker({
                        pickTime: false
                        , format: 'YYYY-MM-DD'
                    });
                } 
                else if(elt.inputType === 'datetime'){
                    $('#' + elt.colName).datetimepicker({
                        format: 'YYYY-MM-DD HH:mm:00'
                    });
                } 
                else if(elt.inputType === 'time'){
                    $('#' + elt.colName).datetimepicker({
                        pickDate: false
                        , format: 'HH:mm:00'
                    });
                } 
                else if(elt.inputType === 'week'){
                    $('#' + elt.colName).datetimepicker({
                        format: 'YYYY-ww'
                    });
                } 
                else if(elt.inputType === 'month'){
                    $('#' + elt.colName).datetimepicker({
                        format: 'YYYY-MM'
                    });
                } 
            }         
        });
        
        if(param_is_auto_increment == ''){
        
            // get max col id - quite a dummy action but does the purpose
            Dashboards.fireChange('param_id_column', param_id_column);
        }
        
        // add Save Record button
        $('#new-record-panel').append('<div id="new-record-save-button-div"><button type="button" class="btn btn-primary btn-lg btn-block" id="new-record-save-button">Save Record</button><div>');

        // add Save Record button event
        $('#new-record-save-button').on('click', function() {
            
            var myNewRecordData = [];
            var myNewRecordColTypes = [];
            var myNewRecordColNames = [];
            
            if(param_is_auto_increment == ''){
                myNewRecordData.push($('#new-record-panel #' + param_id_column).val());
                myNewRecordColTypes.push('Integer');
                myNewRecordColNames.push(param_id_column);           
            }
            
            param_config.metadata.forEach(function(elt, i) {
                if(elt.isEditable){
                    
                    myNewRecordData.push($('#new-record-panel #' + elt.colName).val());
                    myNewRecordColTypes.push(elt.colType);
                    myNewRecordColNames.push(elt.colName);
                    
                }

            });  

            //Dashboards.setParameter('param_db_connection', myJNDI); // should be already set

            Dashboards.setParameter('param_col_types_delimited', myNewRecordColTypes.join('|'));
            Dashboards.setParameter('param_col_names_delimited', myNewRecordColNames.join('|'));
            Dashboards.fireChange('param_new_record', myNewRecordData.join('|'));
            // clear new record table and display standard table editor again
            $('#new-record-panel').remove();
            Dashboards.fireChange('param_sql_select', param_sql_select);

        });


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