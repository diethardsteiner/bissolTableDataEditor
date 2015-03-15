function createCdaPickers(options) {
    
    var cdaPathContainer = options.cdaPathContainer; // name must include . or #
    var cdaIdContainer = options.cdaIdContainer; // name must include . or #
    var cdaParamsContainer = options.cdaParamsContainer; // name must include . or #
    
    // console.log('Preparing selects for: ');
    // console.log(cdaPathContainer);
    // console.log(cdaIdContainer);
    
    
    // details of this function are based on Latino Joel's code
    var cdaConn = new CDA({
      url: window.location.origin+webAppPath+"/plugin/cda/api/",
      error: function(error) {
        console.log("Error: " + error);
        return;
      }
    });
    
    // The next structure is based in callbacks of javascript 
    // because is the right way for browsers/node.js work over network.
    // This is almost the same thing if you use jquery. 
    // The main diferrence is a clean js lib for support CDA on browsers and node.js. Really similar of xmla4js.
    
    // We start by invoking the getCdaList endpoint that return all the CDA files on BI Server.
    cdaConn.getCdaList(function(dataFiles){

        $(cdaPathContainer).empty();
        // $(cdaPathContainer).append("<select></select>");
        $(cdaIdContainer).empty();
        $(cdaParamsContainer).empty();
        
        // for(var i = 0; i < dataFiles.resultset.length; i++){
        //     $(cdaPathContainer + " select").append("<option value='"+dataFiles.resultset[i][1]+"'>"+dataFiles.resultset[i][0]+"</option>");
        // }
        
        var myDataFiles = [];
        
        // console.log(dataFiles.resultset);
        
        // transform dataset so that path is listed first and name after 
        for(var i = 0; i < dataFiles.resultset.length; i++){
            myRow = [dataFiles.resultset[i][1], dataFiles.resultset[i][0]];
            myDataFiles.push(myRow);
        }
        
        // console.log(myDataFiles);
        
        bissolCreateSelect(
            {
                myCdeContainerId: cdaPathContainer
                , myData: myDataFiles
                , myRenderSelectMessage: false
                // , myDefaultValue: 'test'
            }
        );
    
        $(cdaPathContainer + " select").change(function(e){
            var cdaFilePath = $(e.target).val();
            // $(cdaIdContainer).empty().append("<select></select>");
            $(cdaParamsContainer).empty();
    
            // We invoke the listQueries endpoint 
            // that return all the queries available on the CDA file (you send the file path over parameter).
            // Note: some queries, special if you create your CDA in CDE don't have name 
            //   because webdetails aren't setting the tag name (I already open a issue but they are ignoring).
            cdaConn.listQueries(function(dataQueries){
                
                // for(var i = 0; i < dataQueries.resultset.length; i++){
                //     $(cdaIdContainer + " select").append("<option value='"+dataQueries.resultset[i][0]+"'>"+dataQueries.resultset[i][0] + " - " + dataQueries.resultset[i][1]+"</option>");
                // 
                // }
                
                console.log(dataQueries.resultset);
                
                var myDataQueries = [];
                
                // console.log(dataFiles.resultset);
                
                // transform dataset so that path is listed first and name after 
                for(var i = 0; i < dataQueries.resultset.length; i++){
                    myRow = [dataQueries.resultset[i][0], dataQueries.resultset[i][0] + ' - ' + dataQueries.resultset[i][2]];
                    myDataQueries.push(myRow);
                }
                
                bissolCreateSelect(
                    {
                        myCdeContainerId: cdaIdContainer
                        , myData: myDataQueries
                        , myRenderSelectMessage: false
                        // , myDefaultValue: 'test'
                    }
                );
                
                $(cdaIdContainer + " select").change(function(ev){
                    var cdaDataAccessId = $(ev.target).val();
                    $(cdaParamsContainer).empty().append("<select></select>");
    
                    // With the CDA path file and the data access id you can get the lis of parameters.
                    // You just need invoke the listParameters endpoint.
                    cdaConn.listParameters(function(dataParams){
                        for(var i = 0; i < dataParams.resultset.length; i++){
                            $(cdaParamsContainer + " select").append("<option value='"+dataParams.resultset[i][0]+"'>"+dataParams.resultset[i][0] + " - " + dataParams.resultset[i][1]+"</option>");
                        }
                    },{
                        params:{
                            path: cdaFilePath,
                            dataAccessId: cdaDataAccessId
                        }
                    });
                });
    
                // trigger change function after render the select
                $(cdaIdContainer + " select").trigger("change");
    
            },{
                params:{
                    path: cdaFilePath
                }
            });
        });
        
        // trigger change function after render the select
        $(cdaPathContainer + " select").trigger("change");
    });
}



