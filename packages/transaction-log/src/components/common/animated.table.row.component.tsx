import {TableRow} from '@mui/material'
import {useRef, useEffect, useState} from 'react'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

export const AnimatedTableRow = ({
  children,
  initialColor,
  finalColor,
  onClick
}) => {
  const ref = useRef(null)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    (async () => {
      if (ref.current && ref?.current?.style && !completed) {
        ref.current.style.backgroundColor = initialColor
        await sleep(200)
        if (ref?.current?.style?.backgroundColor) {
          ref.current.style.backgroundColor = finalColor
        }
        setCompleted(true)
      }
    })()
  }, [completed])

  return (
    <TableRow
      ref={ref}
      hover
      style={{cursor: 'pointer'}}
      sx={{transition: 'background-color 0.5s ease-in-out'}}
      onClick={onClick}
    >
      {children}
    </TableRow>
  )
}
