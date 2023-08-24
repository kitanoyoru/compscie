defmodule Solution do
  @spec search(nums :: [integer], target :: integer) :: integer
  def search(nums, target), do: search(nums, target, 0, length(nums) - 1)
  def search(_nums, _target, left, right) when left > right, do: -1
  def search(nums, target, left, right) do
    mid_pos = left + div(right - left, 2)
    mid_elem = Enum.at(nums, mid_pos)

    cond do
      mid_elem == target -> mid_pos
      mid_elem < target -> search(nums, target, mid_pos + 1, right)
      mid_elem > target -> search(nums, target, left, mid_pos - 1)
    end
  end
end
