import React, { Component } from 'react'
import {SearchBar} from 'antd-mobile'
import styles from './index.module.css'
import {Api} from '../../../utils'
import {getCity} from '../../../utils/city'
export default class RentAdd extends Component {
    cityId = getCity().value
    timeId = null
    state={
        searchTxt:'',
        tipList:[]
    }
    handleSearchTxt=(value)=>{
        this.setState({
            searchTxt:value
        })
        if(!value){
            return this.setState({
                tipList:[]
            })
           
        }
        clearTimeout(this.timeId)
        this.timeId = setTimeout(async ()=>{
            const res = await Api.get('area/community',{
                params:{
                    name:value,
                    id:this.cityId
                }
            })
            console.log(this.cityId)
            console.log(res)
            this.setState({
                tipList:res.data.body
            })
        },800)
    }
    renderTips=()=>{
        const {tipList} = this.state
        return tipList.map(item=>(
            <li key={item.community} className={styles.tip} onClick={()=>this.tipClick(item)}>{item.communityName}</li>
        ))
    }
    tipClick=(item)=>{
    const {community,communityName} = item
    this.props.history.replace('/rent/add',{
        name:communityName,
        id:community
    })
    }
    render(){
        const {history} = this.props
        const {searchTxt} = this.state
        return(
            <div className={styles.root}>
            {/* 搜索框 */}
            <SearchBar
                placeholder="请输入小区或地址"
                value={searchTxt}
                onChange={this.handleSearchTxt}
                showCancelButton={true}
                onCancel={() => history.go(-1)}
            />

            {/* 搜索提示列表 */}
            <ul className={styles.tips}>{this.renderTips()}</ul>
            </div>
    )
    }
}