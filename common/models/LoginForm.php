<?php
namespace common\models;

use api\actions\UserAction;
use api\models\AppUser;
use Yii;
use yii\base\Event;
use yii\base\Model;

class LoginForm extends Model {
    public $username;
    public $password;
    public $ldap_password;
    public $rememberMe = true;
    public $orgBlock = false;
    private $_user;

    public function __construct() {
        parent::__construct();
        Event::on(\api\models\database\User::className(), true, function($event) {
            $this->orgBlock = true;
        });
    }

    public function rules() {
        return [
            [['username', 'password'], 'required'],
            ['rememberMe', 'boolean'],
            ['password', 'validatePassword']
        ];
    }

    public function attributeLabels() {
        return [
            'username' => "მომხმარებელი",
            'password' =>"პაროლი"
        ];
    }

    /**
     * Validates the password.
     * This method serves as the inline validation for password.
     *
     * @param string $attribute the attribute currently being validated
     * @param array $params the additional name-value pairs given in the rule
     */
    public function validatePassword($attribute, $params) {

        if (!$this->hasErrors()) {
            $user = $this->getUser();
            if (!$user || !$user->validatePassword($this->password)) {
                $this->addError($attribute, Yii::t('Main', 'არასწორი მომხმარებელი ან პაროლი'));
            }
        }
    }

    /**
     * Logs in a user using the provided username and password.
     *
     * @return boolean whether the user is logged in successfully
     */
    public function login() {

        if ($this->validate()) {
            $user = $this->getUser2();
            if (\Yii::$app->user->login($user, $this->rememberMe ? 3600 * 24 * 30 : 0)) {
                $user->last_login = \Yii::$app->formatter->asTimestamp(date_create());
                $user->save(false);
                \Yii::$app->session->set('lang', $user->default_lang);
                return true;
            }
            return false;
        } else {
            return false;
        }
    }

    /**
     * Finds user by [[username]]
     *
     * @return AppUser|null
     */
    protected function getUser() {
        if ($this->_user === null)
            $this->_user = AppUser::findByUsername($this->username);
        return $this->_user;
    }

    protected function getUser2() {
        if ($this->_user === null)
            $this->_user = AppUser::findByUsername2($this->username, $this->password);


        return $this->_user;
    }
}
