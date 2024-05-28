import cdsapi
from datetime import datetime, timedelta
import logging
import os
import xarray as xr
from .forecast_data import ForecastData


class CamsModelDateTime:

    def __init__(self, date: str, time: str):
        self.date = date
        self.time = time


def __get_base_request_body(model_date_time: CamsModelDateTime) -> dict:
    leadtime_hour = [str(i) for i in range(0, 121, 3)]
    return {
        "date": f"{model_date_time.date}/{model_date_time.date}",
        "type": "forecast",
        "format": "grib",
        "time": f"{model_date_time.time}:00",
        "leadtime_hour": leadtime_hour,
    }


def get_single_level_request_body(model_date_time: CamsModelDateTime) -> dict:
    base_request = __get_base_request_body(model_date_time)
    base_request["variable"] = [
        "particulate_matter_10um",
        "particulate_matter_2.5um",
        "surface_pressure",
    ]
    return base_request


def get_multi_level_request_body(model_date_time: CamsModelDateTime) -> dict:
    base_request = __get_base_request_body(model_date_time)
    base_request["variable"] = [
        "nitrogen_dioxide",
        "ozone",
        "sulphur_dioxide",
        "temperature",
    ]
    base_request["model_level"] = "137"
    return base_request


def fetch_cams_data(request_body, file_name) -> xr.Dataset:
    c = cdsapi.Client()
    logging.info(f"Loading data from CAMS to file {file_name}")
    if not os.path.exists(file_name):
        c.retrieve(
            "cams-global-atmospheric-composition-forecasts", request_body, file_name
        )
    return xr.open_dataset(
        file_name, decode_times=False, engine="cfgrib", backend_kwargs={"indexpath": ""}
    )


def get_latest_cam_model_date_time() -> CamsModelDateTime:
    now = datetime.utcnow()
    current_hour = int(now.strftime("%H"))
    # CAMS data becomes available for current day, midnight at 10AM UTC
    if 10 <= current_hour < 22:
        model_date = now
        model_time = "00"
    # CAMS data becomes available for current day, midday at 10PM UTC
    elif 22 <= current_hour < 24:
        model_date = now
        model_time = "12"
    else:
        model_date = now - timedelta(days=1)
        model_time = "12"
    return CamsModelDateTime(model_date.strftime("%Y-%m-%d"), model_time)


def fetch_forecast_data(
    model_date_time: CamsModelDateTime = None,
) -> ForecastData:
    model_date_time = (
        get_latest_cam_model_date_time() if model_date_time is None else model_date_time
    )
    task_params = [
        (
            get_single_level_request_body(model_date_time),
            f"single_level_{model_date_time.date}_{model_date_time.time}.grib",
        ),
        (
            get_multi_level_request_body(model_date_time),
            f"multi_level_{model_date_time.date}_{model_date_time.time}.grib",
        ),
    ]
    results = [fetch_cams_data(*params) for params in task_params]
    return ForecastData(*results)