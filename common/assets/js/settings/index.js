$(document).ready(function (){


    $.ajax({
        type: "POST",
        url: phpData.callback_settings,
        dataType: "json",
        data: {
            queue: "100"
        },
        success: function(data)
        {
            $("#callback_waittime").val(data.callback.wait_time)
            $("#rush_hours_s").val(data.callback.rush_hours_s)
            $("#rush_hours_e").val(data.callback.rush_hours_e)
            $("#working_hour_s").val(data.working_hours[0])
            $("#working_hour_e").val(data.working_hours[1])
            if (data.callback.on)
                $('#callbackOnOff').bootstrapToggle('on')
            if (data.work_hours)
                $('#workhOnOff').bootstrapToggle('on')
            if (data.callback.rush_hours)
                $('#rushOnOf').bootstrapToggle('on')
            if (data.callback.ivr)
                $('#ivrOnOf').bootstrapToggle('on')
        }
    });

    $(document).on("click","#uploadFile",function (){
        $("#audioFile").trigger('click');
    })

    $(document).on("change","#audioFile",function (){
        $("#audioFileForm").submit()
    })

    $("#audioFileForm").submit(function(e) {

        e.preventDefault(); // avoid to execute the actual submit of the form.
        var formData = new FormData(this);
        var form = $(this);

        $.ajax({
            type: "POST",
            cache: false,
            contentType: false,
            processData: false,
            url: form.attr("action"),
            data: formData, // serializes the form's elements.
            success: function(data)
            {
                if (data == 0) {
                    PNotify.success({
                        title: 'აუდიო ფაილი აიტვირთა',
                        text: '',
                        delay: 3000
                    });
                }

            }
        });


    });

    $(document).on("click","#add_white_list", function () {
        if ( $("#whitelistnumber").val() == "") {
            PNotify.info({
                title: 'White list',
                text: 'შეიყვანეთ ნომერი',
                delay: 3000
            });
        } else
            $.ajax({
                type: "POST",
                url: phpData.addWhiteList,
                dataType: "json",
                data: {
                    queue: "100",
                    number: $("#whitelistnumber").val()
                },
                success: function(data)
                {
                    if (data ==0) {
                        $("#whitelistnumber").val('')
                        $('#datatable-whitelist').DataTable().ajax.reload();
                        $('#datatable-whitelistdeleted').DataTable().ajax.reload();
                        PNotify.success({
                            title: 'White list',
                            text: 'ნომერი დაემატა',
                            delay: 3000
                        });
                    }

                    else if (data == -1)
                        PNotify.info({
                            title: 'White list',
                            text: 'ნომერი არსებობს',
                            delay: 3000
                        });
                    else if(data == 1)
                        PNotify.error({
                            title: 'White list',
                            text: 'დაფიქსირდა შეცდომა',
                            delay: 3000
                        });
                }
            });
    })
    $(document).on("click","#add_black_list", function () {
        if ( $("#blacklistnumber").val() == "") {
            PNotify.info({
                title: 'Black list',
                text: 'შეიყვანეთ ნომერი',
                delay: 3000
            });
        } else
            $.ajax({
                type: "POST",
                url: phpData.addBlackList,
                dataType: "json",
                data: {
                    queue: "100",
                    number: $("#blacklistnumber").val()
                },
                success: function(data)
                {
                    if (data ==0) {
                        $("#blacklistnumber").val('')
                        $('#datatable-blacklist').DataTable().ajax.reload();
                        $('#datatable-blacklistdeleted').DataTable().ajax.reload();
                        PNotify.success({
                            title: 'Black list',
                            text: 'ნომერი დაემატა',
                            delay: 3000
                        });
                    }

                    else if (data == -1)
                        PNotify.info({
                            title: 'Black list',
                            text: 'ნომერი არსებობს',
                            delay: 3000
                        });
                    else if(data == 1)
                        PNotify.error({
                            title: 'Black list',
                            text: 'დაფიქსირდა შეცდომა',
                            delay: 3000
                        });
                }
            });
    })

    $("#saveCallback").click(function (){
        $.ajax({
            type: "POST",
            url: phpData.change_settings,
            data: {
                queue: '100',
                status: $('#callbackOnOff').prop('checked'),
                ivr: $("#ivrOnOf").prop('checked'),
                rush: $("#rushOnOf").prop('checked'),
                rush_hours_s: $("#rush_hours_s").val(),
                rush_hours_e: $("#rush_hours_e").val(),
                work: $("#workhOnOff").prop('checked'),
                working_hour_s: $("#working_hour_s").val(),
                working_hour_e: $("#working_hour_e").val(),
                wait: $("#callback_waittime").val()
            }, // serializes the form's elements.
            success: function(data)
            {
                if (data ==0) {
                    PNotify.success({
                        title: 'უკუკავშირი',
                        text: 'პარამეტრები შეიცვალა წარმატებით',
                        delay: 3000
                    });
                } else {
                    PNotify.error({
                        title: 'უკუკავშირი',
                        text: 'დაფიქსირდა შეცდომა',
                        delay: 3000
                    });
                }
            },
            error: function () {
                PNotify.error({
                    title: 'უკუკავშირი',
                    text: 'დაფიქსირდა შეცდომა',
                    delay: 3000
                });
            }
        });
    })

    var table_whitelist = $('#datatable-whitelist').DataTable({
        ajax: {
            url: phpData.whiteList,
            type: "POST",
            dataSrc : 'data',
            data: {
                active: true,
                queue: "100",
            }

        },
        language: {
            emptyTable: "მონაცემები არ არის",
            search: "ფილტრი: ",
            loadingRecords: "იტვირთება...",
            processing: "იტვირთება...",
            info: "ნაჩვენებია ჩანაწერები _START_–დან _END_–მდე, _TOTAL_ ჩანაწერიდან",
            infoEmpty: "ნაჩვენებია ჩანაწერები 0–დან 0–მდე, 0 ჩანაწერიდან",
            sLengthMenu:     "აჩვენე _MENU_ ჩანაწერი",
            paginate: {
                next: "შემდეგი",
                previous: "წინა"
            }
        },
        dom: "<'row'<'col-sm-12 col-md-6'B><'col-sm-12 col-md-6'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-3 pt-1'l><'col-sm-12 col-md-6 text-center'i><'col-sm-12 col-md-3'p>>",

        columns:[
            { data: "number" },
            { data: "created_at" },
            { data: "added_by" },
            {
                "render": function ( data, type, row, meta )
                {
                    return '<div class="dropdown" >' +
                        '<div style="padding: 0.1rem 0.4rem !important;"  class="btn btn-outline-danger waves-effect dropdown-toggle" data-toggle="dropdown">' +
                        '<i class="mdi mdi-delete "></i>' +
                        '</div>' +
                        '<div class="dropdown-menu">' +
                        '<h6 class="dropdown-header")">გსურთ წაშლა ?</h6>' +
                        '<div class="dropdown-item pointer"  onclick="deleteNumber('+row.id+',\'whitelist\')">დიახ</div>' +
                        '<div class="dropdown-item pointer">არა</div>' +
                        '</div>';
                }

            },
        ],
        order: [[ 0, "asc" ]],
        lengthChange: true,
        buttons: [
            { extend: 'excel',title:'White-list',text:'ექსელი <i class="mdi mdi-download"></i>',
                className: 'btn-outline-primary waves-effect ',
                init: function(api, node, config) {
                    $(node).removeClass('btn-secondary')
                }
            },
        ],

        paging:         true,
    });
    var datatable_whitelistdeleted = $('#datatable-whitelistdeleted').DataTable({
        ajax: {
            url: phpData.whiteList,
            type: "POST",
            dataSrc : 'data',
            data: {

                queue: "100",
            }

        },
        language: {
            emptyTable: "მონაცემები არ არის",
            search: "ფილტრი: ",
            loadingRecords: "იტვირთება...",
            processing: "იტვირთება...",
            info: "ნაჩვენებია ჩანაწერები _START_–დან _END_–მდე, _TOTAL_ ჩანაწერიდან",
            infoEmpty: "ნაჩვენებია ჩანაწერები 0–დან 0–მდე, 0 ჩანაწერიდან",
            sLengthMenu:     "აჩვენე _MENU_ ჩანაწერი",
            paginate: {
                next: "შემდეგი",
                previous: "წინა"
            }
        },
        dom: "<'row'<'col-sm-12 col-md-6'B><'col-sm-12 col-md-6'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-3 pt-1'l><'col-sm-12 col-md-6 text-center'i><'col-sm-12 col-md-3'p>>",

        columns:[
            { data: "number" },
            { data: "deleted_at" },
            { data: "deleted_by" },
        ],
        order: [[ 0, "asc" ]],
        lengthChange: true,
        buttons: [
            { extend: 'excel',title:'White-list',text:'ექსელი <i class="mdi mdi-download"></i>',
                className: 'btn-outline-primary waves-effect ',
                init: function(api, node, config) {
                    $(node).removeClass('btn-secondary')
                }
            },
        ],

        paging:         true,
    });

    table_whitelist.buttons().container()
        .appendTo('#datatable-whitelist_wrapper .col-md-6:eq(0)');
    datatable_whitelistdeleted.buttons().container()
        .appendTo('#datatable-whitelistdeleted_wrapper .col-md-6:eq(0)');


    var table_blacklist = $('#datatable-blacklist').DataTable({
        ajax: {
            url: phpData.blackList,
            type: "POST",
            dataSrc : 'data',
            data: {
                active: true,
                queue: "100",
            }

        },
        language: {
            emptyTable: "მონაცემები არ არის",
            search: "ფილტრი: ",
            loadingRecords: "იტვირთება...",
            processing: "იტვირთება...",
            info: "ნაჩვენებია ჩანაწერები _START_–დან _END_–მდე, _TOTAL_ ჩანაწერიდან",
            infoEmpty: "ნაჩვენებია ჩანაწერები 0–დან 0–მდე, 0 ჩანაწერიდან",
            sLengthMenu:     "აჩვენე _MENU_ ჩანაწერი",
            paginate: {
                next: "შემდეგი",
                previous: "წინა"
            }
        },
        dom: "<'row'<'col-sm-12 col-md-6'B><'col-sm-12 col-md-6'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-3 pt-1'l><'col-sm-12 col-md-6 text-center'i><'col-sm-12 col-md-3'p>>",

        columns:[
            { data: "number" },
            { data: "created_at" },
            { data: "added_by" },
            {
                "render": function ( data, type, row, meta )
                {
                    return '<div class="dropdown" >' +
                        '<div style="padding: 0.1rem 0.4rem !important;"  class="btn btn-outline-danger waves-effect dropdown-toggle" data-toggle="dropdown">' +
                        '<i class="mdi mdi-delete "></i>' +
                        '</div>' +
                        '<div class="dropdown-menu">' +
                        '<h6 class="dropdown-header")">გსურთ წაშლა ?</h6>' +
                        '<div class="dropdown-item pointer"  onclick="deleteNumber('+row.id+',\'blacklist\')">დიახ</div>' +
                        '<div class="dropdown-item pointer">არა</div>' +
                        '</div>';
                }

            },
        ],
        order: [[ 0, "asc" ]],
        lengthChange: true,
        buttons: [
            { extend: 'excel',title:'Black-list',text:'ექსელი <i class="mdi mdi-download"></i>',
                className: 'btn-outline-primary waves-effect ',
                init: function(api, node, config) {
                    $(node).removeClass('btn-secondary')
                }
            },
        ],

        paging:         true,
    });
    table_blacklist.buttons().container()
        .appendTo('#datatable-blacklist_wrapper .col-md-6:eq(0)');

    var table_blacklistdeleted = $('#datatable-blacklistdeleted').DataTable({
        ajax: {
            url: phpData.blackList,
            type: "POST",
            dataSrc : 'data',
            data: {
                queue: "100",
            }

        },
        language: {
            emptyTable: "მონაცემები არ არის",
            search: "ფილტრი: ",
            loadingRecords: "იტვირთება...",
            processing: "იტვირთება...",
            info: "ნაჩვენებია ჩანაწერები _START_–დან _END_–მდე, _TOTAL_ ჩანაწერიდან",
            infoEmpty: "ნაჩვენებია ჩანაწერები 0–დან 0–მდე, 0 ჩანაწერიდან",
            sLengthMenu:     "აჩვენე _MENU_ ჩანაწერი",
            paginate: {
                next: "შემდეგი",
                previous: "წინა"
            }
        },
        dom: "<'row'<'col-sm-12 col-md-6'B><'col-sm-12 col-md-6'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-3 pt-1'l><'col-sm-12 col-md-6 text-center'i><'col-sm-12 col-md-3'p>>",

        columns:[
            { data: "number" },
            { data: "deleted_at" },
            { data: "deleted_by" },
        ],
        order: [[ 0, "asc" ]],
        lengthChange: true,
        buttons: [
            { extend: 'excel',title:'Black-list',text:'ექსელი <i class="mdi mdi-download"></i>',
                className: 'btn-outline-primary waves-effect ',
                init: function(api, node, config) {
                    $(node).removeClass('btn-secondary')
                }
            },
        ],

        paging:         true,
    });
    table_blacklistdeleted.buttons().container()
        .appendTo('#table_blacklistdeleted_wrapper .col-md-6:eq(0)');


})

function deleteNumber(id, list) {
    var url =  (list=="whitelist" ?  phpData.deleteWhiteList: phpData.deleteBlackList)

    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        data: {
            queue: "100",
            number: id
        },
        success: function(data)
        {
            if (data ==0) {
                $('#datatable-'+list).DataTable().ajax.reload();
                $('#datatable-'+list+"deleted").DataTable().ajax.reload();


                PNotify.success({
                    title: '',
                    text: 'ნომერი წაიშალა',
                    delay: 3000
                });
            }

            else if (data == -1)
                PNotify.info({
                    title: '',
                    text: 'ნომერი არ არსებობს',
                    delay: 3000
                });
            else if(data == 1)
                PNotify.error({
                    title: '',
                    text: 'დაფიქსირდა შეცდომა',
                    delay: 3000
                });
        }
    });

}

