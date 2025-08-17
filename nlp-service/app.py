# nlp-service/app.py

from flask import Flask, request, jsonify
from flask_mail import Mail, Message
import spacy
from spacy.matcher import Matcher
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# --- NEW: Configure Flask-Mail ---
app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER')
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT'))
app.config['MAIL_USE_TLS'] = os.environ.get('MAIL_USE_TLS').lower() in ['true', '1', 't']
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_DEFAULT_SENDER', app.config['MAIL_USERNAME'])

mail = Mail(app)

# --- (Existing spaCy and NLP logic) ---
nlp = spacy.load("en_core_web_sm", disable=["parser", "ner"])
SKILLS_DB = [
    'react', 'javascript', 'node.js', 'express', 'mongodb', 'python', 'java',
    'c++', 'sql', 'html', 'css', 'aws', 'docker', 'git', 'typescript',
    'redux', 'graphql', 'rest', 'api', 'agile', 'scrum', 'machine learning',
    'data analysis', 'project management'
]
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

@app.route('/analyze', methods=['POST'])
def analyze_resume():
    try:
        data = request.get_json()
        resume_text = data.get('resume_text')
        jd_text = data.get('jd_text')
        validated_skills = set(data.get('validated_skills', []))

        if not resume_text or not jd_text:
            return jsonify({"error": "Missing 'resume_text' or 'jd_text' in request body"}), 400

        resume_skills = extract_skills(resume_text)
        jd_skills = extract_skills(jd_text)
        matched_skills = resume_skills.intersection(jd_skills)
        missing_skills = jd_skills.difference(resume_skills)

        base_score = 0
        if jd_skills:
            base_score = (len(matched_skills) / len(jd_skills)) * 100
        
        VALIDATED_SKILL_BONUS = 5
        bonus_score = 0
        for skill in matched_skills:
            if skill in validated_skills:
                bonus_score += VALIDATED_SKILL_BONUS
        
        final_score = min(round(base_score + bonus_score), 100)

        summary = f"The candidate appears to be a {final_score}% match for this role. "
        if matched_skills:
            summary += f"They possess key skills such as {', '.join(list(matched_skills)[:3])}. "
        if bonus_score > 0:
            summary += "Their score was boosted based on skills you have previously approved in other candidates. "
        if missing_skills:
            summary += f"However, they may be lacking in areas like {', '.join(list(missing_skills)[:3])}."
        else:
            summary += "They appear to possess all required skills."

        response = {
            "matchScore": final_score, "summary": summary,
            "matchedSkills": list(matched_skills), "missingSkills": list(missing_skills)
        }
        return jsonify(response)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- NEW: Email Sending Route ---
@app.route('/send-email', methods=['POST'])
def send_email():
    try:
        data = request.get_json()
        recipient = data.get('recipient')
        subject = data.get('subject')
        html_body = data.get('html_body')

        if not all([recipient, subject, html_body]):
            return jsonify({"error": "Missing required fields: recipient, subject, html_body"}), 400

        msg = Message(subject, recipients=[recipient])
        msg.html = html_body
        mail.send(msg)

        return jsonify({"message": "Email sent successfully!"}), 200
    except Exception as e:
        print(f"Email sending error: {e}")
        return jsonify({"error": "Failed to send email."}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)
