import React, {PropsWithChildren, useCallback, useEffect} from "react";
type  IState ='dark'|'light'|undefined
type IAction = {
    type: 'change',
    value: IState
}
const  MODE_KEY='mode'

export const modeReducer: (state: IState, action: IAction) => IState = (state, action) => {
    if (action.type == 'change') {
        return action.value;
    } else{
        return  state
    }
};
export const modeDefaultValue: IState ='dark';
export const ModeContext = React.createContext<{state:IState, dispatch: React.Dispatch<IAction>}>({
    state: modeDefaultValue, dispatch: () => {
        //
    },
});
export const ModeProvider :React.FC<PropsWithChildren<unknown>> = (props) => {
    const {children} = props;
    const [state, dispatch] = React.useReducer(modeReducer, modeDefaultValue);
    const value = React.useMemo(()=>({
        state,
        dispatch,
    }), [state]);
    useEffect(()=>{
        const cache= globalThis?.localStorage?.getItem?.(MODE_KEY) as IState;
        if(cache){
            dispatch({
                type:'change',
                value:cache
            })
        }
    },[])
    return <ModeContext.Provider value={value}>
        {children}
    </ModeContext.Provider>
}
export default ModeProvider;

export const useMode:()=>['dark'|'light'|undefined,()=>void] = ()=>{
    const {state,dispatch} =React.useContext(ModeContext);
    const toggle = useCallback(()=>{
        const nextValue = state=="light"?'dark':'light'
        dispatch({
            type:'change',
            value:nextValue
        })
        globalThis?.localStorage?.setItem?.(MODE_KEY,nextValue)
    },[dispatch, state])
    return [state,toggle]
}
