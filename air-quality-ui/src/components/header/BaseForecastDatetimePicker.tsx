import { ThemeProvider, createTheme } from '@mui/material/styles'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTime } from 'luxon'

import { useForecastContext } from '../../context'

export const BaseForecastDatetimePicker = (): JSX.Element => {
  const { forecastBaseDate, setForecastBaseDate } = useForecastContext()
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  })

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale="en-gb">
      <ThemeProvider theme={darkTheme}>
        <DateTimePicker
          sx={{ '.MuiFormLabel-root': { color: 'white' } }}
          label="Base Forecast Date"
          disableFuture={true}
          skipDisabled={true}
          timeSteps={{ minutes: 720 }}
          value={forecastBaseDate}
          onChange={(newValue) => {
            const valueToSet = newValue == null ? DateTime.utc() : newValue
            setForecastBaseDate(valueToSet)
          }}
        />
      </ThemeProvider>
    </LocalizationProvider>
  )
}