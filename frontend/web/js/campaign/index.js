var activeopers = [];


$(document).ready(function () {

    // $(document).on("change","#uploadAudio", function () {
    //
    //     var check = true;
    //     var filename = false;
    //
    // })

    $.ajax({
        type: "POST",
        url: phpData.getActiveOperators,
        dataType: "json",
        success: function (data) {
            activeopers=data.activeOpers;
            console.log(activeopers)

        }
    });

    $.ajax({
        type: "POST",
        url: phpData.setting,
        dataType: "json",
        success: function (data) {
            $("#start").val(data.start)
            $("#end").val(data.end)
            $("#count").val(data.count)
        }
    });
    var datatable = $('#datatable-example').DataTable({
        data: [],
        dataSrc: "data",
        language: {
            emptyTable: "მონაცემები არ არის",
            search: "ფილტრი: ",
            info: "რაოდენობა: _TOTAL_ ",
            infoEmpty: "ნაჩვენებია ჩანაწერები 0–დან 0–მდე, 0 ჩანაწერიდან",
            sLengthMenu: " _MENU_ ",
            paginate: {
                next: "შემდეგი",
                previous: "წინა"
            }
        },
        dom: "<'row'<'col-sm-12 col-md-12'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-2 pt-1'l><'col-sm-12 col-md-3 text-center'i><'col-sm-12 col-md-7'p>>",
        columns: [

            {data: "number"},

        ]
    });

    $(document).on("click", "#saveUploadNumbers", function () {
        $.ajax({
            async: false,
            url: phpData.saveNumbers, // <-- point to server-side PHP script
            dataType: 'JSON',  // <-- what to expect back from the PHP script, if anything
            data: {
                campaing_id: $("#campaing_id").val(),
                filename: $("#filename").val()
            },
            type: 'post',
            success: function (result) {
                if (result == 0) {
                    $('#create_user').trigger("reset");
                    $("#outmodal").modal('hide')
                    PNotify.success({
                        title: 'დადასტურება',
                        text: 'ოპერაცია დასრულდა წარმატებით',
                        delay: 3000
                    });
                } else {
                    PNotify.error({
                        title: 'დაფიქსირდა შეცდომა',
                        text: '',
                        delay: 3000
                    });
                }
            },
            error: function () {
                PNotify.error({
                    title: 'დაფიქსირდა შეცდომა',
                    text: '',
                    delay: 3000
                });
            }
        });
    })

    $(document).on("click", ".chooseFile", function () {
        $("#campaing_id").val($(this).data("campaingid"))
        $("#outVoiceFile").trigger('click');
    })
    $(document).on("change", "#outVoiceFile", function () {

        var check = true;
        var filename = false;

        var file_data = $(this).prop('files')[0];
        var form_data = new FormData();
        form_data.append('file', file_data);
        form_data.append('campaing_id', 8);

        var fileType = $(this).val().split('.').pop();

        if (file_data) {

            if (fileType.startsWith("xlsx")) {
                $.ajax({
                    async: false,
                    url: phpData.upload, // <-- point to server-side PHP script
                    dataType: 'JSON',  // <-- what to expect back from the PHP script, if anything
                    cache: false,
                    contentType: false,
                    processData: false,
                    data: form_data,
                    type: 'post',
                    success: function (result) {
                        if (result == "no") {
                            check = false;
                            PNotify.error({
                                title: 'დაფიქსირდა შეცდომა',
                                text: '',
                                delay: 3000
                            });
                        } else {
                            $("#outmodal").modal()
                            datatable.clear();
                            datatable.rows.add(result.data);
                            datatable.draw();
                            $("#filename").val(result.filename)

                        }
                    }
                });
            } else {

                check = false;
                PNotify.error({
                    title: 'ფაილის ტიპი უნდა იყოს XLSX',
                    text: '',
                    delay: 3000
                });

            }
        }


    })


    $(document).on("change", "#inVoiceFile", function () {
        var check = true;
        var filename = false;

        var file_data = $('#inVoiceFile').prop('files')[0];
        var form_data = new FormData();
        form_data.append('file', file_data);
        if (file_data) {

            if (file_data.type == "audio/xlsx") {
                $.ajax({
                    async: false,
                    url: phpData.upload, // <-- point to server-side PHP script
                    dataType: 'text',  // <-- what to expect back from the PHP script, if anything
                    cache: false,
                    contentType: false,
                    processData: false,
                    data: form_data,
                    type: 'post',
                    success: function (result) {
                        if (result == "no") {
                            check = false;
                            PNotify.error({
                                title: 'დაფიქსირდა შეცდომა',
                                text: '',
                                delay: 3000
                            });
                        } else {

                            filename = result;
                        }
                    }
                });
            } else {
                check = false;
                PNotify.error({
                    title: 'ფაილის ტიპი უნდა იყოს WAV',
                    text: '',
                    delay: 3000
                });

            }
        }
        if (check && $("#inVoiseSettId").val() != "") {

            $.ajax({
                type: "POST",
                url: phpData.updateInVoiceSettings,
                dataType: "text",
                data: {
                    id: $("#inVoiseSettId").val(),
                    file: filename
                },
                success: function (data) {
                    if (data == 0) {
                        $('#datatable-inVoiceSettings').DataTable().ajax.reload();
                        PNotify.success({
                            title: '',
                            text: 'ოპერტიცა დასრულდა წარმატებიტ',
                            delay: 3000
                        });
                    } else if (data == -1)
                        PNotify.error({
                            title: '',
                            text: 'დაფიქსირდა შეცდომა',
                            delay: 3000
                        });
                    else if (data == 1)
                        PNotify.error({
                            title: '',
                            text: 'დაფიქსირდა შეცდომა',
                            delay: 3000
                        });
                }
            });
        }
    })

    $(document).on("click", "#saveOutVoiceSett", function () {

        var check = true;
        var filename = false;

        var file_data = $('#outVoiceFile').prop('files')[0];
        var form_data = new FormData();
        form_data.append('file', file_data);
        form_data.append('campaing_id', 8);

        var fileType = $('#outVoiceFile').val().split('.').pop();

        if (file_data) {

            if (fileType.startsWith("xlsx")) {
                $.ajax({
                    async: false,
                    url: phpData.upload, // <-- point to server-side PHP script
                    dataType: 'text',  // <-- what to expect back from the PHP script, if anything
                    cache: false,
                    contentType: false,
                    processData: false,
                    data: form_data,
                    type: 'post',
                    success: function (result) {
                        if (result == "no") {
                            check = false;
                            PNotify.error({
                                title: 'დაფიქსირდა შეცდომა',
                                text: '',
                                delay: 3000
                            });
                        } else {

                            filename = result;
                        }
                    }
                });
            } else {

                check = false;
                PNotify.error({
                    title: 'ფაილის ტიპი უნდა იყოს WAV',
                    text: '',
                    delay: 3000
                });

            }
        }
        if (check) {


            $.ajax({
                type: "POST",
                url: phpData.insertCallsInCampain,
                dataType: "text",
                data: {
                    id: 1,
                    file: filename
                },
                success: function (data) {
                    if (data == 0) {
                        $("#outmodal").modal("hide")
                        $('#datatable-outCallsParam').DataTable().ajax.reload();
                        PNotify.success({
                            title: '',
                            text: 'ოპერტიცა დასრულდა წარმატებიტ',
                            delay: 3000
                        });
                    } else if (data == -1)
                        PNotify.error({
                            title: '',
                            text: 'დაფიქსირდა შეცდომა',
                            delay: 3000
                        });
                    else if (data == 1)
                        PNotify.error({
                            title: '',
                            text: 'დაფიქსირდა შეცდომა',
                            delay: 3000
                        });
                }
            });
        }


    })


    $(document).on("click", "#uploadFile", function () {
        $("#audioFile").trigger('click');
    })

    $(document).on("change", "#audioFile", function () {
        $("#audioFileForm").submit()
    })

    $('#campaign_form, #settingsForm').parsley();

    $("#settingsForm").submit(function (e) {


        e.preventDefault(); // avoid to execute the actual submit of the form.
        var form = $(this);

        $.ajax({
            type: "POST",
            url: phpData.saveSetting,
            data: form.serialize(),
            success: function (data) {
                if (data == 0) {
                    PNotify.success({
                        title: 'პარამეტრები განახლდა წარმატებით',
                        text: 'კპარამეტრების განახლება',
                        delay: 3000
                    });
                } else if (data == -1)
                    PNotify.info({
                        title: 'კპარამეტრების განახლება',
                        text: 'დაფიქსირდა შეცდომა',
                        delay: 3000
                    });
                else if (data == 1)
                    PNotify.error({
                        title: 'კამპანიის დამატება',
                        text: 'დაფიქსირდა შეცდომა',
                        delay: 3000
                    });

            }
        });


        return false;

        e.preventDefault(); // avoid to execute the actual submit of the form.
        var formData = new FormData(this);
        var form = $(this);

        $.ajax({
            type: "POST",
            url: phpData.addCampaign,
            dataType: "json",
            data: formData,
            success: function (data) {
                if (data ==0) {
                    $("#campaignName").val('')
                    refreshCampaing();
                    PNotify.success({
                        title: 'კამპანიის დამატება',
                        text: `დაემატა${data}`,
                        delay: 3000
                    });
                } else if (data == 0)
                    PNotify.info({
                        title: 'კამპანიის დამატება',
                        text: 'კამპანია არსებობს',
                        delay: 3000
                    });
                else if (data == 1)
                    PNotify.error({
                        title: 'კამპანიის დამატება',
                        text: 'დაფიქსირდა შეცდომა',
                        delay: 3000
                    });
            }
        });
    })
    $("#campaign_form").submit(function (e) {

        e.preventDefault(); // avoid to execute the actual submit of the form.
        var formData = new FormData(this);
        var form = this

        var filename = null;

        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });

        // Pretty print the form data object in the console
        console.log(JSON.stringify(formObject, null, 2));
        var file_data = $('#uploadAudio').prop('files')[0];
        var form_data = new FormData();
        form_data.append('file', file_data);
        form_data.append('sender', "senfile");
        if (file_data) {
            if (file_data.type == "audio/wav") {
                $.ajax({
                    async: false,
                    // url: "http://192.168.2.234/upload/index.php", // <-- point to server-side PHP script
                    dataType: 'text',  // <-- what to expect back from the PHP script, if anything
                    cache: false,
                    contentType: false,
                    processData: false,
                    data: form_data,
                    type: 'post',
                    success: function (result) {
                        if (result == "no") {
                            check = false;
                            PNotify.error({
                                title: 'დაფიქსირდა შეცდომა',
                                text: '',
                                delay: 3000
                            });
                        }
                        formData.append("filename", result)
                        filename = result;
                    }
                });
            } else {
                check = false;
                PNotify.warning({
                    title: 'ფაილის ტიპი უნდა იყოს WAV',
                    text: '',
                    delay: 3000
                });

            }
        }



        $.ajax({
            type: "POST",
            cache: false,
            contentType: false,
            processData: false,
            url: phpData.addCampaign,
            data: formData, // serializes the form's elements.
            success: function (data) {
                if (data > 0) {
                    $("#campaignName").val('')
                    form.reset()
                    refreshCampaing()
                    PNotify.success({
                        title: 'კამპანიის დამატება',
                        text: `აიტვირთა ${data.replace(/\r?|\r/g, " ")} ჩანაწერი`,
                        delay: 3000
                    });
                } else if (data == 0)
                    PNotify.info({
                        title: 'კამპანიის დამატება',
                        text: 'კამპანია არსებობს',
                        delay: 3000
                    });
                else if (data == 1)
                    PNotify.error({
                        title: 'კამპანიის დამატება',
                        text: 'დაფიქსირდა შეცდომა',
                        delay: 3000
                    });

            }
        });


        return false;


    })

    $("#audioFileForm").submit(function (e) {

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
            success: function (data) {
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

    $(document).on("click", "#as", function () {

        if ($("#campaignName").val() == "") {
            PNotify.info({
                title: 'კამპანიის დამატება',
                text: 'შეიყვანეთ კამპანიის დასახელება',
                delay: 3000
            });
        }

    })


    var table_campaign = $('#datatable-campaign').DataTable({
        ajax: {
            url: phpData.campaignList,
            type: "POST",
            dataSrc: 'data',
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
            sLengthMenu: "აჩვენე _MENU_ ჩანაწერი",
            paginate: {
                next: "შემდეგი",
                previous: "წინა"
            }
        },
        dom: "<'row'<'col-sm-12 col-md-6'B><'col-sm-12 col-md-6'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-3 pt-1'l><'col-sm-12 col-md-6 text-center'i><'col-sm-12 col-md-3'p>>",

        columns: [
            {data: "created_at"},
            {data: "name"},
            {
                "render": function (data, type, row, meta) {
                    return row.left == 0 ? "დასრულებული" : (row.active == 2 ? "არააქტიური" : "აქტიური");
                }

            },
            // {
            //     "render": function (data, type, row, meta) {
            //         console.log(row);

            //         a = '';    
            //         console.log(row["id"]);
            //         for (var i = 0; i < row.oper.length; i++) {
            //             // $a += '<div class="d-flex align-items-center">' +
            //             // '<label class="ml-1 mt-1" ">' + row.oper[i] + '</label>' 
            //             // if(row.active!=2){
            //             //     $a+='<span onclick="changeCampaing(\'' + row.id + ',\'' + row.name + '\')" class="mdi mdi-pencil mdi-18px ml-auto mr-3 mt-1 btn-outline-warning"></span>'
            //             // }
            //             // $a+='<br>'+'</div>';
                        
            //             a += '<label class="ml-1 mt-1 ml-1" ">' + row.oper[i] + '</label>'
            //         }
                    

            //         return a;

            //     }

            // },
            

            

            {data: "left"},
            {data: "done"},
            {data: "sum"},
            {data: "added_by"},
            {
                "render": function (data, type, row, meta) {
                    var text = '';
                    if (row.active == 2 && row.left > 0){
                        text = '<div class="ml-1 btn btn-xs btn-outline-primary waves-effect "  data-toggle="tooltip" data-placement="bottom"  title="ჩართვა" onclick="activate(' + row.id + ',true,\'' + row.origname + '\')"><span class="mdi mdi-timer"></span></div>'
                    }
                    else if (row.active == 1 && row.left > 0){
                        text ='<div class="ml-1 btn btn-xs btn-outline-success waves-effect "  data-toggle="tooltip" data-placement="bottom"  title="გამორთვა" onclick="activate(' + row.id + ',false,\'' + row.origname + '\')"><span class="mdi mdi-stop"></span></div>'

                    }
                    // '<div class="btn btn-xs btn-outline-warning waves-effect ml-1" data-toggle="tooltip" data-placement="bottom" title="პარამეტრების რედაქტირება" onclick="changeCampaing(\'' + row.id + '\',\'' + row.name + '\')"><span class="mdi mdi-pencil"></span></div>'
                    return '<div class="btn btn-xs btn-outline-warning waves-effect showDetail"  data-toggle="tooltip" data-placement="bottom" title="სიის ნახვა" onclick="showDetail(' + row.id + ',\'' + row.name + '\')"><span class="mdi mdi-details"></span></div>' +
                     text+
                        '<div class="dropdown d-inline-block">' +
                        '  <div class="btn btn-xs btn-outline-danger waves-effect showDetail" data-toggle="dropdown" aria-expanded="false">' +
                        ' <span class="mdi mdi-delete"></span>' +
                        '  </div>' +
                        '  <div class="dropdown-menu">' +
                        '   <h6 class="m-3 mt-2 dropdown-header-custom">გსურთ წაშლა ?</h6>' +
                        `<a href="javascript:void(0)" class="dropdown-item"  onclick="deleteNumber(${row.id}, '${row.name}', 'campaign')">დიახ</a>`+
                        '<a href="javascript:void(0)" class="dropdown-item">არა</a>'+
                        '  </div>' +
                        '</div>';
                        // `<div class="dropdown-content-custom d-none" id="dropdown-content-${row.id}">`+
                        // '<h6 class="m-3 mt-2 dropdown-header-custom">გსურთ წაშლა ?</h6>'+

                        // '</div>'+
                    // '<div class="btn btn-xs btn-outline-primary waves-effect playAudio ml-1"  data-toggle="tooltip" data-placement="bottom"  title="მოსმენა" onclick="playfile(\'' + row.filename + '\')"><span class="mdi mdi-play"></span></div>'+
                        // '<div class="btn btn-xs btn-outline-warning waves-effect ml-1" data-toggle="tooltip" data-placement="bottom" title="პარამეტრების რედაქტირება" onclick="changeCampaing(\'' + row.id + '\',\'' + row.name + '\')"><span class="mdi mdi-pencil"></span></div>'
                        // `<div class=" btn dropdown-custom btn-outline-danger waves-effect m-1" title="წაშლა" onClick="showDropdown(${row.id})">`+
                        // `<i class="mdi mdi-delete"></i>`+
                        // '</div>';







                }

            },

        ],
        order: [[0, "desc"]],
        lengthChange: true,
        buttons: [
            {
                extend: 'excel', title: 'White-list', text: 'ექსელი <i class="mdi mdi-download"></i>',
                className: 'btn-outline-primary waves-effect ',
                init: function (api, node, config) {
                    $(node).removeClass('btn-secondary')
                }
            },
        ],

        paging: true,
        scrollX: true
    });

    $("#campaingChangeButton").on('click', function () {
        campaing_id=$('#campaingModalLabel').attr('data-campaing');
        var datatable_campaing = $('#datatable-campaing-opers').DataTable();
        var changedOpers = [[]];
        for(var i = 0; i < datatable_campaing.rows().count(); i++){
            select_cell=datatable_campaing.cell(i, 3).node();
            data_select_cell = $(select_cell).find('option:selected').text();
            oper_num_data=datatable_campaing.cell(i, 0).data();
            if(data_select_cell!=oper_num_data){
                changedOpers.push([data_select_cell, oper_num_data,campaing_id]);
            }
        }

        if(changedOpers.length!=0){
        $.ajax({
            type: "POST",
            url: phpData.changeOper,
            dataType: "json",
            data: {
                changedOpers: changedOpers
            },
            success: function (data) {
                if (data == 0) {
                    $('#datatable-campaign').DataTable().ajax.reload();
                    PNotify.success({
                        title: 'კამპანიის პარამეტრები შეიცვალა',
                        text: '',
                        delay: 3000
                    });
                } else if (data == -1)
                    PNotify.info({
                        title: '',
                        text: 'ნომერი არ არსებობს',
                        delay: 3000
                    });
                else if (data == 1)
                    PNotify.error({
                        title: '',
                        text: 'დაფიქსირდა შეცდომა',
                        delay: 3000
                    });
            }
        });
    }
        $('#campaingModal').modal('hide');


    
        
    })
    $('#campaingModal').on('hide.bs.modal', function (e) {
        resetCampaingModal();
        
    });
    // $(document).on('click', function(event) {
    //     if (!$(event.target).closest('.dropdown-custom').length) {
    //         $(".dropdown-content-custom").addClass("d-none");
    //         $('#datatable-campaign').css('min-height','');
    //
    //     }
    //     });










    setInterval(refreshCampaing,1000 * 60);
    setInterval(refreshDetail,1000 * 60);
    // $("#btn-campaing-type-expand").on('click', function () {
    //     $("#expandable-campaing-type").toggleClass('d-none');
    $("#campaing_start_time").flatpickr({
        enableTime: true,
        dateFormat: "H:i",
        time_24hr: true,
        noCalendar: true,
        // altInput: true,
        allowInput:false
        // altFormat: "H :i"
    })

    $("#campaing_end_time").flatpickr({
        enableTime: true,
        dateFormat: "H:i",
        time_24hr: true,
        noCalendar: true,
        allowInput: false
        // altInput: true,
        // altFormat: "H :i"
    });



});
$.fn.DataTable.ext.type.order['salary-grade-pre'] = function (d) {
    switch (d) {
        case 'მოსმენილი':
            return 1;
        case 'ნაპასუხები':
            return 2;
        case 'არ ნაპასუხები':
            return 3;
    }
    return 0;
};

function refreshCampaing(){
    $('#datatable-campaign').DataTable().ajax.reload();

}
function refreshDetail(){
    if ($("#DatailBinder").is(":visible")) {
        $('#datatable-detail').DataTable().ajax.reload();
        console.log("refreshed");
    }
}
// function showDropdown(id){
//     console.log(`#dropdown-content-${id}`,"id");
//     $(`#dropdown-content-${id}`).toggleClass("d-none");
//     $('#datatable-campaign').css('min-height','130px');
// }
// function expandDatatable() {
//     console.log("expanded");
//     $('#datatable-campaign').css('min-height','150px');
// }
function deleteNumber(id,name,list) {
    console.log(name,"name");
    var url = (list == "campaign" ? phpData.deleteCampaign : phpData.deleteBlackList)


    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        data: {
            queue: "100",
            number: id
        },
        success: function (data) {
            if (data == 0) {
                $('#datatable-' + list).DataTable().ajax.reload();
                console.log(name,"name");
                if(name==$('#detail_title').text()){
                    $("#DatailBinder").fadeOut();
                }
                PNotify.success({
                    title: '',
                    text: 'კამპანია წაიშალა',
                    delay: 3000
                });
            } else if (data == -1)
                PNotify.info({
                    title: '',
                    text: 'კამპანია არ არსებობს',
                    delay: 3000
                });
            else if (data == 1)
                PNotify.error({
                    title: '',
                    text: 'დაფიქსირდა შეცდომა',
                    delay: 3000
                });
        }
    });

}

