defmodule Solution do
  @spec append_characters(s :: String.t(), t :: String.t()) :: integer
  def append_characters(s, t) do
    append_characters(s, t, 0, 0, String.length(s), String.length(t))
  end

  defp append_characters(_s, _t, _i, j, _sl, tl) when j == tl, do: 0

  defp append_characters(_s, _t, i, j, sl, tl) when i == sl, do: tl - j

  defp append_characters(s, t, i, j, sl, tl) do
    if String.at(s, i) == String.at(t, j) do
      append_characters(s, t, i + 1, j + 1, sl, tl)
    else
      append_characters(s, t, i + 1, j, sl, tl)
    end
  end
end

