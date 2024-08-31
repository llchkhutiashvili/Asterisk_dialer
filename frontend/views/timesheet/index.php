<?php
$this->title = 'Callcenter :: TimeSheet';
use api\actions\TimesheetAction;
use frontend\assets\TimesheetAsset;
use yii\helpers\Json;
use yii\helpers\Url;
use yii\web\View;

TimesheetAsset::register($this);

$phpData = [
    'getTimesheet' => Url::to(['timesheet/get-timesheet']),
    'GetOper' => Url::to(['operator/get-oper-for-stat']),
    'detail' => Url::to(['timesheet/detail']),
];


\Yii::$app->view->registerJs(
    "var phpData = " . Json::encode($phpData) . ";",
    View::POS_BEGIN);


?>
<div class="container-fluid">
    <div class="row">
        <div class="col-sm-4">
            <div style="padding: 5px">

            </div>
        </div>
    </div>
    <div class="card">
        <div class="card-body">
            <div class="row">
                <div class="col-3">
                    <label>აირჩიეთ ინტერვალი</label>
                    <input  class=" waves-effect form-control mrgvlovani" type="text" data-mode="range" id="startDate" placeholder="ინტერვალის არჩევა">
                </div>
                <div class="col-2">
                    <label>დეპარტამენტი</label>
                    <select class="custom-select" id="queue">
                        <?php
                        foreach ($queues as $queue) {
                            echo ' 
                                <option  value="'.$queue->queue.'" '.($queue->queue == Yii::$app->user->identity->queue? "selected":"").'>'.$queue->name.'</option>';
                        }
                        ?>
                    </select>
                </div>
                <div class="col-2">
                    <label>მხარდაჭერის მენეჯერი</label> <br>
                    <select id="oper_nums"   multiple="multiple"></select>
                </div>
                <div class="col">
                    <label>&nbsp;</label> <br>
                    <button type="button" class="btn btn-primary waves-effect waves-light" id="fidnBtn">
                        <i class="mdi mdi-magnify"></i> ძებნა
                    </button>
                </div>
            </div>
        </div>

    </div>

    <div class="row m-t-20">
        <div class="col-lg-12">
            <div class="card">
                <div class="card-body">
                    <div class="tab-content">
                        <div class="row">
                            <div class="col-12">
                                <table  id="datatable-buttons" class="table table-striped table-bordered  nowrap" style="border-collapse: collapse; border-spacing: 0; width: 100% !important;">
                                    <thead>
                                    <tr>
                                        <th rowspan="2">მხარდაჭერის მენეჯერი</th>
                                        <th rowspan="2">მხარდაჭერის მენეჯერის N</th>
                                        <th rowspan="2">დაწყების თარიღი</th>
                                        <th rowspan="2">დამთავრების თარიღი</th>
                                        <th rowspan="2">მუშაობის ხანგრძლივობა</th>
                                        <th rowspan="2">ჯამური საუბრის დრო</th>
                                        <th rowspan="2">%  ჯამური საუბრის დრო</th>

                                        <th rowspan="2">Hold time</th>
                                        <th rowspan="2">შემომავალი</th>
                                        <th rowspan="2">%</th>
                                        <th rowspan="2">გამავალი</th>
                                        <th rowspan="2">%</th>
                                        <th rowspan="2">შესვენება</th>
                                        <th rowspan="2">%</th>
                                        <th rowspan="2">ჩატი</th>
                                        <th rowspan="2">%</th>
                                        <th rowspan="2">მოკვლევა</th>
                                        <th rowspan="2">%</th>
                                        <th rowspan="2">სრმ</th>
                                        <th rowspan="2">სამუშაო დღეები</th>
                                        <th rowspan="2">ფორვარდი</th>
                                        <th colspan="12">შემომავალი</th>
                                        <th colspan="9">გამავალი</th>
                                        <th rowspan="2">დეტალური</th>
                                    </tr>
                                    <tr>
                                        <th>ნაპასუხები</th>
                                        <th>გაცდენილი</th>
                                        <th>გაცდენილი უნიკალური</th>
                                        <th>ჯამი</th>
                                        <th>%</th>
                                        <th>საუბრის დრო</th>
                                        <th>საუბ. დრო მინ.</th>
                                        <th>საუბ. დრო საშ.</th>
                                        <th>საუბ. დრო მაქს.</th>
                                        <th>ლოდ. დრო  მინ.</th>
                                        <th>ლოდ. დრო საშ.</th>
                                        <th>ლოდ. დრო მაქს.</th>
                                        <th>ნაპასუხები</th>
                                        <th>გაცდენილი</th>
                                        <th>ჯამი</th>
                                        <th>%</th>
                                        <th>საუბრის დრო</th>
                                        <th>საუბ. დრო სრული</th>
                                        <th>საუბ. დრო მინ.</th>
                                        <th>საუბ. დრო საშ.</th>
                                        <th>საუბ. დრო მაქს.</th>
                                    </tr>
                                    </thead>
                                    <tbody></tbody>

                                </table>
                            </div> <!-- end col -->
                        </div> <!-- end row -->
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- end row -->

    <div class="row m-t-20">
        <div class="col-lg-12">
            <div class="card">
                <div class="card-body">
                    <h4 class="mt-0 header-title"><span id="detail_oper_name"></span></h4>
                    <hr>
                    <table  id="datatable-detail" class="table table-striped table-bordered  nowrap" style="border-collapse: collapse; border-spacing: 0; width: 100% !important;">
                        <thead>
                        <tr>
                            <th>სტატუსი</th>
                            <th>თარიღი</th>
                            <th>ნომერი</th>
                            <th>ხანგრძლივობა</th>
                        </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <!-- end row -->
</div>

