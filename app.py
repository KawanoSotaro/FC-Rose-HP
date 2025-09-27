from flask import Flask, render_template, request, redirect, session, url_for
from datetime import timedelta

app = Flask(__name__)
app.secret_key = 'your_secret_key'

# セッションの有効期限を30分に設定
app.permanent_session_lifetime = timedelta(minutes=30)

PASSWORD = '9981'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        if request.form['password'] == PASSWORD:
            session.permanent = True  # セッション有効化
            session['logged_in'] = True
            next_page = request.args.get("next", "/")
            # ログイン後はブラウザ履歴を置き換え
            response = redirect(next_page)
            response.headers['Cache-Control'] = 'no-store'  # ブラウザに残さない
            return response
        else:
            error = 'パスワードが間違っています'
    return render_template('login.html', error=error)

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    return redirect('/')

# 共通関数：ログイン必須ページのチェック
def login_required(next_page):
    if not session.get('logged_in'):
        return redirect(url_for('login', next=next_page))
    return None

@app.route('/photo')
def photo():
    redirect_response = login_required('/photo')
    if redirect_response:
        return redirect_response
    return render_template('photo.html')

@app.route('/profile')
def profile():
    redirect_response = login_required('/profile')
    if redirect_response:
        return redirect_response
    return render_template('profile.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/quiz_home')
def quiz_home():
    return render_template('quiz_home.html')

@app.route("/quiz")
def quiz():
    questions = [
        {
            "id": 1,
            "question_img": "images/quiz_nakami/q1.png",
            "label_img": "images/quiz_nakami/q101.png",
            "choices": ["選択肢A", "選択肢B", "選択肢C", "選択肢D"],
            "answer": 0,
            "explanation": "これはテスト用の解説です。"
        }
    ]
    return render_template("quiz.html", questions=questions)

@app.route("/manual")
def manual():
    return render_template("manual.html")

@app.route("/event")
def event():
    return render_template("event.html")

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)