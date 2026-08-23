# LeetCode

596 problems solved, filed by difficulty. Each folder holds one problem, with one file per language I solved it in.

| | Count |
| --- | ---: |
| [Easy](#easy) | 259 |
| [Medium](#medium) | 304 |
| [Hard](#hard) | 24 |
| [Misc](#misc) | 9 |
| **Total** | **596** |

## Layout

```
easy/    medium/    hard/     one folder per problem: `0001. Two Sum`
misc/                         unidentified or non-LeetCode scratch work
structures/                   shared data structures and helpers
tools/                        organize.py + the problem index
```

Solve something new, drop the folder anywhere, then run:

```sh
make organize   # preview where things would land
make apply      # file them and refresh this README
```

## Easy

| # | Problem | Languages |
| ---: | --- | --- |
| 1 | [Two Sum](easy/0001.%20Two%20Sum) | Dart, Elixir, Go, Rust, Swift, TypeScript |
| 9 | [Palindrome Number](easy/0009.%20Palindrome%20Number) | Go, TypeScript |
| 13 | [Roman to Integer](easy/0013.%20Roman%20to%20Integer) | Go |
| 14 | [Longest Common Prefix](easy/0014.%20Longest%20Common%20Prefix) | TypeScript |
| 20 | [Valid Parentheses](easy/0020.%20Valid%20Parentheses) | Rust, TypeScript |
| 21 | [Merge Two Sorted Lists](easy/0021.%20Merge%20Two%20Sorted%20Lists) | Java, TypeScript |
| 27 | [Remove Element](easy/0027.%20Remove%20Element) | Go |
| 28 | [Find the Index of the First Occurrence in a String](easy/0028.%20Find%20the%20Index%20of%20the%20First%20Occurrence%20in%20a%20String) | Java, TypeScript |
| 35 | [Search Insert Position](easy/0035.%20Search%20Insert%20Position) | Java, Python, TypeScript |
| 58 | [Length of Last Word](easy/0058.%20Length%20of%20Last%20Word) | Java, Python, TypeScript |
| 66 | [Plus One](easy/0066.%20Plus%20One) | Go, Python, TypeScript |
| 67 | [Add Binary](easy/0067.%20Add%20Binary) | Java, TypeScript |
| 69 | [Sqrt(x)](easy/0069.%20Sqrt%28x%29) | Go, TypeScript |
| 70 | [Climbing Stairs](easy/0070.%20Climbing%20Stairs) | Go, Java, Rust, TypeScript |
| 83 | [Remove Duplicates from Sorted List](easy/0083.%20Remove%20Duplicates%20from%20Sorted%20List) | TypeScript |
| 88 | [Merge Sorted Array](easy/0088.%20Merge%20Sorted%20Array) | TypeScript |
| 94 | [Binary Tree Inorder Traversal](easy/0094.%20Binary%20Tree%20Inorder%20Traversal) | Java, TypeScript |
| 100 | [Same Tree](easy/0100.%20Same%20Tree) | Go |
| 101 | [Symmetric Tree](easy/0101.%20Symmetric%20Tree) | Go, Java, Rust, TypeScript |
| 104 | [Maximum Depth of Binary Tree](easy/0104.%20Maximum%20Depth%20of%20Binary%20Tree) | Go, Java, Rust, TypeScript |
| 108 | [Convert Sorted Array to Binary Search Tree](easy/0108.%20Convert%20Sorted%20Array%20to%20Binary%20Search%20Tree) | Go, TypeScript |
| 110 | [Balanced Binary Tree](easy/0110.%20Balanced%20Binary%20Tree) | C++, Go, Java, TypeScript |
| 111 | [Minimum Depth of Binary Tree](easy/0111.%20Minimum%20Depth%20of%20Binary%20Tree) | Go, Python, Rust, TypeScript |
| 112 | [Path Sum](easy/0112.%20Path%20Sum) | Java, TypeScript |
| 118 | [Pascal's Triangle](easy/0118.%20Pascal%27s%20Triangle) | Java, Python, TypeScript |
| 119 | [Pascal's Triangle II](easy/0119.%20Pascal%27s%20Triangle%20II) | TypeScript |
| 121 | [Best Time to Buy and Sell Stock](easy/0121.%20Best%20Time%20to%20Buy%20and%20Sell%20Stock) | Java, Python, TypeScript |
| 125 | [Valid Palindrome](easy/0125.%20Valid%20Palindrome) | Python |
| 136 | [Single Number](easy/0136.%20Single%20Number) | Java, Rust, TypeScript |
| 141 | [Linked List Cycle](easy/0141.%20Linked%20List%20Cycle) | Go, TypeScript |
| 144 | [Binary Tree Preorder Traversal](easy/0144.%20Binary%20Tree%20Preorder%20Traversal) | Go, Rust, TypeScript |
| 145 | [Binary Tree Postorder Traversal](easy/0145.%20Binary%20Tree%20Postorder%20Traversal) | TypeScript |
| 160 | [Intersection of Two Linked Lists](easy/0160.%20Intersection%20of%20Two%20Linked%20Lists) | TypeScript |
| 169 | [Majority Element](easy/0169.%20Majority%20Element) | TypeScript |
| 175 | [Combine Two Tables](easy/0175.%20Combine%20Two%20Tables) | SQL |
| 181 | [Employees Earning More Than Their Managers](easy/0181.%20Employees%20Earning%20More%20Than%20Their%20Managers) | SQL |
| 182 | [Duplicate Emails](easy/0182.%20Duplicate%20Emails) | SQL |
| 183 | [Customers Who Never Order](easy/0183.%20Customers%20Who%20Never%20Order) | Python |
| 190 | [Reverse Bits](easy/0190.%20Reverse%20Bits) | Rust |
| 191 | [Number of 1 Bits](easy/0191.%20Number%20of%201%20Bits) | Java, Python, Rust, TypeScript |
| 196 | [Delete Duplicate Emails](easy/0196.%20Delete%20Duplicate%20Emails) | Python, SQL |
| 197 | [Rising Temperature](easy/0197.%20Rising%20Temperature) | SQL |
| 202 | [Happy Number](easy/0202.%20Happy%20Number) | Go |
| 203 | [Remove Linked List Elements](easy/0203.%20Remove%20Linked%20List%20Elements) | TypeScript |
| 205 | [Isomorphic Strings](easy/0205.%20Isomorphic%20Strings) | Go |
| 206 | [Reverse Linked List](easy/0206.%20Reverse%20Linked%20List) | Java, Rust, TypeScript |
| 217 | [Contains Duplicate](easy/0217.%20Contains%20Duplicate) | Go, Python, Rust, Swift, TypeScript |
| 219 | [Contains Duplicate II](easy/0219.%20Contains%20Duplicate%20II) | Go, Java, TypeScript |
| 222 | [Count Complete Tree Nodes](easy/0222.%20Count%20Complete%20Tree%20Nodes) | Go, TypeScript |
| 225 | [Implement Stack using Queues](easy/0225.%20Implement%20Stack%20using%20Queues) | Go, Rust |
| 226 | [Invert Binary Tree](easy/0226.%20Invert%20Binary%20Tree) | Go, Java, Rust, TypeScript |
| 231 | [Power of Two](easy/0231.%20Power%20of%20Two) | Java, Python, Rust, TypeScript |
| 232 | [Implement Queue using Stacks](easy/0232.%20Implement%20Queue%20using%20Stacks) | Go, TypeScript |
| 234 | [Palindrome Linked List](easy/0234.%20Palindrome%20Linked%20List) | TypeScript |
| 242 | [Valid Anagram](easy/0242.%20Valid%20Anagram) | Go, Rust, TypeScript |
| 257 | [Binary Tree Paths](easy/0257.%20Binary%20Tree%20Paths) | Go, TypeScript |
| 268 | [Missing Number](easy/0268.%20Missing%20Number) | Go |
| 278 | [First Bad Version](easy/0278.%20First%20Bad%20Version) | Java, Python, TypeScript |
| 283 | [Move Zeroes](easy/0283.%20Move%20Zeroes) | TypeScript |
| 290 | [Word Pattern](easy/0290.%20Word%20Pattern) | Go, TypeScript |
| 326 | [Power of Three](easy/0326.%20Power%20of%20Three) | Rust, TypeScript |
| 338 | [Counting Bits](easy/0338.%20Counting%20Bits) | Go, Python, Rust |
| 342 | [Power of Four](easy/0342.%20Power%20of%20Four) | TypeScript |
| 344 | [Reverse String](easy/0344.%20Reverse%20String) | C, Go, Java, Python, Rust, Scala, TypeScript, Zig |
| 345 | [Reverse Vowels of a String](easy/0345.%20Reverse%20Vowels%20of%20a%20String) | Go |
| 349 | [Intersection of Two Arrays](easy/0349.%20Intersection%20of%20Two%20Arrays) | C, Elixir, Go, Java, Python, Rust, Swift, TypeScript |
| 350 | [Intersection of Two Arrays II](easy/0350.%20Intersection%20of%20Two%20Arrays%20II) | TypeScript |
| 367 | [Valid Perfect Square](easy/0367.%20Valid%20Perfect%20Square) | Java, TypeScript |
| 374 | [Guess Number Higher or Lower](easy/0374.%20Guess%20Number%20Higher%20or%20Lower) | Java, TypeScript |
| 383 | [Ransom Note](easy/0383.%20Ransom%20Note) | Java, TypeScript |
| 387 | [First Unique Character in a String](easy/0387.%20First%20Unique%20Character%20in%20a%20String) | TypeScript |
| 389 | [Find the Difference](easy/0389.%20Find%20the%20Difference) | Go, Rust |
| 392 | [Is Subsequence](easy/0392.%20Is%20Subsequence) | Go |
| 401 | [Binary Watch](easy/0401.%20Binary%20Watch) | Go |
| 404 | [Sum of Left Leaves](easy/0404.%20Sum%20of%20Left%20Leaves) | Go |
| 409 | [Longest Palindrome](easy/0409.%20Longest%20Palindrome) | TypeScript |
| 415 | [Add Strings](easy/0415.%20Add%20Strings) | TypeScript |
| 441 | [Arranging Coins](easy/0441.%20Arranging%20Coins) | TypeScript |
| 448 | [Find All Numbers Disappeared in an Array](easy/0448.%20Find%20All%20Numbers%20Disappeared%20in%20an%20Array) | Go |
| 455 | [Assign Cookies](easy/0455.%20Assign%20Cookies) | Dart, Go, Rust, TypeScript |
| 459 | [Repeated Substring Pattern](easy/0459.%20Repeated%20Substring%20Pattern) | Java, Python, TypeScript |
| 463 | [Island Perimeter](easy/0463.%20Island%20Perimeter) | Go, Java, Python, Rust |
| 496 | [Next Greater Element I](easy/0496.%20Next%20Greater%20Element%20I) | Rust |
| 500 | [Keyboard Row](easy/0500.%20Keyboard%20Row) | Go, Rust |
| 501 | [Find Mode in Binary Search Tree](easy/0501.%20Find%20Mode%20in%20Binary%20Search%20Tree) | Go, Python, Rust, Swift, TypeScript |
| 509 | [Fibonacci Number](easy/0509.%20Fibonacci%20Number) | TypeScript |
| 511 | [Game Play Analysis I](easy/0511.%20Game%20Play%20Analysis%20I) | SQL |
| 530 | [Minimum Absolute Difference in BST](easy/0530.%20Minimum%20Absolute%20Difference%20in%20BST) | Go, TypeScript |
| 543 | [Diameter of Binary Tree](easy/0543.%20Diameter%20of%20Binary%20Tree) | Go |
| 557 | [Reverse Words in a String III](easy/0557.%20Reverse%20Words%20in%20a%20String%20III) | Go, Python, Rust, TypeScript |
| 559 | [Maximum Depth of N-ary Tree](easy/0559.%20Maximum%20Depth%20of%20N-ary%20Tree) | Go |
| 561 | [Array Partition](easy/0561.%20Array%20Partition) | Go |
| 563 | [Binary Tree Tilt](easy/0563.%20Binary%20Tree%20Tilt) | C, Go |
| 566 | [Reshape the Matrix](easy/0566.%20Reshape%20the%20Matrix) | Java, Python, TypeScript |
| 572 | [Subtree of Another Tree](easy/0572.%20Subtree%20of%20Another%20Tree) | TypeScript |
| 575 | [Distribute Candies](easy/0575.%20Distribute%20Candies) | Rust |
| 577 | [Employee Bonus](easy/0577.%20Employee%20Bonus) | SQL |
| 586 | [Customer Placing the Largest Number of Orders](easy/0586.%20Customer%20Placing%20the%20Largest%20Number%20of%20Orders) | SQL |
| 589 | [N-ary Tree Preorder Traversal](easy/0589.%20N-ary%20Tree%20Preorder%20Traversal) | Go |
| 590 | [N-ary Tree Postorder Traversal](easy/0590.%20N-ary%20Tree%20Postorder%20Traversal) | Go |
| 594 | [Longest Harmonious Subsequence](easy/0594.%20Longest%20Harmonious%20Subsequence) | Go |
| 595 | [Big Countries](easy/0595.%20Big%20Countries) | Python, SQL |
| 596 | [Classes With at Least 5 Students](easy/0596.%20Classes%20With%20at%20Least%205%20Students) | SQL |
| 599 | [Minimum Index Sum of Two Lists](easy/0599.%20Minimum%20Index%20Sum%20of%20Two%20Lists) | Go |
| 605 | [Can Place Flowers](easy/0605.%20Can%20Place%20Flowers) | Go |
| 607 | [Sales Person](easy/0607.%20Sales%20Person) | SQL |
| 610 | [Triangle Judgement](easy/0610.%20Triangle%20Judgement) | SQL |
| 617 | [Merge Two Binary Trees](easy/0617.%20Merge%20Two%20Binary%20Trees) | Go, Java, TypeScript |
| 619 | [Biggest Single Number](easy/0619.%20Biggest%20Single%20Number) | SQL |
| 620 | [Not Boring Movies](easy/0620.%20Not%20Boring%20Movies) | SQL |
| 627 | [Swap Sex of Employees](easy/0627.%20Swap%20Sex%20of%20Employees) | SQL |
| 628 | [Maximum Product of Three Numbers](easy/0628.%20Maximum%20Product%20of%20Three%20Numbers) | C, C++, Go, Python, Rust, Swift, TypeScript |
| 637 | [Average of Levels in Binary Tree](easy/0637.%20Average%20of%20Levels%20in%20Binary%20Tree) | TypeScript |
| 653 | [Two Sum IV - Input is a BST](easy/0653.%20Two%20Sum%20IV%20-%20Input%20is%20a%20BST) | Go, Java, TypeScript |
| 671 | [Second Minimum Node In a Binary Tree](easy/0671.%20Second%20Minimum%20Node%20In%20a%20Binary%20Tree) | Go |
| 697 | [Degree of an Array](easy/0697.%20Degree%20of%20an%20Array) | Rust |
| 700 | [Search in a Binary Search Tree](easy/0700.%20Search%20in%20a%20Binary%20Search%20Tree) | Java, TypeScript |
| 703 | [Kth Largest Element in a Stream](easy/0703.%20Kth%20Largest%20Element%20in%20a%20Stream) | Rust |
| 704 | [Binary Search](easy/0704.%20Binary%20Search) | Elixir, Go, Java, Python, Rust, TypeScript |
| 705 | [Design HashSet](easy/0705.%20Design%20HashSet) | Go, Rust |
| 706 | [Design HashMap](easy/0706.%20Design%20HashMap) | TypeScript |
| 733 | [Flood Fill](easy/0733.%20Flood%20Fill) | Java, TypeScript |
| 744 | [Find Smallest Letter Greater Than Target](easy/0744.%20Find%20Smallest%20Letter%20Greater%20Than%20Target) | TypeScript |
| 746 | [Min Cost Climbing Stairs](easy/0746.%20Min%20Cost%20Climbing%20Stairs) | Go, Rust, TypeScript |
| 771 | [Jewels and Stones](easy/0771.%20Jewels%20and%20Stones) | C, Go |
| 783 | [Minimum Distance Between BST Nodes](easy/0783.%20Minimum%20Distance%20Between%20BST%20Nodes) | Go, Python, Rust |
| 804 | [Unique Morse Code Words](easy/0804.%20Unique%20Morse%20Code%20Words) | TypeScript |
| 812 | [Largest Triangle Area](easy/0812.%20Largest%20Triangle%20Area) | Go, Rust |
| 844 | [Backspace String Compare](easy/0844.%20Backspace%20String%20Compare) | TypeScript |
| 867 | [Transpose Matrix](easy/0867.%20Transpose%20Matrix) | Go |
| 872 | [Leaf-Similar Trees](easy/0872.%20Leaf-Similar%20Trees) | Go, Rust |
| 876 | [Middle of the Linked List](easy/0876.%20Middle%20of%20the%20Linked%20List) | Go, TypeScript |
| 884 | [Uncommon Words from Two Sentences](easy/0884.%20Uncommon%20Words%20from%20Two%20Sentences) | Go |
| 896 | [Monotonic Array](easy/0896.%20Monotonic%20Array) | Go, Java, Python, Rust, TypeScript |
| 897 | [Increasing Order Search Tree](easy/0897.%20Increasing%20Order%20Search%20Tree) | Go |
| 905 | [Sort Array By Parity](easy/0905.%20Sort%20Array%20By%20Parity) | Go, Python, Rust |
| 938 | [Range Sum of BST](easy/0938.%20Range%20Sum%20of%20BST) | Go, Python |
| 942 | [DI String Match](easy/0942.%20DI%20String%20Match) | Go |
| 953 | [Verifying an Alien Dictionary](easy/0953.%20Verifying%20an%20Alien%20Dictionary) | Go, Rust |
| 961 | [N-Repeated Element in Size 2N Array](easy/0961.%20N-Repeated%20Element%20in%20Size%202N%20Array) | Go |
| 965 | [Univalued Binary Tree](easy/0965.%20Univalued%20Binary%20Tree) | Go |
| 977 | [Squares of a Sorted Array](easy/0977.%20Squares%20of%20a%20Sorted%20Array) | Java, Python, TypeScript |
| 989 | [Add to Array-Form of Integer](easy/0989.%20Add%20to%20Array-Form%20of%20Integer) | TypeScript |
| 993 | [Cousins in Binary Tree](easy/0993.%20Cousins%20in%20Binary%20Tree) | Go |
| 1022 | [Sum of Root To Leaf Binary Numbers](easy/1022.%20Sum%20of%20Root%20To%20Leaf%20Binary%20Numbers) | Go |
| 1046 | [Last Stone Weight](easy/1046.%20Last%20Stone%20Weight) | Go, Rust |
| 1050 | [Actors and Directors Who Cooperated At Least Three Times](easy/1050.%20Actors%20and%20Directors%20Who%20Cooperated%20At%20Least%20Three%20Times) | SQL |
| 1051 | [Height Checker](easy/1051.%20Height%20Checker) | Elixir, Go, Python, Rust, TypeScript, Zig |
| 1068 | [Product Sales Analysis I](easy/1068.%20Product%20Sales%20Analysis%20I) | SQL |
| 1108 | [Defanging an IP Address](easy/1108.%20Defanging%20an%20IP%20Address) | Rust |
| 1137 | [N-th Tribonacci Number](easy/1137.%20N-th%20Tribonacci%20Number) | TypeScript |
| 1141 | [User Activity for the Past 30 Days I](easy/1141.%20User%20Activity%20for%20the%20Past%2030%20Days%20I) | SQL |
| 1148 | [Article Views I](easy/1148.%20Article%20Views%20I) | Python, SQL |
| 1207 | [Unique Number of Occurrences](easy/1207.%20Unique%20Number%20of%20Occurrences) | Go, Rust |
| 1221 | [Split a String in Balanced Strings](easy/1221.%20Split%20a%20String%20in%20Balanced%20Strings) | Go, Rust |
| 1266 | [Minimum Time Visiting All Points](easy/1266.%20Minimum%20Time%20Visiting%20All%20Points) | Go |
| 1281 | [Subtract the Product and Sum of Digits of an Integer](easy/1281.%20Subtract%20the%20Product%20and%20Sum%20of%20Digits%20of%20an%20Integer) | TypeScript |
| 1287 | [Element Appearing More Than 25% In Sorted Array](easy/1287.%20Element%20Appearing%20More%20Than%2025%25%20In%20Sorted%20Array) | Go |
| 1323 | [Maximum 69 Number](easy/1323.%20Maximum%2069%20Number) | Go, Rust |
| 1337 | [The K Weakest Rows in a Matrix](easy/1337.%20The%20K%20Weakest%20Rows%20in%20a%20Matrix) | Go, TypeScript |
| 1346 | [Check If N and Its Double Exist](easy/1346.%20Check%20If%20N%20and%20Its%20Double%20Exist) | TypeScript |
| 1351 | [Count Negative Numbers in a Sorted Matrix](easy/1351.%20Count%20Negative%20Numbers%20in%20a%20Sorted%20Matrix) | Go, TypeScript |
| 1356 | [Sort Integers by The Number of 1 Bits](easy/1356.%20Sort%20Integers%20by%20The%20Number%20of%201%20Bits) | C, Go, Python, TypeScript |
| 1365 | [How Many Numbers Are Smaller Than the Current Number](easy/1365.%20How%20Many%20Numbers%20Are%20Smaller%20Than%20the%20Current%20Number) | Go, Python |
| 1370 | [Increasing Decreasing String](easy/1370.%20Increasing%20Decreasing%20String) | Go |
| 1379 | [Find a Corresponding Node of a Binary Tree in a Clone of That Tree](easy/1379.%20Find%20a%20Corresponding%20Node%20of%20a%20Binary%20Tree%20in%20a%20Clone%20of%20That%20Tree) | TypeScript |
| 1385 | [Find the Distance Value Between Two Arrays](easy/1385.%20Find%20the%20Distance%20Value%20Between%20Two%20Arrays) | Java, TypeScript |
| 1389 | [Create Target Array in the Given Order](easy/1389.%20Create%20Target%20Array%20in%20the%20Given%20Order) | Rust, Scala |
| 1403 | [Minimum Subsequence in Non-Increasing Order](easy/1403.%20Minimum%20Subsequence%20in%20Non-Increasing%20Order) | Go |
| 1431 | [Kids With the Greatest Number of Candies](easy/1431.%20Kids%20With%20the%20Greatest%20Number%20of%20Candies) | Go, Python, Rust |
| 1436 | [Destination City](easy/1436.%20Destination%20City) | Go |
| 1437 | [Check If All 1's Are at Least Length K Places Away](easy/1437.%20Check%20If%20All%201%27s%20Are%20at%20Least%20Length%20K%20Places%20Away) | Go |
| 1464 | [Maximum Product of Two Elements in an Array](easy/1464.%20Maximum%20Product%20of%20Two%20Elements%20in%20an%20Array) | Rust |
| 1470 | [Shuffle the Array](easy/1470.%20Shuffle%20the%20Array) | Rust, Scala |
| 1480 | [Running Sum of 1d Array](easy/1480.%20Running%20Sum%20of%201d%20Array) | Java, Python, Rust, TypeScript |
| 1484 | [Group Sold Products By The Date](easy/1484.%20Group%20Sold%20Products%20By%20The%20Date) | SQL |
| 1491 | [Average Salary Excluding the Minimum and Maximum Salary](easy/1491.%20Average%20Salary%20Excluding%20the%20Minimum%20and%20Maximum%20Salary) | TypeScript |
| 1512 | [Number of Good Pairs](easy/1512.%20Number%20of%20Good%20Pairs) | Go, Rust, Scala |
| 1517 | [Find Users With Valid E-Mails](easy/1517.%20Find%20Users%20With%20Valid%20E-Mails) | Python, SQL |
| 1518 | [Water Bottles](easy/1518.%20Water%20Bottles) | Go |
| 1523 | [Count Odd Numbers in an Interval Range](easy/1523.%20Count%20Odd%20Numbers%20in%20an%20Interval%20Range) | Go, Python, Rust, TypeScript |
| 1527 | [Patients With a Condition](easy/1527.%20Patients%20With%20a%20Condition) | Python, SQL |
| 1534 | [Count Good Triplets](easy/1534.%20Count%20Good%20Triplets) | C, C++, Go, Java, Python, Rust, TypeScript |
| 1539 | [Kth Missing Positive Number](easy/1539.%20Kth%20Missing%20Positive%20Number) | TypeScript |
| 1550 | [Three Consecutive Odds](easy/1550.%20Three%20Consecutive%20Odds) | Go |
| 1572 | [Matrix Diagonal Sum](easy/1572.%20Matrix%20Diagonal%20Sum) | Go, Rust |
| 1581 | [Customer Who Visited but Did Not Make Any Transactions](easy/1581.%20Customer%20Who%20Visited%20but%20Did%20Not%20Make%20Any%20Transactions) | SQL |
| 1608 | [Special Array With X Elements Greater Than or Equal X](easy/1608.%20Special%20Array%20With%20X%20Elements%20Greater%20Than%20or%20Equal%20X) | Elixir, Go, Rust, TypeScript |
| 1624 | [Largest Substring Between Two Equal Characters](easy/1624.%20Largest%20Substring%20Between%20Two%20Equal%20Characters) | Dart, Elixir, Go, Python, Rust, TypeScript |
| 1656 | [Design an Ordered Stream](easy/1656.%20Design%20an%20Ordered%20Stream) | Go |
| 1662 | [Check If Two String Arrays are Equivalent](easy/1662.%20Check%20If%20Two%20String%20Arrays%20are%20Equivalent) | Go, Python |
| 1667 | [Fix Names in a Table](easy/1667.%20Fix%20Names%20in%20a%20Table) | Python, SQL |
| 1683 | [Invalid Tweets](easy/1683.%20Invalid%20Tweets) | Python, SQL |
| 1684 | [Count the Number of Consistent Strings](easy/1684.%20Count%20the%20Number%20of%20Consistent%20Strings) | C, Go |
| 1693 | [Daily Leads and Partners](easy/1693.%20Daily%20Leads%20and%20Partners) | SQL |
| 1704 | [Determine if String Halves Are Alike](easy/1704.%20Determine%20if%20String%20Halves%20Are%20Alike) | Go, Rust |
| 1729 | [Find Followers Count](easy/1729.%20Find%20Followers%20Count) | SQL |
| 1731 | [The Number of Employees Which Report to Each Employee](easy/1731.%20The%20Number%20of%20Employees%20Which%20Report%20to%20Each%20Employee) | SQL |
| 1732 | [Find the Highest Altitude](easy/1732.%20Find%20the%20Highest%20Altitude) | Go, Rust |
| 1742 | [Maximum Number of Balls in a Box](easy/1742.%20Maximum%20Number%20of%20Balls%20in%20a%20Box) | Go |
| 1752 | [Check if Array Is Sorted and Rotated](easy/1752.%20Check%20if%20Array%20Is%20Sorted%20and%20Rotated) | Go, Python, Rust, TypeScript |
| 1757 | [Recyclable and Low Fat Products](easy/1757.%20Recyclable%20and%20Low%20Fat%20Products) | Python |
| 1790 | [Check if One String Swap Can Make Strings Equal](easy/1790.%20Check%20if%20One%20String%20Swap%20Can%20Make%20Strings%20Equal) | Go |
| 1795 | [Rearrange Products Table](easy/1795.%20Rearrange%20Products%20Table) | Python, SQL |
| 1796 | [Second Largest Digit in a String](easy/1796.%20Second%20Largest%20Digit%20in%20a%20String) | Go |
| 1800 | [Maximum Ascending Subarray Sum](easy/1800.%20Maximum%20Ascending%20Subarray%20Sum) | Go |
| 1822 | [Sign of the Product of an Array](easy/1822.%20Sign%20of%20the%20Product%20of%20an%20Array) | Go, Python, Rust |
| 1827 | [Minimum Operations to Make the Array Increasing](easy/1827.%20Minimum%20Operations%20to%20Make%20the%20Array%20Increasing) | Go |
| 1832 | [Check if the Sentence Is Pangram](easy/1832.%20Check%20if%20the%20Sentence%20Is%20Pangram) | Go, TypeScript |
| 1873 | [Calculate Special Bonus](easy/1873.%20Calculate%20Special%20Bonus) | Python, SQL |
| 1876 | [Substrings of Size Three with Distinct Characters](easy/1876.%20Substrings%20of%20Size%20Three%20with%20Distinct%20Characters) | Go |
| 1886 | [Determine Whether Matrix Can Be Obtained By Rotation](easy/1886.%20Determine%20Whether%20Matrix%20Can%20Be%20Obtained%20By%20Rotation) | Python, TypeScript |
| 1890 | [The Latest Login in 2020](easy/1890.%20The%20Latest%20Login%20in%202020) | SQL |
| 1913 | [Maximum Product Difference Between Two Pairs](easy/1913.%20Maximum%20Product%20Difference%20Between%20Two%20Pairs) | Go, Rust |
| 1929 | [Concatenation of Array](easy/1929.%20Concatenation%20of%20Array) | Rust, Scala |
| 1941 | [Check if All Characters Have Equal Number of Occurrences](easy/1941.%20Check%20if%20All%20Characters%20Have%20Equal%20Number%20of%20Occurrences) | Go |
| 1965 | [Employees With Missing Information](easy/1965.%20Employees%20With%20Missing%20Information) | SQL |
| 1971 | [Find if Path Exists in Graph](easy/1971.%20Find%20if%20Path%20Exists%20in%20Graph) | Go, Python, Rust, Swift, TypeScript |
| 1979 | [Find Greatest Common Divisor of Array](easy/1979.%20Find%20Greatest%20Common%20Divisor%20of%20Array) | Go |
| 2006 | [Count Number of Pairs With Absolute Difference K](easy/2006.%20Count%20Number%20of%20Pairs%20With%20Absolute%20Difference%20K) | Go |
| 2011 | [Final Value of Variable After Performing Operations](easy/2011.%20Final%20Value%20of%20Variable%20After%20Performing%20Operations) | Rust |
| 2032 | [Two Out of Three](easy/2032.%20Two%20Out%20of%20Three) | Go |
| 2053 | [Kth Distinct String in an Array](easy/2053.%20Kth%20Distinct%20String%20in%20an%20Array) | Go |
| 2062 | [Count Vowel Substrings of a String](easy/2062.%20Count%20Vowel%20Substrings%20of%20a%20String) | Go |
| 2085 | [Count Common Words With One Occurrence](easy/2085.%20Count%20Common%20Words%20With%20One%20Occurrence) | Go |
| 2089 | [Find Target Indices After Sorting Array](easy/2089.%20Find%20Target%20Indices%20After%20Sorting%20Array) | Go |
| 2099 | [Find Subsequence of Length K With the Largest Sum](easy/2099.%20Find%20Subsequence%20of%20Length%20K%20With%20the%20Largest%20Sum) | Go |
| 2103 | [Rings and Rods](easy/2103.%20Rings%20and%20Rods) | Go |
| 2114 | [Maximum Number of Words Found in Sentences](easy/2114.%20Maximum%20Number%20of%20Words%20Found%20in%20Sentences) | Java, Rust |
| 2160 | [Minimum Sum of Four Digit Number After Splitting Digits](easy/2160.%20Minimum%20Sum%20of%20Four%20Digit%20Number%20After%20Splitting%20Digits) | Rust |
| 2176 | [Count Equal and Divisible Pairs in an Array](easy/2176.%20Count%20Equal%20and%20Divisible%20Pairs%20in%20an%20Array) | Go, Python, Rust, TypeScript |
| 2206 | [Divide Array Into Equal Pairs](easy/2206.%20Divide%20Array%20Into%20Equal%20Pairs) | Go, Python |
| 2215 | [Find the Difference of Two Arrays](easy/2215.%20Find%20the%20Difference%20of%20Two%20Arrays) | Go |
| 2273 | [Find Resultant Array After Removing Anagrams](easy/2273.%20Find%20Resultant%20Array%20After%20Removing%20Anagrams) | Go |
| 2283 | [Check if Number Has Equal Digit Count and Digit Value](easy/2283.%20Check%20if%20Number%20Has%20Equal%20Digit%20Count%20and%20Digit%20Value) | Go |
| 2309 | [Greatest English Letter in Upper and Lower Case](easy/2309.%20Greatest%20English%20Letter%20in%20Upper%20and%20Lower%20Case) | Go |
| 2325 | [Decode the Message](easy/2325.%20Decode%20the%20Message) | Go |
| 2331 | [Evaluate Boolean Binary Tree](easy/2331.%20Evaluate%20Boolean%20Binary%20Tree) | Go |
| 2341 | [Maximum Number of Pairs in Array](easy/2341.%20Maximum%20Number%20of%20Pairs%20in%20Array) | Go |
| 2351 | [First Letter to Appear Twice](easy/2351.%20First%20Letter%20to%20Appear%20Twice) | Go |
| 2363 | [Merge Similar Items](easy/2363.%20Merge%20Similar%20Items) | Go |
| 2367 | [Number of Arithmetic Triplets](easy/2367.%20Number%20of%20Arithmetic%20Triplets) | Go |
| 2389 | [Longest Subsequence With Limited Sum](easy/2389.%20Longest%20Subsequence%20With%20Limited%20Sum) | Go |
| 2418 | [Sort the People](easy/2418.%20Sort%20the%20People) | Go |
| 2469 | [Convert the Temperature](easy/2469.%20Convert%20the%20Temperature) | Go |
| 2540 | [Minimum Common Value](easy/2540.%20Minimum%20Common%20Value) | Go |
| 2578 | [Split With Minimum Sum](easy/2578.%20Split%20With%20Minimum%20Sum) | Go |
| 2582 | [Pass the Pillow](easy/2582.%20Pass%20the%20Pillow) | Go |
| 2656 | [Maximum Sum With Exactly K Elements](easy/2656.%20Maximum%20Sum%20With%20Exactly%20K%20Elements) | Go, Rust |
| 2678 | [Number of Senior Citizens](easy/2678.%20Number%20of%20Senior%20Citizens) | Go, Rust |
| 2696 | [Minimum String Length After Removing Substrings](easy/2696.%20Minimum%20String%20Length%20After%20Removing%20Substrings) | Go, Rust |
| 2815 | [Max Pair Sum in an Array](easy/2815.%20Max%20Pair%20Sum%20in%20an%20Array) | Go |
| 2843 | [Count Symmetric Integers](easy/2843.%20Count%20Symmetric%20Integers) | Go, Rust |
| 2873 | [Maximum Value of an Ordered Triplet I](easy/2873.%20Maximum%20Value%20of%20an%20Ordered%20Triplet%20I) | Go |
| 3105 | [Longest Strictly Increasing or Strictly Decreasing Subarray](easy/3105.%20Longest%20Strictly%20Increasing%20or%20Strictly%20Decreasing%20Subarray) | Go |
| 3314 | [Construct the Minimum Bitwise Array I](easy/3314.%20Construct%20the%20Minimum%20Bitwise%20Array%20I) | Go, Kotlin, Python, Rust, TypeScript |
| 3541 | [Find Most Frequent Vowel and Consonant](easy/3541.%20Find%20Most%20Frequent%20Vowel%20and%20Consonant) | Go, Rust, TypeScript |
| 3622 | [Check Divisibility by Digit Sum and Product](easy/3622.%20Check%20Divisibility%20by%20Digit%20Sum%20and%20Product) | Go |
| 3783 | [Mirror Distance of an Integer](easy/3783.%20Mirror%20Distance%20of%20an%20Integer) | Go, Python, TypeScript |

## Medium

| # | Problem | Languages |
| ---: | --- | --- |
| 2 | [Add Two Numbers](medium/0002.%20Add%20Two%20Numbers) | Go, TypeScript |
| 3 | [Longest Substring Without Repeating Characters](medium/0003.%20Longest%20Substring%20Without%20Repeating%20Characters) | Go, TypeScript |
| 5 | [Longest Palindromic Substring](medium/0005.%20Longest%20Palindromic%20Substring) | Go, TypeScript |
| 7 | [Reverse Integer](medium/0007.%20Reverse%20Integer) | TypeScript |
| 11 | [Container With Most Water](medium/0011.%20Container%20With%20Most%20Water) | Go |
| 12 | [Integer to Roman](medium/0012.%20Integer%20to%20Roman) | Java |
| 15 | [3Sum](medium/0015.%203Sum) | Go, TypeScript |
| 17 | [Letter Combinations of a Phone Number](medium/0017.%20Letter%20Combinations%20of%20a%20Phone%20Number) | Go, TypeScript |
| 19 | [Remove Nth Node From End of List](medium/0019.%20Remove%20Nth%20Node%20From%20End%20of%20List) | TypeScript |
| 22 | [Generate Parentheses](medium/0022.%20Generate%20Parentheses) | TypeScript |
| 24 | [Swap Nodes in Pairs](medium/0024.%20Swap%20Nodes%20in%20Pairs) | TypeScript |
| 33 | [Search in Rotated Sorted Array](medium/0033.%20Search%20in%20Rotated%20Sorted%20Array) | Go, Java, Rust, TypeScript |
| 34 | [Find First and Last Position of Element in Sorted Array](medium/0034.%20Find%20First%20and%20Last%20Position%20of%20Element%20in%20Sorted%20Array) | Go, Java, TypeScript |
| 36 | [Valid Sudoku](medium/0036.%20Valid%20Sudoku) | Go, TypeScript |
| 38 | [Count and Say](medium/0038.%20Count%20and%20Say) | Go |
| 39 | [Combination Sum](medium/0039.%20Combination%20Sum) | TypeScript |
| 40 | [Combination Sum II](medium/0040.%20Combination%20Sum%20II) | Go |
| 43 | [Multiply Strings](medium/0043.%20Multiply%20Strings) | TypeScript |
| 45 | [Jump Game II](medium/0045.%20Jump%20Game%20II) | TypeScript |
| 46 | [Permutations](medium/0046.%20Permutations) | Go, TypeScript |
| 47 | [Permutations II](medium/0047.%20Permutations%20II) | TypeScript |
| 48 | [Rotate Image](medium/0048.%20Rotate%20Image) | Java, TypeScript |
| 49 | [Group Anagrams](medium/0049.%20Group%20Anagrams) | Go, Java, Python, TypeScript |
| 50 | [Pow(x, n)](medium/0050.%20Pow%28x%2C%20n%29) | Go, Rust |
| 53 | [Maximum Subarray](medium/0053.%20Maximum%20Subarray) | Go, TypeScript |
| 54 | [Spiral Matrix](medium/0054.%20Spiral%20Matrix) | Go, Python, TypeScript |
| 55 | [Jump Game](medium/0055.%20Jump%20Game) | C++, Go, Java, Python, TypeScript |
| 56 | [Merge Intervals](medium/0056.%20Merge%20Intervals) | TypeScript |
| 59 | [Spiral Matrix II](medium/0059.%20Spiral%20Matrix%20II) | Java, TypeScript |
| 62 | [Unique Paths](medium/0062.%20Unique%20Paths) | Go, Java, TypeScript |
| 63 | [Unique Paths II](medium/0063.%20Unique%20Paths%20II) | Go, Python |
| 64 | [Minimum Path Sum](medium/0064.%20Minimum%20Path%20Sum) | Go, Python, Rust |
| 71 | [Simplify Path](medium/0071.%20Simplify%20Path) | Go, Python, Rust |
| 72 | [Edit Distance](medium/0072.%20Edit%20Distance) | Go |
| 74 | [Search a 2D Matrix](medium/0074.%20Search%20a%202D%20Matrix) | Go, Java, Rust, TypeScript |
| 75 | [Sort Colors](medium/0075.%20Sort%20Colors) | TypeScript |
| 77 | [Combinations](medium/0077.%20Combinations) | Go, TypeScript |
| 78 | [Subsets](medium/0078.%20Subsets) | TypeScript |
| 79 | [Word Search](medium/0079.%20Word%20Search) | Go, Rust |
| 81 | [Search in Rotated Sorted Array II](medium/0081.%20Search%20in%20Rotated%20Sorted%20Array%20II) | Rust |
| 82 | [Remove Duplicates from Sorted List II](medium/0082.%20Remove%20Duplicates%20from%20Sorted%20List%20II) | Go, Java, TypeScript |
| 86 | [Partition List](medium/0086.%20Partition%20List) | Go, Rust |
| 89 | [Gray Code](medium/0089.%20Gray%20Code) | Go |
| 90 | [Subsets II](medium/0090.%20Subsets%20II) | Go |
| 91 | [Decode Ways](medium/0091.%20Decode%20Ways) | Go, Python, Rust |
| 92 | [Reverse Linked List II](medium/0092.%20Reverse%20Linked%20List%20II) | Go, Python, TypeScript |
| 93 | [Restore IP Addresses](medium/0093.%20Restore%20IP%20Addresses) | Go |
| 95 | [Unique Binary Search Trees II](medium/0095.%20Unique%20Binary%20Search%20Trees%20II) | Go, Java, Rust |
| 96 | [Unique Binary Search Trees](medium/0096.%20Unique%20Binary%20Search%20Trees) | Go |
| 97 | [Interleaving String](medium/0097.%20Interleaving%20String) | Go |
| 98 | [Validate Binary Search Tree](medium/0098.%20Validate%20Binary%20Search%20Tree) | TypeScript |
| 99 | [Recover Binary Search Tree](medium/0099.%20Recover%20Binary%20Search%20Tree) | Go, TypeScript |
| 102 | [Binary Tree Level Order Traversal](medium/0102.%20Binary%20Tree%20Level%20Order%20Traversal) | Go, Java, Rust, TypeScript |
| 103 | [Binary Tree Zigzag Level Order Traversal](medium/0103.%20Binary%20Tree%20Zigzag%20Level%20Order%20Traversal) | Go, TypeScript |
| 105 | [Construct Binary Tree from Preorder and Inorder Traversal](medium/0105.%20Construct%20Binary%20Tree%20from%20Preorder%20and%20Inorder%20Traversal) | TypeScript |
| 107 | [Binary Tree Level Order Traversal II](medium/0107.%20Binary%20Tree%20Level%20Order%20Traversal%20II) | Go, Java |
| 109 | [Convert Sorted List to Binary Search Tree](medium/0109.%20Convert%20Sorted%20List%20to%20Binary%20Search%20Tree) | Go |
| 113 | [Path Sum II](medium/0113.%20Path%20Sum%20II) | Python, TypeScript |
| 114 | [Flatten Binary Tree to Linked List](medium/0114.%20Flatten%20Binary%20Tree%20to%20Linked%20List) | Go, Java |
| 116 | [Populating Next Right Pointers in Each Node](medium/0116.%20Populating%20Next%20Right%20Pointers%20in%20Each%20Node) | Java |
| 120 | [Triangle](medium/0120.%20Triangle) | TypeScript |
| 129 | [Sum Root to Leaf Numbers](medium/0129.%20Sum%20Root%20to%20Leaf%20Numbers) | Go, Python, Rust |
| 133 | [Clone Graph](medium/0133.%20Clone%20Graph) | Go, TypeScript |
| 139 | [Word Break](medium/0139.%20Word%20Break) | Go, Rust |
| 150 | [Evaluate Reverse Polish Notation](medium/0150.%20Evaluate%20Reverse%20Polish%20Notation) | Go, TypeScript |
| 152 | [Maximum Product Subarray](medium/0152.%20Maximum%20Product%20Subarray) | Go |
| 153 | [Find Minimum in Rotated Sorted Array](medium/0153.%20Find%20Minimum%20in%20Rotated%20Sorted%20Array) | Go, Java, TypeScript |
| 162 | [Find Peak Element](medium/0162.%20Find%20Peak%20Element) | Java |
| 167 | [Two Sum II - Input Array Is Sorted](medium/0167.%20Two%20Sum%20II%20-%20Input%20Array%20Is%20Sorted) | Java, Python, TypeScript |
| 173 | [Binary Search Tree Iterator](medium/0173.%20Binary%20Search%20Tree%20Iterator) | C++, Java, TypeScript |
| 176 | [Second Highest Salary](medium/0176.%20Second%20Highest%20Salary) | Python, SQL |
| 177 | [Nth Highest Salary](medium/0177.%20Nth%20Highest%20Salary) | Python, SQL |
| 184 | [Department Highest Salary](medium/0184.%20Department%20Highest%20Salary) | Python |
| 187 | [Repeated DNA Sequences](medium/0187.%20Repeated%20DNA%20Sequences) | TypeScript |
| 189 | [Rotate Array](medium/0189.%20Rotate%20Array) | TypeScript |
| 198 | [House Robber](medium/0198.%20House%20Robber) | C++, Go, Java, TypeScript |
| 199 | [Binary Tree Right Side View](medium/0199.%20Binary%20Tree%20Right%20Side%20View) | Java |
| 200 | [Number of Islands](medium/0200.%20Number%20of%20Islands) | Go, Java, TypeScript |
| 208 | [Implement Trie (Prefix Tree)](medium/0208.%20Implement%20Trie%20%28Prefix%20Tree%29) | Go, Python |
| 210 | [Course Schedule II](medium/0210.%20Course%20Schedule%20II) | Go |
| 211 | [Design Add and Search Words Data Structure](medium/0211.%20Design%20Add%20and%20Search%20Words%20Data%20Structure) | Go |
| 213 | [House Robber II](medium/0213.%20House%20Robber%20II) | TypeScript |
| 215 | [Kth Largest Element in an Array](medium/0215.%20Kth%20Largest%20Element%20in%20an%20Array) | Go, Java, Python, Rust |
| 221 | [Maximal Square](medium/0221.%20Maximal%20Square) | Go |
| 230 | [Kth Smallest Element in a BST](medium/0230.%20Kth%20Smallest%20Element%20in%20a%20BST) | C++ |
| 235 | [Lowest Common Ancestor of a Binary Search Tree](medium/0235.%20Lowest%20Common%20Ancestor%20of%20a%20Binary%20Search%20Tree) | Java, TypeScript |
| 236 | [Lowest Common Ancestor of a Binary Tree](medium/0236.%20Lowest%20Common%20Ancestor%20of%20a%20Binary%20Tree) | TypeScript |
| 238 | [Product of Array Except Self](medium/0238.%20Product%20of%20Array%20Except%20Self) | Java |
| 240 | [Search a 2D Matrix II](medium/0240.%20Search%20a%202D%20Matrix%20II) | TypeScript |
| 264 | [Ugly Number II](medium/0264.%20Ugly%20Number%20II) | C, Elixir, Go, JavaScript, Python, Rust, TypeScript |
| 279 | [Perfect Squares](medium/0279.%20Perfect%20Squares) | Go |
| 304 | [Range Sum Query 2D - Immutable](medium/0304.%20Range%20Sum%20Query%202D%20-%20Immutable) | TypeScript |
| 310 | [Minimum Height Trees](medium/0310.%20Minimum%20Height%20Trees) | Go |
| 316 | [Remove Duplicate Letters](medium/0316.%20Remove%20Duplicate%20Letters) | Go, Python, Rust, TypeScript |
| 328 | [Odd Even Linked List](medium/0328.%20Odd%20Even%20Linked%20List) | Go |
| 341 | [Flatten Nested List Iterator](medium/0341.%20Flatten%20Nested%20List%20Iterator) | TypeScript |
| 347 | [Top K Frequent Elements](medium/0347.%20Top%20K%20Frequent%20Elements) | Java |
| 380 | [Insert Delete GetRandom O(1)](medium/0380.%20Insert%20Delete%20GetRandom%20O%281%29) | Go |
| 386 | [Lexicographical Numbers](medium/0386.%20Lexicographical%20Numbers) | Go |
| 413 | [Arithmetic Slices](medium/0413.%20Arithmetic%20Slices) | Go, Java, Python, TypeScript |
| 417 | [Pacific Atlantic Water Flow](medium/0417.%20Pacific%20Atlantic%20Water%20Flow) | Java, TypeScript |
| 419 | [Battleships in a Board](medium/0419.%20Battleships%20in%20a%20Board) | Go |
| 421 | [Maximum XOR of Two Numbers in an Array](medium/0421.%20Maximum%20XOR%20of%20Two%20Numbers%20in%20an%20Array) | Go |
| 424 | [Longest Repeating Character Replacement](medium/0424.%20Longest%20Repeating%20Character%20Replacement) | Go |
| 429 | [N-ary Tree Level Order Traversal](medium/0429.%20N-ary%20Tree%20Level%20Order%20Traversal) | Java, TypeScript |
| 435 | [Non-overlapping Intervals](medium/0435.%20Non-overlapping%20Intervals) | Go, Java, Rust |
| 438 | [Find All Anagrams in a String](medium/0438.%20Find%20All%20Anagrams%20in%20a%20String) | Go, Java, TypeScript |
| 442 | [Find All Duplicates in an Array](medium/0442.%20Find%20All%20Duplicates%20in%20an%20Array) | Go |
| 445 | [Add Two Numbers II](medium/0445.%20Add%20Two%20Numbers%20II) | Python, Rust |
| 450 | [Delete Node in a BST](medium/0450.%20Delete%20Node%20in%20a%20BST) | Java |
| 451 | [Sort Characters By Frequency](medium/0451.%20Sort%20Characters%20By%20Frequency) | Go |
| 452 | [Minimum Number of Arrows to Burst Balloons](medium/0452.%20Minimum%20Number%20of%20Arrows%20to%20Burst%20Balloons) | Go |
| 456 | [132 Pattern](medium/0456.%20132%20Pattern) | Go, Rust |
| 494 | [Target Sum](medium/0494.%20Target%20Sum) | Go |
| 503 | [Next Greater Element II](medium/0503.%20Next%20Greater%20Element%20II) | Python, TypeScript |
| 513 | [Find Bottom Left Tree Value](medium/0513.%20Find%20Bottom%20Left%20Tree%20Value) | Go, Rust |
| 518 | [Coin Change II](medium/0518.%20Coin%20Change%20II) | Go, Rust |
| 523 | [Continuous Subarray Sum](medium/0523.%20Continuous%20Subarray%20Sum) | Java |
| 535 | [Encode and Decode TinyURL](medium/0535.%20Encode%20and%20Decode%20TinyURL) | Go, Python |
| 539 | [Minimum Time Difference](medium/0539.%20Minimum%20Time%20Difference) | Elixir, Go |
| 542 | [01 Matrix](medium/0542.%2001%20Matrix) | Go, Python, TypeScript |
| 547 | [Number of Provinces](medium/0547.%20Number%20of%20Provinces) | Java, TypeScript |
| 556 | [Next Greater Element III](medium/0556.%20Next%20Greater%20Element%20III) | TypeScript |
| 560 | [Subarray Sum Equals K](medium/0560.%20Subarray%20Sum%20Equals%20K) | TypeScript |
| 567 | [Permutation in String](medium/0567.%20Permutation%20in%20String) | Go, Java, Rust |
| 576 | [Out of Boundary Paths](medium/0576.%20Out%20of%20Boundary%20Paths) | Dart, Go |
| 606 | [Construct String from Binary Tree](medium/0606.%20Construct%20String%20from%20Binary%20Tree) | TypeScript |
| 608 | [Tree Node](medium/0608.%20Tree%20Node) | SQL |
| 621 | [Task Scheduler](medium/0621.%20Task%20Scheduler) | C, Go, Rust, Swift, TypeScript |
| 622 | [Design Circular Queue](medium/0622.%20Design%20Circular%20Queue) | Python, TypeScript |
| 626 | [Exchange Seats](medium/0626.%20Exchange%20Seats) | SQL |
| 633 | [Sum of Square Numbers](medium/0633.%20Sum%20of%20Square%20Numbers) | TypeScript |
| 641 | [Design Circular Deque](medium/0641.%20Design%20Circular%20Deque) | Go |
| 652 | [Find Duplicate Subtrees](medium/0652.%20Find%20Duplicate%20Subtrees) | Go |
| 658 | [Find K Closest Elements](medium/0658.%20Find%20K%20Closest%20Elements) | TypeScript |
| 669 | [Trim a Binary Search Tree](medium/0669.%20Trim%20a%20Binary%20Search%20Tree) | Go, Python, Rust |
| 673 | [Number of Longest Increasing Subsequence](medium/0673.%20Number%20of%20Longest%20Increasing%20Subsequence) | Rust |
| 684 | [Redundant Connection](medium/0684.%20Redundant%20Connection) | Go, Python |
| 692 | [Top K Frequent Words](medium/0692.%20Top%20K%20Frequent%20Words) | Go, Java, TypeScript |
| 695 | [Max Area of Island](medium/0695.%20Max%20Area%20of%20Island) | Java, Python, TypeScript |
| 701 | [Insert into a Binary Search Tree](medium/0701.%20Insert%20into%20a%20Binary%20Search%20Tree) | TypeScript |
| 712 | [Minimum ASCII Delete Sum for Two Strings](medium/0712.%20Minimum%20ASCII%20Delete%20Sum%20for%20Two%20Strings) | Go |
| 729 | [My Calendar I](medium/0729.%20My%20Calendar%20I) | Go, Rust, TypeScript |
| 739 | [Daily Temperatures](medium/0739.%20Daily%20Temperatures) | Go, Java, TypeScript |
| 763 | [Partition Labels](medium/0763.%20Partition%20Labels) | TypeScript |
| 767 | [Reorganize String](medium/0767.%20Reorganize%20String) | Go, Rust |
| 784 | [Letter Case Permutation](medium/0784.%20Letter%20Case%20Permutation) | TypeScript |
| 785 | [Is Graph Bipartite](medium/0785.%20Is%20Graph%20Bipartite) | Go |
| 786 | [K-th Smallest Prime Fraction](medium/0786.%20K-th%20Smallest%20Prime%20Fraction) | Go |
| 797 | [All Paths From Source to Target](medium/0797.%20All%20Paths%20From%20Source%20to%20Target) | Java, TypeScript |
| 811 | [Subdomain Visit Count](medium/0811.%20Subdomain%20Visit%20Count) | Go |
| 814 | [Binary Tree Pruning](medium/0814.%20Binary%20Tree%20Pruning) | Java, Python, TypeScript |
| 835 | [Image Overlap](medium/0835.%20Image%20Overlap) | Go, Python |
| 838 | [Push Dominoes](medium/0838.%20Push%20Dominoes) | TypeScript |
| 841 | [Keys and Rooms](medium/0841.%20Keys%20and%20Rooms) | Go, Java, TypeScript |
| 852 | [Peak Index in a Mountain Array](medium/0852.%20Peak%20Index%20in%20a%20Mountain%20Array) | TypeScript |
| 856 | [Score of Parentheses](medium/0856.%20Score%20of%20Parentheses) | Go |
| 861 | [Score After Flipping Matrix](medium/0861.%20Score%20After%20Flipping%20Matrix) | Go, Python |
| 863 | [All Nodes Distance K in Binary Tree](medium/0863.%20All%20Nodes%20Distance%20K%20in%20Binary%20Tree) | Rust |
| 865 | [Smallest Subtree with all the Deepest Nodes](medium/0865.%20Smallest%20Subtree%20with%20all%20the%20Deepest%20Nodes) | Go, TypeScript |
| 869 | [Reordered Power of 2](medium/0869.%20Reordered%20Power%20of%202) | TypeScript |
| 875 | [Koko Eating Bananas](medium/0875.%20Koko%20Eating%20Bananas) | Go, Rust |
| 880 | [Decoded String at Index](medium/0880.%20Decoded%20String%20at%20Index) | Go, Rust |
| 885 | [Spiral Matrix III](medium/0885.%20Spiral%20Matrix%20III) | Go |
| 889 | [Construct Binary Tree from Preorder and Postorder Traversal](medium/0889.%20Construct%20Binary%20Tree%20from%20Preorder%20and%20Postorder%20Traversal) | Go |
| 890 | [Find and Replace Pattern](medium/0890.%20Find%20and%20Replace%20Pattern) | Go |
| 894 | [All Possible Full Binary Trees](medium/0894.%20All%20Possible%20Full%20Binary%20Trees) | Go |
| 907 | [Sum of Subarray Minimums](medium/0907.%20Sum%20of%20Subarray%20Minimums) | Go |
| 912 | [Sort an Array](medium/0912.%20Sort%20an%20Array) | Go |
| 931 | [Minimum Falling Path Sum](medium/0931.%20Minimum%20Falling%20Path%20Sum) | Go |
| 948 | [Bag of Tokens](medium/0948.%20Bag%20of%20Tokens) | TypeScript |
| 951 | [Flip Equivalent Binary Trees](medium/0951.%20Flip%20Equivalent%20Binary%20Trees) | Go |
| 958 | [Check Completeness of a Binary Tree](medium/0958.%20Check%20Completeness%20of%20a%20Binary%20Tree) | Rust |
| 959 | [Regions Cut By Slashes](medium/0959.%20Regions%20Cut%20By%20Slashes) | Python |
| 962 | [Maximum Width Ramp](medium/0962.%20Maximum%20Width%20Ramp) | Go, Rust |
| 967 | [Numbers With Same Consecutive Differences](medium/0967.%20Numbers%20With%20Same%20Consecutive%20Differences) | TypeScript |
| 973 | [K Closest Points to Origin](medium/0973.%20K%20Closest%20Points%20to%20Origin) | Python, TypeScript |
| 974 | [Subarray Sums Divisible by K](medium/0974.%20Subarray%20Sums%20Divisible%20by%20K) | Go, TypeScript |
| 979 | [Distribute Coins in Binary Tree](medium/0979.%20Distribute%20Coins%20in%20Binary%20Tree) | C, Go |
| 981 | [Time Based Key-Value Store](medium/0981.%20Time%20Based%20Key-Value%20Store) | Go, Rust |
| 983 | [Minimum Cost For Tickets](medium/0983.%20Minimum%20Cost%20For%20Tickets) | Go, Python, Rust |
| 986 | [Interval List Intersections](medium/0986.%20Interval%20List%20Intersections) | TypeScript |
| 990 | [Satisfiability of Equality Equations](medium/0990.%20Satisfiability%20of%20Equality%20Equations) | TypeScript |
| 994 | [Rotting Oranges](medium/0994.%20Rotting%20Oranges) | TypeScript |
| 1020 | [Number of Enclaves](medium/1020.%20Number%20of%20Enclaves) | TypeScript |
| 1026 | [Maximum Difference Between Node and Ancestor](medium/1026.%20Maximum%20Difference%20Between%20Node%20and%20Ancestor) | Go |
| 1038 | [Binary Search Tree to Greater Sum Tree](medium/1038.%20Binary%20Search%20Tree%20to%20Greater%20Sum%20Tree) | Go |
| 1039 | [Minimum Score Triangulation of Polygon](medium/1039.%20Minimum%20Score%20Triangulation%20of%20Polygon) | Go |
| 1048 | [Longest String Chain](medium/1048.%20Longest%20String%20Chain) | Go, Python, Rust, TypeScript |
| 1081 | [Smallest Subsequence of Distinct Characters](medium/1081.%20Smallest%20Subsequence%20of%20Distinct%20Characters) | Go, Python, Rust, TypeScript |
| 1091 | [Shortest Path in Binary Matrix](medium/1091.%20Shortest%20Path%20in%20Binary%20Matrix) | TypeScript |
| 1110 | [Delete Nodes And Return Forest](medium/1110.%20Delete%20Nodes%20And%20Return%20Forest) | Go |
| 1143 | [Longest Common Subsequence](medium/1143.%20Longest%20Common%20Subsequence) | Go, TypeScript |
| 1161 | [Maximum Level Sum of a Binary Tree](medium/1161.%20Maximum%20Level%20Sum%20of%20a%20Binary%20Tree) | Go |
| 1162 | [As Far from Land as Possible](medium/1162.%20As%20Far%20from%20Land%20as%20Possible) | Go, TypeScript |
| 1239 | [Maximum Length of a Concatenated String with Unique Characters](medium/1239.%20Maximum%20Length%20of%20a%20Concatenated%20String%20with%20Unique%20Characters) | Go, Rust |
| 1249 | [Minimum Remove to Make Valid Parentheses](medium/1249.%20Minimum%20Remove%20to%20Make%20Valid%20Parentheses) | TypeScript |
| 1254 | [Number of Closed Islands](medium/1254.%20Number%20of%20Closed%20Islands) | Go, TypeScript |
| 1261 | [Find Elements in a Contaminated Binary Tree](medium/1261.%20Find%20Elements%20in%20a%20Contaminated%20Binary%20Tree) | Go |
| 1302 | [Deepest Leaves Sum](medium/1302.%20Deepest%20Leaves%20Sum) | Go |
| 1305 | [All Elements in Two Binary Search Trees](medium/1305.%20All%20Elements%20in%20Two%20Binary%20Search%20Trees) | Go |
| 1306 | [Jump Game III](medium/1306.%20Jump%20Game%20III) | TypeScript |
| 1315 | [Sum of Nodes with Even-Valued Grandparent](medium/1315.%20Sum%20of%20Nodes%20with%20Even-Valued%20Grandparent) | Go |
| 1318 | [Minimum Flips to Make a OR b Equal to c](medium/1318.%20Minimum%20Flips%20to%20Make%20a%20OR%20b%20Equal%20to%20c) | Go, Rust |
| 1338 | [Reduce Array Size to The Half](medium/1338.%20Reduce%20Array%20Size%20to%20The%20Half) | TypeScript |
| 1339 | [Maximum Product of Splitted Binary Tree](medium/1339.%20Maximum%20Product%20of%20Splitted%20Binary%20Tree) | Go, Python, TypeScript |
| 1347 | [Minimum Number of Steps to Make Two Strings Anagram](medium/1347.%20Minimum%20Number%20of%20Steps%20to%20Make%20Two%20Strings%20Anagram) | Dart, Elixir, Go, Python, Rust, TypeScript |
| 1367 | [Linked List in Binary Tree](medium/1367.%20Linked%20List%20in%20Binary%20Tree) | TypeScript |
| 1372 | [Longest ZigZag Path in a Binary Tree](medium/1372.%20Longest%20ZigZag%20Path%20in%20a%20Binary%20Tree) | Go, Rust |
| 1376 | [Time Needed to Inform All Employees](medium/1376.%20Time%20Needed%20to%20Inform%20All%20Employees) | Python, TypeScript |
| 1382 | [Balance a Binary Search Tree](medium/1382.%20Balance%20a%20Binary%20Search%20Tree) | Go |
| 1404 | [Number of Steps to Reduce a Number in Binary Representation to One](medium/1404.%20Number%20of%20Steps%20to%20Reduce%20a%20Number%20in%20Binary%20Representation%20to%20One) | Go |
| 1415 | [The k-th Lexicographical String of All Happy Strings of Length n](medium/1415.%20The%20k-th%20Lexicographical%20String%20of%20All%20Happy%20Strings%20of%20Length%20n) | Go |
| 1441 | [Build an Array With Stack Operations](medium/1441.%20Build%20an%20Array%20With%20Stack%20Operations) | Go, Rust |
| 1448 | [Count Good Nodes in Binary Tree](medium/1448.%20Count%20Good%20Nodes%20in%20Binary%20Tree) | TypeScript |
| 1456 | [Maximum Number of Vowels in a Substring of Given Length](medium/1456.%20Maximum%20Number%20of%20Vowels%20in%20a%20Substring%20of%20Given%20Length) | Go |
| 1457 | [Pseudo-Palindromic Paths in a Binary Tree](medium/1457.%20Pseudo-Palindromic%20Paths%20in%20a%20Binary%20Tree) | Go, Rust |
| 1472 | [Design Browser History](medium/1472.%20Design%20Browser%20History) | Go |
| 1476 | [Subrectangle Queries](medium/1476.%20Subrectangle%20Queries) | Java, Rust |
| 1498 | [Number of Subsequences That Satisfy the Given Sum Condition](medium/1498.%20Number%20of%20Subsequences%20That%20Satisfy%20the%20Given%20Sum%20Condition) | Go |
| 1503 | [Last Moment Before All Ants Fall Out of a Plank](medium/1503.%20Last%20Moment%20Before%20All%20Ants%20Fall%20Out%20of%20a%20Plank) | Go, Python, Rust, TypeScript |
| 1514 | [Path with Maximum Probability](medium/1514.%20Path%20with%20Maximum%20Probability) | Python, Rust |
| 1535 | [Find the Winner of an Array Game](medium/1535.%20Find%20the%20Winner%20of%20an%20Array%20Game) | Go, Rust, TypeScript |
| 1557 | [Minimum Number of Vertices to Reach All Nodes](medium/1557.%20Minimum%20Number%20of%20Vertices%20to%20Reach%20All%20Nodes) | TypeScript |
| 1559 | [Detect Cycles in 2D Grid](medium/1559.%20Detect%20Cycles%20in%202D%20Grid) | Go |
| 1574 | [Shortest Subarray to be Removed to Make Array Sorted](medium/1574.%20Shortest%20Subarray%20to%20be%20Removed%20to%20Make%20Array%20Sorted) | Go |
| 1584 | [Min Cost to Connect All Points](medium/1584.%20Min%20Cost%20to%20Connect%20All%20Points) | Rust |
| 1590 | [Make Sum Divisible by P](medium/1590.%20Make%20Sum%20Divisible%20by%20P) | Go |
| 1593 | [Split a String Into the Max Number of Unique Substrings](medium/1593.%20Split%20a%20String%20Into%20the%20Max%20Number%20of%20Unique%20Substrings) | Go |
| 1630 | [Arithmetic Subarrays](medium/1630.%20Arithmetic%20Subarrays) | Java, TypeScript |
| 1631 | [Path With Minimum Effort](medium/1631.%20Path%20With%20Minimum%20Effort) | Python, Rust |
| 1647 | [Minimum Deletions to Make Character Frequencies Unique](medium/1647.%20Minimum%20Deletions%20to%20Make%20Character%20Frequencies%20Unique) | Go, Python |
| 1653 | [Minimum Deletions to Make String Balanced](medium/1653.%20Minimum%20Deletions%20to%20Make%20String%20Balanced) | Go, Rust |
| 1657 | [Determine if Two Strings Are Close](medium/1657.%20Determine%20if%20Two%20Strings%20Are%20Close) | Dart, Elixir, Go, Rust, TypeScript |
| 1689 | [Partitioning Into Minimum Number Of Deci-Binary Numbers](medium/1689.%20Partitioning%20Into%20Minimum%20Number%20Of%20Deci-Binary%20Numbers) | TypeScript |
| 1721 | [Swapping Nodes in a Linked List](medium/1721.%20Swapping%20Nodes%20in%20a%20Linked%20List) | Go |
| 1743 | [Restore the Array From Adjacent Pairs](medium/1743.%20Restore%20the%20Array%20From%20Adjacent%20Pairs) | Go, Python |
| 1759 | [Count Number of Homogenous Substrings](medium/1759.%20Count%20Number%20of%20Homogenous%20Substrings) | Go, Rust |
| 1802 | [Maximum Value at a Given Index in a Bounded Array](medium/1802.%20Maximum%20Value%20at%20a%20Given%20Index%20in%20a%20Bounded%20Array) | Go |
| 1813 | [Sentence Similarity III](medium/1813.%20Sentence%20Similarity%20III) | Go |
| 1823 | [Find the Winner of the Circular Game](medium/1823.%20Find%20the%20Winner%20of%20the%20Circular%20Game) | TypeScript |
| 1845 | [Seat Reservation Manager](medium/1845.%20Seat%20Reservation%20Manager) | Go |
| 1846 | [Maximum Element After Decreasing and Rearranging](medium/1846.%20Maximum%20Element%20After%20Decreasing%20and%20Rearranging) | Go, Rust |
| 1855 | [Maximum Distance Between a Pair of Values](medium/1855.%20Maximum%20Distance%20Between%20a%20Pair%20of%20Values) | TypeScript |
| 1870 | [Minimum Speed to Arrive on Time](medium/1870.%20Minimum%20Speed%20to%20Arrive%20on%20Time) | Rust |
| 1905 | [Count Sub Islands](medium/1905.%20Count%20Sub%20Islands) | TypeScript |
| 1915 | [Number of Wonderful Substrings](medium/1915.%20Number%20of%20Wonderful%20Substrings) | Go, Rust |
| 1922 | [Count Good Numbers](medium/1922.%20Count%20Good%20Numbers) | Go |
| 1930 | [Unique Length-3 Palindromic Subsequences](medium/1930.%20Unique%20Length-3%20Palindromic%20Subsequences) | Go, Rust |
| 1942 | [The Number of the Smallest Unoccupied Chair](medium/1942.%20The%20Number%20of%20the%20Smallest%20Unoccupied%20Chair) | Go |
| 1975 | [Maximum Matrix Sum](medium/1975.%20Maximum%20Matrix%20Sum) | Go |
| 1980 | [Find Unique Binary String](medium/1980.%20Find%20Unique%20Binary%20String) | Go |
| 1996 | [The Number of Weak Characters in the Game](medium/1996.%20The%20Number%20of%20Weak%20Characters%20in%20the%20Game) | TypeScript |
| 2038 | [Remove Colored Pieces if Both Neighbors are the Same Color](medium/2038.%20Remove%20Colored%20Pieces%20if%20Both%20Neighbors%20are%20the%20Same%20Color) | Go, Python |
| 2044 | [Count Number of Maximum Bitwise-OR Subsets](medium/2044.%20Count%20Number%20of%20Maximum%20Bitwise-OR%20Subsets) | Go, Rust, TypeScript |
| 2054 | [Two Best Non-Overlapping Events](medium/2054.%20Two%20Best%20Non-Overlapping%20Events) | Go |
| 2064 | [Minimized Maximum of Products Distributed to Any Store](medium/2064.%20Minimized%20Maximum%20of%20Products%20Distributed%20to%20Any%20Store) | Go |
| 2075 | [Decode the Slanted Ciphertext](medium/2075.%20Decode%20the%20Slanted%20Ciphertext) | Go |
| 2090 | [K Radius Subarray Averages](medium/2090.%20K%20Radius%20Subarray%20Averages) | Go |
| 2096 | [Step-By-Step Directions From a Binary Tree Node to Another](medium/2096.%20Step-By-Step%20Directions%20From%20a%20Binary%20Tree%20Node%20to%20Another) | Go |
| 2125 | [Number of Laser Beams in a Bank](medium/2125.%20Number%20of%20Laser%20Beams%20in%20a%20Bank) | Go, TypeScript |
| 2140 | [Solving Questions With Brainpower](medium/2140.%20Solving%20Questions%20With%20Brainpower) | Go, TypeScript |
| 2187 | [Minimum Time to Complete Trips](medium/2187.%20Minimum%20Time%20to%20Complete%20Trips) | Go |
| 2196 | [Create Binary Tree From Descriptions](medium/2196.%20Create%20Binary%20Tree%20From%20Descriptions) | Go, Python |
| 2221 | [Find Triangular Sum of an Array](medium/2221.%20Find%20Triangular%20Sum%20of%20an%20Array) | Go |
| 2225 | [Find Players With Zero or One Losses](medium/2225.%20Find%20Players%20With%20Zero%20or%20One%20Losses) | Go |
| 2256 | [Minimum Average Difference](medium/2256.%20Minimum%20Average%20Difference) | C, Go |
| 2265 | [Count Nodes Equal to Average of Subtree](medium/2265.%20Count%20Nodes%20Equal%20to%20Average%20of%20Subtree) | Go, Python, Rust |
| 2270 | [Number of Ways to Split Array](medium/2270.%20Number%20of%20Ways%20to%20Split%20Array) | Go, Rust, TypeScript |
| 2300 | [Successful Pairs of Spells and Potions](medium/2300.%20Successful%20Pairs%20of%20Spells%20and%20Potions) | Elixir, Go |
| 2316 | [Count Unreachable Pairs of Nodes in an Undirected Graph](medium/2316.%20Count%20Unreachable%20Pairs%20of%20Nodes%20in%20an%20Undirected%20Graph) | Go |
| 2348 | [Number of Zero-Filled Subarrays](medium/2348.%20Number%20of%20Zero-Filled%20Subarrays) | Go, Python, Rust, TypeScript |
| 2352 | [Equal Row and Column Pairs](medium/2352.%20Equal%20Row%20and%20Column%20Pairs) | Go |
| 2369 | [Check if There is a Valid Partition For The Array](medium/2369.%20Check%20if%20There%20is%20a%20Valid%20Partition%20For%20The%20Array) | Rust |
| 2391 | [Minimum Amount of Time to Collect Garbage](medium/2391.%20Minimum%20Amount%20of%20Time%20to%20Collect%20Garbage) | Go |
| 2415 | [Reverse Odd Levels of Binary Tree](medium/2415.%20Reverse%20Odd%20Levels%20of%20Binary%20Tree) | Go |
| 2429 | [Minimize XOR](medium/2429.%20Minimize%20XOR) | Go, Rust, TypeScript |
| 2462 | [Total Cost to Hire K Workers](medium/2462.%20Total%20Cost%20to%20Hire%20K%20Workers) | Python |
| 2466 | [Count Ways To Build Good Strings](medium/2466.%20Count%20Ways%20To%20Build%20Good%20Strings) | CC, Go, Rust, TypeScript |
| 2483 | [Minimum Penalty for a Shop](medium/2483.%20Minimum%20Penalty%20for%20a%20Shop) | Go, Rust |
| 2486 | [Append Characters to String to Make Subsequence](medium/2486.%20Append%20Characters%20to%20String%20to%20Make%20Subsequence) | DUMP, Elixir, Go, Python, Rust, Scala, TypeScript, Zig |
| 2492 | [Minimum Score of a Path Between Two Cities](medium/2492.%20Minimum%20Score%20of%20a%20Path%20Between%20Two%20Cities) | Go, TypeScript |
| 2530 | [Maximal Score After Applying K Operations](medium/2530.%20Maximal%20Score%20After%20Applying%20K%20Operations) | Go |
| 2537 | [Count the Number of Good Subarrays](medium/2537.%20Count%20the%20Number%20of%20Good%20Subarrays) | Go, Rust |
| 2583 | [Kth Largest Sum in a Binary Tree](medium/2583.%20Kth%20Largest%20Sum%20in%20a%20Binary%20Tree) | Go |
| 2610 | [Convert an Array Into a 2D Array With Conditions](medium/2610.%20Convert%20an%20Array%20Into%20a%202D%20Array%20With%20Conditions) | Dart, Go, Python, Rust, TypeScript |
| 2616 | [Minimize the Maximum Difference of Pairs](medium/2616.%20Minimize%20the%20Maximum%20Difference%20of%20Pairs) | Rust |
| 2658 | [Maximum Number of Fish in a Grid](medium/2658.%20Maximum%20Number%20of%20Fish%20in%20a%20Grid) | Go |
| 2661 | [First Completely Painted Row or Column](medium/2661.%20First%20Completely%20Painted%20Row%20or%20Column) | Go, Rust |
| 2683 | [Neighboring Bitwise XOR](medium/2683.%20Neighboring%20Bitwise%20XOR) | Go, Python, Rust, TypeScript |
| 2780 | [Minimum Index of a Valid Split](medium/2780.%20Minimum%20Index%20of%20a%20Valid%20Split) | Go, Rust |
| 2785 | [Sort Vowels in a String](medium/2785.%20Sort%20Vowels%20in%20a%20String) | Go |
| 2849 | [Determine if a Cell Is Reachable at a Given Time](medium/2849.%20Determine%20if%20a%20Cell%20Is%20Reachable%20at%20a%20Given%20Time) | Elixir, Go, Rust |
| 2870 | [Minimum Number of Operations to Make Array Empty](medium/2870.%20Minimum%20Number%20of%20Operations%20to%20Make%20Array%20Empty) | Go, Python, TypeScript |
| 2874 | [Maximum Value of an Ordered Triplet II](medium/2874.%20Maximum%20Value%20of%20an%20Ordered%20Triplet%20II) | Go |
| 2914 | [Minimum Number of Changes to Make Binary String Beautiful](medium/2914.%20Minimum%20Number%20of%20Changes%20to%20Make%20Binary%20String%20Beautiful) | Go, Rust, TypeScript |
| 2976 | [Minimum Cost to Convert String I](medium/2976.%20Minimum%20Cost%20to%20Convert%20String%20I) | Go, Rust |
| 3047 | [Find the Largest Area of Square Inside Two Rectangles](medium/3047.%20Find%20the%20Largest%20Area%20of%20Square%20Inside%20Two%20Rectangles) | Go |
| 3163 | [String Compression III](medium/3163.%20String%20Compression%20III) | Go, Rust |
| 3169 | [Count Days Without Meetings](medium/3169.%20Count%20Days%20Without%20Meetings) | Go, Python, Rust, TypeScript |
| 3315 | [Construct the Minimum Bitwise Array II](medium/3315.%20Construct%20the%20Minimum%20Bitwise%20Array%20II) | Go, Python, Rust, TypeScript |
| 3394 | [Check if Grid can be Cut into Sections](medium/3394.%20Check%20if%20Grid%20can%20be%20Cut%20into%20Sections) | Go |
| 3508 | [Implement Router](medium/3508.%20Implement%20Router) | Go |
| 3623 | [Count Number of Trapezoids I](medium/3623.%20Count%20Number%20of%20Trapezoids%20I) | Go |

## Hard

| # | Problem | Languages |
| ---: | --- | --- |
| 30 | [Substring with Concatenation of All Words](hard/0030.%20Substring%20with%20Concatenation%20of%20All%20Words) | TypeScript |
| 124 | [Binary Tree Maximum Path Sum](hard/0124.%20Binary%20Tree%20Maximum%20Path%20Sum) | C, Go |
| 185 | [Department Top Three Salaries](hard/0185.%20Department%20Top%20Three%20Salaries) | SQL |
| 239 | [Sliding Window Maximum](hard/0239.%20Sliding%20Window%20Maximum) | Go |
| 330 | [Patching Array](hard/0330.%20Patching%20Array) | Go, Rust |
| 332 | [Reconstruct Itinerary](hard/0332.%20Reconstruct%20Itinerary) | Go, Python |
| 432 | [All O`one Data Structure](hard/0432.%20All%20O%60one%20Data%20Structure) | Go |
| 629 | [K Inverse Pairs Array](hard/0629.%20K%20Inverse%20Pairs%20Array) | Go, Rust |
| 664 | [Strange Printer](hard/0664.%20Strange%20Printer) | Go, Rust |
| 726 | [Number of Atoms](hard/0726.%20Number%20of%20Atoms) | Go |
| 834 | [Sum of Distances in Tree](hard/0834.%20Sum%20of%20Distances%20in%20Tree) | Go |
| 920 | [Number of Music Playlists](hard/0920.%20Number%20of%20Music%20Playlists) | Go, Rust |
| 956 | [Tallest Billboard](hard/0956.%20Tallest%20Billboard) | Go, Rust |
| 1203 | [Sort Items by Groups Respecting Dependencies](hard/1203.%20Sort%20Items%20by%20Groups%20Respecting%20Dependencies) | Python |
| 1383 | [Maximum Performance of a Team](hard/1383.%20Maximum%20Performance%20of%20a%20Team) | Java |
| 1420 | [Build Array Where You Can Find The Maximum Exactly K Comparisons](hard/1420.%20Build%20Array%20Where%20You%20Can%20Find%20The%20Maximum%20Exactly%20K%20Comparisons) | Go |
| 1458 | [Max Dot Product of Two Subsequences](hard/1458.%20Max%20Dot%20Product%20of%20Two%20Subsequences) | Go, Python |
| 1489 | [Find Critical and Pseudo-Critical Edges in Minimum Spanning Tree](hard/1489.%20Find%20Critical%20and%20Pseudo-Critical%20Edges%20in%20Minimum%20Spanning%20Tree) | Python |
| 1799 | [Maximize Score After N Operations](hard/1799.%20Maximize%20Score%20After%20N%20Operations) | Go, Rust |
| 1964 | [Find the Longest Valid Obstacle Course at Each Position](hard/1964.%20Find%20the%20Longest%20Valid%20Obstacle%20Course%20at%20Each%20Position) | Go |
| 2179 | [Count Good Triplets in an Array](hard/2179.%20Count%20Good%20Triplets%20in%20an%20Array) | Go |
| 2328 | [Number of Increasing Paths in a Grid](hard/2328.%20Number%20of%20Increasing%20Paths%20in%20a%20Grid) | Go |
| 2366 | [Minimum Replacements to Sort the Array](hard/2366.%20Minimum%20Replacements%20to%20Sort%20the%20Array) | Go, Rust |
| 2642 | [Design Graph With Shortest Path Calculator](hard/2642.%20Design%20Graph%20With%20Shortest%20Path%20Calculator) | Go |

## Misc

| # | Problem | Languages |
| ---: | --- | --- |
| 2 | [2?.Add Two Numbers (duplicate)](misc/2%3F.Add%20Two%20Numbers%20%28duplicate%29) | TypeScript |
|  | [?Word Formation](misc/%3FWord%20Formation) | TypeScript |
|  | [Bipartite Graph](misc/Bipartite%20Graph) | TypeScript |
|  | [Count Next Element](misc/Count%20Next%20Element) | TypeScript |
|  | [Leaderboard](misc/Leaderboard) | Python, TypeScript |
|  | [Line of People](misc/Line%20of%20People) | TypeScript |
|  | [Number of Islands](misc/Number%20of%20Islands) | TypeScript |
|  | [Only Child](misc/Only%20Child) | TypeScript |
|  | [Sum of First N Odd Integers](misc/Sum%20of%20First%20N%20Odd%20Integers) | Java, TypeScript |
