import {useRouter} from "next/router";
import {useCallback, useMemo} from "react";

/**
 * 这个会刷新页面，相当于老式跳转，会触发getStaticProps，getServerSideProps或getInitialProps 和页面直接刷进来是一样的
 */
export const useNavigation = ()=>{
    const _router = useRouter();
    const router =useMemo(()=>{
        return _router
        // 这个navigation 只负责页面跳转，不关心堆栈，从而进行页面优化
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    },[])
    return [router]
}

/**
 * 这个会刷新页面，spa逻辑，一句话区别就是 服务器带数据下发的用useNavigation，不带数据的用useClintNavigation（规则仅适用同页面，不同页面仍旧会强制获取数据）
 */
export const useClintNavigation = ()=>{
    const _router = useRouter();
    const push = useCallback(async (route:string)=>{
        return await _router.push(route,undefined,{shallow:true})
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    },[])
    const router =useMemo(()=>{
        return{
            push
        }
        // 这个navigation 只负责页面跳转，不关心堆栈，从而进行页面优化
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    },[])
    return [router]
}
