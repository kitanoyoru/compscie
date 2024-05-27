defmodule Solution do
  @spec special_array(nums :: [integer]) :: integer
  def special_array(nums) do
    nums = Enum.sort(nums)
    search(nums, 0, length(nums))
  end

  defp search(nums, low, high) when low <= high do
    mid = div(low + high, 2)
    freq = count(nums, mid)

    cond do
      mid == freq -> mid
      freq > mid -> search(nums, mid + 1, high)
      freq < mid -> search(nums, low, mid - 1)
    end
  end

  defp search(_nums, _low, _high), do: -1

  defp count(nums, target) do
    Enum.count(nums, fn x -> x >= target end)
  end
end
