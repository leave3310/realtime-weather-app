import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import dayjs from 'dayjs'
import { ThemeProvider } from '@emotion/react'

import { ReactComponent as LoadingIcon } from './images/loading.svg'
import { ReactComponent as DayCloudyIcon } from './images/day-cloudy.svg'
import { ReactComponent as AirFlowIcon } from './images/airFlow.svg'
import { ReactComponent as RainIcon } from './images/rain.svg'
import { ReactComponent as RefreshIcon } from './images/refresh.svg'

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

const WeatherCard = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.backgroundColor};
  box-sizing: border-box;
  padding: 30px 15px;
`

const Location = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 20px;
`

const Description = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 20px;
`

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`

const Temperature = styled.div`
  color: ${({ theme }) => theme.temperatureColor};
  font-size: 96px;
  font-weight: 300;
  display: flex;
`

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`

const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 20px;
  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`

const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`

//新增CSS style並且變換變數
// const DayCloudy = styled(DayCloudyIcon)`
//   flex-basis: 30%;
// `

const Refresh = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: ${({ theme }) => theme.textColor};
  svg {
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
    animation: rotate infinite ${({ isLoading }) => isLoading ? 1.5 : 0}s linear;
  }
@keyframes rotate{
  from{
    transform: rotate(360deg);
  }
  to{
    transform: rotate(0deg);
  }
}
`

const AUTHORIZATION_KEY = 'CWB-A03D04E8-E2FD-42A0-B36C-2D030C9908F8'
const LOCATION_NAME = '臺北'

function App() {
  //console.log('invoke')
  const [currentTheme, setCurrentTheme] = useState('light')
  const [currentWeather, setCurrentWeather] = useState({
    location: '台北市',
    description: '多雲時晴',
    windSpeed: 1.1,
    temperature: 22.9,
    rainPossibility: 48.3,
    observationTime: '2021-04-10 22:00:00',
    isLoading: true
  })
  useEffect(() => {
    //console.log('useEffect')
    fetchCurrentWeather()
  }, [])
  const fetchCurrentWeather = () => {
    setCurrentWeather((preState) => ({ ...preState, isLoading: true }))
    fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${AUTHORIZATION_KEY}&locationName=${LOCATION_NAME}`)
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
        setCurrentWeather({
          location: locationData.locationName,
          description: '多雲時晴',
          windSpeed: weatherElements.WDSD,
          temperature: weatherElements.TEMP,
          rainPossibility: 48.3,
          observationTime: locationData.time.obsTime,
          isLoading: false
        })
      })
  }
  const {
    location,
    description,
    windSpeed,
    temperature,
    rainPossibility,
    observationTime,
    isLoading
  } = currentWeather

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      {/* {console.log('render')}
      {console.log(currentWeather.isLoading)} */}
      <Container>
        <WeatherCard>
          <Location>{location}</Location>
          <Description>{description}</Description>
          <CurrentWeather>
            <Temperature>
              {Math.round(temperature)}<Celsius>°C</Celsius>
            </Temperature>
            <DayCloudyIcon />
          </CurrentWeather>
          <AirFlow>
            <AirFlowIcon /> {windSpeed}m/h
        </AirFlow>
          <Rain>
            <RainIcon /> {rainPossibility}%
        </Rain>
          <Refresh onClick={fetchCurrentWeather} isLoading={isLoading}>
            最後觀測時間：{new Intl.DateTimeFormat('zh-TW', {
            hour: 'numeric',
            minute: 'numeric'
          }).format(dayjs(observationTime))}{' '}
            {isLoading ? <LoadingIcon /> : <RefreshIcon />}
          </Refresh>
        </WeatherCard>
      </Container>
    </ThemeProvider>
  );
}

export default App;
