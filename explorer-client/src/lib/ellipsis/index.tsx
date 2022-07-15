import { Box, BoxTypeMap } from "@mui/material";
import {DefaultComponentProps} from '@mui/material/OverridableComponent';
import React, { PropsWithChildren } from "react";
export interface EllipsisProps extends DefaultComponentProps<BoxTypeMap>{
    text?:string,
    successText?:string;
    errorText?:string
  }
  export const Ellipsis:React.FC<PropsWithChildren<EllipsisProps>> = (props)=>{
    
    return <Box style={{ width: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} {...props}/>
}
export default Ellipsis