import React from 'react'
import { Alert, AlertTitle } from '@mui/material'
import {  useSetRecoilState } from 'recoil'
import { isAuthErrorVisibleAtom, isLandingPageAlertVisibleAtom } from '../../recoilStore/store'

export default function AlertBanner(props) {
    const  setIsAuthErrorVisible = useSetRecoilState(isAuthErrorVisibleAtom)
    const  setIsLandingPageErrorVisible = useSetRecoilState(isLandingPageAlertVisibleAtom)

    const handleClose = () =>{
      setIsAuthErrorVisible(false)
      setIsLandingPageErrorVisible(false)
    }
  return (
    <Alert severity="error"
    onClose={handleClose}
     style={{ border:'1px solid #D9BABA', marginBottom:'10px'}}
     >
       <AlertTitle>{props.alertTitle}</AlertTitle>
     {props.alertMessage}
     </Alert>

  )
}
