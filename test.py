def predict(x, W):
    return W[0] + W[1] * x[0]

def calcCost(X, y, W):
    totalCost = 0
    for i in range(3):
        totalCost += (y[i] - predict(X[i],W))*(y[i] - predict(X[i],W))
    totalCost = totalCost / 3.0;
    return totalCost
    