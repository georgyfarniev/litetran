import { clipboard } from 'electron'
import * as robotjs from 'robotjs'

// Assuming all this platforms using X11
const X11_PLATFORMS = ['linux', 'freebsd', 'openbsd', 'netbsd']

export function getSelectedText(): string {
  // Get text from X11 clipboard
  if (X11_PLATFORMS.includes(process.platform.toLowerCase())) {
    return clipboard.readText('selection')
  }

  const modifier = process.platform === 'darwin' ? 'command' : 'control'

  // On other platforms, attempt to send Ctrl+C key and grab text from clipboard
  robotjs.keyTap('c', modifier)
  return clipboard.readText('clipboard')
}
