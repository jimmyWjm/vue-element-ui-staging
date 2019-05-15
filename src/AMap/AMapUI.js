// UI.js
// 高德map   https://webapi.amap.com/maps?v=1.4.11&key=你的高德地图的key
export default function MapUILoader () {
    return new Promise((resolve, reject) => {
      if (window.AMapUI) {
        resolve(window.AMapUI)
      } else {
        var script = document.createElement('script')
        script.type = 'text/javascript'
        script.async = true
        script.src =
          'http://webapi.amap.com/ui/1.0/main.js'
        script.onerror = reject
        document.head.appendChild(script)
      }
      window.initAMapUI = () => {
        resolve(window.AMapUI)
      }
    })
  }