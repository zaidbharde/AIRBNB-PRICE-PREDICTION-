"""Convert point predictions and errors into actionable price bands."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class PriceBand:
    """A non-negative lower and upper estimate around a prediction."""

    lower: float
    estimate: float
    upper: float

    def __post_init__(self) -> None:
        if not 0 <= self.lower <= self.estimate <= self.upper:
            raise ValueError("price band must satisfy lower <= estimate <= upper")

    @property
    def width(self) -> float:
        """Return the absolute uncertainty width."""
        return self.upper - self.lower

    @property
    def relative_width(self) -> float:
        """Return uncertainty as a fraction of the estimate."""
        return self.width / self.estimate if self.estimate else 0.0


def make_band(estimate: float, error_rate: float, *, floor: float = 0.0) -> PriceBand:
    """Build a symmetric band from a point estimate and relative error."""
    if estimate < 0 or error_rate < 0 or floor < 0:
        raise ValueError("estimate, error rate, and floor must be non-negative")
    error = estimate * error_rate
    return PriceBand(max(floor, estimate - error), estimate, estimate + error)
