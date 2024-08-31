<?php

use api\models\database\Queues;
use yii\helpers\Url;

?>
<!--php /home/mobmarke/public_html/yii schedule/run --scheduleFile=@console/config/schedule.php-->
<!-- Top Bar Start -->
<style>
    .spin {
        -webkit-animation-name: spin1;
        -webkit-animation-duration: 700ms;
        -webkit-animation-delay: 1s;
        -webkit-animation-iteration-count: infinite;
        -webkit-animation-timing-function: linear;
        -moz-animation-name: spin1;
        -moz-animation-duration: 700ms;
        -moz-animation-delay: 1s;
        -moz-animation-iteration-count: infinite;
        -moz-animation-timing-function: linear;

        -ms-animation-name: spin1;
        -ms-animation-duration: 700ms;
        -ms-animation--delay: 1ms;
        -ms-animation-iteration-count: infinite;
        -ms-animation-timing-function: 5s;


        animation-name: spin1;
        animation-duration: 700ms;
        animation-delay: 1s;

        animation-iteration-count: infinite;
        animation-timing-function: linear;
    }

    @-moz-keyframes spin1 {

        0% {
            -webkit-transform: rotate(0deg);
        }
        25% {
            -webkit-transform: rotate(45deg);
        }
        50% {
            -webkit-transform: rotate(0deg);
        }
        75% {
            -webkit-transform: rotate(-45deg);
        }
        100% {
            -webkit-transform: rotate(0deg);
        }


    }

    @-webkit-keyframes spin1 {
        0% {
            -webkit-transform: rotate(0deg);
        }
        25% {
            -webkit-transform: rotate(45deg);
        }
        50% {
            -webkit-transform: rotate(0deg);
        }
        75% {
            -webkit-transform: rotate(-45deg);
        }
        100% {
            -webkit-transform: rotate(0deg);
        }
    }

    @keyframes spin1 {
        0% {
            -webkit-transform: rotate(0deg);
        }
        25% {
            -webkit-transform: rotate(45deg);
        }
        50% {
            -webkit-transform: rotate(0deg);
        }
        75% {
            -webkit-transform: rotate(-45deg);
        }
        100% {
            -webkit-transform: rotate(0deg);
        }
    }
</style>
<div class="topbar">

    <!-- LOGO -->
    <div class="topbar-left">
        <a href="<?= Url::to(["/"]) ?>" class="logo">
                <span>
                    <img src="<?= Yii::getAlias("@web") ?>/img/logo.svg" alt="" height="18">
                </span>
            <i>
                <img src="<?= Yii::getAlias("@web") ?>/img/logo.svg" alt="" height="22">
            </i>
        </a>

    </div>


    <nav class="navbar-custom">

        <ul class="navbar-right d-flex list-inline float-right mb-0">

            <li class="dropdown notification-list">
                <div class="dropdown notification-list nav-pro-img">
                    <a class="dropdown-toggle nav-link arrow-none waves-effect nav-user" data-toggle="dropdown" href="#"
                       role="button" aria-haspopup="false" aria-expanded="false">
                        <?= Yii::$app->user->identity->oper_num . " - " . Yii::$app->user->identity->first_name ?> <i
                                class="mdi mdi-account " style="font-size: 24px"></i>
                    </a>
                    <div class="dropdown-menu dropdown-menu-right profile-dropdown ">
                        <a class="border-bottom dropdown-item text-secondary" href="#" id="showChangePassModal">
                            <i class="mdi mdi-key-change text-secondary Mrglovani"></i> პაროლის შეცვლა
                        </a>
                        <a class="dropdown-item text-danger " href="<?= Url::to(["site/logout"]) ?>">
                            <i class="mdi mdi-power text-danger Mrglovani"></i> გასვლა
                        </a>


                    </div>
                </div>
            </li>

        </ul>
        <ul class="list-inline menu-left mb-0">
            <li class="float-left">
                <button class="button-menu-mobile open-left waves-effect">
                    <i class="mdi mdi-menu"></i>
                </button>
            </li>
        </ul>


    </nav>

</div>
<!-- Top Bar End -->

