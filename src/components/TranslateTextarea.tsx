import React, { useRef } from 'react'
import { TextField, ITextField } from 'office-ui-fabric-react/lib/TextField'
import { IconButton } from 'office-ui-fabric-react/lib/Button'
import { Toolbar } from './Toolbar'

export function TranslateTextarea(props: any) {
  const ref = useRef<ITextField>(null)

  const onChange = (_: any, value?: string) => {
    if (!props.readOnly && props.onChange) {
      props.onChange(value)
    }
  }

  const copy = () => {
    ref?.current?.select()
    document.execCommand('copy')
  }

  const focus = () => ref?.current?.focus()

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
      <Toolbar onClick={focus}>
        <IconButton
          iconProps={{ iconName: 'Copy' }}
          title="Copy"
          ariaLabel="Copy"
          onClick={copy}
        />
      </Toolbar>
    </div>
  )
}