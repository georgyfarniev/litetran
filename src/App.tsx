import React, { useState, useEffect, useRef } from 'react';
import { PrimaryButton, IconButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { ComboBox } from 'office-ui-fabric-react/lib/ComboBox';
import { Modal } from 'office-ui-fabric-react/lib/Modal';

import {
  getTheme,
  mergeStyleSets,
  FontWeights,
  ContextualMenu,
  Toggle,
  DefaultButton,
  IDragOptions,
  IIconProps,
} from 'office-ui-fabric-react';

import { useSelection, useTranslate } from './hooks'
import './App.css';
import { useId, useBoolean } from '@uifabric/react-hooks';

function Settings(props: any) {

  const theme = getTheme();
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
  });
  const toggleStyles = { root: { marginBottom: '20px' } };
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
  };

  const cancelIcon: IIconProps = { iconName: 'Cancel' };

  const titleId = useId('title');
  const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(false);

  const closeSettings = () => {
    hideModal()
        props.onChange && props.onChange(false)
  }

  useEffect(
    () => {
      if (props.visible) {
        showModal()
      } else {
        closeSettings()
      }
    },
    [props.visible]
  )

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
          onClick={closeSettings  }
        />
      </div>
      <div className={contentStyles.body}>
        <p>
          Lorem ipsum dolor sit amet, consectetur
            </p>
      </div>
    </Modal>
  )
}

function Toolbar(props: any) {
  return (
    <div className="lt-input-toolbar" onClick={props.onClick}>
      {props.children}
    </div>
  )
}

function Input(props: any) {
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

function App() {
  const selected = useSelection()
  const [fromLang, setFromLang] = useState('en')
  const [toLang, setToLang] = useState('ru')
  const [text, setText] = useState('')
  const [input, setInput] = useState('')
  const [settingsVisible, setSettingsVisible] = useState(false)


  const translate = () => setInput(text)
  const swap = () => {
    const to = toLang
    setToLang(fromLang)
    setFromLang(to)
  }

  useEffect(() => {
    setText(selected)
    setInput(selected)
  }, [selected])

  const { result, loading } = useTranslate({
    from: fromLang,
    to: toLang,
    text: input
  })

  const languages: any[] = [
    { key: 'en', text: 'English' },
    { key: 'ru', text: 'Russian' },
  ]

  return (
    <div className="lt-app">
      <Settings
        visible={settingsVisible}
        onChange={setSettingsVisible}
      ></Settings>
      <Input value={text} onChange={setText}></Input>
      <div className="lt-toolbar">
        <ComboBox
          className="lt-toolbar-select"
          selectedKey={fromLang}
          autoComplete="on"
          options={languages}
          onChange={(_: any, item: any) => setFromLang(item.key)}
        />
        <IconButton
          className="lt-swap-btn"
          onClick={swap}
          iconProps={{ iconName: 'Switch' }}
          title="Swap"
          ariaLabel="Swap"
        />
        <ComboBox
          className="lt-toolbar-select"
          selectedKey={toLang}
          autoComplete="on"
          options={languages}
          onChange={(_: any, item: any) => setToLang(item.key)}
        />
        <IconButton
          className="lt-swap-btn"
          onClick={() => setSettingsVisible(true)}
          iconProps={{ iconName: 'Settings' }}
          title="Settings"
          ariaLabel="Settings"
        />
        <PrimaryButton
          text="Translate"
          iconProps={{ iconName: 'Send' }}
          onClick={translate}
        />
      </div>
      <Input value={result} readOnly></Input>
    </div>
  )
}

export default App
