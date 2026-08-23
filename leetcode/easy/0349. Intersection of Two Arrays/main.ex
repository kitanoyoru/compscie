defmodule Solution do
  @spec intersection(nums1 :: [integer], nums2 :: [integer]) :: [integer]
  def intersection(nums1, nums2) do
    set1 = Enum.into(nums1, MapSet.new())
    set2 = Enum.into(nums2, MapSet.new())

    Enum.to_list(MapSet.intersection(set1, set2))
  end
end
