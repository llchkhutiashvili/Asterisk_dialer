<?php

/* @var $this \yii\web\View */
/* @var $content string */

use api\models\database\User;
use yii\helpers\Html;
use yii\bootstrap4\Breadcrumbs;
use frontend\assets\AppAsset;
use common\widgets\Alert;
use yii\helpers\Url;

AppAsset::register($this);
$this->registerLinkTag(['rel' => 'icon', 'type' => 'image/gif', 'href' => Url::to(['/img/favicon.gif'])]);
// $users=new User();
// $userr=$users::find()->where(['username' => 'support'])->one();
// $users=Yii::$app->user->identity->email
?>
<?php $this->beginPage() ?>
<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>">
<head>
    <meta charset="<?= Yii::$app->charset ?>">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php $this->registerCsrfMetaTags() ?>
    <title><?= Html::encode($this->title) ?></title>
    <?php $this->head() ?>
</head>
<body class="enlarged">
<?php $this->beginBody() ?>


<div id="wrapper">
    <?php if(!Yii::$app->user->isGuest) require_once 'menu.php'; ?>
    <div class="content-page">
        <div class="content">
             <?= Breadcrumbs::widget([
                'links' => isset($this->params['breadcrumbs']) ? $this->params['breadcrumbs'] : [],
            ]) ?> 
           <?= Alert::widget() ?>
            <?= $content ?> 
        </div>
        <footer class="footer">
            <pre>

        <pre>
    </footer>
    </div>
</div>


<!--<footer class="footer">-->
<!--    <div class="container">-->
<!--      -->
<!--    </div>-->
<!--</footer>-->

<?php $this->endBody() ?>
</body>
</html>
<?php $this->endPage() ?>
