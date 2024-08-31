<?php
namespace api\actions;


use api\models\database\Blacklist;
use api\models\database\Callback;
use api\models\database\Campaing;
use api\models\database\CampaingCalls;
use api\models\database\Crm;
use api\models\database\Crmusers;
use api\models\database\InVoiceSettings;
use api\models\database\News;
use api\models\database\OutVoiceSettings;
use api\models\database\OutVoiceWhitelist;
use api\models\database\Reason;
use api\models\database\Snooze;
use api\models\database\Status;
use api\models\database\Users;
use api\models\database\userToCampaign;
use api\models\database\Viplist;
use api\models\database\Whitelist;
use api\models\response\Result;
use common\models\User;
use PHPUnit\Util\Json;
use Yii;
use yii\rbac\DbManager;


class CampaingAction {

    public static function filter_by_value ($array, $index, $value){
        $newarray = [];
        if(is_array($array) && count($array)>0)
        {
            foreach(array_keys($array) as $key){
                $temp[$key] = $array[$key][$index];

                if ($temp[$key] == $value){
                    $newarray = $array[$key];
                }
            }
        }
        return $newarray;
    }

    public static function getCampaingByUserAction() {

        $sql = "select c.id, c.name from users_to_campaign utc 
                inner join campaing c ON c.id = utc.campaign_id
where utc.status = 1 and utc.oper_num = ".\Yii::$app->user->identity->oper_num." ";
        $row = \Yii::$app->db->createCommand($sql)->queryAll(\PDO::FETCH_ASSOC);
        return json_encode(["data"=>$row, "active"=>\Yii::$app->user->identity->campaign_id]);

    }

    public static function campaingList($queue = null, $active = true){

        $white_list = "SELECT * FROM campaing where  status in (1) ";
        $camp = \Yii::$app->db->createCommand($white_list)->queryAll();
        $result = [];
        foreach ($camp as $c) {
            $done = CampaingCalls::find()->where(["campaing_id"=>$c["id"]])->andWhere(["status"=>Status::getPending()])->count();
            $active = CampaingCalls::find()->where(["campaing_id"=>$c["id"]])->andWhere(["status"=>Status::getActive()])->count();
            $oper_nums = CampaingCalls::find()
            ->select('oper_num')
            ->where(["campaing_id" => $c["id"]])
            ->distinct()
            ->orderBy('oper_num ASC')
            ->column();
            Yii::info($oper_nums,"oper_nums".$c["id"]);
            $c["done"] = $done;
            $c["left"] = $active;
            $c["sum"] = $done+$active;
            $c["oper"] = $oper_nums;
            
            $result[] = $c;
        }

        return $result;
    }
    public static function changeOper($changedOpers){
        foreach ($changedOpers as $changedOper) {
            Yii::info($changedOper,"changedOper");
            $sql = 'UPDATE campaing_calls SET oper_num ='.$changedOper[0].' WHERE oper_num ='.$changedOper[1].' AND campaing_id ='.$changedOper[2];
            $command = \Yii::$app->db->createCommand($sql);
            $command->execute();
        }
        // $oper_num_selected,$oper_num_change,$campaing_id
        // $sql = 'UPDATE campaing_calls SET oper_num ='.$oper_num_selected.' WHERE oper_num ='.$oper_num_change.' AND campaing_id ='.$campaing_id;
        // $command = \Yii::$app->db->createCommand($sql);
        // $command->bindValue(':id', $id);
        // $command->execute();
        return Result::SUCCESS;
    }

    public static function addCampaing($queue = null, $name=null, $origFile = null,$calls_per_minute, $start_hour, $end_hour){
        $whitelist = Campaing::find()->where(["name"=>$name])->andWhere(["status"=>Status::getActive()])->one();

        Yii::trace($calls_per_minute,"raa ariss esss?");
        if ($whitelist)
            return Result::NO_PERMISSIONS;
        else {
            $whitelist = new Campaing();
            // $whitelist->queue = $queue;
            $whitelist->name = $name;
            $whitelist->active =2;
            $whitelist->calls_per_minute = (int)$calls_per_minute;
            $whitelist->start_hour = $start_hour;
            $whitelist->end_hour = $end_hour;
            $whitelist->type= "campaing";
            // $whitelist->origname = $origFile;
            $whitelist->added_by  =\Yii::$app->user->identity->first_name;

            $whitelist->save();
            Yii::trace($whitelist->errors,'database errors');
            if($whitelist->save()){
                return $whitelist->id;
            }
            else return Result::FAILURE;
        }
    }


    public static function activeCampaing($id = null, $flag=null){

        if($flag==="true") {
            $active = 1;
            Campaing::updateAll(["active" => $active], ["id" => $id]);
            return Result::SUCCESS;
        }
        else $active = 2;
        Campaing::updateAll(["active"=>$active],["id"=>$id]);
        return Result::SUCCESS;



    }


