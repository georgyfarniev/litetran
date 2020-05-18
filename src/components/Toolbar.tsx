import React from 'react'

export function Toolbar(props: any) {
  return (
    <div className="lt-input-toolbar" onClick={props.onClick}>
      {props.children}
    </div>
  )
}
