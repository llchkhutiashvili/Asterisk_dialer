
$(document).ready(function() {



    var lostcalls_table = $('#datatable-lostcalls').DataTable({
        dom: "<'row'<'col-sm-12 col-md-6'B><'col-sm-12 col-md-6'f>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-3 pt-1'l><'col-sm-12 col-md-6 text-center'i><'col-sm-12 col-md-3'p>>",
        lengthChange: true,
        // buttons: ['copy', 'excel', 'colvis'],
        buttons: [
            //{ extend: 'copy', text:'კოპირება', className: 'btn-primary' },
            { extend: 'excel',title:'Crm',text:'ექსელი <i class="mdi mdi-download"></i>', className: 'btn-primary waves-effect ' },
        ],

        "paging":         true,
        fixedHeader: true
    });

    var sla_table = $('#datatable-sla').DataTable({
        dom: "<'row'<'col-sm-12 col-md-6'B><'col-sm-12 col-md-6'f>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-3 pt-1'l><'col-sm-12 col-md-6 text-center'i><'col-sm-12 col-md-3'p>>",
        lengthChange: true,
        // buttons: ['copy', 'excel', 'colvis'],
        buttons: [
            //{ extend: 'copy', text:'კოპირება', className: 'btn-primary' },
            { extend: 'excel',title:'Crm',text:'ექსელი <i class="mdi mdi-download"></i>', className: 'btn-primary waves-effect ' },
        ],

        "paging":         true,
        fixedHeader: true
    });
    var repeated_table = $('#datatable-repeated').DataTable({
        dom: "<'row'<'col-sm-12 col-md-6'B><'col-sm-12 col-md-6'f>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-3 pt-1'l><'col-sm-12 col-md-6 text-center'i><'col-sm-12 col-md-3'p>>",
        lengthChange: true,
        // buttons: ['copy', 'excel', 'colvis'],
        buttons: [
            //{ extend: 'copy', text:'კოპირება', className: 'btn-primary' },
            { extend: 'excel',title:'Crm',text:'ექსელი <i class="mdi mdi-download"></i>', className: 'btn-primary waves-effect ' },
        ],

        "paging":         true,
        fixedHeader: true
    });
    var not_working = $('#datatable-not_working').DataTable({
        dom: "<'row'<'col-sm-12 col-md-6'B><'col-sm-12 col-md-6'f>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-3 pt-1'l><'col-sm-12 col-md-6 text-center'i><'col-sm-12 col-md-3'p>>",
        lengthChange: true,
        // buttons: ['copy', 'excel', 'colvis'],
        buttons: [
            //{ extend: 'copy', text:'კოპირება', className: 'btn-primary' },
            { extend: 'excel',title:'Crm',text:'ექსელი <i class="mdi mdi-download"></i>', className: 'btn-primary waves-effect ' },
        ],

        "paging":         true,
        fixedHeader: true
    });
    var interactive = $('#datatable-interactive').DataTable({
        dom: "<'row'<'col-sm-12 col-md-6'B><'col-sm-12 col-md-6'f>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-3 pt-1'l><'col-sm-12 col-md-6 text-center'i><'col-sm-12 col-md-3'p>>",
        lengthChange: true,
        // buttons: ['copy', 'excel', 'colvis'],
        buttons: [
            //{ extend: 'copy', text:'კოპირება', className: 'btn-primary' },
            { extend: 'excel',title:'Crm',text:'ექსელი <i class="mdi mdi-download"></i>', className: 'btn-primary waves-effect ' },
        ],

        "paging":         true,
        fixedHeader: true
    });

    var waittime = $('#datatable-waittime').DataTable({
        dom: "<'row'<'col-sm-12 col-md-6'B><'col-sm-12 col-md-6'f>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-3 pt-1'l><'col-sm-12 col-md-6 text-center'i><'col-sm-12 col-md-3'p>>",
        lengthChange: true,
        // buttons: ['copy', 'excel', 'colvis'],
        buttons: [

              { extend: 'excel',title:'Crm',text:'ექსელი <i class="mdi mdi-download"></i>', className: 'btn-primary waves-effect ' },
        ],

        "paging":         true,
        fixedHeader: true
    });
    var rushhours = $('#datatable-rushhours').DataTable({
        dom: "<'row'<'col-sm-12 col-md-6'B><'col-sm-12 col-md-6'f>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-3 pt-1'l><'col-sm-12 col-md-6 text-center'i><'col-sm-12 col-md-3'p>>",
        lengthChange: true,
        // buttons: ['copy', 'excel', 'colvis'],
        buttons: [

            { extend: 'excel',title:'Crm',text:'ექსელი <i class="mdi mdi-download"></i>', className: 'btn-primary waves-effect ' },
        ],

        "paging":         true,
        fixedHeader: true
    });

    waittime.buttons().container()
        .appendTo('#datatable-rushhours_wrapper .col-md-6:eq(0)');
    waittime.buttons().container()
        .appendTo('#datatable-waittime_wrapper .col-md-6:eq(0)');
    interactive.buttons().container()
        .appendTo('#datatable-interactive_wrapper .col-md-6:eq(0)');
    not_working.buttons().container()
        .appendTo('#datatable-not_working_wrapper .col-md-6:eq(0)');
    repeated_table.buttons().container()
        .appendTo('#datatable-repeated_wrapper .col-md-6:eq(0)');
    sla_table.buttons().container()
        .appendTo('#datatable-sla_wrapper .col-md-6:eq(0)');
    lostcalls_table.buttons().container()
        .appendTo('#datatable-lostcalls_wrapper .col-md-6:eq(0)');
} );