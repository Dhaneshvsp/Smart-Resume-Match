# nlp-service/app.py

from flask import Flask, request, jsonify
# from flask_mail import Mail, Message # Temporarily commented out for debugging
import spacy
from spacy.matcher import Matcher
import os
from dotenv import load_dotenv

# --- NEW: Function to ensure spaCy model is downloaded ---
def download_spacy_model():
    model_name = "en_core_web_sm"
    try:
        spacy.load(model_name)
        print(f"PYTHON: '{model_name}' model already installed.")
    except OSError:
        print(f"PYTHON: Downloading '{model_name}' model...")
        from spacy.cli import download
        download(model_name)
        print(f"PYTHON: '{model_name}' model downloaded successfully.")

# --- Run the download check when the app starts ---
download_spacy_model()

# Load environment variables from .env file for local development
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# --- Configure Flask-Mail with default values ---
app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.environ.get('MAIL_USE_TLS', 'true').lower() in ['true', '1', 't']
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_DEFAULT_SENDER', app.config['MAIL_USERNAME'])

# mail = Mail(app) # Temporarily commented out

# --- spaCy and NLP Logic ---
# The model is now guaranteed to be available because of the updated build command.
nlp = spacy.load("en_core_web_sm", disable=["parser", "ner"])
SKILLS_DB = [
    'react', 'javascript', 'node.js', 'express', 'mongodb', 'python', 'java',
    'c++', 'sql', 'html', 'css', 'aws', 'docker', 'git', 'typescript',
    'redux', 'graphql', 'rest', 'api', 'agile', 'scrum', 'machine learning',
    'data analysis', 'project management'
]
# Correctly create patterns for single and multi-word skills
skill_patterns = [[{"LOWER": s} for s in skill.split()] for skill in SKILLS_DB]
matcher = Matcher(nlp.vocab)
matcher.add("SKILL_MATCHER", skill_patterns)

def extract_skills(text):
    doc = nlp(text.lower())
    matches = matcher(doc)
    found_skills = set()
    for match_id, start, end in matches:
        span = doc[start:end]
        found_skills.add(span.text)
    return found_skills

# --- NEW: Health Check Route ---
@app.route('/', methods=['GET'])
def health_check():
    return "NLP Service is running and healthy."

@app.route('/analyze', methods=['POST'])
def analyze_resume():
    print("--- PYTHON: /analyze route initiated ---")
    try:
        data = request.get_json()
        if not data:
            print("PYTHON: ERROR - Request body is not JSON or is empty.")
            return jsonify({"error": "Invalid request body. Expected JSON."}), 400

        resume_text = data.get('resume_text', '')
        jd_text = data.get('jd_text', '')
        validated_skills = set(data.get('validated_skills', []))
        
        print(f"PYTHON: Received resume text length: {len(resume_text)}")
        print(f"PYTHON: Received JD text length: {len(jd_text)}")

        if not resume_text or not jd_text:
            return jsonify({"error": "Missing 'resume_text' or 'jd_text' in request body"}), 400

        resume_skills = extract_skills(resume_text)
        jd_skills = extract_skills(jd_text)
        
        print(f"PYTHON: Skills found in JD: {jd_skills}")
        print(f"PYTHON: Skills found in Resume: {resume_skills}")
        
        matched_skills = resume_skills.intersection(jd_skills)
        missing_skills = jd_skills.difference(resume_skills)

        base_score = (len(matched_skills) / len(jd_skills)) * 100 if jd_skills else 0
        
        VALIDATED_SKILL_BONUS = 5
        bonus_score = sum(VALIDATED_SKILL_BONUS for skill in matched_skills if skill in validated_skills)
        
        final_score = min(round(base_score + bonus_score), 100)
        
        print(f"PYTHON: Final score calculated: {final_score}")

        summary = f"The candidate appears to be a {final_score}% match for this role. "
        if matched_skills:
            summary += f"They possess key skills such as {', '.join(list(matched_skills)[:3])}. "
        if bonus_score > 0:
            summary += "Their score was boosted based on skills you have previously approved. "
        if missing_skills:
            summary += f"However, they may be lacking in areas like {', '.join(list(missing_skills)[:3])}."
        else:
            summary += "They appear to possess all required skills."

        response = {
            "matchScore": final_score, "summary": summary,
            "matchedSkills": list(matched_skills), "missingSkills": list(missing_skills)
        }
        print("--- PYTHON: /analyze route finished. Sending response. ---")
        return jsonify(response)
    except Exception as e:
        print(f"PYTHON: CRITICAL ERROR in /analyze: {e}")
        return jsonify({"error": str(e)}), 500

# @app.route('/send-email', methods=['POST'])
# def send_email():
#     # This route is temporarily disabled for debugging the main functionality
#     pass

if __name__ == '__main__':
    app.run(port=5001, debug=True)
