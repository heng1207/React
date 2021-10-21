import axios from 'axios'
export const getCurrentCity=()=>{
    const localCity = JSON.parse(localStorage.getItem('hkzf-city'))
    if(!localCity){
        return new Promise((resolve,reject)=>{
            // 获取定位 
            const getLocation = new window.BMap.LocalCity()
            getLocation.get(async (res)=>{
                try {
                    const {data:result} = await axios.get("/area/info?name={res.name}")
                    localStorage.setItem('hkzf-city',JSON.stringify(result.body))
                    resolve(result.body)
                } catch (e) {
                    reject(e)
                }
            })
          
        })
    }else{
        return Promise.resolve(localCity)
    }
}
export {Api} from './api'
export { BASE_URL } from './url'
export * from './auth'
