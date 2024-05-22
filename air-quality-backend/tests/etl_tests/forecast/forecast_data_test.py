import pytest
import xarray
from src.etl.air_quality_index.pollutant_type import PollutantType
from src.etl.forecast.forecast_data import (
    convert_east_only_longitude_to_east_west,
    ForecastData,
)
from .mock_forecast_data import (
    create_test_pollutant_data,
)


@pytest.mark.parametrize(
    "longitude, expected",
    [
        (0.0, 0.0),
        (179.6, 179.6),
        (180.0, 180.0),
        (180.4, -179.6),
        (360.0, 0),
        (359.6, -0.4),
        (-0.1, -0.1),
        (-180.0, -180.0),
    ],
)
def test__convert_longitude_east_range(longitude: float, expected: float):
    assert convert_east_only_longitude_to_east_west(longitude) == expected


@pytest.mark.parametrize(
    "latitude, longitude, expected",
    [
        (-10.0, -90.0, [1]),
        (0, 0.0, [4]),
        (10.0, 90.0, [10]),
        (-5.0, -45.0, [2.25]),
        (5.0, 90.0, [9]),
        (8.75, 60.0, [9]),
    ],
)
def test__get_pollutant_data_for_lat_long(latitude: float, longitude: float, expected):
    #      -90  0  90
    # -10    1  2   4
    #   0    2  4   8
    #  10    4  8  10
    input_data = create_test_pollutant_data(
        steps=[24],
        latitudes=[-10, 0, 10],
        longitudes=[0, 90, 270],
        values=[2, 4, 1, 4, 8, 2, 8, 10, 4],
    )
    dataset = xarray.Dataset(
        coords=dict(step=[24]),
        data_vars=dict(no2=input_data),
    )
    forecast_data = ForecastData(dataset, dataset)
    result = forecast_data.get_pollutant_data_for_lat_long(
        latitude, longitude, PollutantType.NITROGEN_DIOXIDE
    )
    assert result == expected