function bissolCreateTableConfigPicker(myNewConfigData,myOldConfigData){    
    
    if(!$.isEmptyObject(myNewConfigData)){ 
        
        // merge existing config data with new one
        // newer entries will override old ones
        
        var mySavedConfigData = {};
        
        if($.isEmptyObject(myOldConfigData)){
          var myMergedConfigData = myNewConfigData.metadata;
          //console.log(myNewConfigData.metadata);
          
          // add non db attributes
          myNewConfigData.metadata.forEach(function(elt, i) {
            elt.isRequired = false;
            elt.defaultValue = '';
            elt.inputType = 'none';
            elt.validationPattern = '';
            elt.validationTitle = '';  
          });
          
        } else {
        
          mySavedConfigData = JSON.parse(myOldConfigData);
        
          // add configured flag so that we can distinguish the configured fields from the new ones
          mySavedConfigData.metadata.forEach(function(elt, i) {
            elt.configured = true;
          });
          
          //console.log(mySavedConfigData.metadata);
          //console.log(myNewConfigData.metadata);
          var myMergedConfigData = $.extend(myNewConfigData.metadata,mySavedConfigData.metadata);
          //console.log('-------------');
          //console.log(myMergedConfigData);
        
        }

    
        if($('#bissol-table-properties').length){
            $('#bissol-table-properties').remove();
        }
        
        
        var basicStructure =
        '<div class="panel panel-default bissolTableMetadataBox" id="bissol-table-properties">'
        +'  <div class="panel-heading">'
        +'    <h3 class="panel-title">Table Properties</h3>'
        +'  </div>'
        +'  <div class="panel-body">'
        +'    <div id="html_db_table_metadata_picker">'
        // --- table mode picker --- start
        //+'<label>Bissol Editor Type</label>'
        //+'<div class="highlight">'
        // NOTE: active state has to be set on label level not input level!
        +'<div class="btn-group" data-toggle="buttons">'
        +'	<label class="btn btn-primary active" id="editorSimple">'
        +'		<input type="radio" name="editorType" id="editorSimple" autocomplete="off"> Simple Bissol Editor '
        +'	</label>'
        +'	<label class="btn btn-primary" id="editorComplex">'
        +'		<input type="radio" name="editorType" autocomplete="off"> Complex Bissol Editor '
        +'	</label>'
        +'</div>'
        //+'</div>'
        // --- table mode picker --- end
        +'    </div>'
        +'  </div>'
        +'  <div id="html_submit"></div>'
        +'</div>'
        ;

        $('#bissolTablePropertiesContainer').append(basicStructure);
        
        if(mySavedConfigData.editorType === 'complex'){
            //$('#editorSimple').button('toggle');
            $('#editorComplex').button('toggle');
        } 
        var myColsName = [];
        var myColsType = [];
        var myColsPosition = [];

        var myConfigTable=
        '<table class="table table-striped">'
        +'    <thead>'
        +'        <tr>'
        +'            <th></th>'
        +'            <th>#</th>'
        +'            <th>Col Name</th>'
        +'            <th>DB Col Type</th>'
        +'            <th>PDI Col Type</th>'
        +'            <th>Is Visible?</th>'
        +'            <th>Is Editable?</th>'
        +'            <th>Is Primary Key?</th>'  
        +'            <th>Is Auto Increment?</th>'  
        +'            <th>Is Required?</th>' 
        +'            <th>Default Value</th>' 
        +'            <th>Input Type</th>'         
        //+'            <th>Validation Min Number</th>' 
        //+'            <th>Validation Max Number</th>' 
        //+'            <th>Validation Max Char Length</th>' 
        //+'            <th>Validation Step Intervals</th>' 
        +'            <th>Validation Pattern</th>' 
        +'            <th>Validation Pattern Description</th>' 
        +'        </tr>'
        +'    </thead>'
        +'    <tbody>'
        ;
        
        $.each(myMergedConfigData, function(i, val){

            var configuredLabel = '';
            
            if(val.configured){
              configuredLabel = '<span class="label label-primary bissolConfigLabel">Configured</span>';
            } else {
              configuredLabel = '<span class="label label-info bissolConfigLabel">New</span>';
            }
            
            var colTypeDatabase = typeof val.colTypeDb === 'undefined' ? 'n/a' : val.colTypeDb;
            
            // validation config details
            
            var myInputTypes = []; // HTML5 input types
            myInputTypes.push(
              ['none']
              ,['text']
              //,['number']
              //,['range']
              ,['date'],['datetime'],['time']
              //,['week'],['month'] -- not enabled yet as I still have to test if they are saved to DB properly
              //,['datetime-local']
              //,['color']
              //,['email'],['tel'],['url']
              ,['password']);

            myConfigTable +=
            '        <tr>'
            +'            <td>' + configuredLabel + '</td>'
            +'            <td class="colIndex">' + val.colIndex + '</td>'
            +'            <td class="colName">' + val.colName + '</td>'
            +'            <td>' + colTypeDatabase + '</td>'
            +'            <td class="colType">' + val.colType + '</td>'
            +'            <td><input type="checkbox" name="isVisible" value="' + val.colName + '" ' + (val.isVisible ? ' checked ' : ' ') + '/></td>'
            +'            <td><input type="checkbox" name="isEditable" value="' + val.colName + '" ' + (val.isEditable ? ' checked ' : ' ') + '/></td>'
            +'            <td><input type="checkbox" name="isPrimaryKey" value="' + val.colName + '" ' + (val.isPrimaryKey ? ' checked ' : ' ') + '/></td>'
            +'            <td><input type="checkbox" name="isAutoIncrement" value="' + val.colName + '" ' + (val.isAutoIncrement ? ' checked ' : ' ') + ' disabled /></td>'
            +'            <td><input type="checkbox" name="isRequired" value="' + val.colName + '" ' + (val.isRequired ? ' checked ' : ' ') + '/></td>'
            +'            <td><input type="text" name="defaultValue" value="' + val.defaultValue + '"/></td>'
            +'            <td class="myInputTypesPickerContainer">' 
            
            + bissolCreateSelect(
                {
                    myData: myInputTypes
                    , myDefaultValue: typeof val.inputType === 'undefined' ? 'none' : val.inputType
                }
            )

            +'            </td>'
            //+'            <td><input type="text" name="min"></td>'
            //+'            <td><input type="text" name="max"></td>'
            //+'            <td><input type="text" name="maxlength"></td>'
            //+'            <td><input type="text" name="step"></td>'
            +'            <td><input type="text" name="validationPattern" value="' + val.validationPattern + '"></td>'
            +'            <td><input type="text" name="validationTitle" value="' + val.validationTitle + '"></td>'
            +'        </tr>'
            ;

            myColsName.push(val.colName);
            myColsType.push(val.colType);
            myColsPosition.push(val.colIndex);
        });

        myConfigTable +=
        '    </tbody>'
        +'</table>'
        ;
        
                
        Dashboards.setParameter('param_col_names', myColsName.join(','));
        Dashboards.setParameter('param_col_types', myColsType.join(','));
        Dashboards.setParameter('param_col_positions', myColsPosition.join(','));


        $('#html_db_table_metadata_picker').append(myConfigTable);

        // add submit button

        if($('#bissol-table-properties-submit').length === 0){    

            $('#html_db_table_metadata_picker').append('<button type="submit" id="bissol-table-properties-submit" class="btn btn-primary bissolConfigSubmit">Submit</button>');
            
            // add delete button in case we have already a config
            if(!$.isEmptyObject(myOldConfigData)){
              
              $('#html_db_table_metadata_picker').append(
                  '<button type="submit" id="bissol-table-properties-delete" class="btn btn-danger bissolConfigSubmit">Delete</button>'
                  );
            }

            bissolSaveAction();
        }
        
    }
}


