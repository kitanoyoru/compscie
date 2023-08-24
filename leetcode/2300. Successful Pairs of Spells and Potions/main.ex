defmodule Solution do
  def binary_search(left, right, potions, success) do
        if left <= right do
          mid_pos = left + div(right - left, 2)
					mid_elem = Enum.at(potions, mid_pos)
          cond do
            mid_elem >= success -> binary_search(left, mid_pos - 1, potions, success)
            mid_elem < success -> binary_search(mid_pos + 1, right, potions, success)
          end
        end

      {left, right}
  end

  @spec successful_pairs(spells :: [integer], potions :: [integer], success :: integer) :: [integer]
  def successful_pairs(spells, potions, success) do
    n = length(spells)
    m = length(potions)

    pairs = []

    potions = Enum.sort(potions)

    potions
    |> Enum.with_index
    |> Enum.each(
      fn {potion, i} ->
        left = 0
        right = m - 1

        {left, right} = binary_search(left, right, potions, success)

        pairs = pairs ++ [m - left]
      end
    )
    pairs
  end
end
