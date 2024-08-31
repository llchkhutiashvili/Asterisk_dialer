<?php
$this->title = 'Callcenter ::Dailer';

use frontend\assets\CampaignAsset;

use yii\helpers\Json;
use yii\helpers\Url;
use yii\web\View;
use api\actions\CampaingAction;

CampaignAsset::register($this);



$phpData = [

    'change_settings' => Url::to(['settings/change-callback']),
    'campaignList' => Url::to(['campaign/campaign-list']),
    'addCampaign' => Url::to(['campaign/add']),
    'getDetail' => Url::to(['campaign/detail']),
    'getStat' => Url::to(['campaign/stat']),
    'activeCampaign' => Url::to(['campaign/active-campaign']),
    'setting' => Url::to(['campaign/setting']),
    'saveSetting' => Url::to(['campaign/save-setting']),
    'saveNumbers' => Url::to(['campaign/save-number']),
    'deleteCampaign' => Url::to(['campaign/delete-campaign']),
    'blackList' => Url::to(['settings/black-list']),
    'upload' => Url::to(['campaign/upload']),
    'uploadFile' => Yii::getAlias("@web/uploads/"),
    'changeOper'=>Url::to(['campaign/change-oper']),
    'getCampaingOpers'=>Url::to(['campaign/get-campaing-opers']),
    'getActiveOperators'=>Url::to(['campaign/get-active-operators']),
    
];

\Yii::$app->view->registerJs(
    "var phpData = " . Json::encode($phpData) . ";",
    View::POS_BEGIN);
    Yii::info("xutiiiii");
?>
<div class="container-fluid">
<!--    <div style="background-color: #FFFFFF">-->
<!--    <h1 class="btn btn-lg" id="btn-campaing-type-expand">კამპანიის პარამეტრები</h1>-->
<!--    <form id="campaing_type_form" enctype="multipart/form-data" action="">-->
<!--        <div class="row d-none ml-3" id="expandable-campaing-type" >-->
<!--            <div class="col-md-3">-->
<!--                <label class="d-block">კამპანიის ტიპი</label>-->
<!--                <input list="datalist-campaign-types" name="browser" id="browser" class="w-50">-->
<!--                <datalist id="datalist-campaign-types">-->

