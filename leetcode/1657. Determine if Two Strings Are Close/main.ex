defmodule Solution do
  @spec close_strings(word1 :: String.t(), word2 :: String.t()) :: boolean
  def close_strings(word1, word2) do
    if String.length(word1) != String.length(word2) do
      false
    else
      first_freq = word1 |> String.to_charlist() |> Enum.reduce(init_freq(), &update_freq/2)
      second_freq = word2 |> String.to_charlist() |> Enum.reduce(init_freq(), &update_freq/2)

      if has_non_matching_freqs?(first_freq, second_freq) do
        false
      else
        first_freq = Enum.sort(first_freq)
        second_freq = Enum.sort(second_freq)

        first_freq == second_freq
      end
    end
  end

  @spec init_freq() :: list()
  def init_freq(), do: Enum.map(0..25, fn _ -> 0 end)

  @spec update_freq(char(), list()) :: list()
  defp update_freq(c, freq) do
    idx = c - 97
    List.replace_at(freq, idx, Enum.at(freq, idx) + 1)
  end

  @spec has_non_matching_freqs?(list(), list()) :: bool()
  defp has_non_matching_freqs?(first, second) do
    Enum.any?(
      Enum.zip(first, second),
      fn {v1, v2} -> (v1 == 0 && v2 > 0) || (v1 > 0 && v2 == 0) end
    )
  end
end
