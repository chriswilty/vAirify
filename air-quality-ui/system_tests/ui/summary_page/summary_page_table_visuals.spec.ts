import { test } from '../../utils/fixtures'
import { gotoPage, setupPageWithMockData } from '../../utils/helper_methods'
import {
  createForecastAPIResponseData,
  createMeasurementSummaryAPIResponseData,
} from '../../utils/mocked_api'
import {
  CaseAQI1,
  CaseAQI2,
  CaseAQI3,
  CaseAQI4,
  CaseAQI5,
  CaseAQI6,
  Colours,
} from '../../utils/test_enums'

test.describe('Table structure', () => {
  test('Verify that headers exist and innertext matches', async ({
    summaryPage,
    page,
  }) => {
    await gotoPage(page, '/city/summary')
    await summaryPage.getColumnHeaderAndText('AQI Level', 'AQI Level')
    await summaryPage.getColumnHeaderAndText('PM2.5 (µg/m³)', 'PM2.5 (µg/m³)')
    await summaryPage.getColumnHeaderAndText('PM10 (µg/m³)', 'PM10 (µg/m³)')
    await summaryPage.scrollToRightmostPosition()
    await summaryPage.page.waitForTimeout(1000)

    await summaryPage.getColumnHeaderAndText(
      'Nitrogen Dioxide (µg/m³)',
      'Nitrogen Dioxide (µg/m³)',
    )
    await summaryPage.getColumnHeaderAndText('Ozone (µg/m³)', 'Ozone (µg/m³)')
    await summaryPage.getColumnHeaderAndText(
      'Sulphur Dioxide (µg/m³)',
      'Sulphur Dioxide (µg/m³)',
    )
  })
})

