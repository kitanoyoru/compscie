defmodule Solution do
  @spec height_checker(heights :: [integer]) :: integer
  def height_checker(heights) do
    height_checker(heights, Enum.sort(heights), 0)
  end

  defp height_checker([], [], result), do: result

  defp height_checker([head1 | tail1], [head2 | tail2], result) do
    new_result = if head1 != head2, do: result + 1, else: result
    height_checker(tail1, tail2, new_result)
  end
end
