import React from 'react'
import {Flex,Toast} from 'antd-mobile'
import SearchHeader from '../../components/SearchHeader'
import { List,AutoSizer, WindowScroller,InfiniteLoader } from 'react-virtualized'
import HouseItem from '../../components/HouseItem'
import styles from './index.module.css'
import Filter from './components/Filter/index'
import Sticky from '../../components/Sticky'
import NoHouse from '../../components/NoHouse'
import { Api } from '../../utils/api';
import { BASE_URL } from '../../utils/url';
// 获取本地存储的数据
// const {label,value}=JSON.parse(localStorage.getItem('hkzf-city'))
export default class HouseList extends React.Component{
    state = {
        list:[],
        count:0,
        isLoading:false
    }
    label = ''
    value = ''
    // 初始化filters
    filters={}
    componentDidMount(){
        const {label,value}=JSON.parse(localStorage.getItem('hkzf-city'))
        this.label = label
        this.value = value
        this.searchHouseList()
    }
    //获取数据
    async searchHouseList (){
        Toast.loading('加载中...', 0, null, false)
        const {value} = JSON.parse(localStorage.getItem('hkzf-city'))
        const {data:res} = await Api.get(`/houses`,{
            params:{
                cityId:value,
                ...this.filters,
                start:1,
                end:20
            }
        })
        console.log(res)
        const {list,count} = res.body
        Toast.hide()
        if(count!==0){
            Toast.info(`共找到 ${count} 套房源`, 2, null, false)
        }
        this.setState({
            list,
            count,
            isLoading:true
        })
    }
    onFilter = (filters)=>{
        //添加筛选功能重新置顶的效果、
        window.scrollTo(0,0)
        this.filters = filters
        this.searchHouseList()
    }
    // 渲染列表
    renderHouseList=({
        key, // Unique key within array of rows
        index, // 索引号
        style // 注意：重点属性，一定要给每一个行数据添加该样式！作用：指定每一行的位置
      }) =>{
        //   console.log(this)
        const {list } =this.state
        const house = list[index]
        if(!house){
            return (
                <div style={style} key={key}>
                    <p className={styles.loading}></p>
                </div>
            )
        }
        // console.log(letter)
        // console.log(cityIndex)
        // console.log(house)
        return (
            <HouseItem style={style} key={key} src={BASE_URL+ house.houseImg} title={house.title} desc={house.desc} tags={house.tags} price={house.price} onClick={()=>this.props.history.push(`/detail/${house.houseCode}`)} ></HouseItem>
             )
    }
      // 判断列表中的每一行是否加载完成
    isRowLoaded=({index})=>{
        return !!this.state.list[index]
    }
    loadMoreRows = ({ startIndex, stopIndex }) => {
        // console.log(startIndex, stopIndex)
        return new Promise (resolve=>{
         // 数据加载完成时，调用 resolve 即可
         Api.get(`/houses`,{
            params:{
                cityId:this.value,
                ...this.filters,
                start:startIndex,
                end:stopIndex
            }
        }).then(res=>{
            this.setState({
                list:[...this.state.list,...res.data.body.list]
            })
        })
        resolve()
        })
    }
    renderList(){
        const { count,isLoading } = this.state
        if (count === 0&&isLoading) {
          return <NoHouse>没有找到房源，请您换个搜索条件吧~</NoHouse>
        }
        return (
            <div className={styles.houseItems}>
            <InfiniteLoader isRowLoaded={this.isRowLoaded}
             loadMoreRows={this.loadMoreRows}
             rowCount={count}>
                {({ onRowsRendered, registerChild })=>(
                 <WindowScroller>
                 {({height, isScrolling, scrollTop})=>(
                     <AutoSizer>
                      {({width})=>(
                     <List
                     onRowsRendered={onRowsRendered}
                     ref={registerChild}
                     autoHeight // 设置高度为 WindowScroller 最终渲染的列表高度
                     width={width} // 视口的宽度
                     height={height} // 视口的高度
                     rowCount={this.state.count} // List列表项的行数
                     rowHeight={120} // 每一行的高度
                     rowRenderer={this.renderHouseList} // 渲染列表项中的每一行
                     isScrolling={isScrolling}
                     scrollTop={scrollTop}
                     />
                     )}
                     </AutoSizer>
                 )}
             </WindowScroller>
                )}
            </InfiniteLoader>
        </div>
        )
    }
  render(){
        return(
            <div>
                <Flex className={styles.header}>
                    <i className='iconfont icon-back' onClick={()=>this.props.history.go(-1)}></i>
                    <SearchHeader cityName={this.label} className={styles.searchHeader}></SearchHeader>
                </Flex>
                {/* 筛选栏 */}
                <Sticky height={40}>
                <Filter onFilter={this.onFilter}></Filter>
                </Sticky>
                 {/* 房屋列表 */}
                <div className={styles.houseItems}>{this.renderList()}</div>
            </div>
        )
    }
}
