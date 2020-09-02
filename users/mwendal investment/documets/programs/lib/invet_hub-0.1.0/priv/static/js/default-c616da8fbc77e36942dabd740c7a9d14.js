function formartAmount(amt) {
    return Number(amt).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function is_amount_key(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode != 46 &&(charCode < 48 || charCode > 57)))
        return false;
    return true;
}

function is_number_key(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}

$(document).ready(function() {
    $('.select2').each(function() {
        $(this).select2({ dropdownParent: $(this).parent()});
    })

    var spinner = $('#loader');
    batch_id = null;
    user_id = null;
    batch_no = null;
    $('#last_batch_usr').change(function() {
        batch_id = ($(this).val());
        spinner.show();
        $.ajax({
            url: '/last/batch/usr/lookup',
            type: 'POST',
            data: { batch_id: batch_id, _csrf_token: $('#csrf').val() },
            success: function(result) {
                spinner.hide();
                if (result.data) {
                    batch_id = result.data.id;
                    user_id = result.data.last_user_id;
                    $('#last-user').val(result.data.last_user.first_name + ' ' + result.data.last_user.last_name);
                    Swal.fire(
                        'Great',
                        'User retrieved',
                        'success'
                    )
                } else {
                    Swal.fire(
                        'Oops',
                        'Something went wrong!',
                        'error'
                    )
                }
            },
            error: function(request, msg, error) {
                spinner.hide();
                Swal.fire(
                    'Oops',
                    'Something went wrong! try again',
                    'error'
                )
            }
        });
    });

    $("#assign-last-usr").click(function() {
        if (!user_id) {
            Swal.fire(
                'Oops',
                'No selected user found!',
                'error'
            )
            return false;
        }
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, continue!',
            closeOnConfirm: false,
            closeOnCancel: false,
            showLoaderOnConfirm: true
        }).then((result) => {
            if (result.value) {
            spinner.show();
            $.ajax({
                url: '/assign/batch/last/usr',
                type: 'POST',
                data: { batch_id: batch_id, last_user_id: user_id, _csrf_token: $('#csrf').val() },
                success: function(result) {
                    spinner.hide();
                    if (result.data) {
                        Swal.fire(
                            'Success',
                            result.data,
                            'success'
                        )
                        location.reload();
                    } else {
                        Swal.fire(
                            'Oops..',
                            result.error,
                            'error'
                        )
                    }
                },
                error: function(request, msg, error) {
                    spinner.hide();
                    Swal.fire(
                        'Oops..',
                        'Something went wrong! try again',
                        'error'
                    )
                }
            });
        } else {
            spinner.hide();
            Swal.fire(
                'Cancelled',
                'Operation not performed :)',
                'error'
            )
        }
    })
    });

    $.fn.dataTable.ext.buttons.back = {
        text:      'Go Back',
        titleAttr: 'Go Back',
        action: function ( e, dt, node, config ) {
            parent.history.back();
            return false;
        }
    };

    var batch_items_dt = $('#dt-batch-entries').DataTable({
        responsive: true
    });

    $("#close-batch").click(function() {
        if(batch_items_dt.rows().count() <= 0){
            Swal.fire(
                'Oops..!',
                'No transactions found!',
                'error'
            )
            return false;
        }
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, continue!',
            closeOnConfirm: false,
            closeOnCancel: false,
            showLoaderOnConfirm: true
        }).then((result) => {
            if (result.value) {
            spinner.show();
            $.ajax({
                url: '/close/batch',
                type: 'POST',
                data: { batch_no: $('.batch-no').val(), batch_id: $('.batch-id').val(), _csrf_token: $('#csrf').val() },
                success: function(result) {
                    spinner.hide();
                    if (result.data) {
                        Swal.fire(
                            'Success',
                            result.data,
                            'success'
                        )
                        window.location.replace("/new/batch");
                    } else {
                        Swal.fire(
                            'Oops...',
                            result.data,
                            'error'
                        )
                    }
                },
                error: function(request, msg, error) {
                    spinner.hide();
                    Swal.fire(
                        'Oops...',
                        'Something went wrong! try again',
                        'error'
                    )
                }
            });
        } else {
            spinner.hide();
            Swal.fire(
                'Cancelled',
                'Operation not performed :)',
                'error'
            )
        }
    })
    });

    $("#approve-batch").click(function() {
        var type = $(this).attr("data-approve-type")
        if(type == "OUWD"){
            if (ouwd_posting_dt.rows().count() <= 0) {
                Swal.fire(
                    'Oops..',
                    'No entries found!',
                    'error'
                )
                return false;
            }
        }
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, continue!',
            closeOnConfirm: false,
            closeOnCancel: false,
            showLoaderOnConfirm: true
        }).then((result) => {
            if (result.value) {
            spinner.show();
            $.ajax({
                url: '/approve/batch/items',
                type: 'POST',
                data: { batch_id: $('.batch-id').val(), _csrf_token: $('#csrf').val() },
                success: function(result) {
                    spinner.hide();
                    if (result.data) {
                        Swal.fire(
                            'Success!',
                            result.data,
                            'success'
                        )

                        if((type == "INWD") || (type == "UPLOAD") || (type == "OUWD")){
                            location.reload();
                        } else{
                            window.location.replace("/ouwd/batch/approval");
                        }
                    } else {
                        Swal.fire(
                            'Oops...!',
                            'Something went wrong! try again',
                            'error'
                        )
                    }
                },
                error: function(request, msg, error) {
                    spinner.hide();
                    Swal.fire(
                        'Oops...!',
                        'Something went wrong! try again',
                        'error'
                    )
                }
            });
        } else {
            spinner.hide();
            Swal.fire(
                'Cancelled',
                'Operation not performed :)',
                'error'
            )
        }
    })
    });

    $("#reload-batch").click(function() {
        location.reload();
    })

    $("#reject-batch").click(function() {
        if (ouwd_posting_dt.rows().count() <= 0) {
            Swal.fire(
                'Oops..',
                'No entries found!',
                'error'
            )
            return false;
        }
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, continue!',
            closeOnConfirm: false,
            closeOnCancel: false,
            showLoaderOnConfirm: true
        }).then((result) => {
            if (result.value) {
            spinner.show();
            $.ajax({
                url: '/reject/batch',
                type: 'POST',
                data: { batch_id: $('.batch-id').val(), _csrf_token: $('#csrf').val() },
                success: function(result) {
                    spinner.hide();
                    if (result.data) {
                        Swal.fire(
                            'Success!',
                            result.data,
                            'success'
                        )
                        window.location.replace("/ouwd/batch/approval");
                    } else {
                        Swal.fire(
                            'Oops...!',
                            result.error,
                            'error'
                        )
                    }
                },
                error: function(request, msg, error) {
                    spinner.hide();
                    Swal.fire(
                        'Oops...!',
                        'Something went wrong',
                        'error'
                    )
                }
            });
        } else {
            spinner.hide();
            Swal.fire(
                'Cancelled',
                'Operation not performed :)',
                'error'
            )
        }
    })
    });

    $('#select-batch').change(function() {
        batch_id = $(this).find(':selected').attr('data-batch-id');
        $('#selected-batch-id').val(batch_id);
    });

    // Inward Verification Operations
    var tech_dt = $('#dt-tech-verify').DataTable({
        "responsive": true,
        "processing": true,
        "select": {
            "style": 'multi'
        },
        // dom: 'lBfrtip<"actions">',
        'language': {
            'loadingRecords': '&nbsp;',
            processing: '<i class="fal fa-spinner fa-spin fa-2x fa-fw"></i><span class="sr-only">Loading...</span> '
        },
        "serverSide": true,
        "paging": true,
        'ajax': {
            "type"   : "POST",
            "url"    : '/inwd/verification/entries',
            "data"   : {
                "_csrf_token": $("#csrf").val(),
                "batch_id": $("#batch-id").val()
            }
        },
        "columns": [
            {"data": "destin_acc_no"},
            {"data": "destin_sort_code"},
            {"data": "src_acc_no"},
            {"data": "src_sort_code"},
            {"data": "dr_txn_acc_no"},
            {
                "data": "amount",
                "render": function ( data, type, row ) {
                    if(data){
                        return formartAmount(data.replace(/\,/g, ''));
                    } else{
                        "<span class='text-danger'>Not Set</span>"
                    }
                },
                "defaultContent": "<span class='text-danger'>Not Set</span>"
            },
            {"data": "avl_bal"},
            {"data": "cbs_status"},
            {
                "data": "id",
                "className": 'options',
                "orderable": false,
                "render": function ( data, type, row ) {
                    return '<a class="btn-xs text-blue" href="/inwd/verify/transaction?id='+ data +'">View</a>';
                }
            },
        ],
        "lengthMenu": [[10, 25, 50, 100, 500, 1000], [10, 25, 50, 100, 500, 1000]],
        "order": [[1, 'asc']],
        'columnDefs': [
            {
                "targets": 0,
                "className": "text-center"
            },
            {
                "targets": 4,
                "className": "text-center"
            },
            {
                "targets": 5,
                "className": "text-center"
            }
        ],
    });

    $('#inwd-tech-search').on( 'click', function () {
        tech_dt.ajax.reload();
    });

    var inwd_posting_dt = $('#dt-inwd-posting').DataTable({
        responsive: true,
        "processing": true,
        "select": true,
        // dom: 'lBfrtip<"actions">',
        'language': {
            'loadingRecords': '&nbsp;',
            processing: '<i class="fal fa-spinner fa-spin fa-2x fa-fw"></i><span class="sr-only">Loading...</span> '
        },
        "serverSide": true,
        "paging": true,
        'ajax': {
            "type"   : "POST",
            "url"    : '/inwd/posting/entries',
            "data"   : {
                "_csrf_token": $("#csrf").val(),
                "batch_id": $(".batch-id").val()
            }
        },
        "columns": [
            {"data": "destin_acc_no"},
            {"data": "destin_sort_code"},
            {"data": "src_acc_no"},
            {"data": "src_sort_code"},
            {
                "data": "amount",
                "render": function ( data, type, row ) {
                    if(data){
                        return formartAmount(data.replace(/\,/g, ''));
                    } else{
                        "<span class='text-danger'>Not Set</span>"
                    }
                },
                "defaultContent": "<span class='text-danger'>Not Set</span>"
            },
            {"data": "cbs_status"},
            {
                "data": "id",
                "className": 'options',
                "orderable": false,
                "render": function ( data, type, row ) {
                    return '<a class="btn-xs text-blue" href="/inwd/verify/transaction?id='+ data +'">View</a>';
                }
            }
        ],
        "lengthMenu": [[10, 25, 50, 100, 500, 1000], [10, 25, 50, 100, 500, 1000]],
        "order": [[1, 'asc']],
        'columnDefs': [
            {
                "targets": 0,
                "className": "text-center"
            },
            {
                "targets": 4,
                "className": "text-center"
            },
            {
                "targets": 5,
                "className": "text-center"
            }
        ],
    });

    $('#inwd-posting-search').on( 'click', function () {
        inwd_posting_dt.ajax.reload();
    });

    $(".process-inwd-files").click(function() {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, continue!',
            closeOnConfirm: false,
            closeOnCancel: false,
            showLoaderOnConfirm: true
        }).then((result) => {
            if (result.value) {
            spinner.show();
            $.ajax({
                url: '/process/inwd/files',
                type: 'GET',
                success: function(result) {
                    spinner.hide();
                    if (result.data) {
                        Swal.fire(
                            'Success!',
                            'Operation Successful.',
                            'success'
                        )

                        location.reload();
                    } else {
                        Swal.fire(
                            'Oops..!',
                            result.error,
                            'error'
                        )
                    }
                },
                error: function(request, msg, error) {
                    spinner.hide();
                    Swal.fire(
                        'Oops..!',
                        'Something went wrong:)',
                        'error'
                    )
                }
            });
        } else {
            spinner.hide();
            Swal.fire(
                'Cancelled',
                'Operation not performed :)',
                'error'
            )
        }
    })
    });

    $(".batch-apply-dec").click(function() {
        $('#Reject-Reason').modal('hide');
        var decision = $(this).attr("data-decision");
        var return_code = null;
        if(tech_dt.rows().count() <= 0){
            Swal.fire(
                'Oops..!',
                'No transactions found!',
                'error'
            )
            return false;
        }
        if(decision == "REJECTED"){
            return_code = $('#reject-code').val();
            if(return_code == ""){
                Swal.fire(
                    'Oops..!',
                    'Return Reason is required!',
                    'error'
                )
                return false;
            }
        }
        var arr = [];
        tech_dt.rows( { selected: true } ).every(function(rowIdx) {
            arr.push(tech_dt.row(rowIdx).data().id);
        })
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, continue!',
            showLoaderOnConfirm: true
        }).then((result) => {
            if (result.value) {
            spinner.show();
            $.ajax({
                url: '/verify/batch/items',
                type: 'POST',
                data: {entries: arr, batch_id: $('#batch-id').val(), return_code: return_code, decision: decision, _csrf_token: $('#csrf').val() },
                success: function(result) {
                    spinner.hide();
                    if (result.data) {
                        Swal.fire(
                            'Success!',
                            'Operation Successful.',
                            'success'
                        )

                        location.reload();
                    } else {
                        Swal.fire(
                            'Oops..!',
                            result.error,
                            'error'
                        )
                    }
                },
                error: function(request, msg, error) {
                    spinner.hide();
                    Swal.fire(
                        'Oops..!',
                        'Something went wrong:)',
                        'error'
                    )
                }
            });
        } else {
            spinner.hide();
            Swal.fire(
                'Cancelled',
                'Operation not performed :)',
                'error'
            )
        }
    })
    });

    $(".single-apply-dec").click(function() {
        $('#Reject-Reason').modal('hide');
        var decision = $(this).attr("data-decision");
        var return_code = null;
        if(decision == "REJECTED"){
            return_code = $('#reject-code').val();
            if(return_code == ""){
                Swal.fire(
                    'Oops..!',
                    'Return Reason is required!',
                    'error'
                )
                return false;
            }
        }
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, continue!',
            showLoaderOnConfirm: true
        }).then((result) => {
            if (result.value) {
            spinner.show();
            $.ajax({
                url: '/verify/single/item',
                type: 'POST',
                data: {id: $('#id').val(), return_code: return_code, decision: decision, _csrf_token: $('#csrf').val() },
                success: function(result) {
                    spinner.hide();
                    if (result.data) {
                        Swal.fire(
                            'Success',
                            result.data,
                            'success'
                        )

                        window.location.replace("/inwd/tech/verification");
                    } else {
                        Swal.fire(
                            'Oops..',
                            result.error,
                            'error'
                        )
                    }
                },
                error: function(request, msg, error) {
                    spinner.hide();
                    Swal.fire(
                        'Oops..',
                        'Something went wrong! try again',
                        'error'
                    )
                }
            });
        } else {
            spinner.hide();
            Swal.fire(
                'Cancelled',
                'Operation not performed!',
                'error'
            )
        }
    })
    });

    //Outward Entry Posting
    var ouwd_posting_dt = $('#dt-ouwd-posting').DataTable({
        "responsive": true,
        "processing": true,
        // "select": true,
        "select": {
            "style": 'multi'
        },
        // dom: 'lBfrtip<"actions">',
        'language': {
            'loadingRecords': '&nbsp;',
            processing: '<i class="fal fa-spinner fa-spin fa-2x fa-fw"></i><span class="sr-only">Loading...</span> '
        },
        "serverSide": true,
        "paging": true,
        'ajax': {
            "type"   : "POST",
            "url"    : '/outward/entries/posting',
            "data"   : {
                "_csrf_token": $("#csrf").val(),
                "batch_id": $('.batch-id').val()
            }
        },
        "columns": [
            {"data": "destin_acc_no"},
            {"data": "destin_sort_code"},
            {"data": "src_acc_no"},
            {
                "data": "amount",
                "render": function ( data, type, row ) {
                    if(data){
                        return formartAmount(data.replace(/\,/g, ''));
                    } else{
                        return "<span class='text-danger'>Not Set</span>";
                    }
                },
                "defaultContent": "<span class='text-danger'>Not Set</span>"
            },
            {
                "data": "avl_bal",
                "render": function ( data, type, row ) {
                    if(data){
                        return formartAmount(data.replace(/\,/g, ''));
                    } else{
                        return "<span class='text-danger'>Not Set</span>";
                    }
                },
                "defaultContent": "<span class='text-danger'>Not Set</span>"
            },
            {"data": "cbs_status"},
            {
                "data": "id",
                "render": function ( data, type, row ) {
                    return '<button class="btn btn-primary btn-xs" data-toggle="dropdown" style="margin-top:0px !important; padding-top: 0px !important;">Options</button>'+
                        '<div class="dropdown-menu dropdown-menu-animated dropdown-menu-right text-center position-absolute pos-top">'+
                        '<a href="/ouwd/view/entry?id='+data+'" class="dropdown-item text-primary">View details</a>'+
                        '</div>';
                },
                "defaultContent": "<span class='text-danger'>No Actions</span>"
            }
        ],
        "lengthMenu": [[10, 25, 50, 100, 500, 1000], [10, 25, 50, 100, 500, 1000]],
        "order": [[1, 'asc']],
        'columnDefs': [
            {
                "targets": 5,
                "className": "text-center"
            },
            {
                "targets": 6,
                "className": "text-center"
            }
        ],
    });

    $('#ouwd-posting').on( 'click', function () {
        ouwd_posting_dt.ajax.reload();
    });

    // Inward/Outward Reversal Posting
    var rev_dt = $('#dt-reversal').DataTable({
        "responsive": true,
        "processing": true,
        // "select": true,
        "select": {
            "style": 'multi'
        },
        // dom: 'lBfrtip<"actions">',
        'language': {
            'loadingRecords': '&nbsp;',
            processing: '<i class="fal fa-spinner fa-spin fa-2x fa-fw"></i><span class="sr-only">Loading...</span> '
        },
        "serverSide": true,
        "paging": true,
        'ajax': {
            "type"   : "POST",
            "url"    : '/reversal/posting/entries',
            "data"   : {
                "_csrf_token": $("#csrf").val()
            }
        },
        "columns": [
            {"data": "destin_acc_no"},
            {"data": "destin_sort_code"},
            {"data": "src_acc_no"},
            {"data": "src_sort_code"},
            {"data": "dr_txn_acc_no"},
            {
                "data": "amount",
                "render": function ( data, type, row ) {
                    if(data){
                        return formartAmount(data.replace(/\,/g, ''));
                    } else{
                        "<span class='text-danger'>Not Set</span>"
                    }
                },
                "defaultContent": "<span class='text-danger'>Not Set</span>"
            },
            {"data": "avl_bal"},
            {"data": "cbs_status"},
            {
                "data": "id",
                "render": function ( data, type, row ) {
                    return '<button class="btn btn-primary btn-xs" data-toggle="dropdown" style="margin-top:0px !important; padding-top: 0px !important;">Options</button>'+
                        '<div class="dropdown-menu dropdown-menu-animated dropdown-menu-right text-center position-absolute pos-top">'+
                        '<a href="/inwd/verify/transaction?id='+ data +'" class="dropdown-item text-primary">View details</a>'+
                        '</div>';
                },
                "defaultContent": "<span class='text-danger'>No Actions</span>"
            }
        ],
        "lengthMenu": [[10, 25, 50, 100, 500, 1000], [10, 25, 50, 100, 500, 1000]],
        "order": [[1, 'asc']],
        'columnDefs': [
            {
                "targets": 0,
                "className": "text-center"
            },
            {
                "targets": 4,
                "className": "text-center"
            },
            {
                "targets": 5,
                "className": "text-center"
            }
        ],
    });

    $('#rev-search').on( 'click', function () {
        rev_dt.ajax.reload();
    });

    $("#rev-posting").click(function() {
        if(rev_dt.rows().count() <= 0){
            Swal.fire(
                'Oops..!',
                'No transactions found!',
                'error'
            )
            return false;
        }
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, continue!',
            showLoaderOnConfirm: true
        }).then((result) => {
            if (result.value) {
            spinner.show();
            $.ajax({
                url: '/reverse/posting',
                type: 'POST',
                data: {_csrf_token: $('#csrf').val()},
                success: function(result) {
                    spinner.hide();
                    if (result.data) {
                        Swal.fire(
                            'Success',
                            'Posting in progress!',
                            'success'
                        )

                        rev_dt.ajax.reload();
                    } else {
                        Swal.fire(
                            'Oops..',
                            result.error,
                            'error'
                        )
                    }
                },
                error: function(request, msg, error) {
                    spinner.hide();
                    Swal.fire(
                        'Oops..',
                        'Something went wrong! try again',
                        'error'
                    )
                }
            });
        } else {
            spinner.hide();
            Swal.fire(
                'Cancelled',
                'Operation not performed :)',
                'error'
            )
        }
    })
    });

    var row = null;
    var table = null;
    var ref = null;
    var mark_type = null;

    $("#upload-mark-as-posted").click(function() {
        mark_type = $(this).attr("data-mark-type");
        row = upload_dt.rows( { selected: true } ).data()[0];
        table = upload_dt;
        if(!row){
            Swal.fire(
                'Oops..!',
                'No transactions selected!',
                'error'
            )
            return false;
        }
        $('#cbs_ref_no').val("");
        $('#cbs-ref-modal').modal('show');
    })

    $("#rev-mark-as-posted").click(function() {
        row = rev_dt.rows( { selected: true } ).data()[0];
        table = rev_dt;
        if(!row){
            Swal.fire(
                'Oops..!',
                'No transactions selected!',
                'error'
            )
            return false;
        }
        $('#cbs_ref_no').val("");
        $('#cbs-ref-modal').modal('show');
    })

    $("#mark-as-posted").click(function() {
        mark_type = $(this).attr("data-mark-type");
        row = inwd_posting_dt.rows( { selected: true } ).data()[0];
        table = inwd_posting_dt;
        if(!row){
            Swal.fire(
                'Oops..',
                'No transactions selected!',
                'error'
            )
            return false;
        }
        $('#cbs_ref_no').val("");
        $('#cbs-ref-modal').modal('show');
    })

    $("#ouwd-mark-as-posted").click(function() {
        mark_type = $(this).attr("data-mark-type");
        row = ouwd_posting_dt.rows( { selected: true } ).data()[0];
        ouwd_posting_dt.rows('.selected').data()
        table = ouwd_posting_dt;
        if(!row){
            Swal.fire(
                'Oops..',
                'No transactions selected!',
                'error'
            )
            return false;
        }
        $('#cbs_ref_no').val("");
        $('#cbs-ref-modal').modal('show');
    })

    $('.mark-as-posted').click(function() {
        ref = $('#cbs_ref_no').val();
        $('#cbs-ref-modal').modal('hide');
        if($.trim(ref) != ""){
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, continue!',
                showLoaderOnConfirm: true
            }).then((result) => {
                if (result.value) {
                var count = table.rows().count();
                spinner.show();
                $.ajax({
                    url: '/mark/as/posted',
                    type: 'POST',
                    data: {id: row.id, ref: ref, mark_type: mark_type, _csrf_token: $('#csrf').val()},
                    success: function(result) {
                        spinner.hide();
                        if (result.data) {
                            Swal.fire(
                                'Success',
                                'Posting in progress!',
                                'success'
                            )
                            if(count == 1){
                                if(mark_type == "INWD"){
                                    window.location.replace("/select/inward/files");
                                } else if(mark_type == "UPLOAD"){
                                    window.location.replace("/select/upload/files");
                                }
                            }
                            table.ajax.reload();
                        } else {
                            Swal.fire(
                                'Oops..',
                                result.error,
                                'error'
                            )
                        }
                    },
                    error: function(request, msg, error) {
                        spinner.hide();
                        Swal.fire(
                            'Oops..',
                            'Something went wrong! try again',
                            'error'
                        )
                    }
                });
            } else {
                spinner.hide();
                Swal.fire(
                    'Cancelled',
                    'Operation not performed :)',
                    'error'
                )
            }
        })
        }else{
            spinner.hide();
            Swal.fire(
                'Oops...',
                'You need to enter your reference!',
                'error'
            )
        }
    })

    // Upload Processing
    var upload_dt = $('#dt-upload-entries').DataTable({
        "responsive": true,
        "processing": true,
        // dom: 'lBfrtip<"actions">',
        "select": {
            "style": 'multi'
        },
        'language': {
            'loadingRecords': '&nbsp;',
            processing: '<i class="fal fa-spinner fa-spin fa-2x fa-fw"></i><span class="sr-only">Loading...</span> '
        },
        "serverSide": true,
        "paging": true,
        'ajax': {
            "type"   : "POST",
            "url"    : '/upload/posting/entries',
            "data"   : {
                "_csrf_token": $("#csrf").val(),
                "batch_id": $(".batch-id").val()
            }
        },
        "columns": [
            {"data": "src_acc_no"},
            {"data": "destin_acc_no"},
            {"data": "destin_sort_code"},
            {"data": "drcr"},
            {
                "data": "amount",
                "render": function ( data, type, row ) {
                    if(data){
                        return formartAmount(data.replace(/\,/g, ''));
                    } else{
                        "<span class='text-danger'>Not Set</span>"
                    }
                },
                "defaultContent": "<span class='text-danger'>Not Set</span>"
            },
            {"data": "cbs_status"},
            {
                "data": "id",
                "render": function ( data, type, row ) {
                    return '<button class="btn btn-primary btn-xs" data-toggle="dropdown" style="margin-top:0px !important; padding-top: 0px !important;">Options</button>'+
                        '<div class="dropdown-menu dropdown-menu-animated dropdown-menu-right text-center position-absolute pos-top">'+
                        '<a href="/ouwd/view/entry?id='+data+'" class="dropdown-item text-primary">View details</a>'+
                        '</div>';
                },
                "defaultContent": "<span class='text-danger'>No Actions</span>"
            }
        ],
        "lengthMenu": [[10, 25, 50, 100, 500, 1000], [10, 25, 50, 100, 500, 1000]],
        "order": [[1, 'asc']],
        'columnDefs': [
            {
                "targets": 2,
                "className": "text-center"
            },
            {
                "targets": 3,
                "className": "text-center"
            }
        ],
    });

    $('#dt-upload-errors').DataTable({
        "responsive": true,
        "processing": true,
        'language': {
            'loadingRecords': '&nbsp;',
            processing: '<i class="fal fa-spinner fa-spin fa-2x fa-fw"></i><span class="sr-only">Loading...</span> '
        },
        "serverSide": true,
        "paging": true,
        'ajax': {
            "type"   : "POST",
            "url"    : '/upload/entry/errors',
            "data"   : {
                "_csrf_token": $("#csrf").val()
            }
        },
        "columns": [
            {"data": "col_index"},
            {"data": "filename"},
            {"data": "error_msg"}
        ],
        "lengthMenu": [[10, 25, 50, 100, 500, 1000], [10, 25, 50, 100, 500, 1000]],
        "order": [[1, 'asc']]
    });

    //Transactions Reports
    var report_dt = $('#dt-report-entries').DataTable({
        "responsive": true,
        "processing": true,
        "select": {
            "style": 'multi'
        },
        'language': {
            'loadingRecords': '&nbsp;',
            processing: '<i class="fal fa-spinner fa-spin fa-2x fa-fw"></i><span class="sr-only">Loading...</span> '
        },
        "serverSide": true,
        "paging": true,
        'ajax': {
            "type"   : "POST",
            "url"    : '/report/entries',
            "data"   : {
                "_csrf_token": $("#csrf").val(),
                "src_acc_no": $('#src_acc_no').val(),
                "src_sort_code": $('#src_sort_code').val(),
                "from": $('#from').val(),
                "to": $('#to').val(),
                "destin_sort_code": $('#destin_sort_code').val(),
                "destin_acc_no": $('#destin_acc_no').val(),
                "item_type": $('#item_type').val(),
                "drcr": $('#drcr').val(),
                "session": $('#session').val(),
                "file_type": $('#file_type').val()
            }
        },
        "columns": [
            {"data": "src_acc_no"},
            {"data": "src_sort_code"},
            {"data": "destin_acc_no"},
            {"data": "destin_sort_code"},
            {"data": "drcr"},
            {
                "data": "amount",
                "render": function ( data, type, row ) {
                    if(data){
                        return formartAmount(data.replace(/\,/g, ''));
                    } else{
                        "<span class='text-danger'>Not Set</span>"
                    }
                },
                "defaultContent": "<span class='text-danger'>Not Set</span>"
            },
            {"data": "auth_status"},
            {
                "data": "id",
                "render": function ( data, type, row ) {
                    return '<button class="btn btn-primary btn-xs" data-toggle="dropdown" style="margin-top:0px !important; padding-top: 0px !important;">Options</button>'+
                        '<div class="dropdown-menu dropdown-menu-animated dropdown-menu-right position-absolute pos-top">'+
                        '<a href="/ouwd/view/entry?id='+data+'" class="dropdown-item text-primary">View details</a>'+
                        '<a href="/proof/of/payment?id='+data+'" class="dropdown-item text-primary">Proof of Payment</a>'+
                        '</div>';
                },
                "defaultContent": "<span class='text-danger'>No Actions</span>"
            }
        ],
        "lengthMenu": [[10, 25, 50, 100, 500, 1000], [10, 25, 50, 100, 500, 1000]],
        "order": [[1, 'asc']]
    });

    // OUWD FIles
    var ouwd_file_dt = $('#dt-ouwd-file-entries').DataTable({
        "responsive": true,
        "processing": true,
        'language': {
            'loadingRecords': '&nbsp;',
            processing: '<i class="fal fa-spinner fa-spin fa-2x fa-fw"></i><span class="sr-only">Loading...</span> '
        },
        "serverSide": true,
        "paging": true,
        'ajax': {
            "type"   : "POST",
            "url"    : '/ouwd/files',
            "data"   : {
                "_csrf_token": $("#csrf").val(),
                "file_name": $('#file_name').val(),
                "file_type": $('#file_type').val(),
                "from": $('#from').val(),
                "to": $('#to').val(),
                "session": $('#session').val(),
                "seq_no": $('#seq_no').val()
            }
        },
        "columns": [
            {"data": "file_name"},
            {"data": "file_type"},
            {"data": "session"},
            {"data": "seq_no"},
            {"data": "exported_at"},
            {
                "data": "id",
                "render": function ( data, type, row ) {
                    return '<button class="btn btn-primary btn-xs" data-toggle="dropdown" style="margin-top:0px !important; padding-top: 0px !important;">Options</button>'+
                        '<div class="dropdown-menu dropdown-menu-animated dropdown-menu-right position-absolute pos-top">'+
                        '<a href="#" data-id="'+data+'" class="dropdown-item text-primary represent-file">Re-present</a>'+
                        '<a href="#" data-id="'+data+'" class="dropdown-item text-primary reverse-file">Reverse</a>'+
                        '</div>';
                },
                "defaultContent": "<span class='text-danger'>No Actions</span>"
            }
        ],
        "lengthMenu": [[10, 25, 50, 100, 500, 1000], [10, 25, 50, 100, 500, 1000]],
        "order": [[1, 'asc']]
    });

    $('#ouwd-file-filter').on( 'click', function () {
        ouwd_file_dt.on('preXhr.dt', function ( e, settings, data ) {
            data._csrf_token 	= $("#csrf").val();
            data.file_name 	= $('#file_name').val();
            data.file_type 	= $('#file_type').val();
            data.from 	= $('#from').val();
            data.to 	= $('#to').val();
            data.session = $('#session').val();
            data.seq_no	= $('#seq_no').val();
        } );
        $('#filter').modal('hide');
        ouwd_file_dt.draw();
    });

    $('#ouwd-file-reload').on( 'click', function () {
        ouwd_file_dt.ajax.reload();
    });

    var reprsnt_id = null;
    $('#dt-ouwd-file-entries tbody').on('click', '.represent-file', function () {
        console.log("111111");
        reprsnt_id = $(this).attr("data-id");
        $('#represent-form').modal('show');
    });

    $('#reprsnt-file').on( 'click', function () {
        var date = $('#exp-date').val();
        var session = $('#exp-session').val();
        $('#represent-form').modal('hide');
        if((date == "") || (session == "")){
            Swal.fire(
                'Oops..',
                'ensure all fields are filled!',
                'error'
            )
            return false;
        }
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, continue!',
            showLoaderOnConfirm: true
        }).then((result) => {
            if (result.value) {
            spinner.show();
            $.ajax({
                url: '/represent/file',
                type: 'POST',
                data: {id: reprsnt_id, session: session, date: date, _csrf_token: $('#csrf').val()},
                success: function(result) {
                    spinner.hide();
                    if (result.data) {
                        Swal.fire(
                            'Success',
                            'Operation successful!',
                            'success'
                        )
                    } else {
                        Swal.fire(
                            'Oops..',
                            result.error,
                            'error'
                        )
                    }
                },
                error: function(request, msg, error) {
                    spinner.hide();
                    Swal.fire(
                        'Oops..',
                        'Something went wrong! try again',
                        'error'
                    )
                }
            });
        } else {
            spinner.hide();
            Swal.fire(
                'Cancelled',
                'Operation not performed :)',
                'error'
            )
        }
    })
    });

    $('#dt-ouwd-file-entries tbody').on('click', '.reverse-file', function () {
        var id = $(this).attr("data-id");
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, continue!',
            showLoaderOnConfirm: true
        }).then((result) => {
            if (result.value) {
            spinner.show();
            $.ajax({
                url: '/reverse/file',
                type: 'POST',
                data: {id: id, _csrf_token: $('#csrf').val()},
                success: function(result) {
                    spinner.hide();
                    if (result.data) {
                        Swal.fire(
                            'Success',
                            'Operation successful!',
                            'success'
                        )
                    } else {
                        Swal.fire(
                            'Oops..',
                            result.error,
                            'error'
                        )
                    }
                },
                error: function(request, msg, error) {
                    spinner.hide();
                    Swal.fire(
                        'Oops..',
                        'Something went wrong! try again',
                        'error'
                    )
                }
            });
        } else {
            spinner.hide();
            Swal.fire(
                'Cancelled',
                'Operation not performed :)',
                'error'
            )
        }
    })
    });

    $('#report-filter').on( 'click', function () {
        report_dt.on('preXhr.dt', function ( e, settings, data ) {
            data._csrf_token 	= $("#csrf").val();
            data.src_acc_no 	= $('#src_acc_no').val();
            data.src_sort_code 	= $('#src_sort_code').val();
            data.from 		    = $('#from').val();
            data.to 		    = $('#to').val();
            data.destin_sort_code = $('#destin_sort_code').val();
            data.destin_acc_no	= $('#destin_acc_no').val();
            data.item_type      = $('#item_type').val();
            data.drcr	        = $('#drcr').val();
            data.session        = $('#session').val();
            data.file_type        = $('#file_type').val();
        } );
        $('#filter').modal('hide');
        report_dt.draw();
    });

    $('#report-search').on( 'click', function () {
        report_dt.ajax.reload();
    });

    var penalty_cust_dt = $('#dt-penalty-cust').DataTable({
        "responsive": true,
        "processing": true,
        'language': {
            'loadingRecords': '&nbsp;',
            processing: '<i class="fal fa-spinner fa-spin fa-2x fa-fw"></i><span class="sr-only">Loading...</span> '
        },
        "serverSide": true,
        "paging": true,
        'ajax': {
            "type"   : "POST",
            "url"    : '/penalty/customers',
            "data"   : {
                "_csrf_token": $("#csrf").val(),
                "cust_acc_no": $('#cust_acc_no').val(),
                "return_code": $('#return_code').val(),
                "from": $('#from').val(),
                "to": $('#to').val()
            }
        },
        "columns": [
            {"data": "cust_acc_no"},
            {"data": "return_code"},
            {"data": "status"},
            {"data": "inserted_at"}
        ],
        "lengthMenu": [[10, 25, 50, 100, 500, 1000], [10, 25, 50, 100, 500, 1000]],
        "order": [[1, 'asc']]
    });

    $('#penalty-cust-filter').on( 'click', function () {
        penalty_cust_dt.on('preXhr.dt', function ( e, settings, data ) {
            data._csrf_token 	= $("#csrf").val();
            data.cust_acc_no 	= $('#cust_acc_no').val();
            data.return_code 	= $('#return_code').val();
            data.from 		    = $('#from').val();
            data.to 		    = $('#to').val();
        } );
        $('#filter').modal('hide');
        penalty_cust_dt.draw();
    });

    $('#penalty-cust-search').on( 'click', function () {
        penalty_cust_dt.ajax.reload();
    });

    $('#js-download-csv').click(function () {
        $('#reportSearchForm').attr('action', '/download/csv');
        $('#reportSearchForm').attr('method', 'GET');
        $("#reportSearchForm").submit();
    });

    $('#mark-as-discarded').click(function() {
        var dt = null;
        var mark_type = $(this).attr("data-mark-type");
        switch (mark_type) {
            case 'UPLOAD':
                dt = upload_dt;
                break;
            case 'REVERSAL':
                dt = rev_dt;
                break;
            case 'CHANNEL':
                dt = channel_dt;
                break;
            case 'REPORT':
                dt = report_dt;
                break;
            default:
                dt = ouwd_posting_dt;
        }
        row = dt.rows( { selected: true } ).data()[0];
        if(!row){
            Swal.fire(
                'Oops..',
                'No transactions selected!',
                'error'
            )
            return false;
        }
        var arr = [];
        dt.rows( { selected: true } ).every(function(rowIdx) {
            arr.push(dt.row(rowIdx).data().id);
        })
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, continue!',
            showLoaderOnConfirm: true
        }).then((result) => {
            if (result.value) {
            spinner.show();
            $.ajax({
                url: '/mark/as/discarded',
                type: 'POST',
                data: {entry_ids: arr, mark_type: mark_type, _csrf_token: $('#csrf').val()},
                success: function(result) {
                    spinner.hide();
                    if (result.data) {
                        Swal.fire(
                            'Success',
                            'Operation successful!',
                            'success'
                        )
                        dt.ajax.reload();
                    } else {
                        Swal.fire(
                            'Oops..',
                            result.error,
                            'error'
                        )
                    }
                },
                error: function(request, msg, error) {
                    spinner.hide();
                    Swal.fire(
                        'Oops..',
                        'Something went wrong! try again',
                        'error'
                    )
                }
            });
        } else {
            spinner.hide();
            Swal.fire(
                'Cancelled',
                'Operation not performed :)',
                'error'
            )
        }
    })
    })

    $('#txn-summary').click(function() {
        var mark_type = $(this).attr("data-dt-type");
        switch (mark_type) {
            case 'UPLOAD':
                dt = upload_dt;
                break;
            case 'CHANNEL':
                dt = channel_dt;
                break;
            case 'EXPORT':
                dt = export_dt;
                break;
            default:
                dt = ouwd_posting_dt;
        }
        var total_dr = 0;
        var dr_count = 0;
        var total_cr = 0;
        var cr_count = 0;

        dt.rows().every(function(rowIdx) {
            if (dt.row(rowIdx).data().drcr == "D"){
                var amt = dt.row(rowIdx).data().amount.toString();
                total_dr += parseFloat(amt.replace(/\,/g, ''));
                dr_count++;
            } else{
                var amt = dt.row(rowIdx).data().amount.toString();
                total_cr += parseFloat(amt.replace(/\,/g, ''));
                cr_count++;
            }
        })

        $('#dr_amount').val(formartAmount(total_dr));
        $('#dr_count').val(dr_count);
        $('#cr_amount').val(formartAmount(total_cr));
        $('#cr_count').val(cr_count);
        $('#summary-form').modal('show');
    })

    // $('#mark-as-discarded').click(function() {
    //     var dt = null;
    //     var dt_type = $(this).attr("data-dt-val");
    //     switch (dt_type) {
    //         case 'UPLOAD':
    //             dt = upload_dt;
    //             break;
    //         case 'REVERSAL':
    //             dt = rev_dt;
    //             break;
    //         default:
    //             dt = ouwd_posting_dt;
    //     }
    //     row = dt.rows( { selected: true } ).data()[0];
    //     if(!row){
    //         Swal.fire(
    //             'Oops..',
    //             'No transactions selected!',
    //             'error'
    //         )
    //         return false;
    //     }
    //     var arr = [];
    //     upload_dt.rows( { selected: true } ).every(function(rowIdx) {
    //         arr.push(upload_dt.row(rowIdx).data().id);
    //     })
    //     Swal.fire({
    //         title: 'Are you sure?',
    //         text: "You won't be able to revert this!",
    //         type: "warning",
    //         showCancelButton: true,
    //         confirmButtonColor: '#3085d6',
    //         cancelButtonColor: '#d33',
    //         confirmButtonText: 'Yes, continue!',
    //         showLoaderOnConfirm: true
    //       }).then((result) => {
    //         if (result.value) {
    //             $.ajax({
    //                 url: '/mark/as/discarded',
    //                 type: 'POST',
    //                 data: {ids: arr, _csrf_token: $('#csrf').val()},
    //                 success: function(result) {
    //                     if (result.data) {
    //                         Swal.fire(
    //                             'Success',
    //                             'Operation successful!',
    //                             'success'
    //                         )
    //                         upload_dt.ajax.reload();
    //                     } else {
    //                         Swal.fire(
    //                             'Oops..',
    //                             result.error,
    //                             'error'
    //                         )
    //                     }
    //                 },
    //                 error: function(request, msg, error) {
    //                     Swal.fire(
    //                         'Oops..',
    //                         'Something went wrong! try again',
    //                         'error'
    //                     )
    //                 }
    //             });
    //         } else {
    //             Swal.fire(
    //                 'Cancelled',
    //                 'Operation not performed :)',
    //                 'error'
    //             )
    //         }
    //     })
    // })

    $("#upload-posting").click(function() {
        if(upload_dt.rows().count() <= 0){
            Swal.fire(
                'Oops..!',
                'No transactions found!',
                'error'
            )
            return false;
        }
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, continue!',
            showLoaderOnConfirm: true
        }).then((result) => {
            if (result.value) {
            spinner.show();
            $.ajax({
                url: '/upload/posting',
                type: 'POST',
                data: {_csrf_token: $('#csrf').val()},
                success: function(result) {
                    spinner.hide();
                    if (result.data) {
                        Swal.fire(
                            'Success',
                            'Posting in progress!',
                            'success'
                        )

                        upload_dt.ajax.reload();
                    } else {
                        Swal.fire(
                            'Oops..',
                            result.error,
                            'error'
                        )
                    }
                },
                error: function(request, msg, error) {
                    spinner.hide();
                    Swal.fire(
                        'Oops..',
                        'Something went wrong! try again',
                        'error'
                    )
                }
            });
        } else {
            spinner.hide();
            Swal.fire(
                'Cancelled',
                'Operation not performed :)',
                'error'
            )
        }
    })
    });

    //Disable submit button after first click
    $(document).on('click', '.submit', function () {
        $(this.form).submit(function () {
            spinner.show();
            $(".back").prop('disabled', true);
            $(this).find('button[type=submit]').prop('disabled', true);
            $(".submit").html('please wait...');
        });
    });

    //penalties
    $('#dt-penalty').DataTable({"responsive": true});
    //Api Users
    $('#table-api-users').DataTable({"responsive": true});
    $('#table-api-users tbody').on( 'click', '.js-delete-api-user', function () {
        var button = $(this);
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, continue!',
            showLoaderOnConfirm: true
        }).then((result) => {
            if (result.value) {
            spinner.show();
            $.ajax({
                url: '/delete/api/user',
                type: 'DELETE',
                data: {id: button.attr("data-api-user-id"), _csrf_token: $("#csrf").val()},
                success: function(result) {
                    spinner.hide();
                    if (result.info){
                        Swal.fire(
                            'Success',
                            'User deleted successfuly!',
                            'success'
                        )
                        location.reload(true);
                    } else {
                        Swal.fire(
                            'Oops..',
                            result.error,
                            'error'
                        )
                    }
                },
                error: function(request, msg, error) {
                    spinner.hide();
                    Swal.fire(
                        'Oops..',
                        'Something went wrong! try again',
                        'error'
                    )
                }
            });
        } else {
            spinner.hide();
            Swal.fire(
                'Cancelled',
                'Operation not performed :)',
                'error'
            )
        }
    })
    });

    //System Users
    $('#dt-users').DataTable({"responsive": true});
    $('#dt-user-logs').DataTable({"responsive": true});
    $('#dt-users tbody').on( 'click', '.js-delete-user', function () {
        var button = $(this);
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, continue!',
            showLoaderOnConfirm: true
        }).then((result) => {
            if (result.value) {
            spinner.show();
            $.ajax({
                url: '/probase/Smarthub/Rates/delete',
                type: 'POST',
                data: {id: button.attr("data-user-id"), _csrf_token: $("#csrf").val()},
                success: function(result) {
                    spinner.hide();
                    if (result.info){
                        Swal.fire(
                            'Success',
                            'User deleted successfuly!',
                            'success'
                        )
                        location.reload(true);
                    } else {
                        Swal.fire(
                            'Success',
                            result.error,
                            'Success'
                        )
                        location.reload(true)
                    }
                },
                error: function(request, msg, error) {
                    spinner.hide();
                    Swal.fire(
                        'Oops..',
                        'Something went wrong! try again',
                        'error'
                    )
                }
            });
        } else {
            spinner.hide();
            Swal.fire(
                'Cancelled',
                'Operation not performed :)',
                'error'
            )
        }
    })
    });


    //system rates


    //System Transfer Apis
    $('#dt-transfers-apis').DataTable({"responsive": true});
    $('#dt-transfers-apis tbody').on( 'click', '.js-delete-transfer-api', function () {
        var button = $(this);
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, continue!',
            showLoaderOnConfirm: true
        }).then((result) => {
            if (result.value) {
            spinner.show();
            $.ajax({
                url: '/delete/transfer/api',
                type: 'DELETE',
                data: {id: button.attr("data-transfer-api-id"), _csrf_token: $("#csrf").val()},
                success: function(result) {
                    spinner.hide();
                    if (result.data){
                        Swal.fire(
                            'Success',
                            'User deleted successfuly!',
                            'success'
                        )
                        location.reload(true);
                    } else {
                        Swal.fire(
                            'Oops..',
                            result.error,
                            'error'
                        )
                    }
                },
                error: function(request, msg, error) {
                    spinner.hide();
                    Swal.fire(
                        'Oops..',
                        'Something went wrong! try again',
                        'error'
                    )
                }
            });
        } else {
            spinner.hide();
            Swal.fire(
                'Cancelled',
                'Operation not performed :)',
                'error'
            )
        }
    })
    });

    //Dt Banks
    $('#dt-banks').DataTable();
    $('#dt-banks tbody').on( 'click', '.js-delete-bank', function () {
        var button = $(this);
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, continue!',
            showLoaderOnConfirm: true
        }).then((result) => {
            if (result.value) {
            spinner.show();
            $.ajax({
                url: '/delete/bank',
                type: 'DELETE',
                data: {id: button.attr("data-bank-id"), _csrf_token: $("#csrf").val()},
                success: function(result) {
                    spinner.hide();
                    if (result.data){
                        Swal.fire(
                            'Success',
                            'Bank deleted successfuly!',
                            'success'
                        )
                        location.reload(true);
                    } else {
                        Swal.fire(
                            'Oops..',
                            result.error,
                            'error'
                        )
                    }
                },
                error: function(request, msg, error) {
                    spinner.hide();
                    Swal.fire(
                        'Oops..',
                        'Something went wrong! try again',
                        'error'
                    )
                }
            });
        } else {
            spinner.hide();
            Swal.fire(
                'Cancelled',
                'Operation not performed :)',
                'error'
            )
        }
    })
    });

    //Dt currencies
    $('#dt-currencies').DataTable();
    $('#dt-currencies tbody').on( 'click', '.js-delete-currency', function () {
        var button = $(this);
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, continue!',
            showLoaderOnConfirm: true
        }).then((result) => {
            if (result.value) {
            spinner.show();
            $.ajax({
                url: '/delete/currency',
                type: 'DELETE',
                data: {id: button.attr("data-currency-id"), _csrf_token: $("#csrf").val()},
                success: function(result) {
                    spinner.hide();
                    if (result.data){
                        Swal.fire(
                            'Success',
                            'Currency deleted successfuly!',
                            'success'
                        )
                        location.reload(true);
                    } else {
                        Swal.fire(
                            'Oops..',
                            result.error,
                            'error'
                        )
                    }
                },
                error: function(request, msg, error) {
                    spinner.hide();
                    Swal.fire(
                        'Oops..',
                        'Something went wrong! try again',
                        'error'
                    )
                }
            });
        } else {
            spinner.hide();
            Swal.fire(
                'Cancelled',
                'Operation not performed :)',
                'error'
            )
        }
    })
    });

    //Dt Participants
    $('#dt-participants').DataTable();
    $('#dt-participants tbody').on( 'click', '.js-delete-participant', function () {
        var button = $(this);
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, continue!',
            showLoaderOnConfirm: true
        }).then((result) => {
            if (result.value) {
            spinner.show();
            $.ajax({
                url: '/delete/participant',
                type: 'DELETE',
                data: {id: button.attr("data-participant-id"), _csrf_token: $("#csrf").val()},
                success: function(result) {
                    spinner.hide();
                    if (result.data){
                        Swal.fire(
                            'Success',
                            'Participant deleted successfuly!',
                            'success'
                        )
                        location.reload(true);
                    } else {
                        Swal.fire(
                            'Oops..',
                            result.error,
                            'error'
                        )
                    }
                },
                error: function(request, msg, error) {
                    spinner.hide();
                    Swal.fire(
                        'Oops..',
                        'Something went wrong! try again',
                        'error'
                    )
                }
            });
        } else {
            spinner.hide();
            Swal.fire(
                'Cancelled',
                'Operation not performed :)',
                'error'
            )
        }
    })
    });

    //Dt ePayments
    $('#dt-ePayments').DataTable();
    $('#dt-ePayments tbody').on( 'click', '.js-delete-epayment', function () {
        var button = $(this);
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, continue!',
            showLoaderOnConfirm: true
        }).then((result) => {
            if (result.value) {
            spinner.show();
            $.ajax({
                url: '/delete/ePayment',
                type: 'DELETE',
                data: {id: button.attr("data-epayment-id"), _csrf_token: $("#csrf").val()},
                success: function(result) {
                    spinner.hide();
                    if (result.data){
                        Swal.fire(
                            'Success',
                            'ePayment deleted successfuly!',
                            'success'
                        )
                        location.reload(true);
                    } else {
                        Swal.fire(
                            'Oops..',
                            result.error,
                            'error'
                        )
                    }
                },
                error: function(request, msg, error) {
                    spinner.hide();
                    Swal.fire(
                        'Oops..',
                        'Something went wrong! try again',
                        'error'
                    )
                }
            });
        } else {
            spinner.hide();
            Swal.fire(
                'Cancelled',
                'Operation not performed :)',
                'error'
            )
        }
    })
    });

    //Dt ePayments
    $('#dt-return-reasons').DataTable();
    $('#dt-return-reasons tbody').on( 'click', '.js-delete-return-reason', function () {
        var button = $(this);
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, continue!',
            showLoaderOnConfirm: true
        }).then((result) => {
            if (result.value) {
            spinner.show();
            $.ajax({
                url: '/delete/return/reason',
                type: 'DELETE',
                data: {id: button.attr("data-return-reason-id"), _csrf_token: $("#csrf").val()},
                success: function(result) {
                    spinner.hide();
                    if (result.data){
                        Swal.fire(
                            'Success',
                            'Return Reason deleted successfuly!',
                            'success'
                        )
                        location.reload(true);
                    } else {
                        Swal.fire(
                            'Oops..',
                            result.error,
                            'error'
                        )
                    }
                },
                error: function(request, msg, error) {
                    spinner.hide();
                    Swal.fire(
                        'Oops..',
                        'Something went wrong! try again',
                        'error'
                    )
                }
            });
        } else {
            spinner.hide();
            Swal.fire(
                'Cancelled',
                'Operation not performed :)',
                'error'
            )
        }
    })
    });

    //Dt Mnadate Reasons
    $('#dt-mdt-return-reasons').DataTable();
    $('#dt-mdt-return-reasons tbody').on( 'click', '.js-delete-mdt-return-reason', function () {
        var button = $(this);
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, continue!',
            showLoaderOnConfirm: true
        }).then((result) => {
            if (result.value) {
            spinner.show();
            $.ajax({
                url: '/delete/mdt/return/reason',
                type: 'DELETE',
                data: {id: button.attr("data-mdt-return-reason-id"), _csrf_token: $("#csrf").val()},
                success: function(result) {
                    spinner.hide();
                    if (result.data){
                        Swal.fire(
                            'Success',
                            'Return Reason deleted successfuly!',
                            'success'
                        )
                        location.reload(true);
                    } else {
                        Swal.fire(
                            'Oops..',
                            result.error,
                            'error'
                        )
                    }
                },
                error: function(request, msg, error) {
                    spinner.hide();
                    Swal.fire(
                        'Oops..',
                        'Something went wrong! try again',
                        'error'
                    )
                }
            });
        } else {
            spinner.hide();
            Swal.fire(
                'Cancelled',
                'Operation not performed :)',
                'error'
            )
        }
    })
    });

    //Dt branchs
    $('#dt-branchs').DataTable();
    $('#dt-branchs tbody').on( 'click', '.js-delete-branch', function () {
        var button = $(this);
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, continue!',
            showLoaderOnConfirm: true
        }).then((result) => {
            if (result.value) {
            spinner.show();
            $.ajax({
                url: '/delete/branch',
                type: 'DELETE',
                data: {id: button.attr("data-branch-id"), _csrf_token: $("#csrf").val()},
                success: function(result) {
                    spinner.hide();
                    if (result.data){
                        Swal.fire(
                            'Success',
                            'Branch deleted successfuly!',
                            'success'
                        )
                        location.reload(true);
                    } else {
                        Swal.fire(
                            'Oops..',
                            result.error,
                            'error'
                        )
                    }
                },
                error: function(request, msg, error) {
                    spinner.hide();
                    Swal.fire(
                        'Oops..',
                        'Something went wrong! try again',
                        'error'
                    )
                }
            });
        } else {
            spinner.hide();
            Swal.fire(
                'Cancelled',
                'Operation not performed :)',
                'error'
            )
        }
    })
    });

    //Channel Entries
    var channel_dt = $('#dt-channel-entries').DataTable({
        "responsive": true,
        "processing": true,
        "select": {
            "style": 'multi'
        },
        'language': {
            'loadingRecords': '&nbsp;',
            processing: '<i class="fal fa-spinner fa-spin fa-2x fa-fw"></i><span class="sr-only">Loading...</span> '
        },
        "serverSide": true,
        "paging": true,
        'ajax': {
            "type"   : "POST",
            "url"    : '/channel/entries',
            "data"   : {
                "_csrf_token": $("#csrf").val()
            }
        },
        "columns": [
            {"data": "src_acc_no"},
            {"data": "destin_acc_no"},
            {"data": "destin_sort_code"},
            {"data": "drcr"},
            {
                "data": "amount",
                "render": function ( data, type, row ) {
                    if(data){
                        return formartAmount(data.replace(/\,/g, ''));
                    } else{
                        "<span class='text-danger'>Not Set</span>"
                    }
                },
                "defaultContent": "<span class='text-danger'>Not Set</span>"
            },
            {"data": "value_date"},
            {
                "data": "id",
                "render": function ( data, type, row ) {
                    return '<button class="btn btn-primary btn-xs" data-toggle="dropdown" style="margin-top:0px !important; padding-top: 0px !important;">Options</button>'+
                        '<div class="dropdown-menu dropdown-menu-animated dropdown-menu-right text-center position-absolute pos-top">'+
                        '<a href="/ouwd/view/entry?id='+data+'" class="dropdown-item text-primary">View details</a>'+
                        '</div>';
                },
                "defaultContent": "<span class='text-danger'>No Actions</span>"
            }
        ],
        "lengthMenu": [[10, 25, 50, 100, 500, 1000], [10, 25, 50, 100, 500, 1000]],
        "order": [[1, 'asc']]
    });

    $('#channel-search').on( 'click', function () {
        channel_dt.ajax.reload();
    });

    $("#approve-channel-entry").click(function() {
        if(channel_dt.rows().count() <= 0){
            Swal.fire(
                'Oops..!',
                'No transactions found!',
                'error'
            )
            return false;
        }
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            // type: "warning",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, continue!'
            // showLoaderOnConfirm: true
        }).then((result) => {
            if (result.value) {
            spinner.show();
            $.ajax({
                url: '/approve/channel/entries',
                type: 'POST',
                data: {_csrf_token: $('#csrf').val()},
                success: function(result) {
                    spinner.hide();
                    if (result.data) {
                        Swal.fire(
                            'Success',
                            'Approval successful!',
                            'success'
                        )

                        channel_dt.ajax.reload();
                    } else {
                        Swal.fire(
                            'Oops..',
                            result.error,
                            'error'
                        )
                    }
                },
                error: function(request, msg, error) {
                    spinner.hide();
                    Swal.fire(
                        'Oops..',
                        'Something went wrong! try again',
                        'error'
                    )
                }
            });
        } else {
            spinner.hide();
            Swal.fire(
                'Cancelled',
                'Operation not performed :)',
                'error'
            )
        }
    })
    });

    // Export Entries
    var export_dt = $('#dt-export-entries').DataTable({
        "responsive": true,
        "processing": true,
        'language': {
            'loadingRecords': '&nbsp;',
            processing: '<i class="fal fa-spinner fa-spin fa-2x fa-fw"></i><span class="sr-only">Loading...</span> '
        },
        "serverSide": true,
        "paging": true,
        'ajax': {
            "type"   : "POST",
            "url"    : '/export/entries',
            "data"   : {
                "_csrf_token": $("#csrf").val()
            }
        },
        "columns": [
            {"data": "src_acc_no"},
            {"data": "destin_acc_no"},
            {"data": "destin_sort_code"},
            {"data": "drcr"},
            {
                "data": "amount",
                "render": function ( data, type, row ) {
                    if(data){
                        return formartAmount(data.replace(/\,/g, ''));
                    } else{
                        "<span class='text-danger'>Not Set</span>"
                    }
                },
                "defaultContent": "<span class='text-danger'>Not Set</span>"
            },
            {"data": "value_date"}
        ],
        "lengthMenu": [[10, 25, 50, 100, 500, 1000], [10, 25, 50, 100, 500, 1000]],
        "order": [[1, 'asc']]
    });

    $('#export-search').on( 'click', function () {
        export_dt.ajax.reload();
    });

    var allowsubmit = false;
    //on keypress
    $('#confirmpassword').keyup(function(e){
        //get values
        var pass = $('#password').val();
        var confpass = $(this).val();

        //check the strings
        if(pass == confpass){
            //if both are same remove the error and allow to submit
            $('.error').text('');
            allowsubmit = true;
        }else{
            //if not matching show error and not allow to submit
            $('.error').text('Password not matching');
            allowsubmit = false;
        }
    });

    //jquery form submit
    $('.change-pass-form').submit(function(){

        var pass = $('#password').val();
        var confpass = $('#confirmpassword').val();

        //just to make sure once again during submit
        //if both are true then only allow submit
        if(pass == confpass){
            allowsubmit = true;
        }
        if(allowsubmit){
            $('.change-pass-form').find('button[type=submit]').prop('disabled', true);
            $(".change-pass-submit").html('please wait...');
            return true;
        }else{
            return false;
        }
    });

    $('.btn-batch-entry').prop('disabled', true);
    $(".src_acc_no").on("input", function() {
        var acc_no = $('.src_acc_no').val();
        if ((acc_no.trim().length == 9) || (acc_no.trim().length == 13)){
            $('.btn-batch-entry').prop('disabled', false);
        }else{
            $('.btn-batch-entry').prop('disabled', true);
        }
        if((acc_no.trim().length == 13)){
            $.ajax({
                url: '/account/details',
                type: 'POST',
                data: {acc_no: acc_no,  _csrf_token: $("#csrf").val()},
                success: function(result){
                    if(result.status_code) {
                        if (result.status_code == "00"){
                            $('.acc_name').val(result.account_name);
                            $('.acc_status').val(result.account_status);
                            $('.acc_type').val(result.account_type);
                            $('.acc_no').val(result.account_number);
                            $('.avl_bal').val(result.available_balance);
                        }else{
                            Swal.fire(
                                'Oops',
                                result.status_msg,
                                'error'
                            )
                        }
                    }else{
                        Swal.fire(
                            'Oops',
                            result.error,
                            'error'
                        )
                    }
                },
                error: function(request,msg,error) {
                    Swal.fire(
                        'Oops',
                        'An error occurred. try again!',
                        'error'
                    )
                }
            });
        } else{
            return false;
        }
    });

    //++++++++++++++++++++++++++++++++++++++++ Mandates +++++++++++++++++++++++++++++++++++

    // Global mdt Dt
    $('#dt-mdts').DataTable();

    // Mandate Export Request File
    $("#export-mdt-req").click(function() {
        $('#export-button').modal('hide');
        if ($('.export_dt').val() == "") {

            Swal.fire(
                'Oops',
                'No presentment date found!',
                'error'
            )
            return false;
        }
        Swal.fire({
            title: 'Are you sure you want to Export Mandates?',
            text: "mandate will be considered for export! and You won't be able to revert this!",
            // type: "warning",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, continue!'
            // showLoaderOnConfirm: true
        }).then((result) => {
            if (result.value) {
            $.ajax({
                url: '/export/mandates',
                type: 'POST',
                data: {_csrf_token: $('#csrf').val(),  export_dt: $('.export_dt').val()},
                success: function(result) {
                    if (result.data) {
                        Swal.fire(
                            'Success',
                            'Approval successful!',
                            'success'
                        )

                        // location.reload();
                        window.location.replace("/export/mandate/request");
                        channel_dt.ajax.reload();
                    } else {
                        Swal.fire(
                            'Oops..',
                            result.error,
                            'error'
                        )
                    }
                },
                error: function(request, msg, error) {
                    Swal.fire(
                        'Oops..',
                        'Something went wrong! try again',
                        'error'
                    )
                }
            });
        } else {
            Swal.fire(
                'Cancelled',
                'Operation not performed :)',
                'error'
            )
        }
    })
    });

    // Mandate Amendment Export File
    $("#export-mdt-amend").click(function() {
        $('#export-amend-button').modal('hide');
        if ($('.export_dt').val() == "") {

            Swal.fire(
                'Oops',
                'No presentment date found!',
                'error'
            )
            return false;
        }
        Swal.fire({
            title: 'Are you sure you want to Export Mandates?',
            text: "mandate will be considered for export! and You won't be able to revert this!",
            // type: "warning",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, continue!'
            // showLoaderOnConfirm: true
        }).then((result) => {
            if (result.value) {
            $.ajax({
                url: '/export/amendments',
                type: 'POST',
                data: {_csrf_token: $('#csrf').val(),  export_dt: $('.export_dt').val()},
                success: function(result) {
                    if (result.data) {
                        Swal.fire(
                            'Success',
                            'Approval successful!',
                            'success'
                        )

                        // location.reload();
                        window.location.replace("/export/amendment/requests");
                        channel_dt.ajax.reload();
                    } else {
                        Swal.fire(
                            'Oops..',
                            result.error,
                            'error'
                        )
                    }
                },
                error: function(request, msg, error) {
                    Swal.fire(
                        'Oops..',
                        'Something went wrong! try again',
                        'error'
                    )
                }
            });
        } else {
            Swal.fire(
                'Cancelled',
                'Operation not performed :)',
                'error'
            )
        }
    })
    });

    // Mandate Cancellations Export File
    $("#export-mdt-cancel").click(function() {
        $('#export-cancel-button').modal('hide');
        if ($('.export_dt').val() == "") {

            Swal.fire(
                'Oops',
                'No presentment date found!',
                'error'
            )
            return false;
        }
        Swal.fire({
            title: 'Are you sure you want to Export Mandates?',
            text: "mandate will be considered for export! and You won't be able to revert this!",
            // type: "warning",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, continue!'
            // showLoaderOnConfirm: true
        }).then((result) => {
            if (result.value) {
            $.ajax({
                url: '/export/cancellations',
                type: 'POST',
                data: {_csrf_token: $('#csrf').val(),  export_dt: $('.export_dt').val()},
                success: function(result) {
                    if (result.data) {
                        Swal.fire(
                            'Success',
                            'Approval successful!',
                            'success'
                        )

                        // location.reload();
                        window.location.replace("/export/cancellation/requests");
                        channel_dt.ajax.reload();
                    } else {
                        Swal.fire(
                            'Oops..',
                            result.error,
                            'error'
                        )
                    }
                },
                error: function(request, msg, error) {
                    Swal.fire(
                        'Oops..',
                        'Something went wrong! try again',
                        'error'
                    )
                }
            });
        } else {
            Swal.fire(
                'Cancelled',
                'Operation not performed :)',
                'error'
            )
        }
    })
    });

    // Mandate Responses Export File
    $("#export-mdt-resp").click(function() {
        $('#export-resp-button').modal('hide');
        if ($('.export_dt').val() == "") {

            Swal.fire(
                'Oops',
                'No presentment date found!',
                'error'
            )
            return false;
        }
        Swal.fire({
            title: 'Are you sure you want to Export Mandates?',
            text: "mandate will be considered for export! and You won't be able to revert this!",
            // type: "warning",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, continue!'
            // showLoaderOnConfirm: true
        }).then((result) => {
            if (result.value) {
            $.ajax({
                url: '/export/responses',
                type: 'POST',
                data: {_csrf_token: $('#csrf').val(),  export_dt: $('.export_dt').val()},
                success: function(result) {
                    if (result.data) {
                        Swal.fire(
                            'Success',
                            'Approval successful!',
                            'success'
                        )

                        // location.reload();
                        window.location.replace("/export/responses");
                        channel_dt.ajax.reload();
                    } else {
                        Swal.fire(
                            'Oops..',
                            result.error,
                            'error'
                        )
                    }
                },
                error: function(request, msg, error) {
                    Swal.fire(
                        'Oops..',
                        'Something went wrong! try again',
                        'error'
                    )
                }
            });
        } else {
            Swal.fire(
                'Cancelled',
                'Operation not performed :)',
                'error'
            )
        }
    })
    });

    // Mandate Bulk Response Export File
    $("#export-msf_bulk").click(function() {
        $('#msf-bulk-modal').modal('hide');
        if ($('.export_dt').val() == "") {

            Swal.fire(
                'Oops',
                'No presentment date found!',
                'error'
            )
            return false;
        }
        Swal.fire({
            title: 'Are you sure you want to Export Bulk Mandate?',
            text: "mandate will be considered for export! and You won't be able to revert this!",
            // type: "warning",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, continue!'
            // showLoaderOnConfirm: true
        }).then((result) => {
            if (result.value) {
            $.ajax({
                url: '/export/bulk/response',
                type: 'POST',
                data: {_csrf_token: $('#csrf').val(), export_dt: $('.export_dt').val(), id: $('#id').val()},
                success: function(result) {
                    if (result.data) {
                        Swal.fire(
                            'Success',
                            'Approval successful!',
                            'success'
                        )

                        // location.reload();
                        window.location.replace("/export/bulk/response");
                        channel_dt.ajax.reload();
                    } else {
                        Swal.fire(
                            'Oops..',
                            result.error,
                            'error'
                        )
                    }
                },
                error: function(request, msg, error) {
                    Swal.fire(
                        'Oops..',
                        'Something went wrong! try again',
                        'error'
                    )
                }
            });
        } else {
            Swal.fire(
                'Cancelled',
                'Operation not performed :)',
                'error'
            )
        }
    })
    });

    // Mandate bulk Export File
    $("#export-bulk-req").click(function() {
        $('#export-bulk-mod').modal('hide');
        if ($('.export_dt').val() == "") {

            Swal.fire(
                'Oops',
                'No presentment date found!',
                'error'
            )
            return false;
        }
        Swal.fire({
            title: 'Are you sure you want to Authorize bulk Mandate?',
            text: "mandate will be exported! and You won't be able to revert this!",
            // type: "warning",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, continue!'
            // showLoaderOnConfirm: true
        }).then((result) => {
            if (result.value) {
            $.ajax({
                url: '/export/bulk/mandates',
                type: 'POST',
                data: {_csrf_token: $('#csrf').val(),  export_dt: $('.export_dt').val(), id: $('#id').val()},
                success: function(result) {
                    if (result.data) {
                        Swal.fire(
                            'Success',
                            'Authorized successful!',
                            'success'
                        )

                        // location.reload();
                        window.location.replace("/list/bulk");
                        channel_dt.ajax.reload();
                    } else {
                        Swal.fire(
                            'Oops..',
                            result.error,
                            'error'
                        )
                    }
                },
                error: function(request, msg, error) {
                    Swal.fire(
                        'Oops..',
                        'Something went wrong! try again',
                        'error'
                    )
                }
            });
        } else {
            Swal.fire(
                'Cancelled',
                'Operation not performed :)',
                'error'
            )
        }
    })
    });

    //Reject Bulk Button
    $("#reject-bulk").click(function() {
        Swal.fire({
            title: 'Are you sure you want to Reject bulk mandate?',
            text: "mandate will be rejected!",
            // type: "warning",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, continue!'
            // showLoaderOnConfirm: true
        }).then((result) => {
            if (result.value) {
            $.ajax({
                url: '/reject/bulk/mandate',
                type: 'POST',
                data: {_csrf_token: $('#csrf').val(), id: $('#id').val()},
                success: function(result) {
                    if (result.data) {
                        Swal.fire(
                            'Success',
                            'Approval successful!',
                            'success'
                        )

                        // location.reload();
                        window.location.replace("/list/bulk");
                        channel_dt.ajax.reload();
                    } else {
                        Swal.fire(
                            'Oops..',
                            result.error,
                            'error'
                        )
                    }
                },
                error: function(request, msg, error) {
                    Swal.fire(
                        'Oops..',
                        'Something went wrong! try again',
                        'error'
                    )
                }
            });
        } else {
            Swal.fire(
                'Cancelled',
                'Operation not performed :)',
                'error'
            )
        }
    })
    });

    // Cancel Mandate
    $("#approve-cancel").click(function() {
        // $('#export-resp-button').modal('hide');
        if (($("#cancel-dt").val() == "") || ($("#cancel-reason").val()) == "") {

            Swal.fire(
                'Oops',
                'No Cancellation date/reason found!',
                'error'
            )
            return false;
        }
        Swal.fire({
            title: 'Are you sure you want to Cancel Mandate?',
            text: "mandate will be cancelled! and You won't be able to revert this!",
            // type: "warning",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, continue!'
            // showLoaderOnConfirm: true
        }).then((result) => {
            if (result.value) {
            $.ajax({
                url: '/cancel/mandate',
                type: 'POST',
                data: {_csrf_token: $('#csrf').val(), id: $('#id').val(), cancel_dt: $('#cancel-dt').val(), cancel_reason: $('#cancel-reason').val()},
                success: function(result) {
                    if (result.data) {
                        Swal.fire(
                            'Success',
                            'Approval successful!',
                            'success'
                        )

                        // location.reload();
                        window.location.replace("/view/maintained");
                        channel_dt.ajax.reload();
                    } else {
                        Swal.fire(
                            'Oops..',
                            result.error,
                            'error'
                        )
                    }
                },
                error: function(request, msg, error) {
                    Swal.fire(
                        'Oops..',
                        'Something went wrong! try again',
                        'error'
                    )
                }
            });
        } else {
            Swal.fire(
                'Cancelled',
                'Operation not performed :)',
                'error'
            )
        }
    })
    });

    // mandate pending approval button
    $("#view-mandate-approve").click(function() {
        Swal.fire({
            title: 'Are you sure you want to Approve mandate?',
            text: "mandate will be considered for posting! and You won't be able to revert this!",
            // type: "warning",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, continue!'
            // showLoaderOnConfirm: true
        }).then((result) => {
            if (result.value) {
            $.ajax({
                url: '/approve/mandates',
                type: 'POST',
                data: {_csrf_token: $('#csrf').val(), id: $('.id').val()},
                success: function(result) {
                    if (result.data) {
                        Swal.fire(
                            'Success',
                            'Approval successful!',
                            'success'
                        )

                        // location.reload();
                        window.location.replace("/mandates/pending");
                        channel_dt.ajax.reload();
                    } else {
                        Swal.fire(
                            'Oops..',
                            result.error,
                            'error'
                        )
                    }
                },
                error: function(request, msg, error) {
                    Swal.fire(
                        'Oops..',
                        'Something went wrong! try again',
                        'error'
                    )
                }
            });
        } else {
            Swal.fire(
                'Cancelled',
                'Operation not performed :)',
                'error'
            )
        }
    })
    });


    // process mandate inward files
    $("#process-inwd-files").click(function() {
        Swal.fire({
            title: 'Are you sure you want to import mandate file(s)?',
            text: "file(s) will be imported! and You won't be able to revert this!",
            // type: "warning",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, continue!'
            // showLoaderOnConfirm: true
        }).then((result) => {
            if (result.value) {
            $.ajax({
                url: '/import/inward/mandate/files',
                type: 'GET',
                data: {_csrf_token: $('#csrf').val()},
                success: function(result) {
                    if (result.data) {
                        Swal.fire(
                            'Success',
                            'Files imported successful!',
                            'success'
                        )

                        // location.reload();
                        window.location.replace("/list/inward/mandate/files");
                        channel_dt.ajax.reload();
                    } else {
                        Swal.fire(
                            'Oops..',
                            result.error,
                            'error'
                        )
                    }
                },
                error: function(request, msg, error) {
                    Swal.fire(
                        'Oops..',
                        'Something went wrong! try again or Invalid Mandate Inward Processed Directory',
                        'error'
                    )
                }
            });
        } else {
            Swal.fire(
                'Cancelled',
                'Operation not performed :)',
                'error'
            )
        }
    })
    });


    // Mandate Pending Reject Button
    $("#view-mandate-Reject").click(function() {
        Swal.fire({
            title: 'Are you sure you want to reject mandate?',
            text: "Mandate will be rejected!",
            // type: "warning",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, continue!'
            // showLoaderOnConfirm: true
        }).then((result) => {
            if (result.value) {
            $.ajax({
                url: '/mandate/reject',
                type: 'POST',
                data: {_csrf_token: $('#csrf').val(), id: $('.id').val()},
                success: function(result) {
                    if (result.data) {
                        Swal.fire(
                            'Success',
                            'Approval successful!',
                            'success'
                        )

                        // location.reload();
                        window.location.replace("/mandates/pending");
                        channel_dt.ajax.reload();
                    } else {
                        Swal.fire(
                            'Oops..',
                            result.error,
                            'error'
                        )
                    }
                },
                error: function(request, msg, error) {
                    Swal.fire(
                        'Oops..',
                        'Something went wrong! try again',
                        'error'
                    )
                }
            });
        } else {
            Swal.fire(
                'Cancelled',
                'Operation not performed :)',
                'error'
            )
        }
    })
    });

    // Mandate Inwards Accept Button
    $("#accept-inwd").click(function() {
        Swal.fire({
            title: 'Are you sure you want to Accept mandate?',
            text: "mandate will be considered for file export!",
            // type: "warning",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, continue!'
            // showLoaderOnConfirm: true
        }).then((result) => {
            if (result.value) {
            $.ajax({
                url: '/accept/inward/mandate',
                type: 'POST',
                data: {_csrf_token: $('#csrf').val(), id: $('.id').val()},
                success: function(result) {
                    if (result.data) {
                        Swal.fire(
                            'Success',
                            'Approval successful!',
                            'success'
                        )

                        // location.reload();
                        window.location.replace("/inward/file/entries?file=" + $('.filename').val());
                        channel_dt.ajax.reload();
                    } else {
                        Swal.fire(
                            'Oops..',
                            result.error,
                            'error'
                        )
                    }
                },
                error: function(request, msg, error) {
                    Swal.fire(
                        'Oops..',
                        'Something went wrong! try again',
                        'error'
                    )
                }
            });
        } else {
            Swal.fire(
                'Cancelled',
                'Operation not performed :)',
                'error'
            )
        }
    })
    });

    // Mandate Bulk Inwards Accept Button
    $("#accept-bulk").click(function() {
        Swal.fire({
            title: 'Are you sure you want to Accept bulk?',
            text: "mandate will be considered for file export!",
            // type: "warning",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, continue!'
            // showLoaderOnConfirm: true
        }).then((result) => {
            if (result.value) {
            $.ajax({
                url: '/accept/inward/bulk/mandate',
                type: 'POST',
                data: {_csrf_token: $('#csrf').val(), id: $('.id').val()},
                success: function(result) {
                    if (result.data) {
                        Swal.fire(
                            'Success',
                            'Accepted successful!',
                            'success'
                        )

                        // location.reload();
                        window.location.replace("/list/pending/inward/bulk/requests");
                        channel_dt.ajax.reload();
                    } else {
                        Swal.fire(
                            'Oops..',
                            result.error,
                            'error'
                        )
                    }
                },
                error: function(request, msg, error) {
                    Swal.fire(
                        'Oops..',
                        'Something went wrong! try again',
                        'error'
                    )
                }
            });
        } else {
            Swal.fire(
                'Cancelled',
                'Operation not performed :)',
                'error'
            )
        }
    })
    });

    // Mandate Image
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function(e) {
                $('#img').attr('src', e.target.result)
                    .width('100%')
                    .height(943);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    $("#imginput").change(function () {
        var fileInput = document.getElementById('imginput');
        var filePath = fileInput.value;
        var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif|\.jfif)$/i;
        if(!allowedExtensions.exec(filePath)){
            Swal.fire(
                'Oops! Invalid Image',
                'Please upload images only!',
                'error'
            )
            fileInput.value = '';
            return false;
        }else{
            readURL(this);
        }

    });


    // Bulk Mandate Request Branches
    $('#bank_select').on('change', function () {
        var selected = $(this).val().toLowerCase();
        if (selected != '0') {
            $('#branch').show();
            $('#branch option').hide();  //hide all options initially
            $('#branch option:eq(0)').show();  //show the first option
            $('#branch option.' + selected).show();  //show options with the right class
        } else {
            $('#branch').hide();
            $('#branch option').hide();
        }

    });

    var select1 = document.getElementById("bank_select"),
        select2 = document.getElementById("branch");
    select2.disabled = true;
    select1.addEventListener("change", e => select2.disabled = select1.value === "" ? true : false, false);


    //mandate Starting/Expiry Date
    $("#expiredDate").change(function () {
        var startingDate = document.getElementById("startingDate").value;
        var expiredDate = document.getElementById("expiredDate").value;

        if ((Date.parse(startingDate) >= Date.parse(expiredDate))) {

            Swal.fire(
                'Oops',
                'Expiry date must be greater than starting date!',
                'error'
            )

            document.getElementById("expiredDate").value = "";
        }
    });

    $("#startingDate").change(function () {
        var startingDate = document.getElementById("startingDate").value;
        var expiredDate = document.getElementById("expiredDate").value;

        if ((Date.parse(expiredDate) !="")) {
            if ((Date.parse(startingDate) >= Date.parse(expiredDate))) {
                Swal.fire(
                    'Oops',
                    'Starting date must be less than Expiry date!',
                    'error'
                )
                document.getElementById("startingDate").value = "";
            }
        }
    });

    // new mandate amount
    $("#maxAmount").change(function () {
        var minAmount = document.getElementById("minAmount").value;
        var maxAmount = document.getElementById("maxAmount").value;

        if ((parseFloat(minAmount) >= parseFloat(maxAmount))) {
            Swal.fire(
                'Oops',
                'Maximum Amount must be greater than Minimum Amount!',
                'error'
            )
            document.getElementById("maxAmount").value = "";
        }
    });
    $("#minAmount").change(function () {
        var minAmount = document.getElementById("minAmount").value;
        var maxAmount = document.getElementById("maxAmount").value;

        if ((parseFloat(maxAmount) !="")) {
            if ((parseFloat(minAmount) >= parseFloat(maxAmount))) {
                Swal.fire(
                    'Oops',
                    'Minimum Amount must be less than Maximum Amount!',
                    'error'
                )
                document.getElementById("minAmount").value = "";
            }
        }
    });

});