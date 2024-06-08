public class UnionFind {
    class Subset {
        int parent;
        int rank;
    
        public Subset(int parent, int rank) {
            this.parent = parent;
            this.rank = rank;
        }
    }
    
    int find(Subset[] subsets, int x) {
        if (subsets[x].parent != x) {
            subsets[x].parent = find(subsets, subsets[x].parent);
        }
        return subsets[x].parent;
    }
    
    void union(Subset[] subsets, int x, int y) {
        int xRoot = find(subsets, x);
        int yRoot = find(subsets, y);
    
        if (subsets[xRoot].rank > subsets[yRoot].rank) {
            subsets[xRoot].parent = yRoot;
        } else if (subsets[yRoot].rank > subsets[xRoot].rank) {
            subsets[yRoot].parent = xRoot;
        } else {
            subsets[xRoot].parent = yRoot;
            subsets[yRoot].rank += 1;
        }
    }
    
}