<!-- ========== Left Sidebar Start ========== -->
<div class="left side-menu">
    <!--<div class="slimscroll-menu" id="remove-scroll">-->
    <div>
        <!--- Sidemenu -->
        <div id="sidebar-menu">

        </div>
        <!-- Sidebar -->
        <div class="clearfix"></div>

    </div>
    <!-- Sidebar -left -->

</div>

<div class="modal fade " id="passwordModal" tabindex="-1" aria-labelledby="mySmallModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h6 class="modal-title mt-0">პაროლის შეცვლა</h6>
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-12">
                        <form id="changepass_form" action="<?= Url::to(["actions/change-password"]) ?>" method="post">

                            <div class="modal-content">

                                <div class="modal-body">

                                    <div class="form-row">
                                        <div class="form-group col-sm-12 col-md-12">
                                            <div class="input-group">
                                                <div class="input-group-prepend">
                                                    <div class="input-group-text"><i class="mdi mdi-key"></i></div>
                                                </div>
                                                <input type="password" class="form-control "
                                                       data-parsley-minlength="8"

                                                       name="newpassword" required id="newpassword"
                                                       placeholder="შეიყვანეთ ახალი პაროლი">
                                            </div>
                                        </div>
                                        <div class="form-group col-sm-12 col-md-12">
                                            <div class="input-group smsQuestion">
                                                <div class="input-group-append">
                                                    <div class="input-group-text"><i class="mdi mdi-key"></i></div>
                                                </div>
                                                <input type="password" class="form-control " data-parsley-minlength="8"
                                                       data-parsley-equalto="#newpassword" name="oldpassword" required
                                                       id="oldpassword" placeholder="გაიმეორეთ პაროლი">
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div class="modal-footer justify-content-right">
                                    <button type="submit" class="btn btn-outline-success sendSms"><i
                                                class="mdi mdi-content-save"></i> შენახვა
                                    </button>
                                    <img width="20px" id="updatePassLoader" class="d-none"
                                         src="<?= Yii::getAlias("@web") ?>/img/ajax.gif"/>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

            </div>


        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div>


<div class="modal fade " id="newsModal" tabindex="-1" aria-labelledby="mySmallModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h6 class="modal-title mt-0" id="newsModalTitle"></h6>
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-12" id="newsModalText"></div>
                    <div class="col-12" id="modalNewsFile">

                    </div>
                    <div class="col-12">
                        <hr>
                        <input type="hidden" value="" id="newsHiddenId">
                        <small class="text-muted">თარიღი: <span id="newsCreated"></span>, ავტორი: <span
                                    id="newsAuthor"></span></small>
                    </div>

                    <div class="col-12 text-center">
                        <div class="btn btn-outline-primary " onclick="acceptNews()"><i class="mdi mdi-check"></i>
                            გავეცანი
                        </div>
                    </div>

                </div>

            </div>


        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div>


<div class="modal fade " id="newsHistoryModal" tabindex="-1" aria-labelledby="mySmallModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h6 class="modal-title mt-0">სიახლეების ისტორია</h6>
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
            </div>
            <div class="modal-body">
                <table id="datatable-history-news" class="table table-striped table-bordered  nowrap"
                       style="border-collapse: collapse; border-spacing: 0; width: 100% !important;">
                    <thead>
                    <tr>
                        <th>თარიღი</th>
                        <th>დასახელება</th>
                        <th>დეტალური</th>
                    </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
                <div id="newsHistoryDetailBinder">
                    <hr>
                    <div class="row">

                        <div class="col-12" id="historynewsModalText"></div>
                        <div class="col-12" id="historymodalNewsFile">
                            <hr>
                        </div>
                        <div class="col-12">


                            <small class="text-muted">თარიღი: <span id="historynewsCreated"></span>, ავტორი: <span
                                        id="historynewsAuthor"></span></small>
                        </div>



                    </div>
                </div>



            </div>

            <div class="modal-footer">
                <div class="col-12 text-center">
                    <div class="btn btn-outline-danger " data-dismiss="modal" aria-hidden="true"><i
                                class="mdi mdi-close"></i> დახურვა
                    </div>
                </div>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div>


<!-- Left Sidebar End -->