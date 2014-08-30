

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

function bissolCreateModal(myDashboardObjectId,myModalId,myModalTitle,myModalText,myModalButton,myModalButtonText){

    var myModal =
    '    <div class="modal fade" id="' + myModalId +'" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'
    + '     <div class="modal-dialog">'
    + '        <div class="modal-content">'
    + '          <div class="modal-header">'
    + '            <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'
    + '            <h4 class="modal-title" id="myModalLabel">' + myModalTitle + '</h4>'
    + '         </div>'
    + '          <div class="modal-body">'
    + '          ' + myModalText
    + '          </div>'
    + '          <div class="modal-footer">'
    + '            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'
    + '            <button type="button" class="btn btn-primary" id="' + myModalButton + '" data-dismiss="modal">' + myModalButtonText + '</button>'
    + '          </div>'
    + '        </div>'
    + '      </div>'
    + '    </div>'
    ;
    
    $('#' + myDashboardObjectId).append(myModal);

}

// useful jQuery functions for modal: $('#myModal').modal('toggle'); $('#myModal').modal('show'); $('#myModal').modal('hide');