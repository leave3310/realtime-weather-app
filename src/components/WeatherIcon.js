import React, { useMemo } from 'react'
import styled from '@emotion/styled'

import { ReactComponent as DayClear } from './../images/day-clear.svg'
import { ReactComponent as DayCloudy } from './../images/day-cloudy.svg'
import { ReactComponent as DayCloudyFog } from './../images/day-cloudy-fog.svg'
import { ReactComponent as DayFog } from './../images/day-fog.svg'
import { ReactComponent as DayPartiallyClearWithRain } from './../images/day-partially-clear-with-rain.svg'
import { ReactComponent as DaySnowing } from './../images/day-snowing.svg'
import { ReactComponent as DayThunderstorm } from './../images/day-thunderstorm.svg'
import { ReactComponent as NightClear } from './../images/night-clear.svg'
import { ReactComponent as NightCloudy } from './../images/night-cloudy.svg'
import { ReactComponent as NightCloudyFog } from './../images/night-cloudy-fog.svg'
import { ReactComponent as NightFog } from './../images/night-fog.svg'
import { ReactComponent as NightPartiallyClearWithRain } from './../images/night-partially-clear-with-rain.svg'
import { ReactComponent as NightSnowing } from './../images/night-snowing.svg'
import { ReactComponent as NightThunderstorm } from './../images/night-thunderstorm.svg'

const IconContainer = styled.div`
    flex-basis: 30%;

    svg {
        max-height: 110px;
    }
`
//利用號碼來確定天氣型態是甚麼圖示
const weatherTypes = {
    isThunderstorm: [15, 16, 17, 18, 21, 22, 33, 34, 35, 36, 41],
    isClear: [1],
    isCloudyFog: [25, 26, 27, 28],
    isCloudy: [2, 3, 4, 5, 6, 7],
    isFog: [24],
    isPartiallyClearWithRain: [8, 9, 10, 11, 12, 13, 14, 19, 20, 29, 30, 31, 32, 38, 39],
    isSnowing: [23, 37, 42]
}
//顯示天氣圖示
const weatherIcons = {
    day: {
        isThunderstorm: <DayThunderstorm />,
        isClear: <DayClear />,
        isCloudyFog: <DayCloudyFog />,
        isCloudy: <DayCloudy />,
        isFog: <DayFog />,
        isPartiallyClearWithRain: <DayPartiallyClearWithRain />,
        isSnowing: <DaySnowing />
    },
    night: {
        isThunderstorm: <NightThunderstorm />,
        isClear: <NightClear />,
        isCloudyFog: <NightCloudyFog />,
        isCloudy: <NightCloudy />,
        isFog: <NightFog />,
        isPartiallyClearWithRain: <NightPartiallyClearWithRain />,
        isSnowing: <NightSnowing />
    }
}
//處理天氣型態轉成WeatherType是哪一個號碼
const weatherCode2Type = (weatherCode) => {
    const [weatherType] = Object.entries(weatherTypes).find(([weatherType, weatherCodes]) =>
        weatherCodes.includes(Number(weatherCode))
    ) || []
    return weatherType
}
//顯示圖片
const WeatherIcon = ({ weatherCode, moment }) => {
    //useMemo是增加效能用
    const weatherType = useMemo(() => weatherCode2Type(weatherCode), [weatherCode])
    const weatherIcon = weatherIcons[moment][weatherType]
    
    return (
        <IconContainer>
            {weatherIcon}
        </IconContainer>
    )
}

export default WeatherIcon