<template>
  <div class="test">
    <el-row>
        <el-col :span="13">
        <div id="container" style="width:100%;height:600px"></div>
        <div class="button-group">
          <input type="button" class="button" :value="online" v-on:click="hide" style="font-family:华文楷体 !important;font-size:20px" />
          <input type="button" class="button" :value="isCluster"  v-on:click="addCluster" style="font-family:华文楷体 !important;font-size:20px" />
        </div>   
        </el-col>
        <el-col :span="3">
          <div style="margin-top:10px">
              <div class="text-left" style="font-size:20px;font-family:'中易宋体';font-weight: bold;">power.v1</div>
          </div>
          <div class="textBorder">
              <input type="text" name="input1" :value="power.v1" readonly="true" class="textInput" id="areaDaily">
          </div>
          <div style="margin-top:5px">
              <div class="text-left" style="font-size:20px;font-family:'中易宋体';font-weight: bold;">power.v2</div>
          </div>
          <div class="textBorder">
              <input type="text" name="input1" :value="power.v2" readonly="true" class="textInput" id="areaDaily">
          </div>
          <div style="margin-top:5px">
              <div class="text-left" style="font-size:20px;font-family:'中易宋体';font-weight: bold;">power.i1</div>
          </div>
          <div class="textBorder">
              <input type="text" name="input1" :value="power.i1" readonly="true" class="textInput" id="areaDaily">
          </div>
        </el-col>
    </el-row>
    <div>{{power}}</div>
    <div>{{mainControl}}</div>
    <div>{{leftFront}}</div>
    <div>{{rightFront}}</div>
    <div>{{leftBehind}}</div>
    <div>{{rightBehind}}</div>
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
      .button-group 
     {
      position: absolute;
      bottom: 20px;
      left: 20px;
      padding: 10px;
     }
    .button-group .button 
     {
      height: 28px;
      line-height: 28px;
      background-color: #0D9BF2;
      color: #FFF;
      border: 0;
      outline: none;
      padding-left: 5px;
      padding-right: 5px;
      border-radius: 3px;
      margin-bottom: 4px;
      cursor: pointer;
     }
</style>