<!--                </datalist>-->
<!---->
<!--            </div>-->
<!--            <div class="form-group col-md-3">-->
<!--                <label>აირჩიეთ ხმოვანი ფაილი (WAV 8000hz 16bit mono)</label>-->
<!--                <input type="file" class="filestyle "  name="audio" id="uploadAudio" reqired-->
<!--                       data-buttonBefore="true" data-buttonText="აირჩიეთ ფაილი" required accept=".wav"-->
<!--                       data-buttonname="btn-outline-primary">-->
<!--            </div>-->
<!---->
<!--            <div class="col-md-3 d-flex justify-content-center align-items-center">-->
<!--                <button type="submit" class="btn btn-outline-primary " id="add_campaign"><i class="mdi mdi-check"></i> შენახვა</button>-->
<!--            </div>-->
<!--            <div class="form-group col-md-3">-->
<!--                <input list="browsers" name="browser" id="browser">-->
<!--                <datalist id="browsers">-->
<!--                    <option value="Edge">-->
<!--                    <option value="Firefox">-->
<!--                    <option value="Chrome">-->
<!--                    <option value="Opera">-->
<!--                    <option value="Safari">-->
<!--                </datalist>-->
<!--            </div>-->
<!---->
<!---->
<!--        </div>-->
<!--    </form>-->
<!--    </div>-->

    <div class="card mt-2">
        <div class="card-body">
            <h4 class="mt-0 header-title">კამპანია</h4>
            <hr>
            <form id="campaign_form" enctype="multipart/form-data" action="">
                <div class="row ">
                    <div class="col-md-3">
                        <label class="ml-1">კამპანიის დასახელება</label>
                        <input type="text" class="form-control" name="campaignName" required id="campaignName" value=""
                               placeholder="შეიყვანეთ კამპანია" >
                    </div>
                    <div class="form-group col-md-3">
                        <label>აირჩიეთ ხმოვანი ფაილი (WAV 8000hz 16bit mono)</label>
                        <input type="file" class="filestyle pt-1"  name="audio" id="uploadAudio" reqired
                               data-buttonBefore="true" data-buttonText="აირჩიეთ ფაილი" required accept=".wav"
                               data-buttonname="btn-outline-primary">
                    </div>
                    <div class="form-group col-md-2 ">
                        <label class="">აირჩიეთ ფაილი (xslx)</label>
                        <input type="file" class="filestyle pt-2" name="xlsx" id="uploadXlsx" data-buttonBefore="true"
                               required data-buttonText="აირჩიეთ ფაილი"  required accept=".xlsx"
                               data-buttonname="btn-outline-primary">
                    </div>
                    <div class="form-group col-md-2 d-block">
                        <label>ზარების რაონდენობა წთ-ში</label>
                        <input type="text" value="" class="form-control" required name="CPM">
                    </div>
                </div> <!-- end row -->
                <div class="row mt-3">
                    <div class="col-3 d-flex">
                        <div class="input-group-append" style="height: max-content">
                            <div class="btn btn-primary searchCallsback"><i class="mdi mdi-timetable"></i> </div>
                        </div>
                        <input  class="flatpickr waves-effect form-control mrgvlovani" name="campaing_start_time" type="text" id="campaing_start_time" placeholder="აირჩიეთ დაწყების დრო">
                    </div>
                    <div class="col-3 d-flex" >
                        <div class="input-group-append" style="height:max-content">
                            <div class="btn btn-primary searchCallsback"><i class="mdi mdi-timetable"></i> </div>
                        </div>
                        <input  class="flatpickr waves-effect form-control mrgvlovani" name="campaing_end_time" type="text" id="campaing_end_time" placeholder="აირჩიეთ დამთავრების დრო">
                    </div>
                    <div class="col-md-2">
                        <button type="submit" class="btn btn-outline-primary " id="add_campaign"><i class="mdi mdi-check"></i>დამატება</button>
                    </div>
                </div>
            </form>
            <div class="row">
            <div class="col-12 pt-3">
                <table id="datatable-campaign" class="table table-striped table-bordered nowrap" style="border-collapse: collapse; border-spacing: 0; width: 100% !important;">
                    <thead>
                    <tr>
                        <th>შექმნის თარიღი</th>
                        <th>დასახელება</th>
                        <th>სტატუსი</th>
                        <!-- <th>ოპერატორი</th> -->
                        <th>დასარეკი</th>
                        <th>დარეკილი</th>
                        <th>ჯამი</th>
                        <th>იუზერი</th>
                        <th style="width: 10%"></th>
                    </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </div> <!-- end col -->
            </div>
        </div>
    </div>

    <div class="card mt-2 " style="display: none" id="DatailBinder">
        <div class="card-body">
            <h4 class="mt-0 header-title">დეტალური <span id="detail_title"></span></h4>


        <div class="row">

        <div class="col-8">
            <table id="datatable-detail" class="table table-striped table-bordered  nowrap"
                   style="border-collapse: collapse; border-spacing: 0; width: 100% !important;">
                <thead>
                <tr>
                    <th>თარიღი</th>
                    <th>ნომერი</th>
                    <th>სტატუსი</th>
                    <th>შედეგი</th>
                    <th>ხანგრძლივობა</th>

                </tr>
                </thead>
                <tbody>

                </tbody>
            </table>
        </div>
