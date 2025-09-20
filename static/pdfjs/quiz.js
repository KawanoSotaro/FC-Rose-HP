// static/js/quiz.js
document.addEventListener("DOMContentLoaded", () => {
  // --- 全12問の問題データ ---
  const questions = [
    { id:"q1", question_img:"quiz_nakami/q1.png",
      choices:[ {img:"quiz_nakami/25.png"}, {img:"quiz_nakami/26.png"}, {img:"quiz_nakami/27.png"}, {img:"quiz_nakami/28.png"} ],
      answer:0
    },
    { id:"q2", question_img:"quiz_nakami/q2.png",
      choices:[ {text:"サークルでの飲み会禁止"}, {text:"兼サー禁止"}, {text:"喫煙禁止"}, {text:"タメ語禁止"} ],
      answer:0
    },
    { id:"q3", question_img:"quiz_nakami/q3.png",
      choices:[ {text:"inゼリー"}, {text:"モンスターエナジー"}, {text:"フットサルボール"}, {text:"ビブス"} ],
      answer:1
    },
    { id:"q4", question_img:"quiz_nakami/q4.png",
      choices:[ {text:"2026年12月"}, {text:"2026年6月"}, {text:"2025年12月"}, {text:"2027年6月"} ],
      answer:1
    },
    { id:"q5", question_img:"quiz_nakami/q5.png",
      choices:[ {text:"FC.ロサ"}, {text:"FC.ミンゴ"}, {text:"FC.ミント"}, {text:"FC.ロゼ・バナーナ"} ],
      answer:2
    },
    { id:"q6", question_img:"quiz_nakami/q6.png",
      choices:[ {text:"PK大会"}, {text:"パン食い競争"}, {text:"肝試し"}, {text:"スキー合宿"} ],
      answer:3
    },
    { id:"q7", question_img:"quiz_nakami/q7.png",
      choices:[ {img:"quiz_nakami/30.png"}, {img:"quiz_nakami/31.png"}, {img:"quiz_nakami/32.png"}, {img:"quiz_nakami/29.png"} ],
      answer:3
    },
    { id:"q8", question_img:"quiz_nakami/q8.png",
      choices:[ {text:"１０人"}, {text:"６人"}, {text:"２５人"}, {text:"６０人"} ],
      answer:0
    },
    { id:"q9", question_img:"quiz_nakami/q9.png",
      choices:[ {text:"４４０人"}, {text:"５６０人"}, {text:"６４０人"}, {text:"７１０人"} ],
      answer:2
    },
    { id:"q10", question_img:"quiz_nakami/q10.png",
      choices:[ {text:"２４回"}, {text:"１７回"}, {text:"９回"}, {text:"２１回"} ],
      answer:0
    },
    { id:"q11", question_img:"quiz_nakami/q11.png",
      choices:[ {text:"アップルパイ"}, {text:"ガトーショコラ"}, {text:"シュークリーム"}, {text:"おはぎ"} ],
      answer:1
    },
    { id:"q12", question_img:"quiz_nakami/q12.png",
      choices:[ {img:"quiz_nakami/33.png"}, {img:"quiz_nakami/34.png"}, {img:"quiz_nakami/35.png"}, {img:"quiz_nakami/36.png"} ],
      answer:0
    }
  ];

  // --- 要素参照 ---
  const labelArea = document.getElementById("label-area");
  const questionArea = document.getElementById("question-area");
  const choicesArea = document.getElementById("choices-area");
  const overlay = document.getElementById("overlay");
  const resultImg = document.getElementById("result-img");
  const nextBtn = document.getElementById("next-btn");
  const confettiContainer = document.getElementById("confetti-container");

  let currentIndex = 0;
  let score = 0;

  // --- 配列をシャッフル ---
  function shuffleArray(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // --- 12問からランダムに5問を抽出 ---
  function getRandomQuizSet(num) {
    const pool = questions.slice();
    const quizSet = [];
    while (quizSet.length < num && pool.length > 0) {
      const idx = Math.floor(Math.random() * pool.length);
      quizSet.push(pool.splice(idx, 1)[0]);
    }
    return quizSet;
  }

  const quizSet = getRandomQuizSet(5);

  // --- 問題表示 ---
  function showQuestion() {
    const q = quizSet[currentIndex];

    // ラベル画像
    const labelImgNum = currentIndex + 101;
    labelArea.innerHTML = `<img src="/static/images/quiz_nakami/q${labelImgNum}.png" alt="第${currentIndex+1}問目"
      onerror="this.src='/static/images/quiz_nakami/default.png'">`;

    // 問題画像
    questionArea.innerHTML = `<img src="/static/images/${q.question_img}" alt="問題"
      onerror="this.src='/static/images/quiz_nakami/default.png'">`;

    // 選択肢シャッフル
    q.shuffledChoices = shuffleArray(q.choices.map((c,i)=>({...c, originalIndex:i})));

    choicesArea.innerHTML = "";
    q.shuffledChoices.forEach((choice, i) => {
      const btn = document.createElement("button");
      btn.className = "choice-btn";

      if(choice.img){
        btn.classList.add("img-choice"); // 画像用クラス追加
        const img = document.createElement("img");
        img.src = `/static/images/${choice.img}`;
        img.alt = choice.text || `選択肢${i+1}`;
        btn.appendChild(img);
    }
      if(choice.text){
        const span = document.createElement("span");
        span.textContent = choice.text;
        btn.appendChild(span);
      }

      btn.addEventListener("click", () => handleChoice(i));
      choicesArea.appendChild(btn);
    });

    overlay.classList.add("hidden");
    nextBtn.style.display = "none";
  }

  // --- 選択肢クリック処理 ---
  function handleChoice(index) {
    const q = quizSet[currentIndex];
    const correct = q.shuffledChoices[index].originalIndex === q.answer;

    if(correct) {
      score += 20;
      launchConfetti(); // 正解時のみ
      resultImg.src = `/static/images/quiz_nakami/seikai${q.id.replace("q","")}.png`;
    } else {
      resultImg.src = `/static/images/quiz_nakami/huseikai${q.id.replace("q","")}.png`;
    }

    overlay.classList.remove("hidden");
    nextBtn.style.display = "inline-block";
  }

  // --- 次の問題 ---
  nextBtn.addEventListener("click", () => {
    overlay.classList.add("hidden");
    currentIndex++;
    if(currentIndex < quizSet.length){
      showQuestion();
    } else {
      // クイズ終了
      labelArea.innerHTML = "";
      questionArea.innerHTML = "";
      choicesArea.innerHTML = "";
      overlay.classList.add("hidden");
      nextBtn.style.display = "none";

      const resultBox = document.createElement("div");
      resultBox.style.textAlign = "center"; 
      resultBox.style.marginTop = "20px";

      // スコア画像を表示（横いっぱい）
        const scoreImg = document.createElement("img");
        scoreImg.src = `/static/images/quiz_nakami/${score}ten.png`;
        scoreImg.style.width = "100%";
        scoreImg.style.height = "auto";
        resultBox.appendChild(scoreImg);

        // ボタンコンテナ（横並び）
        const btnContainer = document.createElement("div");
        btnContainer.className = "result-buttons"; 

        // ホームへ戻る（左側）
        const homeLink = document.createElement("a");
        homeLink.href = "/";  // FlaskのホームURLに合わせる
        const homeImg = document.createElement("img");
        homeImg.src = "/static/images/quiz_nakami/q_gohome.png";
        homeImg.style.cursor = "pointer";
        homeImg.style.width = "150px";
        homeImg.style.height = "auto";
        homeLink.appendChild(homeImg);

        // もう一度チャレンジ（右側）
        const retryLink = document.createElement("a");
        retryLink.href = "/quiz_home";  // Flaskのクイズホーム画面
        const retryImg = document.createElement("img");
        retryImg.src = "/static/images/quiz_nakami/q_retry.png";
        retryImg.style.cursor = "pointer";
        retryImg.style.width = "150px";
        retryImg.style.height = "auto";
        retryLink.appendChild(retryImg);

        btnContainer.appendChild(homeLink);
        btnContainer.appendChild(retryLink);

        resultBox.appendChild(btnContainer);
        document.querySelector(".quiz-container").appendChild(resultBox);
    }
    });


  /*花吹雪 */
function launchConfetti() {
  const container = document.getElementById("confetti-container");
  const confettis = [];

  for (let i = 0; i < 250; i++) {
    const el = document.createElement("div");
    el.className = "confetti";

    const size = 5 + Math.random() * 10;
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.backgroundColor = `hsl(${Math.random()*360}, 80%, 70%)`;
    el.style.position = "absolute";
    el.style.left = "0px";
    el.style.top = "0px";
    el.style.opacity = 1;

    container.appendChild(el);

    const fromLeft = Math.random() < 0.5;

    confettis.push({
      el: el,
      x: fromLeft ? -200 - Math.random()*400 : window.innerWidth + Math.random()*400,
      y: window.innerHeight + Math.random()*100,
      vx: fromLeft ? Math.random()*12 + 10 : -(Math.random()*12 + 10),
      vy: -(Math.random()*10 + 10),
      gravity: 0.18 + Math.random() * 0.15,
      friction: 0.98, // 横減速係数
      opacity: 1
    });
  }

  function animate() {
    let active = false;

    confettis.forEach(c => {
      if (!c) return;

      // 上昇・落下
      c.vy += c.gravity;
      c.x += c.vx;
      c.y += c.vy;

      // 横速度を減速
      c.vx *= c.friction;

      // 徐々に消える
      c.opacity -= 0.01; // 消えるスピード調整
      if (c.opacity < 0) c.opacity = 0;

      c.el.style.transform = `translate(${c.x}px, ${c.y}px) rotate(${c.vy*10}deg)`;
      c.el.style.opacity = c.opacity;

      // 透明度が残っている限りアニメーションを続ける
      if (c.opacity > 0) active = true;
    });

    if (active) requestAnimationFrame(animate);
  }

  animate();
}

  // --- 初期表示 ---
  showQuestion();
});