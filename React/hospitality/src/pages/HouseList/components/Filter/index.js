import React, { Component } from 'react'
import {Spring} from 'react-spring'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'
import {Api} from '../../../../utils/api'

import styles from './index.module.css'

// 标题高亮状态
// true 表示高亮； false 表示不高亮
const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false
}
// FilterPicker 和 FilterMore 组件的选中值
const selectedValues = {
  area: ['area', 'null'],
  mode: ['null'],
  price: ['null'],
  more: []
}
export default class Filter extends Component {
  state = {
    titleSelectedStatus,
    openType:'',
    // 所有筛选条件数据
    filtersData: {},
    selectedValues
  }
  componentDidMount(){
    this.htmlBody = document.body
    this.getFilterData()
  }
  // 获取筛选条件的所有数据
  async getFilterData(){
    const {value} = JSON.parse(localStorage.getItem('hkzf-city'))
    const {data:res} = await Api.get(`/houses/condition?id=${value}`)
    this.setState({
      filtersData:res.body
    })
  }
  // 点击事件切换高亮
  onTitleClick=(type)=>{
    this.htmlBody.className='body-fixed'
    const {titleSelectedStatus,selectedValues} = this.state
    const newTitleSelectedStatus = {...titleSelectedStatus}
    Object.keys(titleSelectedStatus).forEach(key=>{
      if(key===type){
        newTitleSelectedStatus[key] = true
        return
      }
      const selectedVal = selectedValues[key]
      if(key==='area'&& (selectedVal.length !== 2 || selectedVal[0] !== 'area')){
        newTitleSelectedStatus[key] = true
      }else if (key==='mode'&&(selectedVal[0] !== 'null')){
        newTitleSelectedStatus[key] = true
      }else if (key==='price'&&(selectedVal[0] !== 'null')){
        newTitleSelectedStatus[key] = true
      }else if(key==='more'&&selectedVal.length !== 0 ){
        newTitleSelectedStatus[key] = true
      }else{
        newTitleSelectedStatus[key] = false
      }
    })
    // console.log(newTitleSelectedStatus)
    this.setState({
      openType:type,
      titleSelectedStatus:newTitleSelectedStatus
    })
    // this.setState((prevState)=>{
    //   return {
    //     titleSelectedStatus:{
    //       ...prevState.titleSelectedStatus,
    //       [type]:true
    //     },
    //     openType:type
    //   }
    // })
  }
  // 点击取消  隐藏遮罩层
  onCancel=(type)=>{
    this.htmlBody.className=''
    const {titleSelectedStatus,selectedValues} = this.state
    const newTitleSelectedStatus = {...titleSelectedStatus}
    const selectedVal = selectedValues[type]
      if(type==='area'&& (selectedVal.length !== 2 || selectedVal[0] !== 'area')){
        newTitleSelectedStatus[type] = true
      }else if (type==='mode'&&(selectedVal[0] !== 'null')){
        newTitleSelectedStatus[type] = true
      }else if (type==='price'&&(selectedVal[0] !== 'null')){
        newTitleSelectedStatus[type] = true
      }else if(type==='more'&&selectedVal.length !== 0 ){
        newTitleSelectedStatus[type] = true
      }else{
        newTitleSelectedStatus[type] = false
      }
   this.setState({
    openType:'',
    titleSelectedStatus:newTitleSelectedStatus
   })
  }
  // 点击确定  隐藏遮罩层
  onSave=(type,value)=>{
    this.htmlBody.className=''
    const {titleSelectedStatus} = this.state
    const newTitleSelectedStatus = {...titleSelectedStatus}
    // console.log(type,value)
    const selectedVal = value
    if(type==='area'&& (selectedVal.length !== 2 || selectedVal[0] !== 'area')){
      newTitleSelectedStatus[type] = true
    }else if (type==='mode'&&(selectedVal[0] !== 'null')){
      newTitleSelectedStatus[type] = true
    }else if (type==='price'&&(selectedVal[0] !== 'null')){
      newTitleSelectedStatus[type] = true
    }else if(type==='more'&&selectedVal.length !== 0 ){
      newTitleSelectedStatus[type] = true
    }else{
      newTitleSelectedStatus[type] = false
    }
    /* 
      组装筛选条件：

      1 在 Filter 组件的 onSave 方法中，根据最新 selectedValues 组装筛选条件数据 filters。
      2 获取区域数据的参数名：area 或 subway（选中值数组的第一个元素）。
      3 获取区域数据的值（以最后一个 value 为准）。
      4 获取方式和租金的值（选中值的第一个元素）。
      5 获取筛选（more）的值（将选中值数组转化为以逗号分隔的字符串）。

      {
        area: 'AREA|67fad918-f2f8-59df', // 或 subway: '...'
        mode: 'true', // 或 'null'
        price: 'PRICE|2000',
        more: 'ORIEN|80795f1a-e32f-feb9,ROOM|d4a692e4-a177-37fd'
      }
    */
   const newSelectedValues = {
      ...this.state.selectedValues,
      [type]:value
   }
  //  console.log(newSelectedValues)
  const {area,mode,price,more} = newSelectedValues
   const filters = {}
   //获取区域数据的值
   const areaKey = area[0]
   let areaValue = 'null'
   if(area.length===3){
    areaValue=area[2]!=='null'?area[2]:area[1]
   }
   filters[areaKey]=areaValue
     // 方式和租金
     filters.mode = mode[0]
     filters.price = price[0]
    // 更多筛选条件 more
    filters.more = more.join(',')
    this.props.onFilter(filters)
    // console.log(filters)
    this.setState({
      openType:'',
      titleSelectedStatus:newTitleSelectedStatus,
      selectedValues:newSelectedValues
    })
  }
  // 封装渲染FilterPicker函数
  renderFilterPicker(){
    const {openType,filtersData:{area,subway,rentType,price},selectedValues} = this.state
    if( openType!=='area'&&openType!=='mode'&&openType!=='price'){
      return null
    }
    let data = []
    let cols = 3
    let defaultValue = selectedValues[openType]
    switch (openType) {
      case 'area':
        data = [area,subway]
        cols = 3
        break
      case 'mode':
          data = rentType
          cols = 1
          break
      case 'price':
        data = price
        cols = 1
        break
      default:
        break;
    }
    return <FilterPicker key={openType} onCancel={this.onCancel} onSave={this.onSave} data={data} cols={cols} type={openType} defaultValue={defaultValue}/>
  }
  /* 
    1 封装 renderFilterMore 方法，渲染 FilterMore 组件。
    2 从 filtersData 中，获取数据（roomType, oriented, floor, characteristic），通过 props 传递给 FilterMore 组件。
    3 FilterMore 组件中，通过 props 获取到数据，分别将数据传递给 renderFilters 方法。
    4 在 renderFilters 方法中，通过参数接收数据，遍历数据，渲染标签。
  */
 //封装 renderFilterMore 方法
 renderFilterMore(){
   const {selectedValues,openType,filtersData:{roomType, oriented, floor, characteristic}} = this.state
   if(openType!=='more'){
    return null
   }
   let defaultValue = selectedValues.more
   const data = {
    roomType, oriented, floor, characteristic
   }
   return <FilterMore data={data} type={openType} onSave={this.onSave} defaultValue={defaultValue} onCancel={this.onCancel} />
 }
 // 遮罩层
 renderMask(){
   const{openType} = this.state
   const isHide = openType==='more'||openType===''
   return (<Spring from={{opacity:0}} to={{opacity:isHide?0:1}}>
    {props=>{
      if(props.opacity===0){
        return null
      }
    return (<div style={props} className={styles.mask} onClick={()=>this.onCancel(openType)}/>)
    }}
    </Spring>)
  //  if(openType==='more'||openType===''){
  //    return null
  //  }else {
  //     return <Spring from={{opacity:0}} to={{opacity:1}}>
  //    {props=>{
  //    return (<div style={props} className={styles.mask} onClick={()=>this.onCancel(openType)}/>)
  //    }}
  //    </Spring>
  //  }
 }
  render() {
    const {titleSelectedStatus} = this.state
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {/* <div className={styles.mask} /> */}
        {this.renderMask()}
        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle titleSelectedStatus={titleSelectedStatus} onClick={this.onTitleClick}/>

          {/* 前三个菜单对应的内容： */}
          {/* <FilterPicker /> */}
          {this.renderFilterPicker()}
          {/* 最后一个菜单对应的内容： */}
          {this.renderFilterMore()}
        </div>
      </div>
    )
  }
}