function deleteOutVoiceNumber(id) {

    $.ajax({
        type: "POST",
        url: phpData.outVoiceDeleteNumber,
        dataType: "json",
        data: {
            queue: "100",
            id: id
        },
        success: function (data) {
            if (data == 0) {
                $('#datatable-outCallscampaign').DataTable().ajax.reload();
                PNotify.success({
                    title: '',
                    text: 'ნომერი წაიშალა',
                    delay: 3000
                });
            } else if (data == -1)
                PNotify.info({
                    title: '',
                    text: 'ნომერი არ არსებობს',
                    delay: 3000
                });
            else if (data == 1)
                PNotify.error({
                    title: '',
                    text: 'დაფიქსირდა შეცდომა',
                    delay: 3000
                });
        }
    });

}


function editOutVoice(id, active, int, ext, repeat) {

    $("#outVoiceFile:file").filestyle('clear');
    $("#outVoiseSettId").val(id);
    $("#outVoiseSettStatus").prop("checked", active == 1 ? true : false);
    $("#outVoiseSettInt").prop("checked", int == 1 ? true : false);
    $("#outVoiseSettExt").prop("checked", ext == 1 ? true : false);
    $("#outVoiseSettRepeat").prop("checked", repeat == 1 ? true : false);

    $("#outmodal").modal()
}

