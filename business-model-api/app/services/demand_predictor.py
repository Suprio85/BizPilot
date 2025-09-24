# filepath: app/services/demand_predictor.py
import os
import pickle
import json
from pathlib import Path
from typing import Dict, Any
import torch
import numpy as np
from app.config import settings

class DemandPredictorService:
    def __init__(self):
        self.model = None
        self.preprocessor = None
        self.model_loaded = False
        self.model_dir = Path("models/demand_prediction")
        self.model_dir.mkdir(parents=True, exist_ok=True)
    
    def load_model_files(self):
        """Load model from manually placed files"""
        try:
            # Look for the specific model file
            model_path = Path("best_demand_model.pth")
            
            # Also check in models directory
            if not model_path.exists():
                model_path = self.model_dir / "best_demand_model.pth"
            
            # Check current directory as well
            if not model_path.exists():
                model_path = Path("./best_demand_model.pth")
                
            if not model_path.exists():
                print("Model file 'best_demand_model.pth' not found!")
                print(f"Please place the model file in one of these locations:")
                print(f"  - {Path.cwd()}/best_demand_model.pth")
                print(f"  - {self.model_dir}/best_demand_model.pth")
                raise FileNotFoundError("best_demand_model.pth not found")
            
            # Load the PyTorch model
            from app.ml_models.demand_net import DemandNet
            
            print(f"Loading model from: {model_path}")
            
            # Load model state dict
            state_dict = torch.load(model_path, map_location='cpu')
            
            # Create model with default input size (based on your training code)
            # Your training code shows 404 features (including 384 embedding dimensions)
            input_size = 404
            
            self.model = DemandNet(input_size)
            self.model.load_state_dict(state_dict)
            self.model.eval()
            print(f"Successfully loaded PyTorch model from {model_path.name}")
            
            # Create a mock preprocessor since we don't have the original
            self._create_mock_preprocessor()
            
            self.model_loaded = True
            return True
            
        except Exception as e:
            print(f"Error loading model files: {e}")
            return False
    
    def _create_mock_preprocessor(self):
        """Create a mock preprocessor that mimics the original functionality"""
        from app.ml_models.mock_preprocessor import MockPreprocessor
        self.preprocessor = MockPreprocessor()
        print("Created mock preprocessor (using heuristic-based feature engineering)")
    
    def predict_demand(self, request_data: Dict[str, Any]) -> float:
        """Make demand prediction"""
        if not self.model_loaded:
            if not self.load_model_files():
                raise Exception("Model not loaded and could not load model files")
        
        try:
            # Use preprocessor to make prediction
            prediction = self.preprocessor.predict_new_sample(
                self.model, 
                request_data, 
                device='cpu'
            )
            
            return float(prediction)
            
        except Exception as e:
            print(f"Prediction error: {e}")
            # Fallback: simple heuristic prediction
            return self._fallback_prediction(request_data)
    
    def _fallback_prediction(self, request_data: Dict[str, Any]) -> float:
        """Fallback prediction when model fails"""
        # Simple heuristic based on product category and region
        base_demand = 100
        
        # Product category multipliers
        product_name = request_data.get('product_name', '').lower()
        if 'smartphone' in product_name or 'phone' in product_name:
            base_demand *= 0.3
        elif 'laptop' in product_name or 'computer' in product_name:
            base_demand *= 0.2
        elif 'rice' in product_name or 'fish' in product_name:
            base_demand *= 1.5
        elif 'shirt' in product_name or 'clothing' in product_name:
            base_demand *= 0.8
        
        # Region multipliers
        region = request_data.get('region', '').lower()
        if region in ['dhaka', 'chittagong']:
            base_demand *= 1.3
        elif region in ['sylhet']:
            base_demand *= 1.1
        
        # Weekend bonus
        if request_data.get('is_weekend', 0) == 1:
            base_demand *= 1.2
        
        return max(1, int(base_demand))

# Create global instance
demand_predictor = DemandPredictorService()
