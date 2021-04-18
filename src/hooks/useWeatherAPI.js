import { useState, useEffect, useCallback } from 'react'

const fetchCurrentWeather = ({ authorizationKey, locationName }) => {
    return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${authorizationKey}&locationName=${locationName}`)
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

const fetchWeatherForecast = ({ authorizationKey, cityName }) => {
    return fetch(
        `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${authorizationKey}&locationName=${cityName}`
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

const useWeatherAPI = ({ locationName, cityName, authorizationKey }) => {
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
        const [currentWeather, weatherForecast] = await Promise.all([fetchCurrentWeather({ authorizationKey, locationName }), fetchWeatherForecast({ authorizationKey, cityName })])

        //console.log(currentWeather, weatherForecast)
        setWeatherElement({ ...currentWeather, ...weatherForecast, isLoading: false })
    }, [locationName, cityName, authorizationKey])

    useEffect(() => fetchData(), [fetchData])

    return [weatherElement, fetchData]
}

export default useWeatherAPI