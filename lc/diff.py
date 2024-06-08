# list_a = ["cat", "dog", "dog", "elephant", "!", "!", "cat"]
# list_b = ["cat", "dog", "shark", "elephant", "!", "!", "dog"]

list_a = ["hello", "there", "luke", "!"]
list_b = ["hello", "there", "general", "kenobi", "!"]

# O(n) time complexity: 2 loops
# O(n) space complexity: uses 2 arrays
def tuple(a, b):
    prefixes = []
    suffixes = []
    
    while (a and b and a[0] == b[0]):
        prefixes.append(a.pop(0))
        b.pop(0)
        
    while (a and b and a[-1] == b[-1]):
        suffixes.append(a.pop(-1))
        b.pop(-1)
        
    return (prefixes, suffixes, a, b)

# print(tuple(list_a.copy(), list_b.copy()))

# O(n) time complexity on average, O(n^2) worst case due to hashmap operations
# O(n) space complexity: uses 2 arrays and 2 dicts
def unique(a, b):
    dictA = {}
    dictB = {}
    uniqueA = []
    uniqueB = []

    for word in a:
        dictA[word] = dictA.get(word, 0) + 1
        
    for word in b:
        dictB[word] = dictB.get(word, 0) + 1
        
    for (k, v) in dictA.items():
        if v == 1:
            uniqueA.append(k)
        
    for (k, v) in dictB.items():
        if v == 1:
            uniqueB.append(k)
    
    common = set(uniqueA).intersection(set(uniqueB)) # set operations are O(1) since sets are implemented via hashing, thus set intersection is O(n)
    
    if common:
        return common.pop()
    else:
        return None 
    
# print(unique(list_a.copy(), list_b.copy()))

def diff(a, b):
    tupleRes = tuple(a, b)
    if not tupleRes[0] and not tupleRes[1] and not tupleRes[2] and not tupleRes[3]:
        return

    for prefix in tupleRes[0]:
        print(" " + prefix)


    if tupleRes[2]:
        print("-" + tupleRes[2].pop(0))
    if tupleRes[3]:
        print("+" + tupleRes[3].pop(0))
        
    diff(tupleRes[2], tupleRes[3])

    for suffix in tupleRes[1]:
        print(" " + suffix)
    
    return
    
     
diff(list_a.copy(), list_b.copy())