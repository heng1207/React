import React from 'react'
import { Toast} from 'antd-mobile'
import { List,AutoSizer } from 'react-virtualized'
import NavHeader from '../../components/NavHeader'
import './index.scss'
// import styles from './index.module.css'
import axios from 'axios'
import {getCurrentCity} from '../../utils'
const formatCityData = (list)=>{
    const cityList = {}
    list.forEach(item=>{
        const first = item.short.substr(0,1)
        if(cityList[first]){
        cityList[first].push(item)
        }else{
            cityList[first]=[item]
        }
    })
    const cityIndex = Object.keys(cityList).sort()
    return {
    cityList,
    cityIndex
    }
}
// 列表数据的数据源
// 索引（A、B等）的高度
const TITLE_HEIGHT = 36
// 每个城市名称的高度
const NAME_HEIGHT = 50
// const list = Array(100).fill('wkedsadasd')
const HOUSE_CITY = ['北京', '上海', '广州', '深圳']

const formatCityIndex=(letter)=>{
  switch (letter) {
      case '#':
          return '当前定位'
      case 'hot':
          return '热门城市'
      default:
          return letter.toUpperCase()
  }
}


export default class CityList extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            cityList:{},
            cityIndex:[],
            activeIndex:0
        }
        this.cityListComponent = React.createRef()
    }
    async componentDidMount(){
        await this.getCityList()
        this.cityListComponent.current.measureAllRows()
    }
    // 获取城市列表数据
    async getCityList(){
    const {data:res} = await axios.get(`http://localhost:8080/area/city?level=1`)
    const {cityList,cityIndex} = formatCityData(res.body)
    // 获取热门城市数据
    const {data:resHot} = await axios.get(`http://localhost:8080/area/hot`)
    cityList['hot'] = resHot.body
    cityIndex.unshift('hot')
    // 获取定位
    const curCity = await getCurrentCity()
    cityList['#'] = [curCity]
    cityIndex.unshift('#')
    // console.log(cityList,cityIndex,curCity)
    this.setState({
        cityList,
        cityIndex
    })
    }
    // 切换城市
    cityChange({label,value}){
     if(HOUSE_CITY.indexOf(label)>-1){
        localStorage.setItem('hkzf-city',JSON.stringify({label,value}))
        this.props.history.go(-1)
     }else{
        Toast.info('该城市暂无房源信息',1,null,false)
     }
    }
    // 渲染每一行数据的渲染函数
    // 函数的返回值就表示最终渲染在页面中的内容
    rowRenderer=({
        key, // Unique key within array of rows
        index, // 索引号
        isScrolling, // 当前项是否正在滚动中
        isVisible, // 当前项在 List 中是可见的
        style // 注意：重点属性，一定要给每一个行数据添加该样式！作用：指定每一行的位置
      }) =>{
        //   console.log(this)
        const {cityIndex,cityList} = this.state
        const letter = cityIndex[index]
        // console.log(letter)
        // console.log(cityIndex)
        return (
            <div key={key} style={style} className="city">
            <div className="title">{formatCityIndex(letter)}</div>
             {cityList[letter].map(item=>(
              <div className="name" key={item.value} onClick={()=>this.cityChange(item)}>{item.label}
               </div>
             ))}
          </div>
        )
      }
      //动态计算每行的高度
      getRowHeight=({index})=>{
          const {cityIndex,cityList} = this.state
          return TITLE_HEIGHT+cityList[cityIndex[index]].length*NAME_HEIGHT
      }
       // 封装渲染右侧索引列表的方法
       renderCityIndex(){
           const {cityIndex,activeIndex} = this.state
           return cityIndex.map((item,index)=>(
            <li className="city-index-item" key={item} onClick={()=>{
                 this.cityListComponent.current.scrollToRow(index)
            }}>
            <span className={activeIndex===index?'index-active':''}>
              {item==='hot'?'热':item.toUpperCase()}
            </span>
          </li>
           ))
       }
       //  滚动屏幕发生右侧列表切换
       onRowsRendered = ({startIndex})=>{
        //    console.log(startIndex)
           if(this.state.activeIndex!==startIndex){
               this.setState({
                activeIndex:startIndex
               })
           }
       }
    render(){
        return(
            <div className='citylist'>
                <NavHeader>城市选择</NavHeader>
                {/* 城市列表 */}
                <AutoSizer>
                    {({width,height})=>(
                        <List
                        scrollToAlignment='start'
                        ref={this.cityListComponent}
                        width={width}
                        height={height}
                        rowCount={this.state.cityIndex.length}
                        rowHeight={this.getRowHeight}
                        rowRenderer={this.rowRenderer}
                        onRowsRendered={this.onRowsRendered}
                        />
                    )}
                </AutoSizer>
                
                {/* 右侧索引列表 */}
                {/* 
                1 封装 renderCityIndex 方法，用来渲染城市索引列表。
                2 在方法中，获取到索引数组 cityIndex ，遍历 cityIndex ，渲染索引列表。
                3 将索引 hot 替换为 热。
                4 在 state 中添加状态 activeIndex ，指定当前高亮的索引。
                5 在遍历 cityIndex 时，添加当前字母索引是否高亮的判断条件。
                */}
                <ul className="city-index">{this.renderCityIndex()}</ul>
                {/* <div className="test">测试样式覆盖问题</div> */}
                
                {/* <div className={styles.test}>测试样式覆盖问题</div> */}
            </div>
        )
    }
}