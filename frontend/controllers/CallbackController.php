<?php
namespace frontend\controllers;

use api\actions\actionsAction;
use api\actions\AsteriskmanagerAction;
use api\actions\UserAction;
use api\models\database\Callback;
use api\models\database\CampaingCalls;
use api\models\response\Result;
use common\CQController;
use frontend\models\ResendVerificationEmailForm;
use frontend\models\VerifyEmailForm;
use Yii;
use yii\base\InvalidArgumentException;
use yii\helpers\Json;
use yii\web\BadRequestHttpException;
use yii\web\Controller;
use yii\filters\VerbFilter;
use yii\filters\AccessControl;
use common\models\LoginForm;
use frontend\models\PasswordResetRequestForm;
use frontend\models\ResetPasswordForm;
use frontend\models\SignupForm;
use frontend\models\ContactForm;

/**
 * Site controller
 */
class CallbackController extends CQController
{

    public function actionIndex() {



        $id =  Yii::$app->request->get("id");
        $queue =  Yii::$app->request->get("queue");
        actionsAction::updateCallback($queue,$id);
    }

    public function actionGetNumbers() {
        $day = Yii::$app->request->post("day");
        $result = actionsAction::getCallbackNumbers($day);
        return Json::encode(["data"=>$result]);

    }

    public function actionCall() {
        $id = Yii::$app->request->post("id");
        $callback = Callback::find()->where(["id"=>$id])->one();
        if ($callback["try"] == 0 || $callback["oper_num"] == Yii::$app->user->identity->oper_num) {

            $callback->try +=1;
            $callback->oper_num = Yii::$app->user->identity->oper_num;
            $callback->oper_name = Yii::$app->user->identity->first_name;
            $callback->calldate = date("Y-m-d H:i:s");
            $callback->save();

            return Result::SUCCESS;
        }
        else if ($callback["oper_num"] != Yii::$app->user->identity->oper_num && $callback["calldate"]<date("Y-m-d h:i:s", strtotime("-5 minutes"))) {

            $callback->try +=1;
            $callback->oper_num = Yii::$app->user->identity->oper_num;
            $callback->oper_name = Yii::$app->user->identity->first_name;
            $callback->calldate = date("Y-m-d H:i:s");
            $callback->save();
            return Result::SUCCESS;
        } else
            return "შესაბამის ნომერზე სხვა მხარდაჭერის მენეჯერი ცდილობს დარეკვას";


    }

    public function actionGetCampaign() {
        $campaign = Yii::$app->request->post("campaign");
        Yii::trace($campaign, 'kampniaaaadz');
        $result = actionsAction::getCampaignNumbers($campaign);
        Yii::trace($result, 'ESAARESULT');
        Yii::trace(Json::encode(["data"=>$result]),"jSONAARRAAY");
        return Json::encode(["data"=>$result]);

    }
    public function actionCallToCampaing(){
        $id = Yii::$app->request->post("id");
        $callback = CampaingCalls::find()->where(["id"=>$id])->one();
        Yii::trace($callback, 'CALLBACK');
        Yii::trace($callback["try"], 'CALLBACKtry');

        if ($callback["try"] == 0 || $callback["oper_num"] == Yii::$app->user->identity->oper_num) {
            $callback->try +=1;

            $callback->oper_num = (string)Yii::$app->user->identity->oper_num;
            $callback->oper_name = Yii::$app->user->identity->first_name;
            $callback->save();
            Yii::trace($callback->errors, 'callerorsss');
            Yii::trace($callback["try"], 'newtry');

            return Result::SUCCESS;
        }
        else if ($callback["oper_num"] != Yii::$app->user->identity->oper_num && $callback["calldate"]<date("Y-m-d h:i:s", strtotime("-5 minutes"))) {

            $callback->try +=1;
            $callback->oper_num = Yii::$app->user->identity->oper_num;
            $callback->oper_name = Yii::$app->user->identity->first_name;
            $callback->calldate = date("Y-m-d H:i:s");
            $callback->save();
            return Result::SUCCESS;
        } else
            return "შესაბამის ნომერზე სხვა მხარდაჭერის მენეჯერი ცდილობს დარეკვას";

        

    }
}
