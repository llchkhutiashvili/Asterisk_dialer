$(document).ready(function () {

    $('#datatable-buttons tbody, #datatable-detail tbody').on( 'click', 'tr', function () {
        $('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    });
    // $.fn.dataTable.ext.errMode = 'none';
    $.ajax({
        url: phpData.GetOper,
        type: 'post',
        dataType: 'json',
        data: {
            queue: null
        },
        success: function (result) {
            $('#oper_nums').multiselect('dataprovider', result);
        }

    })
    

    $(document).on("change","#queue", function(){
        $.ajax({
            url: phpData.GetOper,
            type: 'post',
            dataType: 'json',
            data: {
                queue: $(this).val()
            },
            success: function (result) {
                $('#oper_nums').multiselect('dataprovider', result);
            }

        })
    });
    $('#oper_nums').multiselect('setOptions', {
        enableFiltering: true,
        includeSelectAllOption: true,
        maxHeight: 400,
        nonSelectedText: 'აირჩიეთ მხარდაჭერის მენეჯერი',
        allSelectedText: 'მონიშნულია ყველა',
        numberDisplayed: 1,
        nSelectedText: ' - მხარდაჭერის მენეჯერი',
        filterPlaceholder: 'ფილტრი',
        selectAllText: 'ყველას მონიშვნა',
        optionLabel: function(element) {
            return $(element).html() + ' - ' + $(element).val();
        }
    });
    $('#oper_nums').multiselect('rebuild');

    $(document).on("click",".showDetail",function () {
        $("#statDetailBinder").fadeIn();
        var oper_num = $(this).data("oper_num");
        var oper_name = $(this).data("oper_name");
        $("#detail_oper_name").html(oper_name+", თარიღი ["+$("#startDate").val()+"]")



        $('#datatable-detail').DataTable().clear();
        $('#datatable-detail').DataTable().destroy();
        table_detail = $('#datatable-detail').DataTable({
            ajax: {
                url: phpData.detail,
                type: "POST",
                dataSrc : 'data',
                data: {
                    day:  $("#startDate").val(),
                    queue:  $("#queue").val(),
                    oper_num: oper_num,
                    oper_name: oper_name

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
                {
                    "render": function ( data, type, row, meta )
                    {
                        var tt = ""
                        if (row.start_action == "სისტემაში შესვლა" && row.state==1)
                            tt = "(სისტემაში შესვლა)";
                         if (row.end_action == "გასვლა" && row.state==2)
                            tt = "(სისტემიდან გასვლა)";
                        return   state_name(row.status) +" "+ (row.direction == 1 ? "შემომავალი " :  row.direction == 2 ? "გამავალი " : "" ) + "  " + status_name(row.state) + "   " + tt
                    }

                },

                { data: "start_time" },
                { data: "NUMBER" },
                {
                    "render": function ( data, type, row, meta )
                    {
                        return (row.status == "ANSWERED" || row.status == "answered")? secondsToHms(row.duration):""
                    }

                },




            ],
            ordering:false,
            lengthChange: true,
            buttons: [
                { extend: 'csv',title:'Timesheet Detail',text:'ექსელი <i class="mdi mdi-download"></i>', className: 'btn-primary border waves-effect ' },
                {extend: 'colvis', className: 'btn-primary waves-effect border' },
            ],
            paging: true,
            fixedHeader: true
        });
        table_detail.buttons().container()
            .appendTo('#datatable-detail_wrapper .col-md-6:eq(0)');
    });

    var table = $('#datatable-buttons').DataTable({
        ajax: {
            url: phpData.getTimesheet,
            type: "POST",
            dataSrc: 'data',
            data: {
                day: function () {
                    return $("#startDate").val()
                },
                queue: function () {
                    return $("#queue").val()
                },
                oper_num: function() {
                    return  $("#oper_nums").val() == "" ? null : $("#oper_nums").val()
                },

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
            zeroRecords: 'მონაცემები არ არის',
            paginate: {
                next: "შემდეგი",
                previous: "წინა"
            }
        },
        dom: "<'row'<'col-sm-12 col-md-6'B><'col-sm-12 col-md-6'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-3 pt-1'l><'col-sm-12 col-md-6 text-center'i><'col-sm-12 col-md-3'p>>",

        columns: [
            {data: "oper_name"},
            {data: "oper_num"},

            {data: "start_time"},
            {
                "render": function ( data, type, row, meta )
                {
                    return row.end_time == 0 ? "მიმდინარე" :  row.end_time
                }

            },
            {
                "render": function ( data, type, row, meta )
                {
                    // const date1 = new Date(row.start_time);
                    // const date2 = row.end_time==0 ? new Date():new Date(row.end_time);
                    // const diffTime = Math.abs(date2 - date1);
                    // const diffDays = Math.ceil(diffTime/1000);
                    return secondsToHms(row.i*1+row.o*1+row.c*1+row.p*1+row.e*1);
                }
            },
            {
                "render": function ( data, type, row, meta )
                {
                    return (row.in_tt*1+row.o_tt*1)>0?secondsToHms(row.in_tt*1+row.o_tt*1):"00:00:00"
                }

            },
            {
                "render": function ( data, type, row, meta )
                 {  // const date1 = new Date(row.start_time);
                //     const date2 = row.end_time==0 ? new Date():new Date(row.end_time);
                //     const diffTime = Math.abs(date2 - date1);
                //     const diffDays = Math.ceil(diffTime/1000);

                     return (row.in_tt*1+row.o_tt*1)>0?(((row.in_tt*1+row.o_tt*1)/(row.i*1+row.o*1+row.c*1+row.p*1+row.e*1))*100).toFixed(3)+"%":"0.0%"
                }
            },
            {
                "render": function ( data, type, row, meta )
                {
                    return secondsToHms(row.hold_time)
                }

            },
            {
                "render": function ( data, type, row, meta )
                {
                    return secondsToHms(row.i)
                }

            },
            {
                "render": function ( data, type, row, meta )
                {
                    return (row.i>0?(row.i*100/(row.i*1+row.o*1+row.c*1+row.p*1+row.e*1)).toFixed(1)+"%":"0%")
                }

            },
            {
                "render": function ( data, type, row, meta )
                {
                    return secondsToHms(row.o)
                }

            },
            {
                "render": function ( data, type, row, meta )
                {
                    return (row.o>0?(row.o*100/(row.i*1+row.o*1+row.c*1+row.p*1+row.e*1)).toFixed(1)+"%":"0%")
                }
            },
            {
                "render": function ( data, type, row, meta )
                {
                    return secondsToHms(row.p)
                }

            },
            {
                "render": function ( data, type, row, meta )
                {
                    return (row.p>0?(row.p*100/(row.i*1+row.o*1+row.c*1+row.p*1+row.e*1)).toFixed(1)+"%":"0%")
                }

            },
            {
                "render": function ( data, type, row, meta )
                {
                    return secondsToHms(row.c)
                }

            },
            {
                "render": function ( data, type, row, meta )
                {
                    return (row.c>0?(row.c*100/(row.i*1+row.o*1+row.c*1+row.p*1+row.e*1)).toFixed(1)+"%":"0%")
                }

            },
            {
                "render": function ( data, type, row, meta )
                {
                    return secondsToHms(row.e)
                }

            },
            {
                "render": function ( data, type, row, meta )
                {
                    return (row.e>0?(row.e*100/(row.i*1+row.o*1+row.c*1+row.p*1+row.e*1)).toFixed(1)+"%":"0%")
                }

            },
            {data: "crm"},
            {data: "wday"},
            {data: "forward"},
            {data: "in_a"},
            {data: "in_m"},
            {data: "in_m_u"},
            {
                "render": function ( data, type, row, meta )
                {
                    return (parseInt(row.in_a)+parseInt(row.in_m))
                }

            },
            {
                "render": function ( data, type, row, meta )
                {
                    return (parseInt(row.in_a)>0 ? (parseInt(row.in_a)*100/(parseInt(row.in_a)+parseInt(row.in_m))).toFixed(1):0)+"%"
                }

            },
            {
                "render": function ( data, type, row, meta )
                {
                    return secondsToHms(row.in_tt)
                }

            },
            {
                "render": function ( data, type, row, meta )
                {
                    return secondsToHms(row.in_tmin)
                }

            },
            {
                "render": function ( data, type, row, meta )
                {
                    return secondsToHms(row.in_tt>0?(row.in_tt/row.in_a):0)
                }

            },
            {
                "render": function ( data, type, row, meta )
                {
                    return secondsToHms(row.in_tmax)
                }

            },
            {
                "render": function ( data, type, row, meta )
                {
                    return secondsToHms(row.w_min)
                }

            },
            {
                "render": function ( data, type, row, meta )
                {
                    return secondsToHms(row.w_avg)
                }

            },
            {
                "render": function ( data, type, row, meta )
                {
                    return secondsToHms(row.w_max)
                }

            },
            {data: "o_an"},
            {data: "o_un"},
            {
                "render": function ( data, type, row, meta )
                {
                    return (parseInt(row.o_an)+parseInt(row.o_un))
                }

            },
            {
                "render": function ( data, type, row, meta )
                {
                    return (parseInt(row.o_an)>0 ? parseInt(row.o_an)*100/(parseInt(row.o_an)+parseInt(row.o_un)):0).toFixed(1)+"%"
                }

            },
            {
                "render": function ( data, type, row, meta )
                {
                    return secondsToHms(row.o_tt)
                }

            },
            {
                "render": function ( data, type, row, meta )
                {
                    return secondsToHms(row.o_ft);
                }

            },
            {
                "render": function ( data, type, row, meta )
                {
                    return secondsToHms(row.o_tmin)
                }

            },
            {
                "render": function ( data, type, row, meta )
                {
                    return secondsToHms(row.o_tavg)
                }

            },
            {
                "render": function ( data, type, row, meta )
                {
                    return secondsToHms(row.o_tmax)
                }

            },
            {
                "render": function ( data, type, row, meta )
                {
                    return "<i class='mdi mdi-details showDetail pointer font-24 text-warning'   data-oper_name='"+row.oper_name+"' data-oper_num='"+row.oper_num+"'></i>";
                }

            },
        ],
        order: [[0, "desc"]],
        scrollX: true,
        fixedColumns: {
            leftColumns: 2
        },
        processing: true,
        lengthChange: true,
        buttons: [
            {
                extend: 'csv',
                title: 'Timesheet',
                text: 'ექსელი <i class="mdi mdi-download"></i>',
                className: 'btn-primary waves-effect border'
            },
            {extend: 'colvis', className: 'btn-primary waves-effect border' },
        ],
        paging: true,
        fixedHeader: false
    });
    table.buttons().container()
        .appendTo('#datatable-buttons_wrapper .col-md-6:eq(0)');

    $(document).on("click", "#fidnBtn", function (){
        if ($("#startDate").val()=="")
            PNotify.notice({
                title: 'მიუთითეთ თარიღი',
                delay: 3000
            });
        else
            $('#datatable-buttons').DataTable().ajax.reload();

    })
})


// function secondsToHms(d) {
//     d = Math.round(Number(d));
//
//     var h = Math.floor(d / 3600);
//     var m = Math.floor(d % 3600 / 60);
//     var s = Math.floor(d % 3600 % 60);
//     return (h< 10? "0"+h:h) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
// }

function converToDate (timestamp) {

    var date = new Date(timestamp * 1000),
        datevalues = date.getFullYear()+"-"+date.getMonth()+1+"-"+(date.getDate()<10?"0"+date.getDate():date.getDate())+" "
            +(date.getHours()<10?"0"+date.getHours():date.getHours())+":"+(date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes())+":"+(date.getSeconds()<10?"0"+date.getSeconds():date.getSeconds());
    return datevalues;
}

function state_name(key) {
    var status_name = "";
    switch (key) {
        case 'incoming':
            status_name = "შემომავალი"
            break;
        case 'outgoing':
            status_name = "გამავალი"
            break;
        case 'explore':
            status_name = "მოკვლევა"
            break;
        case 'chat':
            status_name = "ჩათი"
            break;
        case 'paused':
            status_name = "შესვენება"
            break;
        case 'NO ANSWER':
            status_name = "გაცდენილი"
            break;
        case 'answered':
            status_name = "ნაპასუხები"
            break;
        case 'ANSWERED':
            status_name = "ნაპასუხები"
            break;
        case 'BUSY':
            status_name = "დაკავება"
            break;
        case 'RINGNOANSWER':
            status_name = "გაცდენილი"
            break;
        default:   status_name = "---"
    }

    return status_name;
}

function status_name(key) {
    var status_name = "";
    switch (key) {
        case '1':
            status_name = "დაწყება"
            break;
        case '2':
            status_name = "დასრულება"
            break;
        case '3':
            status_name = "ზარი"
            break;
        case '4':
            status_name = "ზარი"
            break;
        case '5':
            status_name = "მიმდინარე"
            break;
        default:   status_name = ""
    }

    return status_name;
}

function secondsToHms(d) {
    d = Math.round(Number(d));

    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    return  h + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
}