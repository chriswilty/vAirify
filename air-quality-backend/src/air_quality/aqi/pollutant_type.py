from enum import Enum
from typing import Literal


class PollutantType(Enum):
    NITROGEN_DIOXIDE = "no2"
    OZONE = "o3"
    PARTICULATE_MATTER_2_5 = "pm2_5"
    PARTICULATE_MATTER_10 = "pm10"
    SULPHUR_DIOXIDE = "so2"

    def __eq__(self, other):
        if other is None or not hasattr(other, "name") or not hasattr(other, "value"):
            return False
        return other.name == self.name and other.value == self.value

    def __hash__(self):
        return hash(self.value)

    def literal(self) -> Literal["no2", "o3", "pm2_5", "pm10", "so2"]:
        # Allows usage of enum for keys in TypedDict
        return self.value


def is_single_level(pollutant_type: PollutantType) -> bool:
    is_pm2_5 = pollutant_type == PollutantType.PARTICULATE_MATTER_2_5
    is_pm10 = pollutant_type == PollutantType.PARTICULATE_MATTER_10
    return is_pm10 or is_pm2_5
