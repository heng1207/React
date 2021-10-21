import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace } from 'antd-mobile'

import { Link } from 'react-router-dom'

import NavHeader from '../../components/NavHeader'

import styles from './index.module.css'
import {Api} from '../../utils/api'

// 验证规则：
// const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
// const REG_PWD = /^[a-zA-Z_\d]{3,12}$/

class Registe extends Component {
  state = {
    username:'',
    password:''
  }
  componentDidMount(){
    console.log(1111)
  }
  getUserName = e => {
    this.setState({
      username: e.target.value
    })
  }

  getPassword = e => {
    this.setState({
      password: e.target.value
    })
  }

  handleSubmit = async (e)=>{
    e.preventDefault()
    const { username, password } = this.state

    // console.log('表单提交了', username, password)
    // 发送请求
    const res = await Api.post('/user/registered', {
      username,
      password
    })

  
  // console.log(res)
  console.log('登录结果：', res)
    const { status, body } = res.data

    if (status === 200) {
      // 登录成功
      localStorage.setItem('hkzf_token', body.token)
      this.props.history.go(-1)
    } else {
      // 登录失败
      console.log('失败')
    }
  }
  render() {
    const {username,password} = this.state
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>注册</NavHeader>
        <WhiteSpace size="xl" />
        <WingBlank>
          <form  onSubmit={this.handleSubmit}>
            <div className={styles.formItem}>
              <label className={styles.label}>用户名</label>
              <input value={username}
                onChange={this.getUserName} className={styles.input} placeholder="请输入账号" />
            </div>
            <div className={styles.formItem}>
              <label value={password}
                onChange={this.getPassword} className={styles.label}>密码</label>
              <input
                className={styles.input}
                type="password"
                placeholder="请输入密码"
              />
            </div>
            <div className={styles.formItem}>
              <label className={styles.label}>重复密码</label>
              <input
              value={password}
              onChange={this.getPassword}
                className={styles.input}
                type="password"
                placeholder="请重新输入密码"
              />
            </div>
            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                注册
              </button>
            </div>
          </form>
          <Flex className={styles.backHome} justify="between">
            <Link to="/home">点我回首页</Link>
            <Link to="/login">已有账号，去登录</Link>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}

export default Registe
