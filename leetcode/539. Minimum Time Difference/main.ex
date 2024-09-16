defmodule Solution do
  @spec find_min_difference(time_points :: [String.t()]) :: integer
  def find_min_difference(time_points) do
    minutes = Enum.map(time_points, &convert_to_minutes/1)
    sorted_minutes = Enum.sort(minutes)

    min_diff = find_consecutive_diff(sorted_minutes)
    wrap_around_diff = calculate_wrap_around_diff(sorted_minutes)

    min(min_diff, wrap_around_diff)
  end

  defp convert_to_minutes(time_point) do
    [hours_str, minutes_str] = String.split(time_point, ":")

    hours = String.to_integer(hours_str)
    minutes = String.to_integer(minutes_str)

    60 * hours + minutes
  end

  defp find_consecutive_diff(sorted_minutes) do
    sorted_minutes
    |> Enum.chunk_every(2, 1, :discard)
    |> Enum.map(fn [a, b] -> b - a end)
    |> Enum.min()
  end

  defp calculate_wrap_around_diff(sorted_minutes) do
    first = List.first(sorted_minutes)
    last = List.last(sorted_minutes)

    1440 - last + first
  end
end