function bissolCreateTableConfigPicker(myNewConfigData,myOldConfigData){    
    // console.log('--- -- ---');
    // console.log(myNewConfigData);
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
            elt.validationMessage = '';  
            elt.cdaPath = '';
            elt.cdaId = '';
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
        +'  <div id="html_error_msg"></div>'
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

        var myMetadataConfigForm=
        '<form class="form-horizontal">';
        ;
        
        $.each(myMergedConfigData, function(i, val){

            var configuredLabel = '';
            
            // if(val.configured){
            //   configuredLabel = '<span class="label label-primary bissolConfigLabel"><i class="fa fa-thumbs-o-up"></i></span>';
            // } else {
            //   configuredLabel = '<span class="label label-info bissolConfigLabel"><i class="fa fa-thumbs-o-down"></i></span>';
            // }
            
            if(val.configured){
              configuredLabel = '<span class="label label-primary bissolConfigLabel">Configured</span>';
            } else {
              configuredLabel = '<span class="label label-info bissolConfigLabel">New</span>';
            }
            
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
              ,['password']
              ,['select'] //custom
            );

            myMetadataConfigForm +=

            '<h2>' + val.colName + '</h2>'
            + configuredLabel 
            + '<div class="form-group form-group-sm"><label class="col-sm-2 control-label" for="colIndex">Position</label><div class="col-sm-10"><input type="text" name="colIndex" value="' + val.colIndex + '" disabled></div></div>'
            + '<div class="form-group form-group-sm"><label class="col-sm-2 control-label" for="colName">Column Name</label><div class="col-sm-10"><input type="text" name="colName" value="' + val.colName + '" disabled></div></div>'
            + '<div class="form-group form-group-sm"><label class="col-sm-2 control-label" for="colTypeDb">Column DB Type</label><div class="col-sm-10"><input type="text" name="colTypeDb" value="' + val.colTypeDb + '" disabled></div></div>'
            + '<div class="form-group form-group-sm"><label class="col-sm-2 control-label" for="colType">PDI Column Type</label><div class="col-sm-10"><input type="text" name="colType" value="' + val.colType + '" disabled></div></div>'
            
            + '<div class="form-group form-group-sm"><label class="col-sm-2 control-label" for="isVisible">Is Visible?</label><div class="col-sm-10"><input type="checkbox" name="isVisible" value="' + val.colName + '" ' + (val.isVisible ? ' checked ' : ' ') + '/></div></div>'
            + '<div class="form-group form-group-sm"><label class="col-sm-2 control-label" for="isEditable">Is Editable?</label><div class="col-sm-10"><input type="checkbox" name="isEditable" value="' + val.colName + '" ' + (val.isEditable ? ' checked ' : ' ') + '/></div></div>'
            + '<div class="form-group form-group-sm"><label class="col-sm-2 control-label" for="isPrimaryKey">Is Primary Key?</label><div class="col-sm-10"><input type="checkbox" name="isPrimaryKey" value="' + val.colName + '" ' + (val.isPrimaryKey ? ' checked ' : ' ') + '/></div></div>'
            + '<div class="form-group form-group-sm"><label class="col-sm-2 control-label" for="isAutoIncrement">Is Auto Increment?</label><div class="col-sm-10"><input type="checkbox" name="isAutoIncrement" value="' + val.colName + '" ' + (val.isAutoIncrement ? ' checked ' : ' ') + ' disabled /></div></div>'
            + '<div class="form-group form-group-sm"><label class="col-sm-2 control-label" for="isRequired">Is Required?</label><div class="col-sm-10"><input type="checkbox" name="isRequired" value="' + val.colName + '" ' + (val.isRequired ? ' checked ' : ' ') + '/></div></div>'
            + '<div class="form-group form-group-sm"><label class="col-sm-2 control-label" for="defaultValue">Default Value</label><div class="col-sm-10"><input type="text" name="defaultValue" value="' + val.defaultValue + '"/></div></div>'
            + '<div class="form-group form-group-sm"><label class="col-sm-2 control-label" for="inputType">Input Type</label><div class="col-sm-10 myInputTypesPickerContainer">'
            + bissolCreateSelect(
                {
                    myData: myInputTypes
                    , myDefaultValue: typeof val.inputType === 'undefined' ? 'none' : val.inputType
                }
            )
            + '</div></div>'
            //+'            <td><input type="text" name="min"></td>'
            //+'            <td><input type="text" name="max"></td>'
            //+'            <td><input type="text" name="maxlength"></td>'
            //+'            <td><input type="text" name="step"></td>'
            + '<div class="form-group form-group-sm"><label class="col-sm-2 control-label" for="validationPattern">Validation Pattern</label><div class="col-sm-10"><input type="text" name="validationPattern" value="' + val.validationPattern + '"></div></div>'
            + '<div class="form-group form-group-sm"><label class="col-sm-2 control-label" for="validationMessage">Validation Message</label><div class="col-sm-10"><input type="text" name="validationMessage" value="' + val.validationMessage + '"></div></div>'
            // + '<div class="form-group form-group-sm"><label class="col-sm-2 control-label" for="cdaPath">CDA Path</label><div class="col-sm-10"><input type="text" name="cdaPath" value="' + val.cdaPath + '"></div></div>'
            // + '<div class="form-group form-group-sm"><label class="col-sm-2 control-label" for="cdaId">CDA ID</label><div class="col-sm-10"><input type="text" name="cdaId" value="' + val.cdaId + '"></div></div>'
            + '<div class="form-group form-group-sm"><label class="col-sm-2 control-label" for="cdaPath">CDA Path</label><div class="col-sm-10" id="cdaPath' + val.colIndex + '"></div></div>'
            + '<div class="form-group form-group-sm"><label class="col-sm-2 control-label" for="cdaId">CDA ID</label><div class="col-sm-10" id="cdaId' + val.colIndex + '"></div></div>'
            ;

            myColsName.push(val.colName);
            myColsType.push(val.colType);
            myColsPosition.push(val.colIndex);
        });

        myMetadataConfigForm += '</form>';
        
                
        Dashboards.setParameter('param_col_names', myColsName.join(','));
        Dashboards.setParameter('param_col_types', myColsType.join(','));
        Dashboards.setParameter('param_col_positions', myColsPosition.join(','));


        $('#html_db_table_metadata_picker').append(myMetadataConfigForm);
        
        // add CDA pickers
        // can only be added once the form elements are attached to the main page
        // due to dependency CDA Path - ID (id list updates automatically on path change)
        $.each(myMergedConfigData, function(i, val){
            
            var currentCdaPath = '#cdaPath' + val.colIndex;
            var currentCdaId = '#cdaId' + val.colIndex;
            
            createCdaPickers(
                {
                    cdaPathContainer: currentCdaPath,
                    cdaIdContainer: currentCdaId
                }
            );
            
            
        });
        
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
        
        var colIndexArrayInput = [];
        $( '#html_db_table_metadata_picker input[name="colIndex"]' ).each(function() { 
            colIndexArrayInput.push($(this).val());
        });
        
        var colNameArrayInput = [];
        $( '#html_db_table_metadata_picker input[name="colName"]' ).each(function() { 
            colNameArrayInput.push($(this).val());
        });
        
        var colTypeDbArrayInput = [];
        $( '#html_db_table_metadata_picker input[name="colTypeDb"]' ).each(function() { 
            colTypeDbArrayInput.push($(this).val());
        });
        
        var colTypeArrayInput = [];
        $( '#html_db_table_metadata_picker input[name="colType"]' ).each(function() { 
            colTypeArrayInput.push($(this).val());
        });
        
        var isVisibleArrayInput = [];
        $( '#html_db_table_metadata_picker input[name="isVisible"]' ).each(function() { 
            isVisibleArrayInput.push($(this).is(':checked'));
        });
        
        var isEditableArrayInput = [];
        $( '#html_db_table_metadata_picker input[name="isEditable"]' ).each(function() { 
            isEditableArrayInput.push($(this).is(':checked'));
        });
        
        var isPrimaryKeyArrayInput = [];
        $( '#html_db_table_metadata_picker input[name="isPrimaryKey"]' ).each(function() { 
            isPrimaryKeyArrayInput.push($(this).is(':checked'));
        });
        
        var isAutoIncrementArrayInput = [];
        $( '#html_db_table_metadata_picker input[name="isAutoIncrement"]' ).each(function() { 
            isAutoIncrementArrayInput.push($(this).is(':checked'));
        });
        
        var defaultValueArrayInput = [];
        $( '#html_db_table_metadata_picker input[name="defaultValue"]' ).each(function() { 
            defaultValueArrayInput.push($(this).val());
        });
        
        var isRequiredArrayInput = [];
        $( '#html_db_table_metadata_picker input[name="isRequired"]' ).each(function() { 
            isRequiredArrayInput.push($(this).is(':checked'));
        });
        
        var validationPatternArrayInput = [];
        $( '#html_db_table_metadata_picker input[name="validationPattern"]' ).each(function() { 
            validationPatternArrayInput.push($(this).val());
        });
        
        var validationMessageArrayInput = [];
        $( '#html_db_table_metadata_picker input[name="validationMessage"]' ).each(function() { 
            validationMessageArrayInput.push($(this).val());
        });
        
        var cdaPathArrayInput = [];
        $( '#html_db_table_metadata_picker input[name="cdaPath"]' ).each(function() { 
            cdaPathArrayInput.push($(this).val());
        });
        
        var cdaIdArrayInput = [];
        $( '#html_db_table_metadata_picker input[name="cdaId"]' ).each(function() { 
            cdaIdArrayInput.push($(this).val());
        });
        
        var inputTypeChosenArrayInput = [];
        $( '#html_db_table_metadata_picker .myInputTypesPickerContainer' ).each(function() { 
            inputTypeChosenArrayInput.push($(this).find('select option:selected').val());
        });

        // create one object for each column
        // form has no sections, hence we have to use another way to separate the col metadata
        // how many cols are there?
        for(i=0;i<colNameArrayInput.length;i++){

            var metadataInstance = {};
            metadataInstance.colIndex = colIndexArrayInput[i];
            metadataInstance.colName = colNameArrayInput[i];
            metadataInstance.colTypeDb = colTypeDbArrayInput[i];
            metadataInstance.colType = colTypeArrayInput[i];
            metadataInstance.isVisible = isVisibleArrayInput[i];
            metadataInstance.isEditable = isEditableArrayInput[i];
            metadataInstance.isPrimaryKey = isPrimaryKeyArrayInput[i];
            metadataInstance.isAutoIncrement = isAutoIncrementArrayInput[i];
            metadataInstance.defaultValue = defaultValueArrayInput[i];
            metadataInstance.isRequired = isRequiredArrayInput[i];
            metadataInstance.validationPattern = validationPatternArrayInput[i];
            metadataInstance.validationMessage = validationMessageArrayInput[i];
            metadataInstance.cdaPath = cdaPathArrayInput[i];
            metadataInstance.cdaId = cdaIdArrayInput[i];
            
            var inputTypeChosen = inputTypeChosenArrayInput[i];
            metadataInstance.inputType = inputTypeChosen;
            
            switch (inputTypeChosen) {
                case 'date':
                    metadataInstance.colFormat = 'yyyy-MM-dd';
                    break;
                case 'datetime':
                    metadataInstance.colFormat = 'yyyy-MM-dd HH:mm:ss';
                    break;
                case 'time':
                    metadataInstance.colFormat = 'HH:mm:ss';
                    break;
                // [OPEN]: List other types                       
                default:
                    metadataInstance.colFormat = '';
            }
            
            metadata.push(metadataInstance);
        };
        
        var btdeConfigInstance = {};
        btdeConfigInstance.configId = param_config_id;
        btdeConfigInstance.dbConnection = param_db_connection;
        btdeConfigInstance.dbSchema = param_db_schema;
        btdeConfigInstance.dbTable = param_db_table;
        btdeConfigInstance.editorType = $('#editorSimple').hasClass('active') ? 'simple' : 'complex';
        btdeConfigInstance.metadata = metadata;                

        // Add a few checks
        // 1) are all chosen is_editable cols as well is_visible?
        // 2) is the chosen primary key column visible? 
        // 3) check that only one primary key is defined

        // console.log('--------');
        // console.log(btdeConfigInstance);
        var isEditableCounter = 0;
        var isEditableAndVisibleCounter = 0;
        var isPrimaryKeyCounter = 0;
        var isVisibleCounter = 0;
        var primaryKeyIsVisible = false;
        var primaryKeyIsEditable = false;
        var primaryKeyIsAutoIncremented = false;
        
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
           // check if primary key is auto incremented
           primaryKeyIsAutoIncremented += val.isPrimaryKey && val.isAutoIncrement ? true : false;
        });


        function createAlertErrorMsg(msg){
            var alertMsg = bissolCreateAlertMsg('danger','<strong>Error!</strong> Please correct your configuration details: ' + msg);
            $('#html_error_msg').prepend(alertMsg);
            
            // Modal
            //  var alertMsg = 'Please correct your configuration details: ' + msg;
            // 
            // $('#myAlertModal').remove(); // removing any pre-existing modals 
            // bissolCreateModal(
            //     '#bissolTablePropertiesContainer'
            //     , 'myAlertModal'
            //     , 'Warning'
            //     , 'Test'
            //     , 'myAlertButton'
            //     , 'Ok'
            // );
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
        else if(primaryKeyIsEditable && primaryKeyIsAutoIncremented){
            createAlertErrorMsg('The primary key column must not be editable! Only non-auto-incremented primary keys can be configured to be editable.');                                    
        } 
        else if(primaryKeyIsEditable && !primaryKeyIsAutoIncremented && btdeConfigInstance.editorType === 'simple'){
            createAlertErrorMsg('Editable primary key is only supported in the complex editor mode.');                                    
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
            console.log(btdeConfigInstance);
            var alertSuccess = bissolCreateAlertMsg('success', '<strong>Success!</strong> Configuration details were saved.');

            $('#html_table_config_container').empty();
            $('#html_table_config_container').append(alertSuccess);

            // refresh main action picker pull down menu
            //Dashboards.setParameter('param_config_id','');
            Dashboards.updateComponent(render_comp_config_action_picker);

        }

    });
}