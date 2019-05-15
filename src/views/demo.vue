<template>
  <div class="test">
    <div id="container" style="width:600px;height:600px"></div>
    <div>{{data}}</div>
    <div>{{power}}</div>
    <div>{{mainControl}}</div>
    <div>按照data.number的形式取具体属性: {{data.number}}</div>
  </div>
</template>
<script>
import MapLoader from '@/AMap/AMap.js'
import { setInterval } from 'timers';

export default {
      name: 'amap-page',
      data() {
        return {
          data:'',
          power:'',
          mainControl:'',
          count: 1,
          slotStyle: {
            padding: '2px 8px',
            background: '#eee',
            color: '#333',
            border: '1px solid #aaa'
          },
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
        for(let i=0;i<that.markersDetail.length;i++){
            let marker = new AMap.Marker({
              position: [that.markersDetail[i].lnt,that.markersDetail[i].lat],
              offset: new AMap.Pixel(-10, -20) //图标点的位置
            })
            marker.setMap(that.map)
            //存储内容
            marker.content='<h3><b>设备号:</b>'+that.markersDetail[i].dev_id
            that.markers.push(marker)
            var infoWindow=new AMap.InfoWindow({offset: new AMap.Pixel(0, -10),closeWhenClickMap: true});
            infoWindow.setContent(marker.content);
            that.infoWindow = infoWindow
            AMap.event.addListener(marker, 'click', that.markerClick); 
        }
      }, e => {
        console.log('地图加载失败', e)
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
                let markers = [];
                this.mapReq()
                this.markers = markers;

            })
        },
        //地图更新
        updateMap(){
            this.$api.device.markers().then((res) =>{
                this.markersDetail = res.data;
                if(this.infoWindow.getIsOpen()){
                     for(var i=0; i<this.markersDetail.length;i++){
                       this.markers[i].setPosition([this.markersDetail[i].lnt, this.markersDetail[i].lat])
/*                        console.log(this.infoWindow.getContent())
                       console.log(this.markers[i].content) */
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
      setInterval(this.getData,1000)
      setInterval(this.getPower,1000)
      setInterval(this.getMainControl,1000)
      setInterval(this.updateMap,1000)
  }
}
</script>