function playfile(audio) {
    $("#player_binder").fadeIn();

    $("#s").attr("src", audio);
    $("#s").trigger('play');
}

function playfileIn(audio) {
    $("#player_binder_in").fadeIn();

    $("#player_binder_in_audio").attr("src", phpData.uploadFile + audio);
    $("#player_binder_in_audio").trigger('play');
}

function editInVice(id) {
    $("#inVoiceFile").val('');
    $("#inVoiseSettId").val(id)
    $("#inVoiceFile").click()
}

function activate(id, flag, filename) {

    $.ajax({
        type: "POST",
        url: phpData.activeCampaign,
        dataType: "json",
        data: {
            flag: flag,
            id: id
        },
        success: function (data) {
            if (data == 0) {
                $('#datatable-campaign').DataTable().ajax.reload();


            }
        }
    });

    $.ajax({
        type: "POST",
        // url: 'http://192.168.2.234/upload/index.php',
        dataType: "json",
        data: {
            activeFile: true,
            filename: filename
        },
        success: function (data) {
            if (data == 0) {

                $('#datatable-campaign').DataTable().ajax.reload();


            }
        }
    });
}

function showDetail(id, title) {


    if ($("#DatailBinder").is(":visible") && title==$('#detail_title').text()) {
        $("#DatailBinder").fadeOut();
        // Additional code to execute if the element is visible
    } else {
        $("#DatailBinder").fadeIn();
    }



    $("#detail_title").html(title);
    $('#datatable-detail').DataTable().clear();
    $('#datatable-detail').DataTable().destroy();
    var table_datail = $('#datatable-detail').DataTable({
        ajax: {
            url: phpData.getDetail,
            type: "POST",
            dataSrc: 'data',
            data: {
                id: id
            }

        },
        language: {
            emptyTable: "მონაცემები არ არის",
            search: "ფილტრი: ",
            loadingRecords: "იტვირთება...",
            processing: "იტვირთება...",
            info: "ნაჩვენებია ჩანაწერები _START_–დან _END_–მდე, _TOTAL_ ჩანაწერიდან",
            infoEmpty: "ნაჩვენებია ჩანაწერები 0–დან 0–მდე, 0 ჩანაწერიდან",
            sLengthMenu: "აჩვენე _MENU_ ჩანაწერი",
            paginate: {
                next: "შემდეგი",
                previous: "წინა"
            }
        },
        dom: "<'row'<'col-sm-12 col-md-6'B><'col-sm-12 col-md-6'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-3 pt-1'l><'col-sm-12 col-md-6 text-center'i><'col-sm-12 col-md-3'p>>",

        columns: [

            // {data: "number"},
            //
            // {
            //     "render": function (data, type, row, meta) {
            //         if (row.status == 2)
            //             return 'დარეკილი';
            //         else {
            //             return 'არ დარეკილი';
            //         }
            //     }
            //
            //
            // },
            {data: "calldate","defaultContent": ""},
            {data: "number"},
            { "render": function (data, type, row, meta) {
                    if(row.calldate){
                       return 'დარეკილი';
                    }
                    else{
                        return 'არ დარეკილი';

                    }
                }
            },
            { "render": function (data, type, row, meta) {
                    if(row.billsec){
                        if(row.userfield){
                            return 'მოსმენილი';
                        }
                        return 'ნაპასუხები';
                    }
                    else{
                        return 'არ ნაპასუხები';

                    }
                }
            },

            {data: "billsec", "defaultContent": ""}


        ],
        pageLength: 50,
        lengthChange: true,
        buttons: [
            {
                extend: 'csv',
                title: 'Dailer datail numbers',
                text: 'ექსელი <i class="mdi mdi-download"></i>',
                className: 'btn-primary waves-effect '
            },

        ],
        scrollY: "350px",
        order: [
            [0, 'desc'],
            [2, 'desc'],
            [3, 'asc'],
        ],
        columnDefs: [
            {
                type: 'salary-grade',
                targets: 3
            },
        ],

        scrollX: true,
        paging: true,

    });
    table_datail.buttons().container()
        .appendTo('#datatable-detail_wrapper .col-md-6:eq(0)');

    $('#datatable-stat').DataTable().clear();
    $('#datatable-stat').DataTable().destroy();
    var table_stat = $('#datatable-stat').DataTable({
        ajax: {
            url: phpData.getStat,
            type: "POST",
            dataSrc: 'data',
            data: {
                id: id
            }

        },
        language: {
            emptyTable: "მონაცემები არ არის",
            search: "ფილტრი: ",
            loadingRecords: "იტვირთება...",
            processing: "იტვირთება...",
            info: "ნაჩვენებია ჩანაწერები _START_–დან _END_–მდე, _TOTAL_ ჩანაწერიდან",
            infoEmpty: "ნაჩვენებია ჩანაწერები 0–დან 0–მდე, 0 ჩანაწერიდან",
            sLengthMenu: "აჩვენე _MENU_ ჩანაწერი",
            paginate: {
                next: "შემდეგი",
                previous: "წინა"
            }
        },
        dom: "<'row'<'col-sm-12 col-md-6'B><'col-sm-12 col-md-6'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-3 pt-1'l><'col-sm-12 col-md-6 text-center'i><'col-sm-12 col-md-3'p>>",

        columns: [

            {data: "number"},
            {
                "render": function (data, type, row, meta) {
                    return  secondsToHms(row.duration)
                }

            },
            {data: "created_at"},
        ],
        pageLength: 50,
        lengthChange: true,
        buttons: [
            {
                extend: 'csv',
                title: 'Dailer Stat',
                text: 'ექსელი <i class="mdi mdi-download"></i>',
                className: 'btn-primary waves-effect '
            },

        ],
        scrollY: "350px",
        scrollX: true,
        paging: true,
    });
    table_stat.buttons().container()
        .appendTo('#datatable-stat_wrapper .col-md-6:eq(0)');

}

