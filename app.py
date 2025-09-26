from flask import Flask, render_template, request, redirect, session, url_for, send_from_directory
import random
app = Flask(__name__)
app.secret_key = 'your_secret_key'  # sessionを使うなら絶対必要！

PASSWORD = '9981'  # ここに設定したいパスワードを記入

@app.route('/')  # ホーム画面のURLは 「/」
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        if request.form['password'] == PASSWORD:
            session['logged_in'] = True
            next_page = request.args.get("next", "/")  # ←ここ
            return redirect(next_page)
        else:
            error = 'パスワードが間違っています'
    return render_template('login.html', error=error)

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    return redirect('/login')


@app.route('/profile')
def profile():
    if not session.get('logged_in'):
        return redirect(url_for('login', next="/profile"))
    return render_template("profile.html")

@app.route('/entry')
def entry():
    return render_template('entry.html')

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
            "question_img": "images/quiz_nakami/q1.png",   # 問題画像
            "label_img": "images/quiz_nakami/q101.png",  # 「第1問目」画像
            "choices": ["選択肢A", "選択肢B", "選択肢C", "選択肢D"],
            "answer": 0,
            "explanation": "これはテスト用の解説です。"
        }
    ]
    return render_template("quiz.html", questions=questions)

@app.route('/photo')  # URLは /photo に設定
def photo():
    if not session.get('logged_in'):
        return redirect(url_for('login', next="/photo"))
    return render_template('photo.html')

@app.route("/manual")
def manual():
    return render_template("manual.html")

@app.route("/event")
def event():
    return render_template("event.html")


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)