test.describe('Colour testing', () => {
  test.describe('Valid data', () => {
    test.beforeEach(async ({ page }) => {
      const mockedForecastResponse = [
        createForecastAPIResponseData({
          valid_time: '2024-07-08T03:00:00Z',
          no2: { aqi_level: CaseAQI1.aqiLevel, value: CaseAQI1.no2 },
          o3: { aqi_level: CaseAQI2.aqiLevel, value: CaseAQI2.o3 },
          pm2_5: { aqi_level: CaseAQI3.aqiLevel, value: CaseAQI3.pm2_5 },
          pm10: { aqi_level: CaseAQI4.aqiLevel, value: CaseAQI4.pm10 },
          so2: { aqi_level: CaseAQI1.aqiLevel, value: CaseAQI1.so2 },
        }),
      ]
      const mockedMeasurementSummaryResponse = [
        createMeasurementSummaryAPIResponseData({
          measurement_base_time: '2024-07-08T03:00:00Z',
          no2: {
            mean: { aqi_level: CaseAQI2.aqiLevel, value: CaseAQI2.no2 },
          },
          o3: {
            mean: { aqi_level: CaseAQI3.aqiLevel, value: CaseAQI3.o3 },
          },
          pm2_5: {
            mean: { aqi_level: CaseAQI4.aqiLevel, value: CaseAQI4.pm2_5 },
          },
          pm10: {
            mean: { aqi_level: CaseAQI5.aqiLevel, value: CaseAQI5.pm10 },
          },
          so2: {
            mean: { aqi_level: CaseAQI6.aqiLevel, value: CaseAQI6.so2 },
          },
        }),
      ]

      await setupPageWithMockData(page, [
        {
          endpointUrl: '*/**/air-pollutant/forecast*',
          mockedAPIResponse: mockedForecastResponse,
        },
        {
          endpointUrl: '*/**/air-pollutant/measurements/summary*',
          mockedAPIResponse: mockedMeasurementSummaryResponse,
        },
      ])
      await gotoPage(page, '/city/summary')
    })

    test('Default Toggle: Highlight all AQI values', async ({
      summaryPage,
    }) => {
      const expectedTableColours: string[][] = [
        [
          // AQI Level
          Colours.aqi1, // Forecast
          Colours.aqi6, // Measured
          Colours.notColoured, // Diff
          // pm2.5
          Colours.aqi3, // Forecast
          Colours.aqi4, // Measured
          Colours.notColoured, // Time
          // pm10
          Colours.aqi4, // Forecast
          Colours.aqi5, // Measured
          Colours.notColoured, // Time
          // no2
          Colours.aqi1, // Forecast
          Colours.aqi2, // Measured
          Colours.notColoured, // Time
          // o3
          Colours.aqi2, // Forecast
          Colours.aqi3, // Measured
          Colours.notColoured, // Time
          // so2
          Colours.aqi1, // Forecast
          Colours.aqi6, // Measured
          Colours.notColoured, // Time
        ],
      ]
      await summaryPage.waitForLoad()
      await summaryPage.assertGridAttributes('colours', expectedTableColours)
    })

    test('Toggle OFF: Highlight primary AQI values', async ({
      summaryPage,
    }) => {
      const expectedTableColours: string[][] = [
        [
          // AQI Level
          Colours.aqi1, // Forecast
          Colours.aqi6, // Measured
          Colours.notColoured, // Diff
          // pm2.5
          Colours.notColoured, // Forecast
          Colours.notColoured, // Measured
          Colours.notColoured, // Time
          // pm10
          Colours.notColoured, // Forecast
          Colours.notColoured, // Measured
          Colours.notColoured, // Time
          // no2
          Colours.notColoured, // Forecast
          Colours.notColoured, // Measured
          Colours.notColoured, // Time
          // o3
          Colours.notColoured, // Forecast
          Colours.notColoured, // Measured
          Colours.notColoured, // Time
          // so2
          Colours.aqi1, // Forecast
          Colours.aqi6, // Measured
          Colours.notColoured, // Time
        ],
      ]
      await summaryPage.highlightValuesToggle.click()
      await summaryPage.assertGridAttributes('colours', expectedTableColours)
    })
  })

  test.describe('No Data', () => {
    test.beforeEach(async ({ page }) => {
      const mockedForecastResponse = [
        createForecastAPIResponseData({
          valid_time: '2024-07-08T03:00:00Z',
          location_name: 'Berlin',
          no2: { aqi_level: CaseAQI3.aqiLevel, value: CaseAQI3.no2 },
          o3: { aqi_level: CaseAQI3.aqiLevel, value: CaseAQI3.o3 },
          pm2_5: { aqi_level: CaseAQI3.aqiLevel, value: CaseAQI3.pm2_5 },
          pm10: { aqi_level: CaseAQI3.aqiLevel, value: CaseAQI3.pm10 },
          so2: { aqi_level: CaseAQI3.aqiLevel, value: CaseAQI3.so2 },
        }),
      ]
      await setupPageWithMockData(page, [
        {
          endpointUrl: '*/**/air-pollutant/forecast*',
          mockedAPIResponse: mockedForecastResponse,
        },
      ])
      await gotoPage(page, '/city/summary')
    })

    test('Default Toggle: If there is "no data", cell is coloured grey', async ({
      summaryPage,
    }) => {
      const expectedTableColours: string[][] = [
        [
          // AQI Level
          Colours.aqi3, // Forecast
          Colours.noData, // Measured
          Colours.notColoured, // Diff
          // pm2.5
          Colours.aqi3, // Forecast
          Colours.noData, // Measured
          Colours.notColoured, // Time
          // pm10
          Colours.aqi3, // Forecast
          Colours.noData, // Measured
          Colours.notColoured, // Time
          // no2
          Colours.aqi3, // Forecast
          Colours.noData, // Measured
          Colours.notColoured, // Time
          // o3
          Colours.aqi3, // Forecast
          Colours.noData, // Measured
          Colours.notColoured, // Time
          // so2
          Colours.aqi3, // Forecast
          Colours.noData, // Measured
          Colours.notColoured, // Time
        ],
      ]
      await summaryPage.waitForLoad()
      await summaryPage.assertGridAttributes('colours', expectedTableColours)
    })

    test('Toggle OFF: If there is "no data", cell is coloured grey', async ({
      summaryPage,
    }) => {
      const expectedTableColours: string[][] = [
        [
          // AQI Level
          Colours.aqi3, // Forecast
          Colours.noData, // Measured
          Colours.notColoured, // Diff
          // pm2.5
          Colours.notColoured, // Forecast
          Colours.notColoured, // Measured
          Colours.notColoured, // Time
          // pm10
          Colours.notColoured, // Forecast
          Colours.notColoured, // Measured
          Colours.notColoured, // Time
          // no2
          Colours.notColoured, // Forecast
          Colours.notColoured, // Measured
          Colours.notColoured, // Time
          // o3
          Colours.notColoured, // Forecast
          Colours.notColoured, // Measured
          Colours.notColoured, // Time
          // so2
          Colours.notColoured, // Forecast
          Colours.notColoured, // Measured
          Colours.notColoured, // Time
        ],
      ]
      await summaryPage.waitForLoad()
      await summaryPage.highlightValuesToggle.click()
      await summaryPage.assertGridAttributes('colours', expectedTableColours)
    })
  })
  test('Verify a pollutant value of 0 is assigned AQI 1 colour', async ({
    page,
    summaryPage,
  }) => {
    const mockedForecastResponse = [
      createForecastAPIResponseData({
        valid_time: '2024-07-08T03:00:00Z',
        no2: { aqi_level: CaseAQI1.aqiLevel, value: 0 },
        o3: { aqi_level: CaseAQI1.aqiLevel, value: 0 },
        pm2_5: { aqi_level: CaseAQI1.aqiLevel, value: 0 },
        pm10: { aqi_level: CaseAQI1.aqiLevel, value: 0 },
        so2: { aqi_level: CaseAQI1.aqiLevel, value: 0 },
      }),
    ]
    const mockedMeasurementSummaryResponse = [
      createMeasurementSummaryAPIResponseData({
        measurement_base_time: '2024-07-08T03:00:00Z',
        no2: { mean: { aqi_level: CaseAQI1.aqiLevel, value: 0 } },
        o3: { mean: { aqi_level: CaseAQI1.aqiLevel, value: 0 } },
        pm2_5: { mean: { aqi_level: CaseAQI1.aqiLevel, value: 0 } },
        pm10: { mean: { aqi_level: CaseAQI1.aqiLevel, value: 0 } },
        so2: { mean: { aqi_level: CaseAQI1.aqiLevel, value: 0 } },
      }),
    ]
    await setupPageWithMockData(page, [
      {
        endpointUrl: '*/**/air-pollutant/forecast*',
        mockedAPIResponse: mockedForecastResponse,
      },
      {
        endpointUrl: '*/**/air-pollutant/measurements/summary*',
        mockedAPIResponse: mockedMeasurementSummaryResponse,
      },
    ])

    await gotoPage(page, '/city/summary')

    const expectedTableContents: string[][] = [
      [
        // AQI Level
        Colours.aqi1, // Forecast
        Colours.aqi1, // Measured
        Colours.notColoured, // Diff
        // pm2.5
        Colours.aqi1, // Forecast
        Colours.aqi1, // Measured
        Colours.notColoured, // Time
        // pm10
        Colours.aqi1, // Forecast
        Colours.aqi1, // Measured
        Colours.notColoured, // Time
        // no2
        Colours.aqi1, // Forecast
        Colours.aqi1, // Measured
        Colours.notColoured, // Time
        // o3
        Colours.aqi1, // Forecast
        Colours.aqi1, // Measured
        Colours.notColoured, // Time
        // so2
        Colours.aqi1, // Forecast
        Colours.aqi1, // Measured
        Colours.notColoured, // Time
      ],
    ]
    await summaryPage.waitForLoad()
    await summaryPage.assertGridAttributes('colours', expectedTableContents)
  })

  test('Pollutant values above AQI 6 are coloured black', async ({
    summaryPage,
    page,
  }) => {
    const mockedForecastResponse = [
      createForecastAPIResponseData({
        valid_time: '2024-07-08T03:00:00Z',
        no2: { aqi_level: CaseAQI6.aqiLevel, value: 2000 },
        o3: { aqi_level: CaseAQI6.aqiLevel, value: 2000 },
        pm2_5: { aqi_level: CaseAQI6.aqiLevel, value: 2000 },
        pm10: { aqi_level: CaseAQI6.aqiLevel, value: 2000 },
        so2: { aqi_level: CaseAQI6.aqiLevel, value: 2000 },
      }),
    ]
    const mockedMeasurementSummaryResponse = [
      createMeasurementSummaryAPIResponseData({
        measurement_base_time: '2024-07-08T03:00:00Z',
        no2: { mean: { aqi_level: CaseAQI6.aqiLevel, value: 2000 } },
        o3: { mean: { aqi_level: CaseAQI6.aqiLevel, value: 2000 } },
        pm2_5: {
          mean: { aqi_level: CaseAQI6.aqiLevel, value: 2000 },
        },
        pm10: {
          mean: { aqi_level: CaseAQI6.aqiLevel, value: 2000 },
        },
        so2: { mean: { aqi_level: CaseAQI6.aqiLevel, value: 2000 } },
      }),
    ]

    await setupPageWithMockData(page, [
      {
        endpointUrl: '*/**/air-pollutant/forecast*',
        mockedAPIResponse: mockedForecastResponse,
      },
      {
        endpointUrl: '*/**/air-pollutant/measurements/summary*',
        mockedAPIResponse: mockedMeasurementSummaryResponse,
      },
    ])
    await gotoPage(page, '/city/summary')

    const expectedTableColours: string[][] = [
      [
        // AQI Level
        Colours.aqi6, // Forecast
        Colours.aqi6, // Measured
        Colours.notColoured, // Diff
        // pm2.5
        Colours.cellError, // Forecast
        Colours.cellError, // Measured
        Colours.notColoured, // Time
        // pm10
        Colours.cellError, // Forecast
        Colours.cellError, // Measured
        Colours.notColoured, // Time
        // no2
        Colours.cellError, // Forecast
        Colours.cellError, // Measured
        Colours.notColoured, // Time
        // o3
        Colours.cellError, // Forecast
        Colours.cellError, // Measured
        Colours.notColoured, // Time
        // so2
        Colours.cellError, // Forecast
        Colours.cellError, // Measured
        Colours.notColoured, // Time
      ],
    ]
    await summaryPage.waitForLoad()
    await summaryPage.assertGridAttributes('colours', expectedTableColours)
  })
})
