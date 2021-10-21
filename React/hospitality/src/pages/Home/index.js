import React,{lazy} from 'react'
import {Route} from 'react-router-dom'
import { TabBar } from 'antd-mobile'
// import News from '../News'
import Index from '../Index'

import './index.scss'
// import Profile from '../Profile'
// import HouseList from '../HouseList'
const News =lazy(()=>import ('../News'))
const Profile =lazy(()=>import ('../Profile'))
const HouseList =lazy(()=>import ('../HouseList'))
// TabBar 数据
const tabItems = [
    {
      title: '首页',
      icon: 'icon-ind',
      path: '/home'
    },
    {
      title: '找房',
      icon: 'icon-findHouse',
      path: '/home/list'
    },
    {
      title: '资讯',
      icon: 'icon-infom',
      path: '/home/news'
    },
    {
      title: '我的',
      icon: 'icon-my',
      path: '/home/profile'
    }
  ] 
export default class Home extends React.Component{
    state = {
        // tabbar 高亮效果
        selectedTab: this.props.location.pathname
      }
      // 路由切换时显示高亮效果
      componentDidUpdate(preProps){
      //  console.log('qian',preProps)
      //  console.log('hou',this.props)
       if(preProps!==this.props){
         // 表示发生路由切换  重新更新state中高亮效果的值
        this.setState({
          selectedTab: this.props.location.pathname
        })
       }
      }
      renderTabBarItems() {
        return tabItems.map(item=>(<TabBar.Item
            title={item.title}
            key={item.title}
            icon={<i className={`iconfont ${item.icon}`}></i>
            }
            selectedIcon={<i className={`iconfont ${item.icon}`}></i>
            }
            selected={this.state.selectedTab === item.path}
            onPress={() => {
            this.setState({
                selectedTab:item.path
            });
            this.props.history.push(item.path)
            }}
        >
        </TabBar.Item>))
    } 
    render(){
        // console.log(this.props.location.pathname)
        return(
            <div className='home'>
                <Route path='/home/news' component={News}></Route>
                <Route exact path='/home' component={Index}></Route>
                <Route path='/home/list' component={HouseList}></Route>
                <Route path='/home/profile' component={Profile}></Route>
                <TabBar
                noRenderContent={true}
                tintColor="#21b97a"
                barTintColor="white"
                hidden={this.state.hidden}
                >
                {this.renderTabBarItems()}
                </TabBar>
                </div>
        )
    }
}