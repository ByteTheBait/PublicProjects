import torch
import torch.nn as nn
import numpy as np

# A tiny layer simulating a 1-qubit quantum re-uploading feature map
class MiniQKANLayer(nn.Module):
    def __init__(self, in_features, out_features, degree=3):
        super().__init__()
        self.degree = degree
        # Extremely small parameter matrix
        self.weights = nn.Parameter(torch.randn(out_features, in_features, degree) * 0.1)
        self.bias = nn.Parameter(torch.zeros(out_features))

    def forward(self, x):
        # Create frequencies to simulate quantum rotation steps
        frequencies = torch.arange(1, self.degree + 1, dtype=torch.float32).view(1, 1, -1)
        x_expanded = x.unsqueeze(-1) * frequencies
        
        # Apply sine (simulating quantum state rotation)
        quantum_features = torch.sin(x_expanded)
        
        # Multiply weights and sum it up
        return torch.einsum('bid,oid->bo', quantum_features, self.weights) + self.bias

# Build a small 2-layer network
class TinyQKAN(nn.Module):
    def __init__(self):
        super().__init__()
        self.layer1 = MiniQKANLayer(1, 4, degree=3)
        self.layer2 = MiniQKANLayer(4, 1, degree=3)
        
    def forward(self, x):
        return self.layer2(self.layer1(x))

# 1. Generate 20 simple data points
x_train = torch.linspace(-np.pi, np.pi, 20).view(-1, 1)
y_train = torch.sin(x_train)

# 2. Initialize model and optimizer
model = TinyQKAN()
criterion = nn.MSELoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.1)

# 3. Train for 50 quick steps
print("Training started...")
for epoch in range(51):
    optimizer.zero_grad()
    outputs = model(x_train)
    loss = criterion(outputs, y_train)
    loss.backward()
    optimizer.step()
    
    if epoch % 10 == 0:
        print(f"Epoch {epoch} | Loss: {loss.item():.4f}")

