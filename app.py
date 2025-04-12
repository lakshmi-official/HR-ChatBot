from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os
import re
import logging
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Global variables
policy_data = None
tfidf_vectorizer = None
tfidf_matrix = None
keywords = None
details = None

# Path to the CSV
CSV_PATH = "HCL_HR_Policies_Comprehensive_Dataset.csv"

def preprocess_text(text):
    """Clean and normalize text."""
    text = text.lower()
    text = re.sub(r'[^\w\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def load_policy_data():
    """Load and vectorize HR policy data."""
    global policy_data, tfidf_vectorizer, tfidf_matrix, keywords, details

    try:
        if not os.path.exists(CSV_PATH):
            logger.error(f"CSV file not found at {CSV_PATH}")
            return False

        policy_data = pd.read_csv(CSV_PATH)
        logger.info(f"Loaded {len(policy_data)} policy items from CSV")

        keywords = policy_data['Keyword'].tolist()
        details = policy_data['Detailed Information'].tolist()

        combined_text = [f"{k} {d}" for k, d in zip(keywords, details)]

        tfidf_vectorizer = TfidfVectorizer(
            ngram_range=(1, 2),
            stop_words='english',
            max_features=5000
        )
        
        tfidf_matrix = tfidf_vectorizer.fit_transform(combined_text)

        logger.info("TF-IDF vectorization completed successfully")
        return True

    except Exception as e:
        logger.error(f"Error loading policy data: {e}")
        return False

def find_most_relevant_policy(query):
    """Find the most relevant policy for a query."""
    global tfidf_vectorizer, tfidf_matrix, keywords, details

    if tfidf_vectorizer is None or tfidf_matrix is None:
        logger.error("TF-IDF model not initialized")
        return None

    try:
        preprocessed_query = preprocess_text(query)

        # Synonym mapping for boosting
        synonym_map = {
            "promotion": ["promotion criteria", "promotion eligibility", "career advancement", "move up", "higher position", "band upgrade", "level up"],
            "overtime": ["overtime policy", "extra hours", "additional work", "extended hours", "after hours work", "working late"],
            "leave": ["leave policy", "time off", "vacation", "absence", "holiday", "sick leave", "personal leave", "day off", "annual leave"],
            "notice period": ["notice period", "resignation notice", "exit notice", "leaving notice", "quit notice", "termination notice", "resignation period"],
            "work from home": ["work from home", "remote work", "telecommuting", "telework", "working remotely", "home office", "virtual work", "wfh", "remote working"],
            "salary structure": ["salary", "compensation", "pay", "remuneration", "wages", "income", "earnings", "salary components", "salary breakup", "pay structure", "ctc", "cost to company"]
        }

        for base_term, variations in synonym_map.items():
            for synonym in variations:
                if synonym in preprocessed_query:
                    preprocessed_query += f" {base_term}"
                    logger.info(f"Boosted query with synonym: '{base_term}'")
                    break

        query_vector = tfidf_vectorizer.transform([preprocessed_query])
        similarity_scores = cosine_similarity(query_vector, tfidf_matrix).flatten()

        top_indices = np.argsort(similarity_scores)[::-1][:3]
        logger.info(f"Top matches for query '{query}':")
        for idx in top_indices:
            logger.info(f"  -> {keywords[idx]} (Score: {similarity_scores[idx]:.4f})")

        most_similar_index = similarity_scores.argmax()
        similarity_score = similarity_scores[most_similar_index]

        if similarity_score > 0.02:
            return {
                "keyword": keywords[most_similar_index],
                "detail": details[most_similar_index],
                "score": float(similarity_score)
            }
        else:
            logger.warning(f"No strong match. Best guess: {keywords[most_similar_index]} (Score: {similarity_score})")
            return {
                "keyword": f"(Best Guess) {keywords[most_similar_index]}",
                "detail": details[most_similar_index],
                "score": float(similarity_score)
            }

    except Exception as e:
        logger.error(f"Error finding relevant policy: {e}")
        return None

def format_response(policy_info):
    """Format the response neatly for chat display."""
    if not policy_info:
        return "• I couldn't find specific information about that in the HR policies. Could you try rephrasing your question?"

    response = ""
    if policy_info['keyword'].startswith("(Best Guess)"):
        response += "• <em>I couldn't find an exact match, but this might help:</em><br>"

    response += f"• <strong>{policy_info['keyword']}</strong><br>"

    detail_text = policy_info['detail']
    lines = detail_text.split('\n')
    current_section = None

    for line in lines:
        line = line.strip()
        if not line:
            continue

        if line.endswith(':'):
            current_section = line
            response += f"• <strong>{line}</strong><br>"
        elif line.startswith('-') or re.match(r'^\d+\.', line):
            if current_section and line.startswith('-'):
                response += f"&nbsp;&nbsp;&nbsp;{line}<br>"
            else:
                response += f"• {line}<br>"
        else:
            response += f"• {line}<br>"

    return response

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_question = data.get('message', '')

        if not user_question:
            return jsonify({"error": "Empty question"}), 400

        global policy_data
        if policy_data is None:
            if not load_policy_data():
                return jsonify({
                    "response": "• I couldn't access the HR policy data. Please check if the data file exists."
                })

        relevant_policy = find_most_relevant_policy(user_question)
        response = format_response(relevant_policy)

        return jsonify({"response": response})

    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        return jsonify({
            "response": "• I encountered an error processing your question. Please try again."
        }), 500

# Load data on startup
load_policy_data()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
