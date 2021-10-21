import React from 'react'
// import './index.scss'
import styles from './index.module.css'
import NavHeader from '../../components/NavHeader'
import { Link } from 'react-router-dom'
import { Toast } from 'antd-mobile'
import HouseItem from '../../components/HouseItem'
import {BASE_URL} from '../../utils/url.js'
// import axios from 'axios'
// axios.defaults.baseURL = 'http://localhost:8080'
import {Api} from '../../utils/api'
//解决eslint中bmap不加windowde 问题
const BMap = window.BMap
// 覆盖物样式
const labelStyle = {
    cursor: 'pointer',
    border: '0px solid rgb(255, 0, 0)',
    padding: '0px',
    whiteSpace: 'nowrap',
    fontSize: '12px',
    color: 'rgb(255, 255, 255)',
    textAlign: 'center'
  }
export default class Map extends React.Component{
    state = {
        // 小区房源列表
        houseList:[],
        // 是否显示列表
        isShowList:false
    }
    componentDidMount(){
        this.initMap()
    }
    // 初始化地图
    initMap(){
        const {label,value}= JSON.parse(localStorage.getItem('hkzf-city'))
        // console.log(label,value)
        const map = new BMap.Map('container')
         // 作用：能够在其他方法中通过 this 来获取到地图对象
         this.map = map
        // 创建地址解析器实例     
        const myGeo = new BMap.Geocoder();      
        // 将地址解析结果显示在地图上，并调整地图视野    
        myGeo.getPoint(label, async (point)=>{      
            if (point) {      
                map.centerAndZoom(point, 11);      
                // map.addOverlay(new BMap.Marker(point));
               // 添加控件   
               map.addControl(new BMap.NavigationControl())
               map.addControl(new BMap.ScaleControl())
               this.renderOverlays(value)
               //获取房源信息数据
            //    const {data:res} = await axios.get(`/area/map?id=${value}`)
            // //    console.log(res)
            //    res.body.forEach(item=>{
            //     //    console.log(item)
            //     const {count,label:areaName,value,coord:{latitude,longitude}} = item
            //     //  创建覆盖物
            //     const areaPoint = new BMap.Point(longitude,latitude)
            //     const opts = {
            //         position:areaPoint,
            //         offset:new BMap.Size(-35,-35)
            //     }
            //     const label = new BMap.Label('',opts)
            //      //创建唯一标识
            //      label.id = value
                

            //      // 设置房源覆盖物内容
            //         label.setContent(`
            //         <div class="${styles.bubble}">
            //         <p class="${styles.name}">${areaName}</p>
            //         <p>${count}套</p>
            //         </div>
            //     `)
            // //   console.log(count,areaName,value,latitude,longitude)
            //     label.setStyle(labelStyle)
            //     label.addEventListener('click',()=>{
            //         console.log('haha',label.id)
            //         map.centerAndZoom(areaPoint,13)
            //      // 解决清除覆盖物时，百度地图API的JS文件自身报错的问题
            //      setTimeout(()=>{
            //          map.clearOverlays()
            //      },0)
            //     })
            //     map.addOverlay(label)
            //    }) 
            }      
        }, 
        label);
        // 地图移动事件
        map.addEventListener('movestart',()=>{
            if(this.state.isShowList){
                this.setState({
                    isShowList:false
                })
            }
        })
    }
      // 渲染覆盖物入口
  // 1 接收区域 id 参数，获取该区域下的房源数据
  // 2 获取房源类型以及下级地图缩放级别
    async renderOverlays(id) {
        try {
            Toast.loading('加载中...', 0, null, false)
        const {data:res} = await Api.get(`/area/map?id=${id}`)
        Toast.hide()
         // 调用 getTypeAndZoom 方法获取级别和类型
         const {nextZoom,type}=this.getTypeAndZoom()
       res.body.forEach(item=>{ 
        // 创建覆盖物
        this.createOverlays(item,nextZoom,type)
       })
        } catch (e) {
        Toast.hide()            
        }
    }
    // 计算要绘制的覆盖物类型和下一个缩放级别
  // 区   -> 11 ，范围：>=10 <12
  // 镇   -> 13 ，范围：>=12 <14
  // 小区 -> 15 ，范围：>=14 <16
    getTypeAndZoom(){
        const zoom = this.map.getZoom()
        let nextZoom,type
        if(zoom>=10&&zoom<12){
            nextZoom=13
            type='circle'
        }else if(zoom>=12&&zoom<14){
            nextZoom = 15
            type = 'circle'
        }else if(zoom>=14&&zoom<16){
            type =' rect'
        }
        return {nextZoom,type}
    }
      // 创建覆盖物
    createOverlays(item,nextZoom,type) {
    const {count,label:areaName,value,coord:{longitude,latitude}} = item
    const areaPoint = new BMap.Point(longitude,latitude)

    if(type==='circle'){
        //区或镇
        this.createCircle(count,areaName,areaPoint,value,nextZoom)
    }else{
        //小区
        this.createRect(count,areaName,areaPoint,value)
    }
    }

