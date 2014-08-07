
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
    
    if($('#bissol-table-properties').length){
        $('#bissol-table-properties').remove();
    }
    
    var myColsName = [];
    var myColsType = [];
    var myColsPosition = [];

    var myConfigTable=
    '<table class="table table-striped" id="bissol-table-properties">'
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

    $('#html_db_table_metadata_picker').append(myConfigTable);
    
    // add submit button
    
    if($('#bissol-table-properties-submit').length === 0){    
        
        $('#html_db_table_metadata_picker').append('<button type="submit" id="bissol-table-properties-submit" class="btn btn-primary bissolConfigSubmit">Submit</button>');
    
        $('#bissol-table-properties-submit').on('click', function(){
            
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
        
            
            Dashboards.setParameter('param_db_columns_name', myColsName.join(','));
            Dashboards.setParameter('param_db_columns_type', myColsType.join(','));
            Dashboards.setParameter('param_db_columns_position', myColsPosition.join(','));
            Dashboards.setParameter('param_db_columns_is_visible', myColsIsVisible.join(','));
            Dashboards.setParameter('param_db_columns_is_editable', myColsIsEditable.join(','));
            Dashboards.setParameter('param_db_columns_is_primary_key', myColsIsPrimaryKey.join(','));
            
            // [OPEN] Add a few checks
            // 1) are all chosen is_editable cols as well is_visible?
            // 2) is the chosen primary key column visible? 
            // 3) check that only one primary key is defined
            
            Dashboards.fireChange('param_config_save','save');
        });
    }
}


