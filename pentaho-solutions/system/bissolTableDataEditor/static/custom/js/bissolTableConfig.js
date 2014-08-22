
// lets provide some mapping to Kettle types
/** - moved to kettle transformation
function bissolMapDbTypeToPdiType(myDbType){
    
    var myPdiType;
        
    if(myDbType.toUpperCase()==='STRING' || myDbType.toUpperCase()==='TEXT' 
            || myDbType.toUpperCase().indexOf('CHAR') >= 0) {
        myPdiType = 'String';
    } 
    else if(myDbType.toUpperCase().indexOf('INT') >= 0 || myDbType.toUpperCase()==='SERIAL') {
        myPdiType = 'Integer';
    }
    else if(myDbType.toUpperCase()==='DECIMAL' || myDbType.toUpperCase()==='NUMERIC'){
        myPdiType = 'BigNumber';
    }
    else if(myDbType.toUpperCase()==='FLOAT' || myDbType.toUpperCase()==='REAL' 
            || myDbType.toUpperCase().indexOf('DOUBLE') >= 0){
        myPdiType = 'Number';
    }
    else if(myDbType.toUpperCase().indexOf('BOOL') >= 0){
        myPdiType = 'Boolean';
    }
    else if(myDbType.toUpperCase().indexOf('TIME') >= 0 || myDbType.toUpperCase()==='DATE') {
        myPdiType = 'Date';
    }    
    else if(myDbType.toUpperCase().indexOf('BLOB') >= 0 || myDbType.toUpperCase()==='BINARY'){
        myPdiType = 'Binary';
    } 
    else {
        myPdiType = 'Unknown - Report bug';
    }
    
    return myPdiType;
}
**/

function bissolCreateTableConfigPicker(myData){
    
    if(myData.length > 0){ 
    
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
        +'    </div>'
        +'  </div>'
        +'  <div id="html_submit"></div>'
        +'</div>'
        ;

        $('#bissolTablePropertiesContainer').append(basicStructure);

        var myColsName = [];
        var myColsType = [];
        var myColsPosition = [];

        var myConfigTable=
        '<table class="table table-striped">'
        +'    <thead>'
        +'        <tr>'
        +'            <th>#</th>'
        +'            <th>Col Name</th>'
        +'            <th>DB Col Type</th>'
        +'            <th>PDI Col Type</th>'
        +'            <th>Is Visible?</th>'
        +'            <th>Is Editable?</th>'
        +'            <th>Is Primary Key?</th>'        
        +'        </tr>'
        +'    </thead>'
        +'    <tbody>'
        ;

        $.each(myData, function(i, val){
            myConfigTable +=
            '        <tr>'
            +'            <td>' + val[3] + '</td>'
            +'            <td>' + val[0] + '</td>'
            +'            <td>' + val[1] + '</td>'
            +'            <td>' + val[5] + '</td>'
            +'            <td><input type="checkbox" name="isVisible" value="' + val[0] + '"/></td>'
            +'            <td><input type="checkbox" name="isEditable" value="' + val[0] + '"/></td>'
            +'            <td><input type="checkbox" name="isPrimaryKey" value="' + val[0] + '" ' + (val[4]==='YES' ? ' checked ' : ' ') + ' />'
            +'        </tr>'
            ;

            myColsName.push(val[0]);
            myColsType.push(val[5]); // use pdi col types
            myColsPosition.push(val[3]);
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

                console.log('my cols is primary key:');
                console.log(myColsIsPrimaryKey);

                // Add a few checks
                // 1) are all chosen is_editable cols as well is_visible?
                // 2) is the chosen primary key column visible? 
                // 3) check that only one primary key is defined



                var alertError = '';
                function createAlertErrorMsg(msg){
                    alertError =
                    '<div class="alert alert-danger alert-dismissible" role="alert">'
                    +'    <button type="button" class="close" data-dismiss="alert">'
                    +'    <span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'
                    +'    <strong>Error!</strong> Please correct your configuration details: ' 
                    + msg
                    +'</div>'
                    ;
                    return alertError;
                }


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
                
                
                if(myColsIsPrimaryKey.length === 0){
                    $('#html_db_table_metadata_picker').prepend(createAlertErrorMsg('You must define a primary key!'));
                }

                else if(myColsIsPrimaryKey.length > 1){
                    $('#html_db_table_metadata_picker').prepend(createAlertErrorMsg('You must only define one column as primary key!'));
                }

                else if(myColsIsVisible.length === 0){
                    $('#html_db_table_metadata_picker').prepend(createAlertErrorMsg('You must define at least one visible column!'));
                }     

                else if(isPrimaryKeyOkCounter !== 1){
                    $('#html_db_table_metadata_picker').prepend(createAlertErrorMsg('The primary key column must be visible!'));                
                }

                else if(myColsIsEditable.length === 0){
                    $('#html_db_table_metadata_picker').prepend(createAlertErrorMsg('You must define at least one editable column!'));
                }
                else if(isEditableCheckCounter !== myColsIsEditable.length){
                    $('#html_db_table_metadata_picker').prepend(createAlertErrorMsg('All editable columns must be visible as well!'));                
                } 
                else if(primaryKeyIsEditable === 1){
                    $('#html_db_table_metadata_picker').prepend(createAlertErrorMsg('The primary key column must not be editable!'));                                    
                }

                else {
                    
                    //Dashboards.setParameter('param_col_names', myColsName.join(','));
                    //Dashboards.setParameter('param_col_types', myColsType.join(','));
                    //Dashboards.setParameter('param_col_positions', myColsPosition.join(','));
                    Dashboards.setParameter('param_col_names_visible', myColsIsVisible.join(','));
                    Dashboards.setParameter('param_col_names_editable', myColsIsEditable.join(','));
                    Dashboards.setParameter('param_id_column', myColsIsPrimaryKey.join(','));
                    Dashboards.fireChange('param_config_save','save');

                    var alertSuccess =
                    '<div class="alert alert-success alert-dismissible" role="alert">'
                    +'    <button type="button" class="close" data-dismiss="alert">'
                    +'    <span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'
                    +'    <strong>Success!</strong> Configuration details were saved.'
                    +'</div>'
                    ;

                    $('#html_table_config_container').empty();
                    $('#html_table_config_container').append(alertSuccess);
                    
                    // refresh main action picker pull down menu
                    //Dashboards.setParameter('param_config_id','');
                    Dashboards.updateComponent(render_comp_config_action_picker);
                    
                }

            });
}