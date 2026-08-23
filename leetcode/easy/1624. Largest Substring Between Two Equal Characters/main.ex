defmodule Solution do
  @spec max_length_between_equal_characters(s :: String.t()) :: integer
  def max_length_between_equal_characters(s), do: do_max_length(s, 0, %{}, -1)

  defp do_max_length(<<f, rest::bytes>>, i, index_map, max_length) do
    case index_map[f] do
      nil -> do_max_length(rest, i + 1, Map.put(index_map, f, i), max_length)
      x -> do_max_length(rest, i + 1, index_map, max(max_length, i - 1 - x))
    end
  end

  defp do_max_length(<<>>, _, _, max_length), do: max_length
end
