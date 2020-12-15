<template>
    <div>
        <div>
            <input type="text" name="" id="nameId">
            <button @click="searchByName">按人名查询</button>
        </div>
        <br>
        <div>
            <input type="date" name="" id="dateId">
            <button  @click="searchByTime">按日期查询</button>
        </div>
        <br>
        <div>
            <button @click="backLastPage">返回</button>
        </div>
        <br>
        <div>
            <hot-table ref="hotTableComponent" :settings="hotSettings" :data="data"></hot-table>
        </div>
    </div>
</template>

<script>

import { HotTable } from '@handsontable/vue';
import Handsontable from 'handsontable';
import Vue from 'vue';

var userInfoArray=["客户姓名","时间","商品名","备注","","金额合计（元）"];
var productInfoArray=["规格","样式","单位","数量","价格（元）","金额（元）"];
var userInfoRow = [];
var proInfoRow = [];
var that = this;

export default {

    data: function() {
        return {
            data: [
                userInfoArray,
                productInfoArray
            ],
            hotSettings: {
                // data: this.data,
                licenseKey: "non-commercial-and-evaluation",
                readOnly: true,
                
            },
        };
    },
    components: {
        HotTable,
        Handsontable
    },
    methods: {

        searchByName() {
            var nameInfo = document.getElementById("nameId");
            var name = nameInfo.value;
            
            this.searchInDB(name,"name_index",this);
        },

        searchByTime() {
            var timeInfo = document.getElementById("dateId");
            var time = timeInfo.value;
            
            this.searchInDB(time,"date_index",this);
        },

        searchInDB(info,type,myThis) {

            var openRequest = window.indexedDB.open("cxr_data_product_info");

            openRequest.onupgradeneeded = function (event) {

            };
            openRequest.onsuccess = function (event) {
                console.log('数据库onsuccess');

                let db = openRequest.result;
                
                var tran = db.transaction(["productInfo"], "readonly");

                var chartInfo = tran.objectStore("productInfo");

                let infoIndexReq = chartInfo.index(type);

                var request = infoIndexReq.getAll(info);

                request.onsuccess = function () {
                    if (request.result !== undefined) {
                        console.log("信息"+JSON.stringify(request.result)); 
                        myThis.showInfo(request.result);
                    } else {
                        alert("查询完成，没有相关数据");
                    }
                };
                request.onerror = function () {
                    alert("读取失败!"+request.error);
                };
            };
            openRequest.onerror = function (event) {
                alert("查询失败,还没有任何数据");
            };
        },

        showInfo(infoArray){

            var hot = this.$refs.hotTableComponent.hotInstance;

            hot.clear();

            this.data = [];
            userInfoRow = [];
            proInfoRow = [];

            infoArray.forEach(info => {

                this.data.push(userInfoArray);
                userInfoRow.push(this.data.length-1);

                var usefInfo = [info.curstomName,info.chartTime,info.productName,info.note,"",info.totalPrice];
                this.data.push(usefInfo);

                this.data.push(productInfoArray);
                proInfoRow.push(this.data.length-1);

                info.subInfoArray.forEach(element => {
                    var subInfo = [element.specifName,element.styleName,element.unitName,element.numName,element.priceName,element.allPriceName];
                    this.data.push(subInfo);
                });
            })

            // hot.updateSettings({
            //     cells: null
            // });

            hot.loadData(this.data);

            hot.updateSettings({
                cells: function (row, col, prop) {  

                    try {
                        var cellAll = hot.getCell(row,col);
                        cellAll.style.backgroundColor = "#ffffff";
                    } catch (error) {
                        
                    }
                            
                    for (let index = 0; index < userInfoRow.length; index++) {

                        var rowss = userInfoRow[index];
                        
                        for (let indexx = 0; indexx < 6; indexx++) {
                            
                            try {
                                var cell = hot.getCell(rowss,indexx);
                                                                                                                                          
                                cell.style.backgroundColor = "#220011";

                            } catch (error) {
                                
                            }
                        }
                    }

                    for (let index = 0; index < proInfoRow.length; index++) {
                        
                        var rowdd = proInfoRow[index];
                        
                        for (let indexx = 0; indexx < 6; indexx++) {
                    
                            try {
                                var cell = hot.getCell(rowdd,indexx);
                            
                                cell.style.backgroundColor = "#112288";
                            } catch (error) {
                                
                            }
                        }
                    }
                }
            });
        },
        backLastPage() {
            this.$router.back();
        }
    },
}
</script>

<style src="../../node_modules/handsontable/dist/handsontable.full.css">

/* table,table tr th, table tr td { 
    border:1px solid #000000; 
}

table { 
    width: 80%;
    min-height: 25px; 
    line-height: 25px; 
    text-align: center; 
    border-collapse: collapse; 
    padding: 10%;
}  */

/* div {
    padding: 10px;
    left: 0px;
} */

</style>