    // 创建区、镇覆盖物
    createCircle(count,name,point,id,zoom) {
        const opts = {
                    position:point,
                    offset:new BMap.Size(-35,-35)
                }
                const label = new BMap.Label('',opts)
                 //创建唯一标识
                 label.id = id
                

                 // 设置房源覆盖物内容
                    label.setContent(`
                    <div class="${styles.bubble}">
                    <p class="${styles.name}">${name}</p>
                    <p>${count}套</p>
                    </div>
                `)
            //   console.log(count,areaName,value,latitude,longitude)
                label.setStyle(labelStyle)
                label.addEventListener('click',()=>{
                    // console.log('haha',label.id)
                    this.renderOverlays(id)
                    this.map.centerAndZoom(point,zoom)
                 // 解决清除覆盖物时，百度地图API的JS文件自身报错的问题
                 setTimeout(()=>{
                     this.map.clearOverlays()
                 },0)
                })
                this.map.addOverlay(label)
               
    }
    // 创建小区覆盖物
    createRect(count,name,point,id) {
        const opts = {
            position:point,
            offset:new BMap.Size(-50,-28)
        }
        const label = new BMap.Label('',opts)
         //创建唯一标识
         label.id = id
        

         // 设置房源覆盖物内容
            label.setContent(`
            <div class="${styles.rect}">
            <span class="${styles.housename}">${name}</span>
            <span class="${styles.housenum}">${count}套</span>
            <i class="${styles.arrow}"></i>
          </div>
        `)
    //   console.log(count,areaName,value,latitude,longitude)
        label.setStyle(labelStyle)
        label.addEventListener('click',(e)=>{
            // console.log(e)
            const {clientX,clientY} = e.changedTouches[0]
            this.map.panBy(window.innerWidth / 2 - clientX,(window.innerHeight - 330) / 2 - clientY)
         this.getHouseList(id)
        })
        this.map.addOverlay(label)
        
    }
    // 获取小区数据
    async getHouseList(id){
       try {
        Toast.loading('加载中...', 0, null, false)
        const {data:res} = await Api.get(`/houses?cityId=${id}`)
        Toast.hide()
        this.setState({
            houseList:res.body.list,
            isShowList:true
        })
       } catch (error) {
        Toast.hide()           
       }
    }
    //// 封装渲染房屋列表的方法
    renderHousesList() {
        return this.state.houseList.map(item=>
                <HouseItem  key={item.houseCode}
                src={BASE_URL + item.houseImg}
                title={item.title}
                desc={item.desc}
                tags={item.tags}
                price={item.price}></HouseItem>
               )
        
    }
    render(){
        return(
            <div className={styles.map}>
                {/* <div className={styles.test}>测试样式覆盖问题</div> */}

                <NavHeader>地图找房</NavHeader>
                <div id="container" className={styles.container}></div> 
        
            <div
            className={[
                styles.houseList,
                this.state.isShowList ? styles.show:''
            ].join(' ')}
            >
            <div className={styles.titleWrap}>
                <h1 className={styles.listTitle}>房屋列表</h1>
                <Link className={styles.titleMore} to="/home/list">
                更多房源
                </Link>
            </div>

            <div className={styles.houseItems}>
                {/* 房屋结构 */}
                {this.renderHousesList()}
            </div>
            </div>
            </div>
        )
    }
}