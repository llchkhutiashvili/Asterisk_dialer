<?php
namespace frontend\controllers;

use api\actions\actionsAction;
use api\actions\LanguagesAction;
use api\actions\UserAction;
use api\models\database\Queues;
use common\CQController;
use frontend\models\LangPack;
use Yii;
use yii\filters\AccessControl;
use yii\helpers\Json;
use yii\data\Pagination;
use yii\widgets\LinkPager;

class ActionsController extends CQController {

    public function behaviors() {
        return [
            'access' => [
                'class' => AccessControl::className(),
                'rules' => [
                    [
                        'allow' => true,
                        'roles' => ['@']
                    ]
                ]
            ]
        ];
    }
    public function actionChangePassword() {
        $password = Yii::$app->request->post("newpassword");
        return actionsAction::changePass($password);

    }
    public function actionCreateOperator() {

        $allow_queue = Yii::$app->request->post("allow_queue");
        $fullname = trim(Yii::$app->request->post("fullname"));
        $queue = trim(Yii::$app->request->post("queue"));
        $username = trim(Yii::$app->request->post("username"));
        $oper_num = trim(Yii::$app->request->post("oper_num"));
        $role = trim(Yii::$app->request->post("role"));
        $user_id = trim(Yii::$app->request->post("user_id"));
        $role_name = trim(Yii::$app->request->post("role_name"));
        $penalty = trim(Yii::$app->request->post("penalty"));
        $chat_name = trim(Yii::$app->request->post("chat_name"));
        $language = trim(Yii::$app->request->post("language"));
        $password = Yii::$app->request->post("password");

        return actionsAction::createOperator($fullname, $queue, $username, $oper_num, $role, $allow_queue, $user_id, $role_name, $penalty,$chat_name, $language,$password);

    }

    public function actionGetOperators() {
        return json_encode(["data"=> UserAction::getUserByAllowQueue() ]);
    }

    public function actionDeleteOperator() {
        $user_id = Yii::$app->request->post("user_id");
       return actionsAction::deleteOperator($user_id);
    }
}