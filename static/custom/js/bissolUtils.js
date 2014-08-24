

function bissolCreateAlertMsg(type, msg){
    // type can be info, warning, danger, success (see bootstrap docu for more info)
    var alertMsg =
    '<div class="alert alert-' + type + ' alert-dismissible" role="alert">'
    +'    <button type="button" class="close" data-dismiss="alert">'
    +'    <span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'
    + msg
    +'</div>'
    ;
    return alertMsg;
}