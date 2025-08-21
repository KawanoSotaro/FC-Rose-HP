from flask import Flask, render_template, request, redirect, session, url_for

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # sessionを使うなら絶対必要！

PASSWORD = '9981'  # ここに設定したいパスワードを記入

@app.route('/')
def index():
    if not session.get('logged_in'):
        return redirect('/login')
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        if request.form['password'] == PASSWORD:
            session['logged_in'] = True
            return redirect('/')
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
        return redirect('/login')
    return render_template('profile.html')

@app.route('/entry')
def entry():
    if not session.get('logged_in'):
        return redirect('/login')
    return render_template('entry.html')

@app.route('/about')
def about():
    if not session.get('logged_in'):
        return redirect('/login')
    return render_template('about.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)