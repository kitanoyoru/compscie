defmodule Solution do
  @spec nth_ugly_number(n :: integer) :: integer    
  def nth_ugly_number(n) do
    loop(n)
  end

  def loop(nums \\ [1], indices \\ {0, 0, 0}, seq)

  def loop([head | _rest], _indices, 1) do
    head
  end

  def loop(nums, {i2, i3, i5}, seq) do
    next2 = Enum.at(nums, i2) * 2
    next3 = Enum.at(nums, i3) * 3
    next5 = Enum.at(nums, i5) * 5

    next_value = Enum.min([next2, next3, next5])

    i2 = if next2 <= next_value, do: i2, else: i2 + 1
    i3 = if next3 <= next_value, do: i3, else: i3 + 1
    i5 = if next5 <= next_value, do: i5, else: i5 + 1

    loop([next_value | nums], {i2, i3, i5}, seq - 1)
  end
end