function resetInVoice(id) {
    $.ajax({
        type: "POST",
        url: phpData.resetInVoice,
        dataType: "json",
        data: {
            queue: "100",
            id: id
        },
        success: function (data) {
            if (data == 0) {
                $('#datatable-inVoiceSettings').DataTable().ajax.reload();
                PNotify.success({
                    title: '',
                    text: 'ხმოვანი ფაილი დარესეტდა',
                    delay: 3000
                });
            } else if (data == -1)
                PNotify.info({
                    title: '',
                    text: 'დაფიქსირდა შეცდომა',
                    delay: 3000
                });
            else if (data == 1)
                PNotify.error({
                    title: '',
                    text: 'დაფიქსირდა შეცდომა',
                    delay: 3000
                });
        }
    });
}
function secondsToHms(d) {
    d = Number(d);

    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    return ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
}

function changeCampaing($campaign_id,$campaign_name){
    // $("#exampleModal").modal('show');
    // $('#exampleModal select option[value="default"]').text($oper_num);
    // $('#changeOperName').text($campaign_name);
    // $('#changeOperName').attr('data-panel', $campaign_id);
    // $('#changeOperName').attr('data-oper-change',$oper_num);
    $('#campaingModalLabel').attr('data-campaing',$campaign_id);
    console.log($campaign_id);
    var datatableCampaingOpers = $('#datatable-campaing-opers').DataTable({
        ajax: {
            url: phpData.getCampaingOpers,
            type: "POST",
            dataSrc: 'opers',
            dataType: "json",
            data: {
                campaing_id: $campaign_id,
            },


        },
        language: {
            emptyTable: "მონაცემები არ არის",
            // search: "ფილტრი: ",
            loadingRecords: "იტვირთება...",
            processing: "იტვირთება...",
            info: "ნაჩვენებია ჩანაწერები _START_–დან _END_–მდე, _TOTAL_ ჩანაწერიდან",
            infoEmpty: "ნაჩვენებია ჩანაწერები 0–დან 0–მდე, 0 ჩანაწერიდან",
            sLengthMenu: "აჩვენე _MENU_ ჩანაწერი",
            paginate: {
                next: "შემდეგი",
                previous: "წინა"
            }
        },
        dom: "<'row'<'col-sm-12 col-md-6'B><'col-sm-12 col-md-6'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-3 pt-1'l><'col-sm-12 col-md-6 text-center'i><'col-sm-12 col-md-3'p>>",


        columns: [
            {data: "oper_num"},
            {data: "oper_name"},
            {
                "render": function (data, type, row, meta) {
                    return '<div class="ml-1 btn btn-xs btn-outline-primary waves-effect " id="button'+row.oper_num+'" data-toggle="tooltip" data-placement=""  title="შეცვლა" onclick="changeOper(' + row.oper_num +')"><span class="mdi mdi-pencil">შეცვლა</span></div>';                }
            },
            {
                "render": function (data, type, row, meta) {
                    select='<select class="custom-select d-none" id=select'+row.oper_num+'>'+
                    '<option value="default" selected>'+row.oper_num+'</option>';
                    activeopers.forEach(function(value, index) {
                        if(value!=row.oper_num){
                        select += '<option>'+value+'</option>';
                        }
                    });

                    return select;
                }
            },


        ],
                buttons: [
            ],
        targets:"no-sort",
        order:false,
        bsort:false,
        lengthChange: true,
        paging: true,
        scrollX: false,
        searching: false,
        info: false,
        destroy: true,
        responsive: true,

    });
    $("#campaingModal").modal('show');

}

function changeOper(oper_change){
    $('#select'+oper_change).removeClass('d-none');
    $('#button'+oper_change).removeClass('btn-outline-primary');
    $('#button'+oper_change).addClass('btn-outline-secondary');
    $('#datatable-campaing-opers thead tr th:eq(3)').removeClass('d-none');
    $('#datatable-campaing-opers').css('font-size','15px');
    $('#modalChangeOperHeading').css('font-size','17px');
    $('#campaingModalLabel').css('font-size','20px');
    $('#campaingModalDialog').addClass('modal-lg');
    
    // var oper_num_selected = $('#exampleModal select option:selected').text();
    // var oper_num_change = $('#changeOperName').attr('data-oper-change');
    // var campaign_id = $('#changeOperName').attr('data-campaing');
    // console.log(oper_num_selected, oper_num_change, campaign_id, 'changeOperButton');
}
function resetCampaingModal (){
    $('#datatable-campaing-opers thead tr th:eq(3)').addClass('d-none');
    $('#datatable-campaing-opers').css('font-size','');
    $('#modalChangeOperHeading').css('font-size','');
    $('#campaingModalLabel').css('font-size','');
    $('#campaingModalDialog').removeClass('modal-lg');

    
}
