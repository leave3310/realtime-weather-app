import React, { useState, useEffect, useCallback, useMemo } from 'react'
import styled from '@emotion/styled'
import { ThemeProvider } from '@emotion/react'

import WeatherCard from './views/WeatherCard'
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

const fetchCurrentWeather = () => {
  return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${AUTHORIZATION_KEY}&locationName=${LOCATION_NAME}`)
    .then((response) => response.json())
    .then((data) => {
      // 測試資料內容
      // console.log('data ', data) 
      const locationData = data.records.location[0]
      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, currentElement) => {
          if (['WDSD', 'TEMP'].includes(currentElement.elementName)) {
            neededElements[currentElement.elementName] = currentElement.elementValue
          }
          return neededElements
        }, {}
      )

      return {
        location: locationData.locationName,
        windSpeed: weatherElements.WDSD,
        temperature: weatherElements.TEMP,
        observationTime: locationData.time.obsTime,
      }
    })
}

const fetchWeatherForecast = () => {
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${AUTHORIZATION_KEY}&locationName=${LOCATION_NAME_FORCAST}`
  )
    .then((response) => response.json())
    .then((data) => {
      //console.log('data', data)
      const locationData = data.records.location[0]

      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          if (['Wx', 'PoP', 'CI'].includes(item.elementName)) {
            neededElements[item.elementName] = item.time[0].parameter
          }
          return neededElements
        }, {}
      )

      return {
        description: weatherElements.Wx.parameterName,
        weatherCode: weatherElements.Wx.parameterValue,
        rainPossibility: weatherElements.PoP.parameterName,
        comfortability: weatherElements.CI.parameterName
      }

    })

}
function App() {
  //console.log('invoke')
  const moment = useMemo(() => getMoment(LOCATION_NAME_FORCAST), [])
  const [currentTheme, setCurrentTheme] = useState('light')
  const [weatherElement, setWeatherElement] = useState({
    location: '',
    description: '',
    windSpeed: 0,
    temperature: 0,
    rainPossibility: 0,
    observationTime: new Date(),
    comfortability: '',
    weatherCode: 0,
    isLoading: true
  })

  const fetchData = useCallback(async () => {
    setWeatherElement({
      ...weatherElement,
      isLoading: true
    })
    //等待兩筆資料都好之後再設定
    const [currentWeather, weatherForecast] = await Promise.all([fetchCurrentWeather(), fetchWeatherForecast()])

    //console.log(currentWeather, weatherForecast)
    setWeatherElement({ ...currentWeather, ...weatherForecast, isLoading: false })
  }, [])

  useEffect(() => {
    // console.log('execute function in useEffect')
    fetchData()
    setCurrentTheme(moment === 'day' ? 'light' : 'dark')
  }, [moment])

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      {/* {console.log('render')}
      {console.log(weatherElement.isLoading)} */}
      <Container>
        <WeatherCard weatherElement={weatherElement} moment={moment} fetchData={fetchData} />
      </Container>
    </ThemeProvider>
  );
}

export default App;