function bissolSaveAction(){
    //$('#bissol-table-properties-submit').on('click', function(){
    $('#html_db_table_metadata_picker > button').on('click', function(){
                
        var action = $(this).text();
        console.log('The action chosen is: ' + action);
        Dashboards.setParameter('param_config_action', action);

        // remove any exsiting alert messages
        $('#bissol-table-properties div .alert').remove();
                
        // BUILD JSON CONFIG OBJECT
        var metadata = [];
        var metadataRows = $('#html_db_table_metadata_picker > table > tbody > tr');
        
        // create one object by row
        $.each(metadataRows, function(i, val){
            var metadataRow = {};
            metadataRow.colIndex = $( val ).find( 'td.colIndex' ).text();
            metadataRow.colName = $( val ).find( 'td.colName' ).text();
            metadataRow.colType = $( val ).find( 'td.colType' ).text();
            metadataRow.isVisible = $( val ).find( 'input[name="isVisible"]' ).is( ':checked' );
            metadataRow.isEditable = $( val ).find( 'input[name="isEditable"]' ).is( ':checked' );
            metadataRow.isPrimaryKey = $( val ).find( 'input[name="isPrimaryKey"]' ).is( ':checked' );
            metadataRow.isAutoIncrement = $( val ).find( 'input[name="isAutoIncrement"]' ).is( ':checked' );
            metadataRow.defaultValue = $( val ).find( 'input[name="defaultValue"]' ).val();
            metadataRow.isRequired = $( val ).find( 'input[name="isRequired"]' ).is( ':checked' );
            
            var inputTypeChosen = $( val ).find( 'td.myInputTypesPickerContainer > select option:selected' ).val();
            
            metadataRow.inputType = inputTypeChosen;
            
            switch (inputTypeChosen) {
                case 'date':
                    metadataRow.colFormat = 'yyyy-MM-dd';
                    break;
                case 'datetime':
                    metadataRow.colFormat = 'yyyy-MM-dd HH:mm:ss';
                    break;
                case 'time':
                    metadataRow.colFormat = 'HH:mm:ss';
                    break;
                // [OPEN]: List other types                       
                default:
                    metadataRow.colFormat = '';
            }
            
            //metadataRow.validationMin = $( val ).find( 'input[name="min"]' ).val();
            //metadataRow.validationMax = $( val ).find( 'input[name="max"]' ).val();
            //metadataRow.validationMaxLength = $( val ).find( 'input[name="maxLength"]' ).val();            
            //metadataRow.validationStep = $( val ).find( 'input[name="step"]' ).val();
            metadataRow.validationPattern = $( val ).find( 'input[name="validationPattern"]' ).val();
            metadataRow.validationTitle = $( val ).find( 'input[name="validationTitle"]' ).val();
            
            metadata.push(metadataRow);
        });
        
        var btdeConfigInstance = {};
        btdeConfigInstance.configId = param_config_id;
        btdeConfigInstance.dbConnection = param_db_connection;
        btdeConfigInstance.dbSchema = param_db_schema;
        btdeConfigInstance.dbTable = param_db_table;
        btdeConfigInstance.editorType = $('#editorSimple').hasClass('active') ? 'simple' : 'complex';
        btdeConfigInstance.metadata = metadata;                
                
        /**
        var myColsIsVisible = [];

        $( 'input[name="isVisible"]:checkbox:checked' ).each(function() {
            myColsIsVisible.push($(this).val());
        });

        console.log('my cols is visible:');
        console.log(myColsIsVisible);

        var myColsIsEditable = [];

        $( 'input[name="isEditable"]:checkbox:checked' ).each(function() {
            myColsIsEditable.push($(this).val());
        });

        console.log('my cols is editable:');
        console.log(myColsIsEditable);

        var myColsIsPrimaryKey = [];

        $( 'input[name="isPrimaryKey"]:checkbox:checked' ).each(function() {
            myColsIsPrimaryKey.push($(this).val());
        });

        console.log('my cols primary key:');
        console.log(myColsIsPrimaryKey);

        var myColsIsAutoIncrement = [];

        $( 'input[name="isAutoIncrement"]:checkbox:checked' ).each(function() {
            myColsIsAutoIncrement.push($(this).val());
        });               

        console.log('my cols auto increment:');
        console.log(myColsIsAutoIncrement);

        **/

        // Add a few checks
        // 1) are all chosen is_editable cols as well is_visible?
        // 2) is the chosen primary key column visible? 
        // 3) check that only one primary key is defined

        /**
        var isEditableCheckCounter = 0;
        $.each(myColsIsVisible,function(i,val){
            $.each(myColsIsEditable,function(j,value){
                if(val === value) {
                isEditableCheckCounter++;
                }    
            });
        });

        var isPrimaryKeyOkCounter = 0;
        if(myColsIsPrimaryKey.length === 1){
            $.each(myColsIsVisible,function(i,val){
                if(val === myColsIsPrimaryKey[0]) {
                    isPrimaryKeyOkCounter++;
                }
            });
        }
        
        var primaryKeyIsEditable = 0;
        if($.inArray(myColsIsPrimaryKey[0], myColsIsEditable) > -1){
            primaryKeyIsEditable = 1;
        } else {
            primaryKeyIsEditable = 0;
        }
        **/
  
        var isEditableCounter = 0;
        var isEditableAndVisibleCounter = 0;
        var isPrimaryKeyCounter = 0;
        var isVisibleCounter = 0;
        var primaryKeyIsVisible = false;
        var primaryKeyIsEditable = false;
        
        $.each(metadata, function(i, val){
           // check if there are any editable columns defined
           isEditableCounter += val.isEditable ? 1 : 0;
           // check if all editable columns are visible
           isEditableAndVisibleCounter += val.isEditable && val.isVisible ? 1 : 0;
           // count how many primary keys are defined
           isPrimaryKeyCounter += val.isPrimaryKey ? 1 : 0;
           // count how many visible fields are defined
           isVisibleCounter += val.isVisible ? 1 : 0;
           // check if the primar key is visible
           primaryKeyIsVisible += val.isPrimaryKey && val.isVisible ? true : false;
           // check if primary key column is specified as editable
           primaryKeyIsEditable += val.isPrimaryKey && val.isEditable ? true : false;
        });


        function createAlertErrorMsg(msg){
            var alertMsg = bissolCreateAlertMsg('danger','<strong>Error!</strong> Please correct your configuration details: ' + msg);
            $('#html_db_table_metadata_picker').prepend(alertMsg);
        }

        if(isPrimaryKeyCounter === 0){
            createAlertErrorMsg('You must define a primary key!');
        }

        else if(isPrimaryKeyCounter > 1){
            createAlertErrorMsg('You must only define one column as primary key!');
        }

        else if(isVisibleCounter === 0){
            createAlertErrorMsg('You must define at least one visible column!');
        }     

        else if(!primaryKeyIsVisible){
            createAlertErrorMsg('The primary key column must be visible!');                
        }

        else if(isEditableCounter === 0){
            createAlertErrorMsg('You must define at least one editable column!');
        }
        else if(isEditableCounter !== isEditableAndVisibleCounter){
            createAlertErrorMsg('All editable columns must be visible as well!');                
        } 
        else if(primaryKeyIsEditable){
            createAlertErrorMsg('The primary key column must not be editable!');                                    
        }

        else {

            //Dashboards.setParameter('param_col_names', myColsName.join(','));
            //Dashboards.setParameter('param_col_types', myColsType.join(','));
            //Dashboards.setParameter('param_col_positions', myColsPosition.join(','));
            //Dashboards.setParameter('param_col_names_visible', myColsIsVisible.join(','));
            //Dashboards.setParameter('param_col_names_editable', myColsIsEditable.join(','));
            //Dashboards.setParameter('param_id_column', myColsIsPrimaryKey.join(','));
            //Dashboards.setParameter('param_is_auto_increment', myColsIsAutoIncrement.join(','));
            //Dashboards.fireChange('param_config_save','save');
            
            Dashboards.fireChange('param_config', JSON.stringify(btdeConfigInstance));

            var alertSuccess = bissolCreateAlertMsg('success', '<strong>Success!</strong> Configuration details were saved.');

            $('#html_table_config_container').empty();
            $('#html_table_config_container').append(alertSuccess);

            // refresh main action picker pull down menu
            //Dashboards.setParameter('param_config_id','');
            Dashboards.updateComponent(render_comp_config_action_picker);

        }

    });
}