<!--        <div class="col-6">-->
<!--            <table id="datatable-stat" class="table table-striped table-bordered  nowrap"-->
<!--                   style="border-collapse: collapse; border-spacing: 0; width: 100% !important;">-->
<!--                <thead>-->
<!--                <tr>-->
<!--                    <th>ნომერი</th>-->
<!--                    <th>ხანგრძლივობა</th>-->
<!--                    <th>თარიღი</th>-->
<!--                </tr>-->
<!--                </thead>-->
<!--                <tbody>-->
<!---->
<!--                </tbody>-->
<!--            </table>-->
<!--        </div>-->
<!--        </div>-->
        </div>
    </div>
    <!-- <div class="card mt-2 ">
        <div class="card-body">
            <h4 class="mt-0 header-title">პარამეტრები</h4>

            <form id="settingsForm" action="#" method="post">
                <div class="row">
                    <div class="col-3">
                        <label>დაწყება</label>
                        <input type="text"  value="" class="form-control" required name="start" id="start">
                    </div>
                    <div class="col-3">
                        <label>დასრულება</label>
                        <input type="text" value="" class="form-control" required name="end" id="end">
                    </div>
                    <div class="form-group col-md-2">
                        <label>ზარების რაონდენობა წთ-ში</label>
                        <input type="text" value="" class="form-control" required name="count" id="count">
                    </div>
                    <div class="col-2">
                        <label>&nbsp;</label><br>
                        <button type="submit" class="btn btn-outline-primary"><i class="mdi mdi-check"></i> შენახვა</button>
                    </div>
                </div>
            </form>
        </div>

    </div> -->


    <div class="col-md-12" style="display: none; text-align: right" id="player_binder">
        <audio preload="none" controls id="s">

            <source id="aa" src="<?= Yii::getAlias("@web") ?>/uploads/1.wav"/>
        </audio>
    </div>


    <div id="outmodal" class="modal fade bs-example-modal-lg bs-example-modal-center " tabindex="-1" role="dialog"
         aria-labelledby="exampleModalLongTitle" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header ">
                    <h5 class="modal-title mt-0">ატვირთული ფაილი</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                </div>
                <div class="modal-body">
                    <form id="create_user" action="#">

                        <div class="row">
                            <div class="col-md-12">
                                <table id="datatable-example" class="table table-striped table-bordered  nowrap"
                                       style="border-collapse: collapse; border-spacing: 0; width: 100% !important;">
                                    <thead>
                                    <tr>
                                        <th>ნომერი</th>
                                    </tr>
                                    </thead>
                                    <tbody>

                                    </tbody>
                                </table>
                            </div>
                            <div class="col-6 pt-1 d-block">
                                <hr>
                                <is="form-group">
                                    <input type="hidden" id="campaing_id">
                                    <input type="hidden" id="filename">
                                    <input type="file" class="filestyle" id="outVoiceFile" data-buttonBefore="true"
                                           data-buttonText="აირჩიეთ ფაილი" accept=".xlsx" data-buttonname="btn-primary">sddddddddddd</input>
                                </div>
                            </div>


                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn  btn-success waves-effect" id="saveUploadNumbers">
                        <i class="mdi mdi-check"></i> დადასტურება
                    </button>
                </div>

            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->
<div class="modal fade" id="campaingModal" tabindex="-1" role="dialog" aria-labelledby="campaingModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document" id="campaingModalDialog">
    <div class="modal-content shadow-lg">
      <div class="modal-header bg-primary text-white">
        <h5 class="modal-title" id="campaingModalLabel" data-campaing="">კამპანიის პარამეტრების შეცვლა</h5>
        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body d-flex">
        <div class="">
        <h6 class="d-block font-weight-bold ml-2" id="modalChangeOperHeading">კამპანიაზე მომუშავე ოპერატორები</h6> 
        <table id="datatable-campaing-opers" class="table table-striped table-bordered nowrap"
                   style="border-collapse: collapse; border-spacing: 0; width: 100% !important;" >
                <thead>
                <tr>
                    <th>ოპერატორის ნომერი</th>
                    <th>ოპერატორის სახელი</th>
                    <th></th>
                    <th class="d-none">აირჩიეთ ოპერატორი</th>
                </tr>
                </thead>
                <tbody>

                </tbody>
            </table>
        
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-danger" data-dismiss="modal">დახურვა</button>
        <button type="button" id="campaingChangeButton" class="btn btn-success">შენახვა</button>
      </div>
    </div>
  </div>
</div>   


    <input type="hidden" id="inVoiseSettId">
    <input type="file" class="d-none" id="inVoiceFile" accept=".xlsx">
    <style>
        .pointer {
            cursor: pointer;
        }

        .panel-title {
            position: relative;
            cursor: pointer;
        }

        .panel-title::after {
            content: "\f107";
            color: #333;
            font-size: 20px;
            top: -2px;
            right: 0px;
            position: absolute;
            font-family: "FontAwesome"
        }

        .panel-title[aria-expanded="true"]::after {
            content: "\f106";
        }

        /*
         * Added 12-27-20 to showcase full title clickthrough
         */

        .panel-heading-full.panel-heading {
            padding: 0;
        }

        .panel-heading-full .panel-title {
            padding: 10px 35px;
            line-height: 25px;
        }

        .panel-heading-full .panel-title::after {
            top: 8px;
            left: 15px;
        }
    </style>