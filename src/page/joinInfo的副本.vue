<template>
  <div>
      <div>
          <table id="firstTable">
              <tbody>
                  <tr>
                      <th>客户姓名</th>
                      <th>时间</th>
                      <th>商品名</th>
                      <th>备注</th>
                      <th>金额合计（元）</th>
                  </tr>
                  <tr>
                      <td>
                          <input type="text" id="curstomName">
                      </td>
                      <td>
                          <input type="date" name="" id="chartTime">
                      </td>
                      <td>
                          <input type="text" id="productName">
                      </td>
                      <td>
                          <input type="text" id="note">
                      </td>
                      <td>
                          <input type="number" name="" id="totalPrice">
                      </td>
                  </tr>
              </tbody>
          </table>
      </div>
      
      <div align=left float=left>
          <button @click="addRow()">增加一行</button>
          <button @click="deleteLastRow()">删除一行</button>
      </div>
      
      <div>
          <table id="tableInfo">

            <tr id="row0">
                <th>规格</th>
                <th>样式</th>
                <th>单位</th>
                <th>数量</th>
                <th>价格（元）</th>
                <th>金额（元）</th>
            </tr>

            <tr id="row1">

                <td>
                    <input type="text" name="specifName1" id="specifName1">
                </td>

                <td>
                    <input type="text" name="styleName1" id="styleName1">
                </td>

                <td>
                    <input type="text" name="unitName1" id="unitName1">
                </td>

                <td>
                    <input type="number" name="numName1" id="numName1">
                </td>

                <td>
                    <input type="number" name="priceName1" id="priceName1">
                </td>

                <td>
                    <input type="number" name="allPriceName1" id="allPriceName1" v-model="allPriceInput">
                </td>
            </tr>
          </table>
      </div>
      <div align=right>
          <button @click="saveAllInfo()">保存</button>
      </div>
      <div align=right>
          <button @click="backLastPage()">返回</button>
      </div>
  </div>
</template>

<script>

var rowNum = 1;

// var db = null;

// var objectStore = null;

// function simpleInfo (curstomName,chartTime,productName,note,totalPrice,subInfoArray) {

//     this.curstomName = curstomName;
//     this.chartTime = chartTime;
//     this.productName = productName;
//     this.note = note;
//     this.totalPrice = totalPrice;
//     this.subInfoArray = subInfoArray;
// }

// function arrayInfo (specifName,styleName,unitName,numName,priceName,allPriceName) {

//     this.specifName = specifName;
//     this.styleName = styleName;
//     this.unitName = unitName;
//     this.numName = numName;
//     this.priceName = priceName;
//     this.allPriceName = allPriceName;
// }

export default {
    name: "joinInfo",

    data: function () {
        return {
            totalAllprice: 0,
            allPriceInput: '',
        };
    },

    watch: {
        allPriceInput: function (newValue,oldValue) {
            this.totalAllprice = newValue;
        },
    },

    methods: {

        addRow () {

            rowNum = rowNum + 1;

            var mytable = document.getElementById("tableInfo");

            var row = document.createElement("tr");
            row.id = "row"+rowNum;

            var td1 = document.createElement("td");
            td1.innerHTML = "<input type='text' name='specifName"+rowNum+"' id='specifName"+rowNum+"'>";

            var td2 = document.createElement("td");
            td2.innerHTML = "<input type='text' name='styleName"+rowNum+"' id='styleName"+rowNum+"'>";

            var td3 = document.createElement("td");
            td3.innerHTML = "<input type='text' name='unitName"+rowNum+"' id='unitName"+rowNum+"'>";

            var td4 = document.createElement("td");
            td4.innerHTML = "<input type='number' name='numName"+rowNum+"' id='numName"+rowNum+"'>";

            var td5 = document.createElement("td");
            td5.innerHTML = "<input type='number' name='priceName"+rowNum+"' id='priceName"+rowNum+"'>";

            var td6 = document.createElement("td");
            td6.innerHTML = "<input type='number' name='allPriceName"+rowNum+"' id='allPriceName"+rowNum+"'>";

            row.appendChild(td1);
            row.appendChild(td2);
            row.appendChild(td3);
            row.appendChild(td4);
            row.appendChild(td5);
            row.appendChild(td6);

            mytable.appendChild(row);
        },

        deleteLastRow() {

            if(rowNum > 1) {

                var table = document.getElementById("tableInfo");
                table.deleteRow(rowNum+1);
                rowNum = rowNum - 1;
            }
        },

        saveMainInfo() {

            var obj = {};

            var curstomNameId = "curstomName";
            var curstomName = document.getElementById(curstomNameId).value;

            var chartTimeId = "chartTime";
            var chartTime = document.getElementById(chartTimeId).value;

            var productNameId = "productName";
            var productName = document.getElementById(productNameId).value;

            var noteId = "note";
            var note = document.getElementById(noteId).value;

            var totalPriceId = "totalPrice";
            var totalPrice = document.getElementById(totalPriceId).value;

            obj.curstomName = curstomName;
            obj.chartTime = chartTime;
            obj.productName = productName;
            obj.note = note;
            obj.totalPrice = totalPrice;
            obj.subInfoArray = [];

            return obj;
        },

        saveSubInfo() {

            var array = new Array();

            for (var index = 1; index <= rowNum; index++) {

                var specifId = "specifName"+index;
                var specifName = document.getElementById(specifId).value;

                var styleId = "styleName"+index;
                var styleName = document.getElementById(styleId).value;

                var unitId = "unitName"+index;
                var unitName = document.getElementById(unitId).value;

                var numId = "numName"+index;
                var numName = document.getElementById(numId).value;

                var priceId = "priceName"+index;
                var priceName = document.getElementById(priceId).value;

                var allPriceId = "allPriceName"+index;
                var allPriceName = document.getElementById(allPriceId).value;

                // var sunInfo = new Object();
                
                // sunInfo.specifName = specifName;
                // sunInfo.styleName = styleName;
                // sunInfo.unitName = unitName;
                // sunInfo.numName = numName;
                // sunInfo.priceName = priceName;
                // sunInfo.allPriceName = allPriceName;
                
                // array.push(sunInfo);

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
    }
}
</script>

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

div {
    padding: 10px;
    left: 0px;
}

</style>>