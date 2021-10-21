import React, { Component } from 'react'

import { Carousel, Flex,Modal ,Toast} from 'antd-mobile'

import NavHeader from '../../components/NavHeader'
import HouseItem from '../../components/HouseItem'
import HousePackage from '../../components/HousePackage'

import { BASE_URL } from '../../utils/url'
import {Api} from '../../utils/api'
import styles from './index.module.css'
import {isAuth} from '../../utils'
const alert = Modal.alert

// 猜你喜欢
const recommendHouses = [
  {
    id: 1,
    src: BASE_URL + '/img/message/1.png',
    desc: '72.32㎡/南 北/低楼层',
    title: '安贞西里 3室1厅',
    price: 4500,
    tags: ['随时看房']
  },
  {
    id: 2,
    src: BASE_URL + '/img/message/2.png',
    desc: '83㎡/南/高楼层',
    title: '天居园 2室1厅',
    price: 7200,
    tags: ['近地铁']
  },
  {
    id: 3,
    src: BASE_URL + '/img/message/3.png',
    desc: '52㎡/西南/低楼层',
    title: '角门甲4号院 1室1厅',
    price: 4300,
    tags: ['集中供暖']
  }
]

// 百度地图
const BMap = window.BMap

const labelStyle = {
  position: 'absolute',
  zIndex: -7982820,
  backgroundColor: 'rgb(238, 93, 91)',
  color: 'rgb(255, 255, 255)',
  height: 25,
  padding: '5px 10px',
  lineHeight: '14px',
  borderRadius: 3,
  boxShadow: 'rgb(204, 204, 204) 2px 2px 2px',
  whiteSpace: 'nowrap',
  fontSize: 12,
  userSelect: 'none'
}

export default class HouseDetail extends Component {
  state = {
    isFavorite:false,
    // 数据加载中状态
    isLoading: false,

    // 房屋详情
    houseInfo: {
      // 房屋图片
      houseImg: [],
      // 标题
      title: '',
      // 标签
      tags: [],
      // 租金
      price: 0,
      // 房型
      roomType: '',
      // 房屋面积
      size: 0,
      // 朝向
      oriented: [],
      // 楼层
      floor: '',
      // 小区名称
      community: '',
      // 地理位置
      coord: {
        latitude: '39.928033',
        longitude: '116.529466'
      },
      // 房屋配套
      supporting: [],
      // 房屋标识
      houseCode: '',
      // 房屋描述
      description: ''
    }
  }

  componentDidMount() {
    this.checkFavorite()
    this.setState({
      isLoading:true
    })
    this.getHouseDetail()
    // const {params} = this.props.match
    // console.log(params)
   
    
  }
  
  //创建显示收藏的方法
  async checkFavorite(){
   const isLoader = isAuth()
   if(!isLoader){
     return
   }
   const {id} = this.props.match.params
  //  console.log(id)
   const res = await Api.get(`/user/favorites/${id}`)
   const {status,body} = res.data
  //  console.log(res)
   if(status===200){
     this.setState({
      isFavorite:body.isFavorite
     })
   }
  }
  // 获取数据
  async getHouseDetail(){
    const {id} = this.props.match.params
    const {data:res} = await Api.get(`/houses/${id}`)
    // console.log(res)
    this.setState({
      houseInfo:res.body,
      // 数据加载中状态
    isLoading: false,
    })
    const {community,coord} = res.body
    this.renderMap(community,coord)
  }
  // 渲染轮播图结构
  renderSwipers() {
    const {
      houseInfo: { houseImg }
    } = this.state

    return houseImg.map(item => (
      <a
        key={item}
        href="http://itcast.cn"
        style={{
          display: 'inline-block',
          width: '100%',
          height: 252
        }}
      >
        <img
          src={BASE_URL + item}
          alt=""
          style={{ width: '100%', verticalAlign: 'top',height:'100%' }}
        />
      </a>
    ))
  }

