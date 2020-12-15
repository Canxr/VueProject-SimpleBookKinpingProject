<template>
    <div>
        <br>
        <div align=left float=left>
            <button @click="addRow()">增加一行</button>
            <button @click="deleteLastRow()">删除一行</button>
        </div>
        <br>
        <div>
            <hot-table ref="hotTableComponent" :settings="hotSettings" :data="data" id="myHotTable"></hot-table>
        </div>
        <br>
        <div align=right>
            <button @click="saveAllInfo()">保存</button>
        </div>
        <br>
        <div align=right>
            <button @click="printChart()">打印</button>
        </div>
        <br>
        <div align=right>
            <button @click="backLastPage()">返回</button>
        </div>
    </div>
</template>

<script>

import { HotTable } from '@handsontable/vue';
import Handsontable from 'handsontable';
import formulaparser from 'hot-formula-parser'
import Vue from 'vue';

var rowNum = 4;

var userInfoArray=["客户姓名","时间","商品名","备注","","金额合计（元）"];
var productInfoArray=["规格","样式","单位","数量","价格（元）","金额（元）"];

var chartData = [
                userInfoArray,
                ["","","","","","0"],//return this.sumPrices();
                productInfoArray,
                ["","","","0","0","0"],
            ];

export default {
    name: "joinInfo",

    data: function () {
        return {
            data: chartData,
            hotSettings: {
                // data: this.data,
                fillHandle: false,
                licenseKey: "non-commercial-and-evaluation",
                formulas: true,
                // colHeaders: true,
                // rowHeaders: true,
                cells: function (row, col, prop) {
                    var cellProperties ={};
                    cellProperties.dateFormat = "YYYY-MM-DD";

                    if (row < 2) {
                        if (row == 0) {
                            cellProperties.readOnly = true;
                        }else{
                            if (col == 1) {
                                cellProperties.type = "date";
                            }else if (col == 5) {
                                cellProperties.type = "numeric";
                            }
                        }
                    }else{
                        if (row == 2) {
                            cellProperties.readOnly = true;
                        }else{
                            if (col == 3 || col == 4 || col == 5) {
                                cellProperties.type = "numeric";
                            }
                        }
                    }
                    return cellProperties;
                },
            },
        };
    },

    components: {
        HotTable,
        Handsontable,
        formulaparser
    },

    methods: {

        addRow () {
            
            if (rowNum < 20) {
                rowNum = rowNum + 1;
                // var cul = "=D"+rowNum.toString()+"*E"+rowNum.toString()+"";
                // chartData.push(["","","","0","0",cul]);
                chartData.push(["","","","0","0","0"]);
                // var topArr = chartData[1];
                // var sumCul = "=SUM(F4:"+"F"+rowNum.toString()+")";
                // topArr.splice(5,1,sumCul);
            }
        },

        deleteLastRow() {
            
            if(rowNum > 4) {

                chartData.splice(rowNum-1,1);
                rowNum = rowNum - 1;
                // var topArr = chartData[1];
                // var sumCul = "=SUM(F4:"+"F"+rowNum.toString()+")";
                // topArr.splice(5,1,sumCul);
            }
        },

        saveMainInfo() {

            var hot = this.$refs.hotTableComponent.hotInstance;

            var obj = {};
            
            try {
                var curstomName = hot.getCell(1,0).innerHTML;
                obj.curstomName = curstomName;
            } catch (error) {
                console.log(error);
            }

            try {
                var chartTimeArray = hot.getCell(1,1).innerHTML.split(">");
                var chartTime = chartTimeArray[chartTimeArray.length-1];
                obj.chartTime = chartTime;
            } catch (error) {
                console.log(error);
            }

            try {
                var productName = hot.getCell(1,2).innerHTML;
                obj.productName = productName;
            } catch (error) {
                console.log(error);
            }

            try {
                var note = hot.getCell(1,3).innerHTML;
                obj.note = note;
            } catch (error) {
                console.log(error);
            }

            try {
                var totalPrice = hot.getCell(1,5).innerHTML;
                obj.totalPrice = totalPrice;
            } catch (error) {
                console.log(error);
            }
            
            obj.subInfoArray = [];

            return obj;
        },

        saveSubInfo() {

            var hot = this.$refs.hotTableComponent.hotInstance;

            var array = new Array();

            for (var index = 3; index < rowNum; index++) {

                var specifName = hot.getCell(index,0).innerHTML;
                var styleName = hot.getCell(index,1).innerHTML;
                var unitName = hot.getCell(index,2).innerHTML;
                var numName = hot.getCell(index,3).innerHTML;
                var priceName = hot.getCell(index,4).innerHTML;
                var allPriceName = hot.getCell(index,5).innerHTML;

                array.push({
                    specifName: specifName,
                    styleName: styleName,
                    unitName: unitName,
                    numName: numName,
                    priceName: priceName,
                    allPriceName: allPriceName
                });
            }

            return array;
        },

        saveAllInfo () {

            var subArray = this.saveSubInfo();
            var mainInfo = this.saveMainInfo();
            
            mainInfo.subInfoArray = subArray;

            this.saveInDB(mainInfo);
        },

        saveInDB (info) {

            var openRequest = window.indexedDB.open("cxr_data_product_info");

            openRequest.onupgradeneeded = function (event) {
                
                console.log('数据库onupgradeneeded');

                var db = event.target.result;

                var tran = event.target.transaction;

                var os = db.createObjectStore('productInfo',{ autoIncrement: true } );
                os.createIndex('name_index','curstomName');
                os.createIndex('date_index','chartTime');

            };

            openRequest.onerror = function (event) {
                console.log('数据库onerror');
            };
            openRequest.onsuccess = function (event) {

                console.log('数据库onsuccess');

                let db = openRequest.result;
                
                let tran = db.transaction(["productInfo"], "readwrite");

                var chartInfo = tran.objectStore("productInfo");

                let req = chartInfo.add(info);

                req.onsuccess = function () {
                    alert("保存完成");
                };
                req.onerror = function () {
                    alert("保存失败!"+req.error);
                };
            };
        },
        backLastPage(){
            this.$router.back();
        },
        printChart(){
            var chart = document.getElementById("myHotTable");
            console.log(chart.innerHTML);
            var newContent =chart.innerHTML;
            var oldContent = document.body.innerHTML;
            document.body.innerHTML = newContent;
            window.print();
            window.location.reload();
            document.body.innerHTML = oldContent;
        },
    }
}
</script>

<style src="../../node_modules/handsontable/dist/handsontable.full.css">

</style>

<style>

table,table tr th, table tr td { 
    border:1px solid #000000; 
}

table { 
    width: 80%;
    min-height: 25px; 
    line-height: 25px; 
    text-align: center; 
    border-collapse: collapse; 
    padding: 10%;
} 

</style>>