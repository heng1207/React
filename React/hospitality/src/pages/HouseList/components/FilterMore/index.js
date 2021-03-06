import React, { Component } from 'react'

import FilterFooter from '../../../../components/FilterFooter'

import styles from './index.module.css'

/* 
  获取选中值以及设置高亮：

  1 在 state 中添加状态 selectedValues（表示选中项的值）。
  2 给标签绑定单击事件，通过参数获取到当前项的 value。
  3 判断 selectedValues 中是否包含当前项的 value 值。
  4 如果不包含，就将当前项的 value 添加到 selectedValues 数组中。
  5 如果包含，就从 selectedValues 数组中移除（使用数组的 splice 方法，根据索引号删除）。
  6 在渲染标签时，判断 selectedValues 数组中，是否包含当前项的 value，包含，就添加高亮类。
*/
export default class FilterMore extends Component {
  state = {
    selectedValues:this.props.defaultValue
  }
  //标签的点击事件
  onTagClick(value){
  const {selectedValues}= this.state
  const newSelectedValues = selectedValues
  if(newSelectedValues.indexOf(value)<=-1){
    // 没有选中的值
    newSelectedValues.push(value)
  }else{
    const index = newSelectedValues.findIndex(item=>item===value)
    newSelectedValues.splice(index,1)
  }
  this.setState({
    selectedValues:newSelectedValues
  })
  }
  // 渲染标签
  renderFilters(data) {
    const {selectedValues} = this.state
   
    // 高亮类名： styles.tagActive
    return data.map(item=>{
      const isSelected = selectedValues.indexOf(item.value)>-1
      return (
        <span onClick={()=>this.onTagClick(item.value)}  key={item.value} className={[styles.tag,isSelected?styles.tagActive:'' ].join(' ')}>{item.label}</span>
      )
    })
  }
  // 点击取消按钮  取消标签
  onCancel=()=>{
    this.setState({
      selectedValues:[],
    })
  }
   // 点击确定按钮  
  onOk=()=>{
    const {type,onSave} = this.props
    onSave(type,this.state.selectedValues)
   }
  render() {
    const {onCancel, data:{roomType, oriented, floor, characteristic},type} = this.props
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div className={styles.mask} onClick={()=>onCancel(type)}/>

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        {/* 
          底部按钮

          1 设置 FilterFooter 组件的取消按钮文字为：清除。
          2 点击取消按钮时，清空所有选中项的值（selectedValues: []）。
          3 点击确定按钮时，将当前选中项的值和 type，传递给 Filter 父组件。
          4 在 Filter 组件中的 onSave 方法中，接收传递过来的选中值，更新状态 selectedValues。

          说明：type 和 onSave 都由父组件通过 props 传递给该组件。
        */}
        <FilterFooter
          className={styles.footer}
          cancelText="清除"
          onCancel={this.onCancel}
          onOk={this.onOk}
        />
      </div>
    )
  }
}
