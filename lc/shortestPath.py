#-1 - An obstacle.
# 0 - An exit.
# INF - An empty room. We use the value 2^31 - 1 = 2147483647 to represent INF as you may assume that the distance to an exit is less than 2147483647.


def shortestPathToExit(grid):
    if (len(grid) == 0):
        return
    
    for i in range(len(grid)):
        for j in range(len(grid[0])):
            if grid[i][j] == 0:
                bfs(grid, i, j)
                
    return grid
                

def dfs(grid, i, j, distance, visited):
    if i < 0 or i >= len(grid) or j < 0 or j >= len(grid[0]) or grid[i][j] == -1 or (grid[i][j] == 0 and distance > 0) or (i, j) in visited:
        return
    
    grid[i][j] = min(grid[i][j], distance)
    visited.append((i, j))
    
    dfs(grid, i + 1, j, distance + 1, visited)
    dfs(grid, i - 1, j, distance + 1, visited)
    dfs(grid, i, j + 1, distance + 1, visited)
    dfs(grid, i, j - 1, distance + 1, visited)
    
def bfs(grid, i, j):
    q = []
    visited = []

    q.append((i, j, 0))
    
    while len(q) > 0:
        coord = q.pop()
        if coord[0] < 0 or coord[0] >= len(grid) or coord[1] < 0 or coord[1] >= len(grid) or grid[coord[0]][coord[1]] == -1 or (coord[0], coord[1]) in visited or (grid[coord[0]][coord[1]] == 0 and coord[2] > 0):
            continue
        visited.append((coord[0], coord[1]))
        grid[coord[0]][coord[1]] = min(coord[2], grid[coord[0]][coord[1]])
        
        q.append((coord[0] + 1, coord[1], coord[2] + 1))
        q.append((coord[0] - 1, coord[1], coord[2] + 1))
        q.append((coord[0], coord[1] + 1, coord[2] + 1))
        q.append((coord[0], coord[1] - 1, coord[2] + 1))
        
answer = [[3, -1, 0, 1], [2, 2, 1, -1], [1, -1, 2, -1], [0, -1, 3, 4]]
input = [[float('inf'), -1, 0, float('inf')], [float('inf'),float('inf'),float('inf'),-1], [float('inf'), -1, float('inf'), -1], [0, -1, float('inf'), float('inf')]]
print(shortestPathToExit(input) == answer)
