<?php
namespace api\actions;


use api\models\database\Callback;
use api\models\database\CampaingCalls;
use api\models\database\Crm;
use api\models\database\Crmusers;
use api\models\database\News;
use api\models\database\Reason;
use api\models\database\Snooze;
use api\models\database\Status;
use api\models\response\Result;
use common\models\User;
use frontend\models\Campaign;
use PHPUnit\Util\Json;
use Yii;
use yii\rbac\DbManager;


class actionsAction {

    public static function createOperator($fullname = null, $queue = null, $username = null, $oper_num = null, $role = null, $allow_queue= null, $user_id = null, $role_name = null, $penalty= null,$chat_name = null, $language = null,$password = null) {
        $result = null;

        if ($user_id > 0) {

            $old_user = User::find()->where(['or',["username"=>$username],["oper_num"=>$oper_num]])->andWhere(["status"=>Status::getActive()])->andWhere(["<>","id",$user_id])->one();

            if ($old_user)
                $result = "User_exists";
            else {
                $user = User::find()->where(["id"=>$user_id])->one();
                $user->chat_name = $chat_name;
                $user->username = $username;
                $user->first_name = $fullname;
                $user->language = $language;
                $user->penalty = $penalty;
                $user->queue = $queue;
                $user->allow_queue = $allow_queue!=''? implode(",",$allow_queue):"";
                $user->oper_num = $oper_num;
                if ($password != null and $password != "")
                    $user->setPassword($password);
                $user->save();

                $auth=new DbManager;
                if ($role == 1)
                    $role = $auth->getRole('role_operator');
                else if ($role == 2)
                    $role = $auth->getRole('role_global_admin');
                else if ($role == 3)
                    $role = $auth->getRole('role_monitoring');
                else if ($role == 4)
                    $role = $auth->getRole('role_risks');

                $auth->revoke($auth->getRole($role_name), $user->id);
                $auth->assign( $role, $user->id );
                $result = "Created";
            }

        }
        else  {
            $user = new User();
            if($user->findByUsername($username) || $user->findByOperNum($oper_num) ) {
                $result = "User_exists";
            }
            else {
                $user->chat_name = $chat_name;
                $user->username = $username;
                $user->first_name = $fullname;
                $user->language = $language;
                $user->queue = $queue;
                $user->penalty = $penalty;
                $user->allow_queue = $allow_queue!=''? implode(",",$allow_queue):"";
                $user->oper_num = $oper_num;
                $user->setPassword($password);
                $user->access_token = \Yii::$app->security->generateRandomString();
                $user->generateAuthKey();
                if ($user->save()) {
                    $auth=new DbManager;
                    if ($role == 1)
                        $role = $auth->getRole('role_operator');
                    else if ($role == 2)
                        $role = $auth->getRole('role_global_admin');
                    else if ($role == 3)
                        $role = $auth->getRole('role_monitoring');
                    else if ($role == 4)
                        $role = $auth->getRole('role_risks');
                    $auth->assign($role, $user->getId());
                    $result = "Created";
                } else $result = "Coudn't add";
            }
        }

      return $result;


    }

    public static function changePass($newpass = null){
        $user = User::find()->where(["id"=>\Yii::$app->user->getId()])->one();

        $user->setPassword($newpass);
        $user->access_token = \Yii::$app->security->generateRandomString();
        $user->generateAuthKey();
        if($user->save())
            return Result::SUCCESS;
        else return Result::FAILURE;

    }

    public static function deleteOperator($user_id = null){

        $transaction = \Yii::$app->db->beginTransaction();

            try {
                $user = \api\models\database\User::find()->where(["id"=>$user_id])->one();
                if ($user) {
                    $user->status = Status::getDeleted();
                    $user->save();

                    $transaction->commit();
                    return Result::SUCCESS;
                } else return Result::FAILURE;


            }
            catch (\Exception $ex) {
                $transaction->rollBack();
                \Yii::error($ex->getMessage());
            }

    }

    public static function updateCallback($queue=null, $number = null) {
        $command = \Yii::$app->db->createCommand(
            "UPDATE callback set try = try+1 WHERE try < 2 AND queue = '$queue' AND  number like '".$number."%'"
        );
        $command->execute();
    }

    public static function getCallbackNumbers($day = null) {

        $result = Callback::find()->where(["<","try",2])->andWhere(["queue"=>\Yii::$app->user->identity->queue])
            ->andWhere(["like","datetime", $day."%", false])->andWhere(["<","ident",5])->all();
        return $result;
    }

    public static function getCampaignNumbers($campaign = null) {

        $oper_num=\Yii::$app->user->identity->oper_num;
        $result = CampaingCalls::find()->where(["=","campaing_name",$campaign])->andWhere(["=","oper_num",$oper_num])->andWhere(["<","try",2    ])->all();
        return $result;
    }
    public static function getCampaigns($campaign = null) {

        $oper_num=\Yii::$app->user->identity->oper_num;
        $result  = CampaingCalls::find()
        ->select(['campaing_name'])
        ->distinct()->where(["=", "oper_num", $oper_num])
        ->asArray()
        ->all();
        Yii::trace($result, 'campaignsssssss');
        return $result;
    }


    public static function getChatCallbackNumbers($day = null) {

        $result = Callback::find()->where(["<","try",2])->andWhere([">","ident",4])->andWhere(["queue"=>\Yii::$app->user->identity->queue])
            ->andWhere(["like","datetime", $day."%", false])->all();
        return $result;
    }


    public static function getCallbackNumbersArray($day = null) {


        $sql = "SELECT * from callback 
                WHERE try < 2 AND queue = :queue  and datetime like :day 
                ";



        $rows = \Yii::$app->db->createCommand($sql)

            ->bindValue(":queue", \Yii::$app->user->identity->queue)
            ->bindValue(":day", "%".$day."%")
            ->queryAll(\PDO::FETCH_ASSOC);

//        $result = Callback::find()->where(["<","try",2])->andWhere(["queue"=>\Yii::$app->user->identity->queue])
//            ->andWhere(["like","datetime", $day."%", false])->all();
        return $rows;
    }






    public static function getCallbackNumbersForManager($day = null, $queue = null) {
        $day = explode("to", $day);

        $result = Callback::find()->where(["<","try",2])->andWhere(["queue"=>$queue])
            ->andWhere([">=","datetime", trim($day[0])." 00:00:00"])
            ->andWhere(["<=","datetime", trim($day[1])." 23:59:59"])
            ->all();
        return $result;
    }
    public static function log_to_console($data,$message=null) {
        $output = json_encode($data);
        echo "<script>console.log($output);</script>";
    }

}