import React, { useState, useEffect, useMemo } from 'react'
import styled from '@emotion/styled'
import { ThemeProvider } from '@emotion/react'

import useWeatherAPI from './hooks/useWeatherAPI'
import WeatherCard from './views/WeatherCard'
import WeatherSetting from './views/WeatherSetting'
import { getMoment, findLocation } from './utils/helpers'

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
  const [currentCity, setCurrentCity] = useState('臺北市')
  const currentLocation = useMemo(() => findLocation(currentCity), [currentCity])
  const { cityName, locationName, sunriseCityName } = currentLocation

  //增加效能用法並取得圖片要顯示早上還是晚上的
  const moment = useMemo(() => getMoment(sunriseCityName), [sunriseCityName])
  //看現在是要顯示設定還是天氣預報的部分
  const [currentPage, setCurrentPage] = useState('WeatherCard')
  //背景顏色
  const [currentTheme, setCurrentTheme] = useState('light')
  //取得API內容
  const [weatherElement, fetchData] = useWeatherAPI({
    locationName,
    cityName,
    authorizationKey: AUTHORIZATION_KEY
  })
  //傳遞到Component設定父元件的方法
  const handleCurrentPageChange = (currentPage) => { setCurrentPage(currentPage) }
  const handleCurrentCityChange = (currentCity) => { setCurrentCity(currentCity) }
  //利用時間來確定背景是暗色還亮色
  useEffect(() => setCurrentTheme(moment === 'day' ? 'light' : 'dark'), [moment])

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {currentPage === 'WeatherCard' && (<WeatherCard cityName={cityName} weatherElement={weatherElement} moment={moment} fetchData={fetchData} handleCurrentPageChange={handleCurrentPageChange} />)}
        {currentPage === 'WeatherSetting' && (<WeatherSetting cityName={cityName} handleCurrentPageChange={handleCurrentPageChange} handleCurrentCityChange={handleCurrentCityChange} />)}
      </Container>
    </ThemeProvider>
  );
}

export default App;
