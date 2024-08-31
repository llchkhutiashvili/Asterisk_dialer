<?php

namespace frontend\models;

use Yii;

/**
 * This is the model class for table "campaign".
 *
 * @property int $id
 * @property int $campaign_ID
 * @property string|null $time
 * @property string $name
 * @property int $phone_num
 * @property int $oper_num
 * @property int $try
 */
class Campaign extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'campaign';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['campaign_ID', 'name', 'phone_num', 'oper_num', 'try'], 'required'],
            [['campaign_ID', 'phone_num', 'oper_num', 'try'], 'integer'],
            [['time'], 'safe'],
            [['name'], 'string', 'max' => 128],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'campaign_ID' => 'Campaign ID',
            'time' => 'Time',
            'name' => 'Name',
            'phone_num' => 'Phone Num',
            'oper_num' => 'Oper Num',
            'try' => 'Try',
        ];
    }
}
