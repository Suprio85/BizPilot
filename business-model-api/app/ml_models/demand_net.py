# filepath: app/ml_models/demand_net.py
import torch
import torch.nn as nn

class DemandNet(nn.Module):
    """PyTorch model architecture matching your training code"""
    def __init__(self, input_size, dropout_rate=0.2):
        super().__init__()
        
        self.backbone = nn.Sequential(
            nn.Linear(input_size, 256),
            nn.BatchNorm1d(256),
            nn.ReLU(),
            nn.Dropout(dropout_rate),
            
            nn.Linear(256, 128),
            nn.BatchNorm1d(128),
            nn.ReLU(),
            nn.Dropout(dropout_rate),
            
            nn.Linear(128, 64),
            nn.BatchNorm1d(64),
            nn.ReLU(),
            nn.Dropout(dropout_rate/2),
            
            nn.Linear(64, 32),
            nn.ReLU(),
            
            nn.Linear(32, 1),
            nn.Sigmoid()
        )
        
    def forward(self, x):
        return self.backbone(x)
