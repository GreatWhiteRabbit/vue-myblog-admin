<template>
  <div >
    <div>
      <div class="block">
        <span class="demonstration">默认</span>
        {{rangeTime}}
        <el-date-picker
            v-model="rangeTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            end-placeholder="结束日期">
        </el-date-picker>
        <el-button type="primary" @click="submit">确定</el-button>
      </div>

    </div>
    <div class="route">
      <div id ="box1" style="width: 1000px; height: 600px"></div>
      <div id ="box2" style="width: 50%; height: 600px; background-color: rgba(23,233,233,0.3)"></div>
      <div id ="box3" style="width: 50%; height: 600px; background-color: rgba(23,23,233,0.3)" ></div>
      <div id ="box4" style="width: 50%; height: 600px; background-color: rgba(23,233,23,0.3)"></div>
      <div id ="box5" style="width: 50%; height: 600px; background-color: rgba(23,145,140,0.3)"></div>
    </div>
  </div>

</template>

<script>

import axios from "axios";
export default {
  name: "MyEchart",
  data() {
    return{
      startTime:'2023-03-20 00:00:00',
      endTime:'2023-03-22 00:00:00',
      rangeTime:'2023-03-20',
      // 网站流量图
      option1 : {
        title: {
          text: '网站访问量',
          subtext: '数据'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          // prettier-ignore
          data: ['00:00', '01:15', '02:30', '03:45', '05:00', '06:15', '07:30', '08:45', '10:00', '11:15', '12:30', '13:45', '15:00', '16:15', '17:30', '18:45', '20:00', '21:15', '22:30', '23:45']
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} 人'
          },
          axisPointer: {
            snap: true
          }
        },
        visualMap: {
          show: false,
          dimension: 0,
          pieces: [
            {
              lte: 6,
              color: 'green'
            },
            {
              gt: 6,
              lte: 8,
              color: 'red'
            },
            {
              gt: 8,
              lte: 14,
              color: 'green'
            },
            {
              gt: 14,
              lte: 17,
              color: 'red'
            },
            {
              gt: 17,
              color: 'green'
            }
          ]
        },
        series: [
          {
            name: '访问量',
            type: 'line',
            smooth: true,
            // prettier-ignore
            data: [300, 280, 250, 260, 270, 300, 550, 500, 400, 390, 380, 390, 400, 500, 600, 750, 800, 700, 600, 400],
            markArea: {
              itemStyle: {
                color: 'rgba(255, 173, 177, 0.4)'
              },

            }
          }
        ]
      },
      // 设备图
      option2 : {
        title: {
          text: '设备分类图',
          subtext: '数据',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '值',
            type: 'pie',
            radius: '50%',
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },
      // 操作系统图
      option3 : {
        title: {
          text: 'OS分类图',
          subtext: '数据',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '值',
            type: 'pie',
            radius: '50%',
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },
      // IP所属省份图
      option4 : {
        title: {
          text: '浏览器分类图',
          subtext: '数据',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '值',
            type: 'pie',
            radius: '50%',
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },
      // 浏览器分类图
      option5 : {
        title: {
          text: 'IP地址分类图',
          subtext: '数据',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '值',
            type: 'pie',
            radius: '50%',
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },

    }
  },
  methods:{
    setEchartsOptions1() {
      var myChart = this.$echarts.init(document.getElementById("box1"));
      myChart.setOption(this.option1);
      myChart.resize(); //重绘,动态获取options时不会出现渲染异常
    },
    setEchartsOptions2() {
      var myChart = this.$echarts.init(document.getElementById("box2"));
      myChart.setOption(this.option2);
      myChart.resize(); //重绘,动态获取options时不会出现渲染异常
    },
    setEchartsOptions3() {
      var myChart = this.$echarts.init(document.getElementById("box3"));
      myChart.setOption(this.option3);
      myChart.resize(); //重绘,动态获取options时不会出现渲染异常
    },
    setEchartsOptions4() {
      var myChart = this.$echarts.init(document.getElementById("box4"));
      myChart.setOption(this.option4);
      myChart.resize(); //重绘,动态获取options时不会出现渲染异常
    },
    setEchartsOptions5() {
      var myChart = this.$echarts.init(document.getElementById("box5"));
      myChart.setOption(this.option5);
      myChart.resize(); //重绘,动态获取options时不会出现渲染异常
    },
    getData1() {
      var that = this;
      axios({
        method:'get',
        url:'/apis/browse/getSumGroupByTime',
        params:{
          startTime:this.startTime,
          endTime:this.endTime
        }
      }).then(res => {
        var data1 = [];
        var data2 = [];
       for(let i = 0; i < res.data.data.length; i++) {
        data1.push(res.data.data[i].name);
        data2.push(res.data.data[i].value);
       }
        that.option1.xAxis.data = data1;
        that.option1.series[0].data = data2;
       that.setEchartsOptions1();
      })
    },
    getData2() {
      axios({
        method:'get',
        url:'/apis/browse/getSumGroupByDevice',
        params:{
          startTime:this.startTime,
          endTime:this.endTime
        }
      }).then(res => {

        for(let i = 0; i < res.data.data.length; i++) {

          this.option2.series[0].data = res.data.data;
        }
        this.setEchartsOptions2();
      })
    },
    getData3() {
      axios({
        method:'get',
        url:'/apis/browse/getSumGroupByOS',
        params:{
          startTime:this.startTime,
          endTime:this.endTime
        }
      }).then(res => {

        for(let i = 0; i < res.data.data.length; i++) {

          this.option3.series[0].data = res.data.data;
        }
        this.setEchartsOptions3();
      })
    },
    getData4() {
      axios({
        method:'get',
        url:'/apis/browse/getSumGroupByBrowse',
        params:{
          startTime:this.startTime,
          endTime:this.endTime
        }
      }).then(res => {

        for(let i = 0; i < res.data.data.length; i++) {
          this.option4.series[0].data = res.data.data;
        }
        this.setEchartsOptions4();
      })
    },
    getData5() {
      axios({
        method:'get',
        url:'/apis/browse/getSumGroupByProvince',
        params:{
          startTime:this.startTime,
          endTime:this.endTime
        }
      }).then(res => {

        for(let i = 0; i < res.data.data.length; i++) {
          this.option5.series[0].data = res.data.data;
        }
        this.setEchartsOptions5();
      })
    },
    submit() {
      this.startTime = this.rangeTime[0];
      this.endTime = this.rangeTime[1];
      this.getData1();
      this.getData2();
      this.getData3();
      this.getData4();
      this.getData5();
    }
  },

  created() {
    this.getData1();
    this.getData2();
    this.getData3();
    this.getData4();
    this.getData5();
  }
}
</script>

<style scoped>
.route{
  display: flex;
  flex-wrap: wrap;
}
</style>