# Given an integer array nums and an integer k, return the length of the longest subarray of s such that the frequency of each character in this subarray is greater than or equal to k.

# if no such subarray exists, return 0.

input = [1,1,1,2,2]
k = 3

def recurse(arr, start, end, k):
    counts = {}

    for i in range(start, end):
        counts[arr[i]] = counts.get(arr[i], 0) + 1
        
    for i in range(start, end):
        if counts[arr[i]] < k:
            left = recurse(arr, k, start, i)
            right = recurse(arr, k, i + 1, end)
            return max(left, right)
        
    
    return end - start
    
print(recurse(input, 0, len(input), k))