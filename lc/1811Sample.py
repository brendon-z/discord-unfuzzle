import numpy as np

# Q1

def q1a_func(a_list, a, b):
    for x in a_list:
        if not x >= a or not x < b:
            return False
    
    return True

# Q2

def q1b_func(a_list, m):
    res = []
    for (listElement, index) in enumerate(a_list):
        if max(listElement) <= m:
            res.append(index)
            
    return res


# Q3

def q3_func(m, h):
    bmi = m / (h ** 2)
    
    if bmi < 18.5:
        return "Underweight"
    elif bmi < 25:
        return "Normal"
    elif bmi < 30:
        return "Overweight"
    else:
        return "Obese"
    
# Q4

def q4_func(x, t):
    z = [0] * len(x)

    for i in range(len(x)):
        if x[i] > t:
            z[i] = 1
        elif x[i] < -t:
            z[i] = - 1
        else:
            z[i] = x[i] / t
            
    return np.array(z)

# Q5

def q5_func(array, n):
    res = [0] * len(array)
    
    for i in range(n):
        s = array[i] // n
        restSum = 0
        for j in range(s):
            restSum += array[i + j * n]

        res[i] = array[i] + restSum
        
    return res
