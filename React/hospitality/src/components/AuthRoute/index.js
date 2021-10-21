import React from 'react'
import {Route,Redirect} from 'react-router-dom'
import {isAuth} from '../../utils'
export const AuthRoute = ({component:Component,...rest})=>{
return <Route {...rest} render={(props)=>{
const isLoader = isAuth()
if(isLoader){
    return <Component {...props}></Component>
}else{
    return (<Redirect to={{
        pathname:'/login',
        state:{
            from:props.location
        }
    }}></Redirect>)
}
}}></Route>
}