# filepath: app/ml_models/mock_preprocessor.py
import numpy as np
import pandas as pd
import torch
from typing import Dict, Any

class MockPreprocessor:
    """
    Mock preprocessor that recreates the feature engineering logic
    from your training code without needing the original preprocessor
    """
    
    def __init__(self):
        # Mock embedding handler for product embeddings
        self.embedding_handler = MockEmbeddingHandler()
        
        # Feature columns (404 total features based on your training)
        self.feature_columns = self._create_feature_column_names()
        
        # Mock encoders for categorical variables
        self.encoders = {
            'region': {'dhaka': 0, 'chittagong': 1, 'sylhet': 2, 'rajshahi': 3, 'khulna': 4},
            'bd_season': {'winter': 0, 'spring': 1, 'summer': 2, 'monsoon': 3, 'autumn': 4, 'late_autumn': 5},
            'event': {'none': 0, 'eid': 1, 'ramadan': 2, 'hartal': 3, 'monsoon': 4},
            'economic_zone': {'low': 0, 'medium': 1, 'high': 2}
        }
        
        # Mock scalers (using reasonable defaults)
        self.feature_means = np.zeros(404)
        self.feature_stds = np.ones(404)
        
        # Target scaler parameters
        self.target_scaler = {
            'min_val': 0.0,
            'max_val': 1.0,
            'transform': 'sqrt'
        }
    
    def _create_feature_column_names(self):
        """Create feature column names matching the original preprocessor"""
        features = []
        
        # Numerical features
        numerical_features = [
            'days_since_start_norm', 'month', 'dayofweek', 'quarter',
            'month_sin', 'month_cos', 'dayofweek_sin', 'dayofweek_cos',
            'is_weekend', 'is_winter', 'is_summer', 'is_festival_season'
        ]
        features.extend(numerical_features)
        
        # Product embedding features (384 dimensions)
        embedding_features = [f'product_emb_{i}' for i in range(384)]
        features.extend(embedding_features)
        
        # Categorical features
        categorical_features = [
            'region_encoded', 'bd_season_encoded', 'event_encoded', 'economic_zone_encoded'
        ]
        features.extend(categorical_features)
        
        # Target mean features
        target_mean_features = [
            'region_target_mean', 'bd_season_target_mean', 
            'event_target_mean', 'economic_zone_target_mean'
        ]
        features.extend(target_mean_features)
        
        return features
    
    def get_bd_season(self, date_str: str) -> str:
        """Determine BD season from date"""
        date = pd.to_datetime(date_str)
        month = date.month
        
        if month in [12, 1, 2]:
            return 'winter'
        elif month in [3, 4]:
            return 'spring'
        elif month in [5, 6]:
            return 'summer'
        elif month in [7, 8]:
            return 'monsoon'
        elif month in [9, 10]:
            return 'autumn'
        else:
            return 'late_autumn'
    
    def predict_new_sample(self, model, sample, device='cpu'):
        """Make prediction for new sample"""
        print(f"Predicting for product: '{sample['product_name']}'")
        
        # Build features
        features = self._build_features(sample)
        
        # Preprocess features
        tensor = self._preprocess_features(features, device)
        
        # Make prediction
        model.eval()
        with torch.no_grad():
            pred_scaled = model(tensor).cpu().numpy().flatten()
            prediction = self.inverse_transform_target(pred_scaled)
        
        print(f"7-Day Demand Forecast: {prediction[0]:.0f} units")
        return prediction[0]
    
    def _build_features(self, sample):
        """Build feature vector from sample"""
        features = []
        
        # Parse date
        date = pd.to_datetime(sample['date'])
        
        # Temporal features
        days_since_start_norm = (date - pd.to_datetime('2022-01-01')).days / 1000
        month = date.month
        dayofweek = date.dayofweek
        quarter = date.quarter
        
        # Cyclical features
        month_sin = np.sin(2 * np.pi * month / 12)
        month_cos = np.cos(2 * np.pi * month / 12)
        dayofweek_sin = np.sin(2 * np.pi * dayofweek / 7)
        dayofweek_cos = np.cos(2 * np.pi * dayofweek / 7)
        
        # Season indicators
        is_winter = int(month in [12, 1, 2])
        is_summer = int(month in [5, 6, 7, 8])
        is_festival_season = int(month in [4, 11, 12])
        
        # Numerical features
        numerical_features = [
            days_since_start_norm, month, dayofweek, quarter,
            month_sin, month_cos, dayofweek_sin, dayofweek_cos,
            sample.get('is_weekend', 0), is_winter, is_summer, is_festival_season
        ]
        features.extend(numerical_features)
        
        # Product embedding
        product_embedding = self.embedding_handler.get_product_embedding(sample['product_name'])
        features.extend(product_embedding.tolist())
        
        # Categorical features
        bd_season = sample.get('bd_season', self.get_bd_season(sample['date']))
        
        categorical_mapping = {
            'region': sample['region'],
            'bd_season': bd_season,
            'event': sample.get('event', 'none'),
            'economic_zone': sample.get('economic_zone', 'medium')
        }
        
        # Encode categoricals
        for col in ['region', 'bd_season', 'event', 'economic_zone']:
            value = str(categorical_mapping[col])
            encoded_val = self.encoders[col].get(value, 0)  # Default to 0 if unknown
            features.append(encoded_val)
        
        # Target mean features (use reasonable defaults)
        region_means = {'dhaka': 160, 'chittagong': 140, 'sylhet': 120, 'rajshahi': 110, 'khulna': 100}
        season_means = {'winter': 130, 'spring': 140, 'summer': 150, 'monsoon': 120, 'autumn': 135, 'late_autumn': 125}
        event_means = {'none': 130, 'eid': 200, 'ramadan': 110, 'hartal': 60, 'monsoon': 90}
        zone_means = {'low': 100, 'medium': 130, 'high': 160}
        
        target_mean_features = [
            region_means.get(sample['region'], 130),
            season_means.get(bd_season, 130),
            event_means.get(sample.get('event', 'none'), 130),
            zone_means.get(sample.get('economic_zone', 'medium'), 130)
        ]
        features.extend(target_mean_features)
        
        return np.array(features, dtype=np.float32)
    
    def _preprocess_features(self, features, device):
        """Apply scaling and convert to tensor"""
        features = features.reshape(1, -1)
        
        # Ensure correct size (404 features)
        expected_size = 404
        if features.shape[1] != expected_size:
            if features.shape[1] < expected_size:
                # Pad with zeros
                padding = np.zeros((1, expected_size - features.shape[1]))
                features = np.concatenate([features, padding], axis=1)
            else:
                # Truncate
                features = features[:, :expected_size]
        
        # Apply mock standardization (subtract mean, divide by std)
        features = (features - self.feature_means) / self.feature_stds
        
        return torch.FloatTensor(features).to(device)
    
    def inverse_transform_target(self, y_transformed):
        """Inverse transform targets back to original scale"""
        # Mock inverse transform - scale from [0,1] back to reasonable demand range
        y_normalized = np.clip(y_transformed, 0, 1)
        
        # Apply inverse sqrt transform and scale
        y_sqrt = y_normalized * 60  # Max sqrt value ~60 for reasonable demand
        y_original = np.maximum(y_sqrt ** 2, 0)
        
        return y_original


