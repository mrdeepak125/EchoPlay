'use client';
import { setProgress } from '@/redux/features/loadingBarSlice'
import React from 'react'
import LoadingBar from 'react-top-loading-bar'
import { useDispatch, useSelector } from 'react-redux'


const TopProgressBar = () => {
    const dispatch = useDispatch();
    const progress= useSelector((state)=>state.loadingBar.progress)

  return (
    <LoadingBar
    color='#ff6cab'
    height={1.4}
    progress={progress}
    onLoaderFinished={() => dispatch(setProgress(0))}
  />
  )
}

export default TopProgressBar