<script>
import AMap from 'AMap';
import { setInterval } from 'timers';
import { connect } from 'net';
import AMapUI from 'AMapUI';
export default {
      name: 'amap-page',
      data() {
        return {
          leftBehind:{
            time:'',
            lbderr:'',
            lbdrpm:'',
            lbdcurr:'',
            lbddeg:'',
            lbdheight:'',
            lbdtemp:'',
            lbzerr:'',
            lbzrpmL:'',
            lbzcurr:'',
            lbzdeg:'',
            lbzheight:'',
            lbztemp:'',
            lbterr:'',
            lbtrpm:'',
            lbtcurr:'',
            lbtdeg:'',
            lbtheight:'',
            lbttemp:'',
          },
          rightBehind:'',
          leftFront:'',
          rightFront:'',
          power:'',
          mainControl:'',
          zoom: 8,
          center: [121.5273285, 31.21515044],
          markersDetail: [],
          markers: [],
          infoWindow: null,
          window: '',
          map: null,
          online:'隐藏离线设备',
          isCluster:'点聚合',
          cluster:null,
          markersOnline:[]
        };
      },
  methods: {

    // 获取高德地图api
      mapReq () {
        let that = this
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
      },
      markerReq(){
        let that = this 
          AMapUI.loadUI(['overlay/SimpleMarker'], function(SimpleMarker) {
              var iconTheme = 'default';	 
              var iconStyles = SimpleMarker.getBuiltInIconStyles(iconTheme);
              var now = new Date().getTime()
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
      },
        getLeftBehind(){
        this.$api.device.LeftBehind().then((res) => {
            this.leftBehind = res.data;
            }).catch(function(res) {
            alert(res);
            });
        },
        getLeftFront(){
        this.$api.device.LeftFront().then((res) => {
            this.leftFront = res.data;
            }).catch(function(res) {
            alert(res);
            });
        },
        getRightFront(){
        this.$api.device.RightFront().then((res) => {
            this.rightFront = res.data;
            }).catch(function(res) {
            alert(res);
            });
        },
        getRightBehind(){
        this.$api.device.RightBehind().then((res) => {
            this.rightBehind = res.data
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
            let that = this
            this.$api.device.markers().then((res) =>{
            this.markersDetail = res.data;
            var now = new Date().getTime()
            this.markersOnline= []
            AMapUI.loadUI(['overlay/SimpleMarker'], function(SimpleMarker) {
              var iconTheme = 'default';	 
              var iconStyles = SimpleMarker.getBuiltInIconStyles(iconTheme);
              if(that.online=="隐藏离线设备"){
                    //目前是显示离线设备
                    if(that.infoWindow.getIsOpen()){
                        for(var i=0; i<that.markersDetail.length;i++){
                            //marker位置
                            that.markers[i].setPosition([that.markersDetail[i].lnt, that.markersDetail[i].lat])
                            //样式变化
                            let date = that.markersDetail[i].time;
                            date = date.substring(0,19);    
                            date = date.replace(/-/g,'/'); 
                            var markerTime = new Date(date).getTime();
                            if(now - markerTime <=180000){
                              that.markers[i].setIconStyle(iconStyles[2])
                              that.markersOnline.push(that.markers[i])
                            }else{
                              that.markers[i].setIconStyle(iconStyles[10])
                            }
                            //窗体位置
                            if(that.infoWindow.getContent() == that.markers[i].content) {
                              that.infoWindow.setPosition([that.markersDetail[i].lnt, that.markersDetail[i].lat])
                            }
                            that.markers[i].show();
                        }
                    }
                    else{
                        for(var i=0; i<that.markersDetail.length;i++){
                            //marker位置
                            that.markers[i].setPosition([that.markersDetail[i].lnt, that.markersDetail[i].lat])
                            //样式变化
                            let date = that.markersDetail[i].time;
                            date = date.substring(0,19);    
                            date = date.replace(/-/g,'/'); 
                            var markerTime = new Date(date).getTime();
                            if(now - markerTime <=180000){
                              that.markers[i].setIconStyle(iconStyles[2])
                              that.markersOnline.push(that.markers[i])
                            }else{
                              that.markers[i].setIconStyle(iconStyles[10])
                            }
                            that.markers[i].show();
                        }
                    }
              }else{
                    //目前是隐藏离线设备
                    if(that.infoWindow.getIsOpen()){
                        for(var i=0; i<that.markersDetail.length;i++){
                            //marker位置
                            that.markers[i].setPosition([that.markersDetail[i].lnt, that.markersDetail[i].lat])
                            //样式变化
                            let date = that.markersDetail[i].time;
                            date = date.substring(0,19);    
                            date = date.replace(/-/g,'/'); 
                            var markerTime = new Date(date).getTime();
                            if(now - markerTime <=180000){
                              that.markers[i].setIconStyle(iconStyles[2])
                              //在线设备要全部显示
                              //窗体位置
                              if(that.infoWindow.getContent() == that.markers[i].content) {
                                that.infoWindow.setPosition([that.markersDetail[i].lnt, that.markersDetail[i].lat])
                              }
                              that.markers[i].show();
                              that.markersOnline.push(that.markers[i])
                            }else{
                              that.markers[i].setIconStyle(iconStyles[10])
                              //离线设备要隐藏
                              that.markers[i].hide();
                              //窗体位置
                              if(that.infoWindow.getContent() == that.markers[i].content) {
                                that.infoWindow.close();
                              }
                            }
                        }
                    }else{
                        for(var i=0; i<that.markersDetail.length;i++){
                            //marker位置
                            that.markers[i].setPosition([that.markersDetail[i].lnt, that.markersDetail[i].lat])
                            //样式变化
                            let date = that.markersDetail[i].time;
                            date = date.substring(0,19);    
                            date = date.replace(/-/g,'/'); 
                            var markerTime = new Date(date).getTime();
                            if(now - markerTime <=180000){
                              that.markers[i].setIconStyle(iconStyles[2])
                              that.markers[i].show();
                              that.markersOnline.push(that.markers[i])
                            }else{
                              that.markers[i].setIconStyle(iconStyles[10])
                              that.markers[i].hide();
                            }
                        }
                    }

              }
            })
            })
        },
        markerClick(e) {
        this.infoWindow.setContent(e.target.content);
        this.infoWindow.open(this.map, e.target.getPosition());
        },
        //是否隐藏离线设备
        hide(){
         if(this.online == "隐藏离线设备"){
           this.online = "显示离线设备"
         }else{
           this.online = "隐藏离线设备"
         }
         //切换的时候主动更新
         this.updateCluster()
        },
        //改变的是标志
        addCluster(){
          let that = this
          that.map.plugin(["AMap.MarkerClusterer"],function(){
          //原来是无聚合，转为点聚合
          if(that.isCluster == "点聚合"){
            that.isCluster = "无聚合"
            if(that.cluster) {     
                that.cluster.setMap(null);  
            }
            //说明目前为显示离线设备   
            if(that.online == "隐藏离线设备"){
              that.cluster = new AMap.MarkerClusterer(that.map,that.markers); 
            }else{
            //隐藏离线设备
              that.cluster = new AMap.MarkerClusterer(that.map,that.markersOnline); 
            }
          }else{
          //原来是点聚合，转为无聚合
            that.isCluster = "点聚合"
            if(that.cluster) {     
                that.cluster.setMap(null);  
            }
            for(let i=0;i<that.markers.length;i++){
              that.markers[i].setMap(that.map)
            }
          }
          })
        },
        //定期更新状态
        updateCluster(){
          let that = this
          that.map.plugin(["AMap.MarkerClusterer"],function(){
          //点聚合
          if(that.isCluster == "无聚合"){
            if(that.cluster) {     
              that.cluster.setMap(null);  
            }
            //说明目前为显示离线设备   
            if(that.online == "隐藏离线设备"){
              that.cluster = new AMap.MarkerClusterer(that.map,that.markers); 
            }else{
            //隐藏离线设备
              that.cluster = new AMap.MarkerClusterer(that.map,that.markersOnline); 
            }
          }else{
          //无聚合
            if(that.cluster) {     
                that.cluster.setMap(null);  
            }
            for(let i=0;i<that.markers.length;i++){
              that.markers[i].setMap(that.map)
            }
          }
          })
        },
        updateData(){
          this.getLeftFront();
          this.getLeftBehind();
          this.getRightFront();
          this.getRightBehind();
          this.getPower();
          this.getMainControl();
        }
 
  },
  mounted(){
      //初始化页面
      this.updateData();
      this.getMarkersDetail(); 
      //更新信息
      setInterval(this.updateData,1000)
      setInterval(this.updateMap,500) 
      //点聚合更新
      setInterval(this.updateCluster,60*1000)
  }
}
</script>
