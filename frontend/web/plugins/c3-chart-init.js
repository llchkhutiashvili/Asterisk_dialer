/*
 Template Name: Lexa - Responsive Bootstrap 4 Admin Dashboard
 Author: Themesbrand
 File: C3 Chart init js
 */

!function($) {
    "use strict";

    var ChartC3 = function() {};

    ChartC3.prototype.init = function () {
        //generating chart 
        c3.generate({

            bindto: '#chart',
            data: {
                columns: [
                    ['In Answered', 150, 80, 70, 152, 250, 95],
                    ['In missed', 200, 130, 90, 240, 130, 220],
                    ['Out Answered', 300, 200, 160, 100, 250, 50],
                    ['Out missed', 100, 110, 68, 300, 50, 250],
                    ['No working', 220, 330, 161, 200, 150, 50]
                ],
                //groups: [
                //    ['In Answered', 'In missed','Out Answered','Out missed','No working']
                //],
                type: 'bar',
                colors: {
                    'In Answered': '#2CA02C',
                    'In missed': '#D62728',
                    'Out Answered': '#1F77B4',
                    'Out missed': "#FF7F0E",
                    'No working': "#9467BD"

                }
            },
            axis: {
                x: {
                    type: 'category',
                    categories: ['2011-01-01', '2011-01-02', '2011-01-03', '2011-01-04', '2011-01-05', '2011-01-06']
                }
            }
        });



        //combined chart
        c3.generate({
            bindto: '#combine-chart',
            data: {
                columns: [
                    ['SonyVaio', 30, 20, 50, 40, 60, 50],
                    ['iMacs', 200, 130, 90, 240, 130, 220],
                    ['Tablets', 300, 200, 160, 400, 250, 250],
                    ['iPhones', 200, 130, 90, 240, 130, 220],
                    ['Macbooks', 130, 120, 150, 140, 160, 150]
                ],
                types: {
                    SonyVaio: 'bar',
                    iMacs: 'bar',
                    Tablets: 'spline',
                    iPhones: 'line',
                    Macbooks: 'bar'
                },
                colors: {
                    SonyVaio: '#f0f1f4',
                    iMacs: '#7a6fbe',
                    Tablets: '#2f8ee0',
                    iPhones: '#fb4',
                    Macbooks: '#28bbe3'
                },
                groups: [
                    ['SonyVaio','iMacs']
                ]
            },
            axis: {
                x: {
                    type: 'categorized'
                }
            }
        });
        
        //roated chart
        c3.generate({
            bindto: '#roated-chart',
            data: {
                columns: [
                ['Revenue', 30, 200, 100, 400, 150, 250],
                ['Pageview', 50, 20, 10, 40, 15, 25]
                ],
                types: {
                    Revenue: 'bar'
                },
                colors: {
                    Revenue: '#f0f1f4',
                    Pageview: '#28bbe3'
	            }
            },
            axis: {
                rotated: true,
                x: {
                type: 'categorized'
                }
            }
        });

        //stacked chart
        c3.generate({
            bindto: '#chart-stacked',
            data: {
                columns: [
                    ['Revenue', 130, 120, 150, 140, 160, 150, 130, 120, 150, 140, 160, 150],
                    ['Pageview', 200, 130, 90, 240, 130, 220, 200, 130, 90, 240, 130, 220]
                ],
                types: {
                    Revenue: 'area-spline',
                    Pageview: 'area-spline'
                    // 'line', 'spline', 'step', 'area', 'area-step' are also available to stack
                },
                colors: {
                    Revenue: '#f0f1f4',
                    Pageview: '#28bbe3'
                }
            }
        });
        
        //Donut Chart
        c3.generate({
             bindto: '#donut-chart',
            data: {
                columns: [
                    ['Desktops', 78],
                    ['Smart Phones', 55],
                    ['Mobiles', 40],
                    ['Tablets', 25]
                ],
                type : 'donut'
            },
            donut: {
                title: "Candidates",
                width: 30,
				label: { 
					show:false
				}
            },
            color: {
            	pattern: ['#f0f1f4', '#7a6fbe', '#28bbe3', '#2f8ee0']
            }
        });
        
        //Pie Chart
        c3.generate({
             bindto: '#pie-chart',
            data: {
                columns: [
                    ['Desktops', 78],
                    ['Smart Phones', 55],
                    ['Mobiles', 40],
                    ['Tablets', 25]
                ],
                type : 'pie'
            },
            color: {
                pattern: ['#f0f1f4', '#7a6fbe', '#28bbe3', '#2f8ee0']
            },
            pie: {
		        label: {
		          show: false
		        }
		    }
        });

    },
    $.ChartC3 = new ChartC3, $.ChartC3.Constructor = ChartC3

}(window.jQuery),

//initializing 
function($) {
    "use strict";
    $.ChartC3.init()
}(window.jQuery);



