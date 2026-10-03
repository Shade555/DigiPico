# tabpfn_service.py
# A script to demonstrate using TabPFN for the Hacktoberfest $200 partner requirement.

import pandas as pd
from sklearn.model_selection import train_test_split
from tabpfn import TabPFNClassifier

def train_and_predict_interest():
    print("🚀 Initializing TabPFN Model...")
    
    # Dummy historical user data (the "tabular" data)
    # Columns: [topics_completed, time_spent_mins, avg_quiz_score, saved_topics, current_level]
    X_train = pd.DataFrame([
        [1, 15, 60, 0, 1],
        [5, 120, 85, 4, 3],
        [10, 300, 95, 10, 5],
        [2, 30, 70, 1, 2],
        [8, 200, 90, 8, 4]
    ], columns=["topics_completed", "time_spent_mins", "avg_quiz_score", "saved_topics", "current_level"])
    
    # Labels corresponding to the rows above
    # e.g., web_basics, ai_models, hands_on_coding
    y_train = pd.Series(["web_basics", "hands_on_coding", "ai_models", "web_basics", "ai_models"])

    # Initialize the classifier
    # (TabPFN requires no hyperparameter tuning and is highly effective on small datasets)
    classifier = TabPFNClassifier(device='cpu', N_ensemble_configurations=32)

    # Fit the model
    print("📈 Fitting model on historical learner data...")
    classifier.fit(X_train, y_train)

    # Let's predict a new user's interest
    # New user has completed 6 topics, spent 150 mins, scored 88, saved 5 topics, and is level 3
    X_new = pd.DataFrame([
        [6, 150, 88, 5, 3]
    ], columns=["topics_completed", "time_spent_mins", "avg_quiz_score", "saved_topics", "current_level"])

    print("🔮 Predicting next interest for new user...")
    prediction = classifier.predict(X_new)
    
    print(f"✅ Prediction complete! The user is most likely to engage with: {prediction[0]}")

if __name__ == "__main__":
    train_and_predict_interest()
