const TOKEN_NAME = 'hkzf-city'
const getCity =()=> JSON.parse(localStorage.getItem(TOKEN_NAME))||{}
const setCity =(value)=>localStorage.setItem(TOKEN_NAME,value)
export {getCity,setCity}