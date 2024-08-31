<?php
namespace common;

use yii\web\Controller;

class CQController extends Controller {
    public function beforeAction($action) {

        $this->enableCsrfValidation = false; // Disable CSRF check
        if (\Yii::$app->session->has('lang')) {
            \Yii::$app->language = \Yii::$app->session->get('lang');
        } else {

            \Yii::$app->language = 'ka-GE';
        }
        return parent::beforeAction($action);
    }
}