# ML/NLP Pipeline Documentation

## Overview
This module demonstrates a comprehensive AI/ML workflow for assignment evaluation, including:

- **Text Preprocessing**: Stop word removal, stemming, normalization
- **TF-IDF Vectorization**: Converting text to numerical vectors
- **Cosine Similarity**: Semantic comparison with reference answers
- **ML Neural Network Scoring**: TensorFlow.js based evaluation

## Workflow Steps

### 1. Text Extraction (OCR/Parser)
Extracts text from PDF or image files using OCR engines or PDF parsers.

### 2. Text Preprocessing
- Remove stop words
- Remove punctuation  
- Convert to lowercase
- Text normalization using `natural` and `compromise` libraries

### 3. Feature Extraction (TF-IDF)
Text is converted into numerical format using TF-IDF vectorization with dimensions up to 4096.

### 4. Similarity Calculation (Cosine Similarity)
Cosine similarity is used to compare student answers with model/reference answers, calculating semantic distance.

### 5. AI-Based Evaluation
Includes:
- Relevance Checking
- Completeness Checking
- Quality Analysis
- Logical Flow Checking

### 6. ML Scoring (TensorFlow.js)
Neural network layers with:
- Layer 1: ReLU activation
- Layer 2: Sigmoid activation
- Target Loss calculation

### 7. Result Storage
Results and feedback are stored in MongoDB database.

## Files
- `mlPipeline.js` - Core ML pipeline implementation
- Uses libraries: `natural`, `compromise`, `@tensorflow/tfjs-node`

## Console Output Example
```
 ====================================================== 
 🔥 STARTING ML PIPELINE EVALUATION
 ====================================================== 

[Pipeline] [4/11] Text Preprocessing (natural, compromise)
  ↳ Normalizing chunks, removing stopwords, stemming text...
  ✔ Extracted 156 meaningful tokens, 8 entities

[Pipeline] [5/11] TF-IDF Vectorization
  ↳ Building vector matrix: [Dimension 2x4096]

[Pipeline] [6/11] Cosine Similarity
  ↳ Calculating semantic distance. Confidence score metric: 0.861

[Pipeline] [7/11] ML Scoring (TensorFlow.js / Brain.js)
  ↳ Layer 1 & 2 activations complete. Target Loss: 0.041
```
