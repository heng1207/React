import React,{lazy,Suspense} from 'react';
import {BrowserRouter as Router,Route,Redirect} from 'react-router-dom'
import Home from './pages/Home'
// import CityList from './pages/CityList'
// import Map from './pages/Map'
// import HouseDetail from './pages/HouseDetail'
// import Login from './pages/Login'
// import Registe from './pages/Registe'
// // import Profile from './pages/Profile'
// import Rent from './pages/Rent'
// import RentAdd from './pages/Rent/Add'
// import RentSearch from './pages/Rent/Search'
import {AuthRoute} from './components/AuthRoute'

const CityList =lazy(()=>import ('./pages/CityList'))
const Map =lazy(()=>import ('./pages/Map'))
const HouseDetail =lazy(()=>import ('./pages/HouseDetail'))
const Login =lazy(()=>import ('./pages/Login'))
const Registe =lazy(()=>import ('./pages/Registe'))
const Rent =lazy(()=>import ('./pages/Rent'))
const RentAdd =lazy(()=>import ('./pages/Rent/Add'))
const RentSearch =lazy(()=>import ('./pages/Rent/Search'))

function App() {
  return (
    <Router>
      <Suspense fallback={<div className='index-Loading' >Loading...</div>}> 
    <div className='App'>
     {/* 项目跟组件<Button>登录</Button> */}
     <Route exact path='/' render={()=><Redirect to='/home' />}></Route>
     <Route path='/home' component={Home}></Route>
     <Route path='/citylist' component={CityList}></Route>
     <Route path='/map' component={Map}></Route>
     <Route path="/detail/:id" component={HouseDetail} />
     <Route path="/login" component={Login} />
     <Route path="/registe" component={Registe} />
     {/* <Route path="/profile" component={Profile} /> */}
     <AuthRoute exact path='/rent' component={Rent}></AuthRoute>
     <AuthRoute path='/rent/add' component={RentAdd}></AuthRoute>
     <AuthRoute path='/rent/search' component={RentSearch}></AuthRoute>
    </div>
    </Suspense>
    </Router>
  )
}

export default App;
