import React, { useEffect } from 'react'

export default ({ children, playbackrate }) => {

  useEffect(() => {
    document.querySelector('video').playbackRate = playbackrate
  }, [playbackrate])

  return (
    <div>{children}</div>
  )
}
