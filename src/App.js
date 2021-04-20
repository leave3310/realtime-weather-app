import React, { useState, useEffect, useCallback, useMemo } from 'react'
import styled from '@emotion/styled'
import { ThemeProvider } from '@emotion/react'

import useWeatherAPI from './hooks/useWeatherAPI'
import WeatherCard from './views/WeatherCard'
import WeatherSetting from './views/WeatherSetting'
import { getMoment } from './utils/helpers'

const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow: '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const AUTHORIZATION_KEY = 'CWB-A03D04E8-E2FD-42A0-B36C-2D030C9908F8'
const LOCATION_NAME = '臺北'
const LOCATION_NAME_FORCAST = '宜蘭縣'


function App() {

  const moment = useMemo(() => getMoment(LOCATION_NAME_FORCAST), [])
  const [currentPage, setCurrentPage] = useState('WeatherCard')
  const [currentTheme, setCurrentTheme] = useState('light')
  const [weatherElement, fetchData] = useWeatherAPI({
    locationName: LOCATION_NAME,
    cityName: LOCATION_NAME_FORCAST,
    authorizationKey: AUTHORIZATION_KEY
  })
  const handleCurrentPageChange = (currentPage) => { setCurrentPage(currentPage) }
  useEffect(() => setCurrentTheme(moment === 'day' ? 'light' : 'dark'), [moment])

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {currentPage === 'WeatherCard' && (<WeatherCard weatherElement={weatherElement} moment={moment} fetchData={fetchData} handleCurrentPageChange={handleCurrentPageChange} />)}
        {currentPage === 'WeatherSetting' && (<WeatherSetting handleCurrentPageChange={handleCurrentPageChange} />)}
      </Container>
    </ThemeProvider>
  );
}

export default App;
