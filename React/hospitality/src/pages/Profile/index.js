import React, { Component } from 'react'

import { Link } from 'react-router-dom'
import { Grid, Button,Modal  } from 'antd-mobile'

import { BASE_URL,isAuth,getToken,removeToken, Api } from '../../utils'

import styles from './index.module.css'
const alert = Modal.alert


// 菜单数据
const menus = [
  { id: 1, name: '我的收藏', iconfont: 'icon-coll', to: '/favorate' },
  { id: 2, name: '我的出租', iconfont: 'icon-ind', to: '/rent' },
  { id: 3, name: '看房记录', iconfont: 'icon-record' },
  {
    id: 4,
    name: '成为房主',
    iconfont: 'icon-identity'
  },
  { id: 5, name: '个人资料', iconfont: 'icon-myinfo' },
  { id: 6, name: '联系我们', iconfont: 'icon-cust' }
]
export default class Profile extends Component {
  avatarEditor = React.createRef()

  state = {
      isLogin:isAuth(),
      userInfo: {
        nickname:'',
        avatar:''
    //   nickname: '' || '游客',
    //   avatar: '' || BASE_URL + '/img/profile/avatar.png'
    }
  }
  componentDidMount(){
      this.getUserInfo()
      // console.log(11)
  }
  // 获取个人信息数据
  async getUserInfo(){
    // console.log(11)
      if(!this.state.isLogin){
          //没登录
          return
      }
      // console.log(getToken())
  const res = await Api.get('/user',{
      header:{
        authorization :getToken()
      }
     
  })
  console.log(res)
  if(res.data.status===200){
      const {nickname,avatar} = res.data.body
      // console.log(nickname)
      this.setState({
        // isLogin:true,
          userInfo:{
            nickname,
            avatar:BASE_URL+avatar
          }
      })
      
    
  }else{
    this.setState({
      isLogin:false
    })
  }
  }
  
  //退出功能
  logout(){
    alert('提示', '您还未登录，请先登录后收藏', [
      { text: '取消'},
      { text: '确定', onPress: async ()=>{
        // console.log(11)
        await Api.post('/user/logout',null,{
          header:{
            authorization:getToken()
          }
        })
        removeToken()
        this.setState({
          isLogin:false,
          userInfo:{
            avatar:'',
            nickname:''
          }
        })
      }}
    ])
    
  }
  render() {
    const {isLogin,
      userInfo: { nickname, avatar }
    } = this.state
    const { history } = this.props
    // console.log(isLogin,nickname)
    const defaultAvatar=BASE_URL + '/img/profile/avatar.png'
    // console.log(defaultAvatar)
    return (
      <div className={styles.root}>
        {/* 个人信息 */}
        <div className={styles.title}>
          <img
            className={styles.bg}
            src={BASE_URL + '/img/profile/bg.png'}
            alt="背景图"
          />
          <div className={styles.info}>
            <div className={styles.myIcon}>
              <img className={styles.avatar} src={avatar||defaultAvatar} alt="icon" />
            </div>
            <div className={styles.user}>
              <div className={styles.name}>{nickname || '游客'}</div>
              {/* 登录后展示： */}
              {isLogin?(<>
                <div className={styles.auth}>
                  <span onClick={this.logout}>退出</span>
                </div>
                <div className={styles.edit}>
                  编辑个人资料
                  <span className={styles.arrow}>
                    <i className="iconfont icon-arrow" />
                  </span>
                </div>
              </>):(<div className={styles.edit}>
                <Button
                  type="primary"
                  size="small"
                  inline
                  onClick={() => history.push('/login')}
                >
                  去登录
                </Button>
              </div>)}
              {/* <>
                <div className={styles.auth}>
                  <span onClick={this.logout}>退出</span>
                </div>
                <div className={styles.edit}>
                  编辑个人资料
                  <span className={styles.arrow}>
                    <i className="iconfont icon-arrow" />
                  </span>
                </div>
              </> */}

              {/* 未登录展示： */}
              
            </div>
          </div>
        </div>

        {/* 九宫格菜单 */}
        <Grid
          data={menus}
          columnNum={3}
          hasLine={false}
          renderItem={item =>
            item.to ? (
              <Link to={item.to}>
                <div className={styles.menuItem}>
                  <i className={`iconfont ${item.iconfont}`} />
                  <span>{item.name}</span>
                </div>
              </Link>
            ) : (
              <div className={styles.menuItem}>
                <i className={`iconfont ${item.iconfont}`} />
                <span>{item.name}</span>
              </div>
            )
          }
        />

        {/* 加入我们 */}
        <div className={styles.ad}>
          <img src={BASE_URL + '/img/profile/join.png'} alt="" />
        </div>
      </div>
    )
  }
}
