defmodule Solution do
  @spec min_steps(s :: String.t(), t :: String.t()) :: integer
  def min_steps(s, t) do
    s_freq = Enum.reduce(String.to_charlist(s), init_freq(), &update_freq/2)
    t_freq = Enum.reduce(String.to_charlist(t), init_freq(), &update_freq/2)

    steps =
      Enum.reduce(0..25, 0, fn i, acc -> acc + abs(Enum.at(s_freq, i) - Enum.at(t_freq, i)) end)

    div(steps, 2)
  end

  @spec init_freq() :: list()
  defp init_freq, do: Enum.map(0..25, fn _ -> 0 end)

  @spec update_freq(char(), list()) :: list()
  defp update_freq(c, freq) do
    idx = c - 97
    List.replace_at(freq, idx, Enum.at(freq, idx) + 1)
  end
end
