<template>
  <div class="test">
    <el-row>
        <el-col :span="13">
        <div id="container" style="width:100%;height:600px"></div>
        </el-col>
        <el-col :span="3">
          <div style="margin-top:10px">
              <div class="text-left" style="font-size:20px;font-family:'中易宋体';font-weight: bold;">data.number</div>
          </div>
          <div class="textBorder">
              <input type="text" name="input1" :value="data.number" readonly="true" class="textInput" id="areaDaily">
          </div>
          <div style="margin-top:5px">
              <div class="text-left" style="font-size:20px;font-family:'中易宋体';font-weight: bold;">data.motorId</div>
          </div>
          <div class="textBorder">
              <input type="text" name="input1" :value="data.motorId" readonly="true" class="textInput" id="areaDaily">
          </div>
          <div style="margin-top:5px">
              <div class="text-left" style="font-size:20px;font-family:'中易宋体';font-weight: bold;">data.err</div>
          </div>
          <div class="textBorder">
              <input type="text" name="input1" :value="data.err" readonly="true" class="textInput" id="areaDaily">
          </div>
        </el-col>
    </el-row>
    <div>{{data}}</div>
    <div>{{power}}</div>
    <div>{{mainControl}}</div>
  </div>
</template>
<style>
        div.text-left
     {
        font-size:17px;
        font-family:"黑体";
        font-weight: bold;
        height: 40px;
        line-height: 40px;
        display:inline-block
     }
     .textInput
     {
        border:1px solid;
        width:70px;
        height:40px;
        font-size: 17px;
        text-align:center;
        background-color:#63B8FF;
        color:white;
        display:inline-block
     }
</style>

<script>
import MapLoader from '@/AMap/AMap.js'
import { setInterval } from 'timers';
import { connect } from 'net';
import MapUILoader from '@/AMap/AMapUI.js'
export default {
      name: 'amap-page',
      data() {
        return {
          data:{
            number:'',
            motorId:'',
            err:'',
            rpm:'',
            cur:'',
            deg:'',
            height:'',
            temp:'',
            time:''
          },
          power:'',
          mainControl:'',
          zoom: 8,
          center: [121.5273285, 31.21515044],
          markersDetail: [],
          markers: [],
          infoWindow: null,
          window: '',
          map: null
        };
      },
  methods: {

    // 获取高德地图api
      mapReq () {
        let that = this
        MapLoader().then(AMap => {
          console.log('地图加载成功')
          this.markerReq();
          that.map = new AMap.Map('container', {
            resizeEnable: true,
            center: [that.markersDetail[0].lnt,that.markersDetail[0].lat],//地图标记title
            zoom: this.zoom //地图视图缩放级别
          })

          var Options = {
              position: {top:'10px',right:'10px'},
              showZoomBar: true,

          }

          that.map.plugin(["AMap.ControlBar"],function(){
              var controlBar = new AMap.ControlBar(Options)
              that.map.addControl(controlBar)
          });
        }, e => {
          console.log('地图加载失败', e)
        })
      },
      markerReq(){
        let that = this
        console.log("我执行了")
        
       MapUILoader().then(AMapUI => {
          console.log("加载UI成功")
          AMapUI.loadUI(['overlay/SimpleMarker'], function(SimpleMarker) {
              var iconTheme = 'default';	 
              var iconStyles = SimpleMarker.getBuiltInIconStyles(iconTheme);
              var now = new Date().getTime
              for(let i=0;i<that.markersDetail.length;i++){

                  let date = that.markersDetail[i].time;
                  date = date.substring(0,19);    
                  date = date.replace(/-/g,'/'); 
                  var markerTime = new Date(date).getTime();
                  var marker = null;
                  if(now - markerTime <=180000){
                    marker = new SimpleMarker({
                               iconTheme: iconTheme,
                               //使用内置的iconStyle
                               iconStyle: iconStyles[2],	   
                               map: that.map,
                               offset: new AMap.Pixel(-10, -20),
                               position:[that.markersDetail[i].lnt,that.markersDetail[i].lat],
                               });
                  }else{
                    marker = new SimpleMarker({
                               iconTheme: iconTheme,
                               //使用内置的iconStyle
                               iconStyle: iconStyles[10],	   
                               map: that.map,
                               offset: new AMap.Pixel(-10, -20),
                               position:[that.markersDetail[i].lnt,that.markersDetail[i].lat],
                               });
                  }
                  //存储内容
                  marker.content='<h3><b>设备号:</b>'+that.markersDetail[i].dev_id
                  that.markers.push(marker)
                  AMap.event.addListener(marker, 'click', that.markerClick); 
              }
                  var infoWindow=new AMap.InfoWindow({offset: new AMap.Pixel(0, -10),closeWhenClickMap: true});
                  infoWindow.setContent(marker.content);
                  that.infoWindow = infoWindow
          })
        }, e => {
        console.log('UI加载失败', e)
      })
      },
        getData(){
        this.$api.device.Data().then((res) => {
            this.data = res.data;
            }).catch(function(res) {
            alert(res);
            });
        },
        getPower(){
            this.$api.device.Power().then((res) =>{
              this.power = res.data;
            })
        },
        getMainControl(){
            this.$api.device.mainControl().then((res) =>{
              this.mainControl = res.data;
            })
        },
        //地图初始化
        getMarkersDetail(){
            this.$api.device.markers().then((res) =>{
                this.markersDetail = res.data
                this.mapReq()
                

            })
        },
        //地图更新
        updateMap(){
            this.$api.device.markers().then((res) =>{
                this.markersDetail = res.data;
                if(this.infoWindow.getIsOpen()){
                     for(var i=0; i<this.markersDetail.length;i++){
                       this.markers[i].setPosition([this.markersDetail[i].lnt, this.markersDetail[i].lat])
                       if(this.infoWindow.getContent() == this.markers[i].content) 
                      {
                       this.infoWindow.setPosition([this.markersDetail[i].lnt, this.markersDetail[i].lat])
                      }
                    }
                }else{
                    for(var i=0; i<this.markersDetail.length;i++){
                       this.markers[i].setPosition([this.markersDetail[i].lnt, this.markersDetail[i].lat])
                    }
                }
            })
        },
        markerClick(e) {
        this.infoWindow.setContent(e.target.content);
        this.infoWindow.open(this.map, e.target.getPosition());
        }
 
  },
  mounted(){
      //初始化页面
      this.getData();
      this.getPower();
      this.getMainControl();
      this.getMarkersDetail(); 
      //更新信息
/*       setInterval(this.getData,1000)
      setInterval(this.getPower,1000)
      setInterval(this.getMainControl,1000)
      setInterval(this.updateMap,1000) */
  }
}
</script>
