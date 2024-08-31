<?php

namespace frontend\assets;


use yii\web\AssetBundle;

class CampaignAsset extends AssetBundle {
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
        'plugins/flatpickr/flatpickr.min.css',
        'plugins/c3/c3.min.css',
        'plugins/datatables/dataTables.bootstrap4.min.css',
        'plugins/datatables/buttons.bootstrap4.min.css',
        'plugins/datatables/fixedHeader.dataTables.min.css',
        'plugins/datatables/fixedColumns.bootstrap4.min.css',
        'css/operator/addOperator.css',
        'css/campaign/index.css',
        'plugins/parsleyjs/parsley.css',
        'plugins/datatables/jquery.dataTables.min.css',
        'plugins/multiselect/css/bootstrap-multiselect.css'


    ];
    public $js = [
        'plugins/datatables/jquery.dataTables.min.js',
        'plugins/datatables/dataTables.bootstrap4.min.js',
        'plugins/datatables/dataTables.buttons.min.js',
        'plugins/datatables/buttons.bootstrap4.min.js',
        'plugins/datatables/jszip.min.js',
        'plugins/datatables/pdfmake.min.js',
        'plugins/datatables/vfs_fonts.js',
        'plugins/datatables/buttons.print.min.js',
        'plugins/datatables/buttons.colVis.min.js',
        'plugins/datatables/dataTables.responsive.min.js',
        'plugins/datatables/responsive.bootstrap4.min.js',
        'plugins/datatables/dataTables.fixedHeader.min.js',
        'plugins/datatables/dataTables.fixedColumns.min.js',
        'plugins/d3/d3.min.js',
        'plugins/c3/c3.min.js',
        'plugins/c3-chart-init.js',
        'plugins/flatpickr/flatpickr.min.js',
        'plugins/datatables/buttons.html5.min.js',
        'plugins/multiselect/js/bootstrap-multiselect.js',
        'plugins/parsleyjs/parsley.min.js',
        'js/general-report/app.js',
        'plugins/multiselect/js/popper.min.js',
        'js/operator/addoperator.js',
        'js/campaign/index.js'
    ];
    public $depends = [
        'frontend\assets\AppAsset'
    ];
}