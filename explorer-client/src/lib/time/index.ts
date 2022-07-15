import dayjs from "dayjs"

export const dateRender = (str?:string|number)=>{
    if(!str){
        return ''
    }
    if(typeof str=='number'&&`${str}`.length<11){
        return dayjs.unix(str).format("YYYY-MM-DD")
    }
    return dayjs(str).format("YYYY-MM-DD")
}

export const timeRender = (str?:string|number)=>{
    if(!str){
        return ''
    }
    if(typeof str=='number'&&`${str}`.length<11){
        return dayjs.unix(str).format("YYYY-MM-DD H:mm:ss")
    }
    return dayjs(str).format("YYYY-MM-DD H:mm:ss")
}