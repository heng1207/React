import React from 'react'
import { Carousel,Flex,Grid,WingBlank  } from 'antd-mobile'
import {getCurrentCity} from '../../utils'
import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'
import './index.scss'
import {BASE_URL} from '../../utils/url.js'

import axios from 'axios'
import SearchHeader from '../../components/SearchHeader'
axios.defaults.baseURL='http://localhost:8080'
// 导航菜单数据
const navs = [
    {
      id: 1,
      img: Nav1,
      title: '整租',
      path: '/home/list'
    },
    {
      id: 2,
      img: Nav2,
      title: '合租',
      path: '/home/list'
    },
    {
      id: 3,
      img: Nav3,
      title: '地图找房',
      path: '/map'
    },
    {
      id: 4,
      img: Nav4,
      title: '去出租',
      path: '/rent/add'
    }
]
// 获取地理位置
// navigator.geolocation.getCurrentPosition(position=>{
//   console.log('位置',position)
// })

export default class Index extends React.Component{
    state = {
        swiper: [],
        isSwiperLoader:false,
        groups:[],
        // 最新资讯
        news: [],
        curCityName:'上海'
      }
      // 获取轮播图数据
      async getSwiper(){
          const {data:res} = await axios.get('/home/swiper')
          this.setState({
              swiper:res.body,
              isSwiperLoader:true
          })
      }
      // 获取租房小组的数据
      async getGroups(){
        const {data:res} = await axios.get('/home/groups',{
          params:{
            area:'AREA%7C88cff55c-aaa4-e2e0'
          }
        })
        this.setState({
          groups:res.body
        })
      }
        // 获取最新资讯
      async getNews() {
        const res = await axios.get(
          '/home/news?area=AREA%7C88cff55c-aaa4-e2e0'
        )

        this.setState({
          news: res.data.body
        })
      }

      async componentDidMount() {
       this.getSwiper()
       this.getGroups()
       this.getNews()
       const curCity = await getCurrentCity()
       this.setState({
        curCityName:curCity.label
       })
      }
      // 渲染轮播图结构
      renderSwiper(){
          return this.state.swiper.map(item => (
            <a
              key={item.id}
              href="http://www.alipay.com"
              style={{ display: 'inline-block', width: '100%', height: 212 }}
            >
              <img
                src={BASE_URL+item.imgSrc}
                alt=""
                style={{ width: '100%', verticalAlign: 'top' }}
              />
            </a>
          ))
      }
       // 渲染导航菜单的结构
       renderNav(){
        return navs.map(item=>(<Flex.Item key={item.id} onClick={()=>this.props.history.push(item.path)}>
          <img src={item.img} alt=''></img>
          <h2>{item.title}</h2>
      </Flex.Item>))
      }
      // 渲染最新资讯
      renderNews() {
        return this.state.news.map(item => (
          <div className="news-item" key={item.id}>
            <div className="imgwrap">
              <img
                className="img"
                src={`http://localhost:8080${item.imgSrc}`}
                alt=""
              />
            </div>
            <Flex className="content" direction="column" justify="between">
              <h3 className="title">{item.title}</h3>
              <Flex className="info" justify="between">
                <span>{item.from}</span>
                <span>{item.date}</span>
              </Flex>
            </Flex>
          </div>
        ))
      }

      render() {
        return (
          <div>
              {/* 轮播图 */}
              <div className='swiper'>
              {this.state.isSwiperLoader?(<Carousel
              autoplay
              autoplayInterval={2000}
              infinite
            >
              {this.renderSwiper()}
            </Carousel>):('') }
              {/* 搜索框 */}
              <SearchHeader cityName={this.state.curCityName}></SearchHeader>
              </div>
            {/* 导航菜单 */}
            <Flex className='nav'>
              {this.renderNav()}
            </Flex>
             {/* 租房小组 */}
            <div className="group">
              <h3 className="group-title">
                租房小组 <span className="more">更多</span>
              </h3>
              {/* 宫格组件 */}
              <Grid square={false} hasLine={false} columnNum={2} data={this.state.groups} renderItem={item => (
              <Flex className="group-item" justify="around" key={item.id}>
                <div className="desc">
                  <p className="title">{item.title}</p>
                  <span className="info">{item.desc}</span>
                </div>
                <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
              </Flex>
            )} />
            </div>
             {/* 最新资讯 */}
            <div className="news">
              <h3 className="group-title">最新资讯</h3>
              <WingBlank size="md">{this.renderNews()}</WingBlank>
            </div>
          </div>
        );
      }
}