  // 渲染地图
  renderMap(community, coord) {
    const { latitude, longitude } = coord

    const map = new BMap.Map('map')
    const point = new BMap.Point(longitude, latitude)
    map.centerAndZoom(point, 17)

    const label = new BMap.Label('', {
      position: point,
      offset: new BMap.Size(0, -36)
    })

    label.setStyle(labelStyle)
    label.setContent(`
      <span>${community}</span>
      <div class="${styles.mapArrow}"></div>
    `)
    map.addOverlay(label)
  }
  // 渲染标签
  renderTags(){
    const {houseInfo:{tags}} = this.state
    
    return tags.map((item,index)=>{
      let tagClass = ''
      if(index>2){
        tagClass='tag3'
      }else{
        tagClass= 'tag'+(index+1)
      }
      return (
        <span key={item} className={[styles.tag, styles[tagClass]].join(' ')}>
          {item}
        </span>
      )
    })
    
  }
  handleFavorite =async ()=>{
    const isLoading = isAuth()
    const {history,location} = this.props
    if(!isLoading){
      return alert('提示', '您还未登录，请先登录后收藏', [
        { text: '取消'},
        { text: '确定', onPress: () => history.push('/login',{from:location})}
      ])
    }
    const {isFavorite} = this.state
    if(isFavorite){
      const {id} = this.props.match.params
      // console.log(id)
      const res = await Api.delete(`/user/favorites/${id}`)
      this.setState({
        isFavorite:false
      })
      if(res.data.status===200){
        Toast.info('取消收藏成功',2,null,false)
      }else{
        Toast.info('请求超时，请重新登录',2,null,false)
      }
    }else{
      const {id} = this.props.match.params
      // console.log(id)
      const res = await Api.post(`/user/favorites/${id}`)
      this.setState({
        isFavorite:true
      })
      if(res.data.status===200){
        Toast.info('添加收藏成功',2,null,false)
      }else{
        Toast.info('请求超时，请重新登录',2,null,false)
      }
    }
  }
  render() {
    const { isFavorite,isLoading,houseInfo:{community,title,supporting,description,oriented,floor,price,roomType,size} } = this.state
    return (
      <div className={styles.root}>
        {/* 导航栏 */}
        <NavHeader
          className={styles.navHeader}
          rightContent={[<i key="share" className="iconfont icon-share" />]}
        >
          {community}
        </NavHeader>

        {/* 轮播图 */}
        <div className={styles.houseImg}>
          {!isLoading ? (
            <Carousel autoplay infinite autoplayInterval={5000}>
              {this.renderSwipers()}
            </Carousel>
          ) : (
            ''
          )}
        </div>

        {/* 房屋基础信息 */}
        <div className={styles.info}>
          <h3 className={styles.infoTitle}>
          {title}
          </h3>
          <Flex className={styles.tags}>
            <Flex.Item>
             {this.renderTags()}
            </Flex.Item>
          </Flex>
     
          <Flex className={styles.infoPrice}>
            <Flex.Item className={styles.infoPriceItem}>
              <div>
                {price}
                <span className={styles.month}>/月</span>
              </div>
              <div>租金</div>
            </Flex.Item>
            <Flex.Item className={styles.infoPriceItem}>
              <div>{roomType}</div>
              <div>房型</div>
            </Flex.Item>
            <Flex.Item className={styles.infoPriceItem}>
              <div>{size}平米</div>
              <div>面积</div>
            </Flex.Item>
          </Flex>

          <Flex className={styles.infoBasic} align="start">
            <Flex.Item>
              <div>
                <span className={styles.title}>装修：</span>
                精装
              </div>
              <div>
                <span className={styles.title}>楼层：</span>
                {floor}
              </div>
            </Flex.Item>
            <Flex.Item>
              <div>
                <span className={styles.title}>朝向：</span>{oriented.join('、')}
              </div>
              <div>
                <span className={styles.title}>类型：</span>普通住宅
              </div>
            </Flex.Item>
          </Flex>
        </div>

        {/* 地图位置 */}
        <div className={styles.map}>
          <div className={styles.mapTitle}>
            小区：
            <span>{community}</span>
          </div>
          <div className={styles.mapContainer} id="map">
            地图
          </div>
        </div>

        {/* 房屋配套 */}
        <div className={styles.about}>
          <div className={styles.houseTitle}>房屋配套</div>
          {supporting.length>0?(<HousePackage
            list={supporting}
          />):(<div className="title-empty">暂无数据</div>)}
          
          {/* <div className="title-empty">暂无数据</div> */}
        </div>

        {/* 房屋概况 */}
        <div className={styles.set}>
          <div className={styles.houseTitle}>房源概况</div>
          <div>
            <div className={styles.contact}>
              <div className={styles.user}>
                <img src={BASE_URL + '/img/avatar.png'} alt="头像" />
                <div className={styles.useInfo}>
                  <div>王女士</div>
                  <div className={styles.userAuth}>
                    <i className="iconfont icon-auth" />
                    已认证房主
                  </div>
                </div>
              </div>
              <span className={styles.userMsg}>发消息</span>
            </div>

            <div className={styles.descText}>
              {description || '暂无房屋描述'}
            </div>
          </div>
        </div>

        {/* 推荐 */}
        <div className={styles.recommend}>
          <div className={styles.houseTitle}>猜你喜欢</div>
          <div className={styles.items}>
            {recommendHouses.map(item => (
              <HouseItem {...item} key={item.id} />
            ))}
          </div>
        </div>

        {/* 底部收藏按钮 */}
        <Flex className={styles.fixedBottom}>
          <Flex.Item  onClick={this.handleFavorite}>
            <img
              src={ BASE_URL + (isFavorite? '/img/star.png' : '/img/unstar.png')}
              className={styles.favoriteImg}
              alt="收藏"
            />
            <span className={styles.favorite}>{isFavorite?'已收藏':'收藏'}</span>
          </Flex.Item>
          <Flex.Item>在线咨询</Flex.Item>
          <Flex.Item>
            <a href="tel:400-618-4000" className={styles.telephone}>
              电话预约
            </a>
          </Flex.Item>
        </Flex>
      </div>
    )
  }
}
