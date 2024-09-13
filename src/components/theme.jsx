'use client'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { ListItemIcon, MenuItem, useColorScheme } from '@mui/material';
import { Check } from '@mui/icons-material'

const ThemeSwitch = ({ setThemeName }) => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const { mode, setMode } = useColorScheme();

  const options = [
    { name: 'Light Theme', value: 'light' },
    { name: 'Dark Theme', value: 'dark' },
    { name: 'Use System Theme', value: 'system' }
  ]

  useEffect(() => {
    setMounted(true);
  }, []);

  const insiderRun = (value) => {
    const newTheme = (typeof (value) === 'string') && value.toLowerCase().replace(' ', '') || 'system';
    setThemeName(newTheme);
    setTheme(newTheme);
    setMode(newTheme);
  }
  // useEffect(() => {
  //   const handleKeyDown = (event) => {
  //     if ((event.ctrlKey || event.metaKey) && event.key === 'm') {
  //       event.preventDefault()
  //       handleToggleTheme()
  //     }
  //   }
  //   window.addEventListener('keydown', handleKeyDown)
  //   return () => window.removeEventListener('keydown', handleKeyDown)
  // }, [theme])

  if (!mounted) {
    return null
  }

  return (
    <>
      {options.map((option, index) => (
        <MenuItem onClick={() => insiderRun(option.value)} key={index} >
          <ListItemIcon>
            {option.value === mode ? <Check fontSize="small" /> : null}
          </ListItemIcon>
          {option.name}
        </MenuItem>
      ))}
    </>
  )
}

export { ThemeSwitch };