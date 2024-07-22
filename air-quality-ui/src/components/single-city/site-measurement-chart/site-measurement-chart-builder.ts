import { EChartsOption, SeriesOption } from 'echarts'
// eslint-disable-next-line import/no-unresolved
import { MarkArea2DDataItemOption } from 'echarts/types/src/component/marker/MarkAreaModel.js'

import { PollutantType, pollutantTypeDisplay } from '../../../models'
import { aqiRangesByPollutant } from '../../../services/aqi-calculator/aqi-calculator-service'
import { convertToLocalTime } from '../../../services/echarts-service'
import {
  ForecastResponseDto,
  MeasurementsResponseDto,
} from '../../../services/types'

const createBackgroundAqiZones = (pollutant: PollutantType): SeriesOption => {
  const ranges = aqiRangesByPollutant[pollutant]

  return {
    type: 'line',
    data: [],
    name: 'Background',
    markArea: {
      data: [
        getAqiBand(0, ranges[0], '#50f0e5'),
        getAqiBand(ranges[0], ranges[1], '#50ccaa'),
        getAqiBand(ranges[1], ranges[2], '#f0e641'),
        getAqiBand(ranges[2], ranges[3], '#ff505080'),
        getAqiBand(ranges[3], ranges[4], '#960032'),
        getAqiBand(ranges[4], ranges[5], '#7d2181'),
      ],
    },
    silent: true,
    z: -1,
  }
}

const getAqiBand = (
  y0: number,
  y1: number,
  color: string,
): MarkArea2DDataItemOption => {
  return [
    {
      yAxis: y0,
      itemStyle: {
        color: color,
        opacity: 0.25,
      },
    },
    {
      yAxis: y1,
    },
  ]
}

const createForecastSeries = (
  pollutantType: PollutantType,
  forecastData: ForecastResponseDto[],
): SeriesOption => {
  return {
    type: 'line',
    data: forecastData.map((data) => [
      convertToLocalTime(data.valid_time),
      data[pollutantType].value.toFixed(1),
    ]),
    name: 'Forecast',
    color: 'black',
    lineStyle: {
      width: 5,
      type: 'dashed',
    },
    z: 2,
  }
}

const createMeasurementSeries = (
  pollutantType: PollutantType,
  measurementsBySite: Record<string, MeasurementsResponseDto[]>,
  seriesColorsBySite?: Record<string, string>,
): SeriesOption[] =>
  Object.entries(measurementsBySite).map(([siteName, measurements]) => ({
    type: 'line',
    data: measurements
      .filter((f) => f[pollutantType] !== undefined)
      .map((f) => [
        convertToLocalTime(f.measurement_date),
        f[pollutantType]?.toFixed(1),
      ]),
    name: siteName,
    ...(seriesColorsBySite && {
      color: seriesColorsBySite[siteName],
    }),
    triggerLineEvent: true,
    lineStyle: {
      width: 1,
      type: 'solid',
      opacity: 0.5,
    },
    z: 1,
    symbol: 'roundRect',
  }))

const createChartOptions = (
  chartTitle: string,
  zoomPercent: number,
): EChartsOption => {
  return {
    animation: false,
    title: {
      text: chartTitle,
      left: 'center',
    },
    xAxis: {
      type: 'time',
    },
    yAxis: {
      type: 'value',
      name: 'µg/m³',
      nameGap: 50,
      nameLocation: 'middle',
    },
    dataZoom: {
      show: true,
      realtime: false,
      end: zoomPercent,
    },
    tooltip: {
      trigger: 'item',
    },
  }
}

export const generateMeasurementChart = (
  pollutantType: PollutantType,
  zoomPercent: number,
  measurementsBySite: Record<string, MeasurementsResponseDto[]>,
  forecastData: ForecastResponseDto[],
  seriesColorsBySite?: Record<string, string>,
) => {
  const series = createMeasurementSeries(
    pollutantType,
    measurementsBySite,
    seriesColorsBySite,
  )
  const forecast = createForecastSeries(pollutantType, forecastData)

  const chartTile = pollutantTypeDisplay[pollutantType]
  const options = createChartOptions(chartTile, zoomPercent)

  return {
    ...options,
    series: [...series, forecast, createBackgroundAqiZones(pollutantType)],
  }
}