class MockEmbeddingHandler:
    """Mock embedding handler that creates consistent embeddings for product names"""
    
    def __init__(self):
        self.embedding_cache = {}
        self.embedding_dim = 384
        np.random.seed(42)  # For consistent embeddings
    
    def get_product_embedding(self, product_name):
        """Get embedding for a product name"""
        if product_name in self.embedding_cache:
            return self.embedding_cache[product_name]
        
        embedding = self._compute_embedding(product_name)
        self.embedding_cache[product_name] = embedding
        return embedding
    
    def _compute_embedding(self, product_name):
        """Create deterministic embedding based on product name"""
        product_name = str(product_name).lower().strip()
        
        # Create hash-based seed for consistency
        hash_val = hash(product_name)
        np.random.seed(abs(hash_val) % (2**31))
        
        # Generate base embedding
        embedding = np.random.normal(0, 0.1, self.embedding_dim)
        
        # Add semantic features based on product characteristics
        char_features = [
            len(product_name),
            sum(c.isalpha() for c in product_name),
            sum(c.isdigit() for c in product_name),
            len(set(product_name)),
            ord(product_name[0]) if product_name else 0
        ]
        
        # Incorporate character features
        for i, feat in enumerate(char_features[:5]):
            if i < self.embedding_dim:
                embedding[i] += feat * 0.02
        
        # Add category-based features
        categories = {
            'electronics': ['phone', 'smartphone', 'laptop', 'computer', 'tablet', 'camera', 'tv', 'television'],
            'food': ['rice', 'fish', 'chicken', 'vegetables', 'fruits', 'milk', 'bread'],
            'clothing': ['shirt', 'jeans', 'dress', 'jacket', 'shoes', 'bag'],
            'books': ['book', 'textbook', 'novel', 'magazine', 'notebook']
        }
        
        # Apply category-specific modifications
        for category, keywords in categories.items():
            if any(keyword in product_name for keyword in keywords):
                category_hash = hash(category) % self.embedding_dim
                for i in range(10):  # Modify 10 dimensions per category
                    idx = (category_hash + i) % self.embedding_dim
                    embedding[idx] += 0.3
        
        # Normalize embedding
        embedding = embedding / (np.linalg.norm(embedding) + 1e-8)
        return embedding.astype(np.float32)