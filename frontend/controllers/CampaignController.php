<?php

namespace frontend\controllers;

use api\actions\actionsAction;
use api\actions\CampaingAction;
use api\actions\LanguagesAction;
use api\actions\SettingsAction;
use api\models\database\Campaing;
use api\models\database\CampaingCalls;
use api\models\database\CampaingStat;
use api\models\response\Result;
use common\CQController;
use frontend\models\LangPack;
use SebastianBergmann\CodeCoverage\TestFixture\C;
use Yii;
use yii\filters\AccessControl;
use yii\helpers\Json;
use yii\data\Pagination;
use yii\helpers\VarDumper;
use yii\widgets\LinkPager;
class CampaignController extends CQController
{
    public function beforeAction($action)
    {
        $this->enableCsrfValidation = false;
        return parent::beforeAction($action);
    }


    public function actionIndex()
    {
        return $this->render("index");
    }

    public function actionCampaignList()
    {
        $queue = Yii::$app->user->identity->queue;
        $active = Yii::$app->request->post("active");
        return Json::encode(["data" => CampaingAction::campaingList($queue, $active)]);
    }
    public function actionSaveSetting()
    {
        $start = Yii::$app->request->post("start");
        $end = Yii::$app->request->post("end");
        $count = Yii::$app->request->post("count");
        $setting = [
            "start"=>$start,
            "end"=>$end,
            "count"=>$count,

        ];
        if(file_put_contents(\Yii::getAlias("@frontend")."/web/dailerSettings.json", json_encode($setting,JSON_UNESCAPED_UNICODE)))
            return Result::SUCCESS;
            else return Result::FAILURE;
    }

    public function actionAdd()
    {
        $queue = Yii::$app->user->identity->queue;
        $campaing_name = Yii::$app->request->post("campaignName");
        $origFile = Yii::$app->request->post("filename");
        $calls_per_minute = Yii::$app->request->post("CPM");
        $start_hour = Yii::$app->request->post("campaing_start_time");
        $end_hour = Yii::$app->request->post("campaing_end_time");
        $campaing_id = CampaingAction::addCampaing($queue, $campaing_name,$origFile,$calls_per_minute,$start_hour,$end_hour);
        $folder = "campaing" . $campaing_id;
        if ($campaing_id > 0) {

            if (!file_exists($folder)) {
                mkdir("uploads/" . $folder, 0777, true);
            }
            $str_result = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

            $name = substr(str_shuffle($str_result), 0, 15);
            $name_audio = substr(str_shuffle($str_result), 0, 15);


            if (move_uploaded_file($_FILES['xlsx']['tmp_name'], "uploads/" . $folder . "/" . $name . "." . pathinfo($_FILES['xlsx']['name'], PATHINFO_EXTENSION))) {
                $xlsx_url = "uploads/" . $folder . "/" . $name . "." . pathinfo($_FILES['xlsx']['name'], PATHINFO_EXTENSION);
            }

            if (move_uploaded_file($_FILES['audio']['tmp_name'], "/var/lib/asterisk/sounds/custom/". $name . "." . pathinfo($_FILES['audio']['name'], PATHINFO_EXTENSION))) {
                $audio = "uploads/" . $folder . "/" . $name . "." . pathinfo($_FILES['audio']['name'], PATHINFO_EXTENSION);
            }

            $camp = Campaing::find()->where(["id" => $campaing_id])->one();
            $camp->filename = $name;
            $camp->save();
            return CampaingAction::saveNumbers($xlsx_url, $campaing_id);
        }
    }

    public function actionDetail()
    {
        $id = Yii::$app->request->post("id");
        $details=campaingAction::getCampaingCallsDetail($id);
        $data=json_encode(["data"=>$details]);
        return $data;

    }

    public function actionStat()
    {
        $id = Yii::$app->request->post("id");
        $data=CampaingStat::find()->where(["camp_id"=>$id])->asArray()->all();
        foreach ($data as $d) {
            $connection = Yii::$app->db2;
            $command = $connection->createCommand('SELECT * FROM table_name');
            $data = $command->queryAll();
            $d["number"];
            
        }
        return ;
    }
    public function actionSetting()
    {
        $settings = file_get_contents(\Yii::getAlias("@frontend")."/web/dailerSettings.json");

        return $settings;
    }


    public function actionDeleteCampaign()
    {
        $queue = Yii::$app->user->identity->queue;
        $number = Yii::$app->request->post("number");
        return CampaingAction::deleteCampaing($queue, $number);
    }
    public function actionActiveCampaign()
    {

        $id = Yii::$app->request->post("id");
        $flag = Yii::$app->request->post("flag");
        return CampaingAction::activeCampaing($id, $flag);
    }


    public function actionAddBlackList()
    {
        $queue = Yii::$app->user->identity->queue;
        $number = Yii::$app->request->post("number");
        return SettingsAction::addBlackList($queue, $number);
    }

