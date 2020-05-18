import React, { useEffect } from 'react'
import { IconButton } from 'office-ui-fabric-react/lib/Button'
import { Modal } from 'office-ui-fabric-react/lib/Modal'
import { getTheme, mergeStyleSets, FontWeights, IIconProps } from 'office-ui-fabric-react'
import { useId, useBoolean } from '@uifabric/react-hooks'

export function Settings(props: any) {
  const theme = getTheme()
  const contentStyles = mergeStyleSets({
    container: {
      display: 'flex',
      flexFlow: 'column nowrap',
      alignItems: 'stretch',
    },
    header: [
      // tslint:disable-next-line:deprecation
      theme.fonts.xLargePlus,
      {
        flex: '1 1 auto',
        borderTop: `4px solid ${theme.palette.themePrimary}`,
        color: theme.palette.neutralPrimary,
        display: 'flex',
        alignItems: 'center',
        fontWeight: FontWeights.semibold,
        padding: '12px 12px 14px 24px',
      },
    ],
    body: {
      flex: '4 4 auto',
      padding: '0 24px 24px 24px',
      overflowY: 'hidden',
      selectors: {
        p: { margin: '14px 0' },
        'p:first-child': { marginTop: 0 },
        'p:last-child': { marginBottom: 0 },
      },
    },
  })
  const iconButtonStyles = {
    root: {
      color: theme.palette.neutralPrimary,
      marginLeft: 'auto',
      marginTop: '4px',
      marginRight: '2px',
    },
    rootHovered: {
      color: theme.palette.neutralDark,
    },
  }

  const cancelIcon: IIconProps = { iconName: 'Cancel' }
  const titleId = useId('title')
  const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(false)

  const closeSettings = () => {
    hideModal()
    props.onChange && props.onChange(false)
  }
  useEffect(() => props.visible ? showModal() : closeSettings(), [ props.visible])

  return (
    <Modal
      containerClassName='lt-settings-modal'
      titleAriaId={titleId}
      isOpen={isModalOpen}
      onDismiss={closeSettings}
      isBlocking={false}
    >
      <div className={contentStyles.header}>
        <span id={titleId}>Lorem Ipsum</span>
        <IconButton
          styles={iconButtonStyles}
          iconProps={cancelIcon}
          ariaLabel="Close popup modal"
          onClick={closeSettings}
        />
      </div>
      <div className={contentStyles.body}>
        <p>Lorem ipsum dolor sit amet, consectetur</p>
      </div>
    </Modal>
  )
}