    public static function deleteCampaing($queue = null, $id=null){
        $whitelist = Campaing::find()->where(["id"=>$id])->one();
        if ($whitelist) {
            $whitelist->status = Status::getDeleted();
            $whitelist->deleted_at = date("Y-m-d H:i:s");
            $whitelist->deleted_by  =\Yii::$app->user->identity->first_name;
            if($whitelist->save())
                return Result::SUCCESS;
            else return Result::FAILURE;
        }
        else {
            return Result::NO_PERMISSIONS;
        }
    }

    public static function saveNumbers($filename = null, $campaingId = null){
        $reader = new \PhpOffice\PhpSpreadsheet\Reader\Xlsx();
        $reader->setReadDataOnly(true);
        $sheetData = $reader->load($filename)->getActiveSheet()->toArray();
        unset($sheetData[0]);
        $userInfo = [];
        $cam = Campaing::find()->where(["id"=>$campaingId])->one();
        $count = 0;
        foreach ($sheetData as $key => $data) {
//            if(!array_key_exists($data[2],$userInfo))
//                $userInfo[$data[2]] = $campaingId;
            if(!$data[0] == null) {
                $campaingCalls = new CampaingCalls();
                $campaingCalls->campaing_id = $campaingId;
                $campaingCalls->campaing_name = $cam->name;
                $campaingCalls->number = (string)$data[0];
//            $campaingCalls->number = (string)$data[1];
//            $campaingCalls->oper_num = (string)$data[2];
                $campaingCalls->calldate = null;
                $campaingCalls->save();
                $count++;
                Yii::trace($campaingCalls->errors, 'saveNumbers errors');
            }
        }

//        return Result::SUCCESS;
        return $count;
    }

    public static function resetInVoiceSettings($id= null) {
        $OutVoiceSettings = InVoiceSettings::find()->where(["id"=>$id])->one();
        if ($OutVoiceSettings) {
            $OutVoiceSettings->in_voice = "silence";

            if($OutVoiceSettings->save())
                return Result::SUCCESS;
            else return Result::FAILURE;
        }
        else {
            return Result::NO_PERMISSIONS;
        }
    }
    public static function getActiveOperators(){

        $users = User::find()->select('oper_num')
        ->innerJoin('auth_assignment', 'auth_assignment.user_id = users.id')
        ->where(['auth_assignment.item_name' => 'role_global_admin'])->andWhere(["status"=>Status::getActive()])->column();
        return $users;

    }
    public static function getCampaingOperators($campaing_id = null){
        $opers = CampaingCalls::find()
        ->select(['oper_num','oper_name'])
        ->where(["campaing_id" => $campaing_id])
        ->groupBy('oper_num')
        ->orderBy('oper_num ASC')
        ->all();    
        Yii::trace($opers,"jsonoperrr");
        return $opers;

    }
    public static function getCampaingCalls($campaing_id = null, $limit = null){
            $numbers = CampaingCalls::find()
                ->select(['number'])
                ->where(["campaing_id" => $campaing_id])
                ->andWhere(["status"=>Status::getActive()])
                ->limit($limit)
                ->column();
            Yii::info($numbers,"amminunbersss");
        return $numbers;

    }
    public static function getCampaingCallsDetail($campaing_id){
        $rawdata=CampaingCalls::find()->select(["number","unique_id"])->where(["campaing_id"=>$campaing_id])->asArray()->all();
        $newdata =[];
        Yii::info($rawdata,"dataadasdasaaaa");
        Yii::info("problem","probbbb");
        foreach ($rawdata as $data) {
            $temparray=[];
            if($data["unique_id"]){
                $cdrdata=null;
                $celdata=null;
                $connectioncdr = Yii::$app->db2;
                $command = $connectioncdr->createCommand('SELECT billsec,userfield FROM cdr WHERE uniqueid ="'.$data["unique_id"].'"');
                $cdrdata = $command->queryOne();
                $connectioncel = Yii::$app->db2;
                $command = $connectioncel->createCommand('SELECT eventtime FROM cel WHERE uniqueid ="'.$data["unique_id"].'" AND eventtype="CHAN_START"' );
                $celdata = $command->queryOne();
                if (!empty($celdata)) {
                    $temparray["calldate"]=$celdata["eventtime"];
                }

                if (!empty($cdrdata)) {
                    $temparray["billsec"]=$cdrdata["billsec"];
                    $temparray["userfield"]=$cdrdata["userfield"];
                }
                Yii::info($celdata,"celll".$data["number"]);
                Yii::info($cdrdata,"cdrrrr".$data["number"]);
                Yii::info($data["number"],"numbbeer");
            }
            $temparray["number"]=$data["number"];
            $temparray["uniqueid"]=$data["unique_id"];
            $newdata[]=$temparray;
        }

        Yii::info($newdata,"newdasdadassata");
        return $newdata;



    }
    




}