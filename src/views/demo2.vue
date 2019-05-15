<template>
  <div class="test">
    <div id="container" style="width:100%;height:300px"></div>
  </div>
</template>
<script>
import MapLoader from '@/AMap/AMap.js'

export default {
  data () {
    return {
      map: null
    }
  },
  methods: {
    // 查看位置
    lookMap (row) {
      this.$nextTick(function () {
        this.mapReq(row.reportPlace)
      })
    },
 
    // 获取高德地图api
    mapReq (mapData) {
      let that = this
      MapLoader().then(AMap => {
        console.log('地图加载成功')
        that.map = new AMap.Map('container', {
          resizeEnable: true,
          center: mapData.jwNum,//地图标记title
          zoom: 12 //地图视图缩放级别
        })
        let marker = new AMap.Marker({
          position: that.map.getCenter(),
          offset: new AMap.Pixel(-30, -60) //图标点的位置
        })
        marker.setMap(that.map)
        // 设置label标签
        // label默认蓝框白底左上角显示，样式className为：amap-marker-label
        marker.setLabel({
          // 修改label相对于maker的位置
          offset: new AMap.Pixel(30, -80),//点标记定位
          content: `<div style='width:320px;height:160px;background:#fff;border-radius:3px;border:1px solid #e6e6e6;font-size:12px;box-shadow:5px 5px 5px #999;'>
          <h5 style='text-align:center;margin:0;padding:10px;border-bottom:1px solid #e6e6e6;font-size:16px;'>` + mapData.title + `</h5>
            <div style='padding:5px;'>
              <p style='margin:8px 0;'>检测师：` + mapData.name + `</p>
              <p style='margin:8px 0;'>检测时间：` + mapData.dateTime + `</p>
              <p style='margin:8px 0;white-space:pre-wrap;'>地址：` + mapData.address + `</p>
              <p style='margin:8px 0;'>查看报告：<a href="` + mapData.urls + `" target="_bank">` + mapData.reportNum + `</a></p>
            </div>
        </div> `
        })
      }, e => {
        console.log('地图加载失败', e)
      })
    }
 
  },
  mounted(){
    this.mapReq();
  }
}
</script>
