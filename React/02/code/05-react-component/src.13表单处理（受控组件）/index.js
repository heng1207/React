import React from 'react'
import ReactDOM from 'react-dom'

/* 
  受控组件：其值受到React控制的表单元素
  
  操作文本框的值：
*/

class App extends React.Component {
  state = {
    txt: ''
  }

  handleChange = e => {
    this.setState({
      txt: e.target.value
    })
  }

  render() {
    return (
      <div>
        <input type="text" value={this.state.txt} onChange={this.handleChange} />
      </div>
    )
  }
}

// 渲染组件
ReactDOM.render(<App />,  document.getElementById('root'))