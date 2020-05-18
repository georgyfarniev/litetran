import React from 'react'
import { Toggle } from 'office-ui-fabric-react/lib/Toggle'

export function Settings() {
  return (
    <Toggle inlineLabel label="Show in system tray" defaultChecked/>
  )
}
