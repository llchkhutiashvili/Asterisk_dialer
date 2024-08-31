<?php
namespace common;

use yii\web\AssetBundle;

class CommonAssets extends AssetBundle {

    public $sourcePath = '@common/assets';

    public $css = [
        'css/metismenu.min.css',
        'css/icons.css',
        'css/style.css',
        'css/font-awesome.css',
      /*  'fonts/stylesheet.css'*/
        'plugins/pnotify/PNotify.css',
        'plugins/pnotify/BrightTheme.css'
    ];

    public $js = [
        'js/metisMenu.min.js',
        'js/jquery.slimscroll.js',
        'js/waves.min.js',
        'plugins/pnotify/PNotify.js'

    ];

    public $depends = [
        'yii\web\YiiAsset',
        'yii\bootstrap4\BootstrapAsset',
    ];

}