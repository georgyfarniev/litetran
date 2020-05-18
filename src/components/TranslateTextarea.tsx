import React, { useRef } from 'react'
import { TextField } from 'office-ui-fabric-react/lib/TextField'
import { IconButton } from 'office-ui-fabric-react/lib/Button'
import { Toolbar } from './Toolbar'

export function TranslateTextarea(props: any) {
  const ref = useRef(null)

  const onChange = (_: any, value?: string) => {
    if (!props.readOnly && props.onChange) {
      props.onChange(value)
    }
  }

  return (
    <div className="lt-input-container">
      <TextField
        inputClassName="lt-textfield"
        multiline
        resizable={false}
        value={props.value}
        onChange={onChange}
        componentRef={ref}
        readOnly={props.readOnly}
      />
      <Toolbar onClick={() => ref?.current?.focus()}>
        <IconButton
          iconProps={{ iconName: 'Play' }}
          title="Play"
          ariaLabel="Play"
        />
        <IconButton
          iconProps={{ iconName: 'Copy' }}
          title="Copy"
          ariaLabel="Copy"
        />
      </Toolbar>
    </div>
  )
}