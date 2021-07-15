import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { ThemeProvider } from 'styled-components'
import AppProvider from './src/contexts'
import Routes from './src/routes'
import { theme } from './src/styles/theme'

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <NavigationContainer>
                <AppProvider>
                    <Routes />
                </AppProvider>
            </NavigationContainer>
        </ThemeProvider>
    )
}

export default App