    public function actionDeleteWhiteList()
    {
        $queue = Yii::$app->user->identity->queue;
        $number = Yii::$app->request->post("number");
        return SettingsAction::deleteWhiteList($queue, $number);
    }

    public function actionDeleteBlackList()
    {
        $queue = Yii::$app->user->identity->queue;
        $number = Yii::$app->request->post("number");
        return SettingsAction::deleteBlackList($queue, $number);
    }

    public function actionBlackList()
    {
        $queue = Yii::$app->user->identity->queue;
        $active = Yii::$app->request->post("active");
        return Json::encode(["data" => SettingsAction::BlackList($queue, $active)]);
    }

    public function actionOutVoiceSettings()
    {
        $queue = Yii::$app->user->identity->queue;
        return Json::encode(["data" => SettingsAction::outVoiceSettings()]);
    }

    public function actionOutVoiceNumbers()
    {

        $queue = Yii::$app->user->identity->queue;
        return Json::encode(["data" => SettingsAction::outVoiceNumbers($queue)]);
    }

    public function actionOutVoiceAddNumber()
    {
        $queue = Yii::$app->user->identity->queue;
        $number = Yii::$app->request->post("number");
        return SettingsAction::outVoiceAddNumber($number, $queue);
    }

    public function actionOutVoiceDeleteNumber()
    {
        $id = Yii::$app->request->post("id");
        return SettingsAction::outVoiceDeleteNumber($id);
    }

    public function actionInVoiceSettings()
    {

        return Json::encode(["data" => SettingsAction::inVoiceSettings()]);
    }

    public function actionUpdateOutVoiceSettings()
    {
        $id = Yii::$app->request->post("id");
        $int = Yii::$app->request->post("int");
        $ext = Yii::$app->request->post("ext");
        $status = Yii::$app->request->post("status");
        $repeat = Yii::$app->request->post("repeat");
        $file = Yii::$app->request->post("file");
        return SettingsAction::updateOutVoiceSettings($id, $status, $int, $ext, $repeat, $file);
    }


    public function actionUpdateInVoiceSettings()
    {
        $id = Yii::$app->request->post("id");
        $file = Yii::$app->request->post("file");
        return SettingsAction::updateInVoiceSettings($id, $file);
    }

    public function actionResetInVoice()
    {
        $id = Yii::$app->request->post("id");
        return SettingsAction::resetInVoiceSettings($id);
    }


    public function actionUploadAudio()
    {

        $str_result = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

        $name = substr(str_shuffle($str_result), 0, 15);


        if (move_uploaded_file($_FILES['file']['tmp_name'], 'uploads/' . $name . "." . pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION))) {

            $web_page_to_send = "http://10.45.68.128/upload/index.php";

            $file_name_with_full_path = 'uploads/' . $name . "." . pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);

            $post_request = array(
                "sender" => "senfile",
                "file" => curl_file_create($file_name_with_full_path) // for php 5.5+
            );

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $web_page_to_send);
            curl_setopt($ch, CURLOPT_POST, 0);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $post_request);
            curl_exec($ch);
            curl_close($ch);

        }


    }

    public function actionUpload()
    {
        $campaing_id = Yii::$app->request->post("campaing_id");

        $str_result = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

        $name = substr(str_shuffle($str_result), 0, 15);

        if (isset($_FILES['file1'])) {
        } else {
        }


        if (move_uploaded_file($_FILES['file1']['tmp_name'],' @web/uploads/' . $name . "." . pathinfo($_FILES['file']['name']))) {


            $file_name_with_full_path = $name . "." . pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);


            $reader = new \PhpOffice\PhpSpreadsheet\Reader\Xlsx();
            $reader->setReadDataOnly(true);
            $sheetData = $reader->load("uploads/" . $file_name_with_full_path)->getActiveSheet()->toArray();
            unset($sheetData[0]);
            $d = [];
            foreach ($sheetData as $s) {
                array_push($d, ["number" => $s[0]]);
            }

            return json_encode(["filename" => $file_name_with_full_path, "data" => $d]);


        }


    }

    public function actionSaveNumber()
    {
        $campaing_id = Yii::$app->request->post("campaing_id");
        $filename = Yii::$app->request->post("filename");
        return CampaingAction::saveNumbers($filename, $campaing_id);

    }
    public function actionChangeOper()
    {   $changedOpers = Yii::$app->request->post("changedOpers");
        return CampaingAction::changeOper($changedOpers);

    }

    public function actionGetCampaingOpers()
    {
        $campaing_id = Yii::$app->request->post("campaing_id");
        return Json::encode(["opers"=>CampaingAction::getCampaingOperators($campaing_id)]);
    }
    public function actionGetActiveOperators()
    {
        return Json::encode(["activeOpers"=>CampaingAction::getActiveOperators()]);
    }



}
