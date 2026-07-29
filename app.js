"use strict";

/* =====================================================
   HTML特殊文字の変換
===================================================== */

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =====================================================
   用語集
===================================================== */

function setupCategoryFilter() {
    const categoryFilter =
        document.getElementById(
            "categoryFilter"
        );

    const categories = [
        ...new Set(
            terms.map(term => term.category)
        )
    ].sort();

    categories.forEach(category => {
        const option =
            document.createElement(
                "option"
            );

        option.value =
            category;

        option.textContent =
            category;

        categoryFilter.appendChild(
            option
        );
    });
}


function renderTerms() {
    const termList =
        document.getElementById(
            "termList"
        );

    const searchText =
        document.getElementById(
            "termSearch"
        )
        .value
        .trim()
        .toLowerCase();

    const selectedCategory =
        document.getElementById(
            "categoryFilter"
        )
        .value;

    const selectedLevel =
        document.getElementById(
            "levelFilter"
        )
        .value;

    const filteredTerms =
        terms.filter(term => {
            const searchableText = (
                term.term +
                " " +
                term.category +
                " " +
                term.level +
                " " +
                term.meaning +
                " " +
                term.point +
                " " +
                term.trap
            ).toLowerCase();

            const matchesSearch =
                !searchText ||
                searchableText.includes(
                    searchText
                );

            const matchesCategory =
                !selectedCategory ||
                term.category ===
                    selectedCategory;

            const matchesLevel =
                !selectedLevel ||
                term.level ===
                    selectedLevel;

            return (
                matchesSearch &&
                matchesCategory &&
                matchesLevel
            );
        });

    if (
        filteredTerms.length === 0
    ) {
        termList.innerHTML = `
            <div class="empty-message">
                該当する用語がありません。
            </div>
        `;

        return;
    }

    termList.innerHTML =
        filteredTerms
        .map(term => {
            return `
                <article
                    class="term-card"
                    data-level="${escapeHtml(
                        term.level
                    )}">

                    <div class="term-head">
                        <h3>
                            ${escapeHtml(
                                term.term
                            )}
                        </h3>

                        <span
                            class="tag category">
                            ${escapeHtml(
                                term.category
                            )}
                        </span>

                        <span
                            class="tag level ${escapeHtml(
                                term.level
                            )}">
                            ${escapeHtml(
                                term.level
                            )}
                        </span>
                    </div>

                    <div class="term-body">
                        <p>
                            ${escapeHtml(
                                term.meaning
                            )}
                        </p>

                        <div class="point">
                            <strong>
                                要点：
                            </strong>

                            ${escapeHtml(
                                term.point
                            )}
                        </div>

                        <div class="trap">
                            <strong>
                                よくある間違い：
                            </strong>

                            ${escapeHtml(
                                term.trap
                            )}
                        </div>
                    </div>
                </article>
            `;
        })
        .join("");
}


/* =====================================================
   用語集イベント
===================================================== */

document
    .getElementById(
        "termSearch"
    )
    .addEventListener(
        "input",
        renderTerms
    );


document
    .getElementById(
        "categoryFilter"
    )
    .addEventListener(
        "change",
        renderTerms
    );


document
    .getElementById(
        "levelFilter"
    )
    .addEventListener(
        "change",
        renderTerms
    );


/* =====================================================
   問題数表示
===================================================== */

function displayQuestionCounts() {
    document.getElementById(
        "fillCount"
    ).textContent =
        fillQuizzes.length;

    document.getElementById(
        "selectionCount"
    ).textContent =
        selectionQuizzes.length;

    document.getElementById(
        "trueFalseCount"
    ).textContent =
        trueFalseQuizzes.length;

    document.getElementById(
        "codeCount"
    ).textContent =
        codeQuizzes.length;

    document.getElementById(
        "totalCount"
    ).textContent =
        mobileQuizzes.length;


    const quizMode =
        document.getElementById(
            "quizMode"
        );

    const allOption =
        quizMode.querySelector(
            'option[value="all"]'
        );

    const fillOption =
        quizMode.querySelector(
            'option[value="fill"]'
        );

    const selectionOption =
        quizMode.querySelector(
            'option[value="selection"]'
        );

    const trueFalseOption =
        quizMode.querySelector(
            'option[value="truefalse"]'
        );

    const codeOption =
        quizMode.querySelector(
            'option[value="code"]'
        );


    allOption.textContent =
        "全" +
        mobileQuizzes.length +
        "問";

    fillOption.textContent =
        "穴埋め" +
        fillQuizzes.length +
        "問";

    selectionOption.textContent =
        "選択問題" +
        selectionQuizzes.length +
        "問";

    trueFalseOption.textContent =
        "○×問題" +
        trueFalseQuizzes.length +
        "問";

    codeOption.textContent =
        "コード読解" +
        codeQuizzes.length +
        "問";
}


/* =====================================================
   学習記録
===================================================== */

const QUIZ_STORAGE_KEY =
    "serverJavaMobileQuizVersion170";


function createInitialQuizState() {
    return mobileQuizzes.map(
        () => {
            return {
                status:
                    "unanswered",

                userAnswer:
                    "",

                revealed:
                    false
            };
        }
    );
}


function loadQuizState() {
    try {
        const savedData =
            localStorage.getItem(
                QUIZ_STORAGE_KEY
            );

        if (!savedData) {
            return createInitialQuizState();
        }

        const parsedData =
            JSON.parse(
                savedData
            );

        if (
            !Array.isArray(
                parsedData
            ) ||
            parsedData.length !==
                mobileQuizzes.length
        ) {
            return createInitialQuizState();
        }

        return parsedData;

    } catch (error) {
        console.error(
            "学習記録の読み込みに失敗しました。",
            error
        );

        return createInitialQuizState();
    }
}


function saveQuizState() {
    try {
        localStorage.setItem(
            QUIZ_STORAGE_KEY,
            JSON.stringify(
                quizState
            )
        );

    } catch (error) {
        console.error(
            "学習記録の保存に失敗しました。",
            error
        );
    }
}


let quizState =
    loadQuizState();

let currentQuizIndex =
    0;

let currentFilteredIndexes =
    [];


/* =====================================================
   問題の絞り込み
===================================================== */

function updateFilteredIndexes() {
    const mode =
        document.getElementById(
            "quizMode"
        )
        .value;

    currentFilteredIndexes =
        mobileQuizzes
        .map(
            (quiz, index) => {
                return {
                    quiz,
                    index
                };
            }
        )
        .filter(item => {
            if (
                mode === "fill"
            ) {
                return (
                    item.quiz.type ===
                    "fill"
                );
            }

            if (
                mode ===
                "selection"
            ) {
                return (
                    item.quiz.type ===
                    "mc"
                );
            }

            if (
                mode ===
                "truefalse"
            ) {
                return (
                    item.quiz.type ===
                    "tf"
                );
            }

            if (
                mode === "code"
            ) {
                return (
                    item.quiz.type ===
                    "code"
                );
            }

            if (
                mode ===
                "unanswered"
            ) {
                return (
                    quizState[
                        item.index
                    ].status ===
                    "unanswered"
                );
            }

            if (
                mode ===
                "incorrect"
            ) {
                return (
                    quizState[
                        item.index
                    ].status ===
                    "incorrect"
                );
            }

            return true;
        })
        .map(
            item => item.index
        );


    if (
        currentFilteredIndexes.length ===
        0
    ) {
        currentQuizIndex =
            0;

        return;
    }


    if (
        currentQuizIndex >=
        currentFilteredIndexes.length
    ) {
        currentQuizIndex =
            currentFilteredIndexes.length -
            1;
    }
}


/* =====================================================
   問題形式変更
===================================================== */

function changeQuizMode() {
    currentQuizIndex =
        0;

    updateFilteredIndexes();

    renderSingleQuiz();

    renderQuizOverview();
}


/* =====================================================
   問題文の空欄表示
===================================================== */

function formatQuestion(
    question
) {
    return escapeHtml(
        question
    )
    .replace(
        "【　】",
        '<span class="blank-mark">　　　　</span>'
    );
}


/* =====================================================
   1問表示
===================================================== */

function renderSingleQuiz(
    refreshFilter = true
) {
    if (refreshFilter) {
        updateFilteredIndexes();
    }

    const singleQuizArea =
        document.getElementById(
            "singleQuizArea"
        );


    if (
        currentFilteredIndexes.length ===
        0
    ) {
        singleQuizArea.innerHTML = `
            <div class="empty-quiz-message">
                <h3>
                    該当する問題はありません
                </h3>

                <p>
                    すべて正解しているか、
                    まだ答え合わせをしていない可能性があります。
                </p>
            </div>
        `;

        updateQuizProgress();
        updateNavigationButtons();

        return;
    }


    const actualIndex =
        currentFilteredIndexes[
            currentQuizIndex
        ];

    const quiz =
        mobileQuizzes[
            actualIndex
        ];

    const state =
        quizState[
            actualIndex
        ];


    let answerInputArea =
        "";


    if (
        quiz.type ===
        "fill"
    ) {
        answerInputArea = `
            <input
                id="mobileAnswerInput"
                class="mobile-answer-input"
                type="text"
                value="${escapeHtml(
                    state.userAnswer ||
                    ""
                )}"
                placeholder="空欄に入る用語を入力"
                autocomplete="off"
                autocapitalize="off"
                spellcheck="false">
        `;

    } else {
        answerInputArea = `
            <div class="mobile-options">
                ${quiz.options
                    .map(
                        (
                            option,
                            optionIndex
                        ) => {
                            const checked =
                                String(
                                    state.userAnswer
                                ) ===
                                String(
                                    optionIndex
                                )
                                    ? "checked"
                                    : "";

                            return `
                                <label
                                    class="mobile-option">

                                    <input
                                        type="radio"
                                        name="mobileQuizOption"
                                        value="${optionIndex}"
                                        ${checked}>

                                    <span>
                                        ${escapeHtml(
                                            option
                                        )}
                                    </span>
                                </label>
                            `;
                        }
                    )
                    .join("")}
            </div>
        `;
    }


    const codeArea =
        quiz.code
            ? `
                <pre class="quiz-code">${escapeHtml(
                    quiz.code
                )}</pre>
            `
            : "";


    let resultClass =
        "";

    if (
        state.status ===
        "correct"
    ) {
        resultClass =
            "is-correct";
    }

    if (
        state.status ===
        "incorrect"
    ) {
        resultClass =
            "is-incorrect";
    }


    singleQuizArea.innerHTML = `
        <article
            class="single-quiz-card ${resultClass}">

            <div class="single-quiz-head">
                <span
                    class="single-quiz-number">
                    Q${actualIndex + 1}
                </span>

                <span
                    class="single-quiz-type">
                    ${escapeHtml(
                        quiz.label
                    )}
                </span>

                <span
                    class="single-quiz-category">
                    ${escapeHtml(
                        quiz.category
                    )}
                </span>
            </div>

            <div class="single-question">
                ${formatQuestion(
                    quiz.q
                )}
            </div>

            ${codeArea}

            ${answerInputArea}

            <button
                id="checkCurrentButton"
                class="mobile-btn check-one-btn"
                type="button">
                この問題を答え合わせ
            </button>

            ${
                state.revealed
                    ? createAnswerBox(
                        quiz,
                        state
                    )
                    : ""
            }
        </article>
    `;


    const checkButton =
        document.getElementById(
            "checkCurrentButton"
        );

    checkButton.addEventListener(
        "click",
        checkCurrentQuestion
    );


    const answerInput =
        document.getElementById(
            "mobileAnswerInput"
        );

    if (answerInput) {
        answerInput.addEventListener(
            "keydown",
            event => {
                if (
                    event.key ===
                    "Enter"
                ) {
                    event.preventDefault();

                    checkCurrentQuestion();
                }
            }
        );
    }


    updateQuizProgress();

    updateNavigationButtons();

    renderQuizOverview();
}


/* =====================================================
   答え・解説表示
===================================================== */

function createAnswerBox(
    quiz,
    state
) {
    const isCorrect =
        state.status ===
        "correct";

    return `
        <div
            class="one-answer-box ${
                isCorrect
                    ? ""
                    : "wrong"
            }">

            <h4>
                ${
                    isCorrect
                        ? "正解です！"
                        : "確認しましょう"
                }
            </h4>

            <div>
                あなたの回答：

                <strong>
                    ${escapeHtml(
                        getUserAnswerText(
                            quiz,
                            state
                        )
                    )}
                </strong>
            </div>

            <div
                class="correct-answer-text">
                正解：
                ${escapeHtml(
                    quiz.displayAnswer
                )}
            </div>

            <div
                class="answer-explanation">
                <strong>
                    解説：
                </strong>

                ${escapeHtml(
                    quiz.explanation
                )}
            </div>
        </div>
    `;
}


function getUserAnswerText(
    quiz,
    state
) {
    if (
        state.userAnswer === "" ||
        state.userAnswer === null ||
        state.userAnswer === undefined
    ) {
        return "未入力";
    }

    if (
        quiz.type ===
        "fill"
    ) {
        return state.userAnswer;
    }

    return (
        quiz.options[
            Number(
                state.userAnswer
            )
        ] ||
        "未選択"
    );
}


/* =====================================================
   回答の表記統一
===================================================== */

function normalizeAnswer(
    value
) {
    return String(
        value
    )
    .normalize(
        "NFKC"
    )
    .toLowerCase()
    .replace(
        /\s+/g,
        ""
    )
    .replace(
        /[()（）]/g,
        ""
    )
    .replace(
        /[<>]/g,
        ""
    )
    .replace(
        /^@/,
        ""
    )
    .replace(
        /;$/g,
        ""
    );
}


/* =====================================================
   1問ずつ答え合わせ
===================================================== */

function checkCurrentQuestion() {
    if (
        currentFilteredIndexes.length ===
        0
    ) {
        return;
    }


    const actualIndex =
        currentFilteredIndexes[
            currentQuizIndex
        ];

    const quiz =
        mobileQuizzes[
            actualIndex
        ];

    const state =
        quizState[
            actualIndex
        ];


    if (
        quiz.type ===
        "fill"
    ) {
        const input =
            document.getElementById(
                "mobileAnswerInput"
            );

        const userAnswer =
            input
                ? input.value.trim()
                : "";


        if (!userAnswer) {
            alert(
                "空欄に答えを入力してください。"
            );

            return;
        }


        state.userAnswer =
            userAnswer;


        const normalizedUserAnswer =
            normalizeAnswer(
                userAnswer
            );


        const isCorrect =
            quiz.answers.some(
                answer =>
                    normalizeAnswer(
                        answer
                    ) ===
                    normalizedUserAnswer
            );


        state.status =
            isCorrect
                ? "correct"
                : "incorrect";

        state.revealed =
            true;

    } else {
        const selectedOption =
            document.querySelector(
                'input[name="mobileQuizOption"]:checked'
            );


        if (!selectedOption) {
            alert(
                "選択肢を1つ選んでください。"
            );

            return;
        }


        state.userAnswer =
            selectedOption.value;


        state.status =
            Number(
                selectedOption.value
            ) ===
            quiz.answer
                ? "correct"
                : "incorrect";


        state.revealed =
            true;
    }


    saveQuizState();

    /*
    間違えた問題だけを表示しているときでも、
    答え合わせ直後に正解と解説を確認できるように、
    この時点では絞り込みを更新しない。
    */
    renderSingleQuiz(
        false
    );


    window.setTimeout(
        () => {
            const answerBox =
                document.querySelector(
                    ".one-answer-box"
                );

            if (answerBox) {
                answerBox.scrollIntoView(
                    {
                        behavior:
                            "smooth",

                        block:
                            "nearest"
                    }
                );
            }
        },
        80
    );
}


/* =====================================================
   前後の問題へ移動
===================================================== */

function previousQuestion() {
    updateFilteredIndexes();

    if (
        currentQuizIndex >
        0
    ) {
        currentQuizIndex--;

        renderSingleQuiz(
            false
        );

        scrollToQuizTop();
    }
}


function nextQuestion() {
    const oldActualIndex =
        currentFilteredIndexes[
            currentQuizIndex
        ];

    updateFilteredIndexes();


    if (
        currentFilteredIndexes.length ===
        0
    ) {
        renderSingleQuiz(
            false
        );

        return;
    }


    const newPositionOfOldQuestion =
        currentFilteredIndexes.indexOf(
            oldActualIndex
        );


    if (
        newPositionOfOldQuestion !==
        -1
    ) {
        currentQuizIndex =
            newPositionOfOldQuestion;
    }


    if (
        currentQuizIndex <
        currentFilteredIndexes.length -
        1
    ) {
        currentQuizIndex++;
    }


    renderSingleQuiz(
        false
    );

    scrollToQuizTop();
}


function jumpToQuestion(
    actualIndex
) {
    updateFilteredIndexes();


    const newPosition =
        currentFilteredIndexes.indexOf(
            actualIndex
        );


    if (
        newPosition ===
        -1
    ) {
        return;
    }


    currentQuizIndex =
        newPosition;


    renderSingleQuiz(
        false
    );

    scrollToQuizTop();
}


function scrollToQuizTop() {
    const toolbar =
        document.querySelector(
            ".mobile-quiz-toolbar"
        );

    if (toolbar) {
        toolbar.scrollIntoView(
            {
                behavior:
                    "smooth",

                block:
                    "start"
            }
        );
    }
}


/* =====================================================
   前へ・次へボタンの状態
===================================================== */

function updateNavigationButtons() {
    const previousButton =
        document.getElementById(
            "previousButton"
        );

    const nextButton =
        document.getElementById(
            "nextButton"
        );


    if (
        currentFilteredIndexes.length ===
        0
    ) {
        previousButton.disabled =
            true;

        nextButton.disabled =
            true;

        return;
    }


    previousButton.disabled =
        currentQuizIndex <=
        0;


    nextButton.disabled =
        currentQuizIndex >=
        currentFilteredIndexes.length -
        1;
}


/* =====================================================
   進捗表示
===================================================== */

function updateQuizProgress() {
    const total =
        mobileQuizzes.length;


    const answered =
        quizState.filter(
            state =>
                state.status !==
                "unanswered"
        ).length;


    const correct =
        quizState.filter(
            state =>
                state.status ===
                "correct"
        ).length;


    const incorrect =
        quizState.filter(
            state =>
                state.status ===
                "incorrect"
        ).length;


    const progress =
        total === 0
            ? 0
            : Math.round(
                answered /
                total *
                100
            );


    const currentQuestionText =
        document.getElementById(
            "currentQuestionText"
        );

    const quizScoreText =
        document.getElementById(
            "quizScoreText"
        );

    const quizProgressBar =
        document.getElementById(
            "quizProgressBar"
        );


    if (
        currentFilteredIndexes.length ===
        0
    ) {
        currentQuestionText.textContent =
            "対象問題なし";

    } else {
        currentQuestionText.textContent =
            "問題 " +
            (
                currentQuizIndex +
                1
            ) +
            " / " +
            currentFilteredIndexes.length;
    }


    quizScoreText.textContent =
        "正解 " +
        correct +
        "問・間違い " +
        incorrect +
        "問・回答 " +
        answered +
        "/" +
        total;


    quizProgressBar.style.width =
        progress +
        "%";
}


/* =====================================================
   問題一覧
===================================================== */

function toggleQuizOverview() {
    const quizOverview =
        document.getElementById(
            "quizOverview"
        );

    const overviewButton =
        document.getElementById(
            "overviewButton"
        );


    quizOverview.classList.toggle(
        "hidden"
    );


    if (
        quizOverview.classList.contains(
            "hidden"
        )
    ) {
        overviewButton.textContent =
            "問題一覧を表示";

    } else {
        overviewButton.textContent =
            "問題一覧を閉じる";

        renderQuizOverview();


        quizOverview.scrollIntoView(
            {
                behavior:
                    "smooth",

                block:
                    "nearest"
            }
        );
    }
}


function renderQuizOverview() {
    const quizOverview =
        document.getElementById(
            "quizOverview"
        );


    if (
        quizOverview.classList.contains(
            "hidden"
        )
    ) {
        return;
    }


    if (
        currentFilteredIndexes.length ===
        0
    ) {
        quizOverview.innerHTML = `
            <div>
                該当する問題はありません。
            </div>
        `;

        return;
    }


    const currentActualIndex =
        currentFilteredIndexes[
            currentQuizIndex
        ];


    quizOverview.innerHTML =
        currentFilteredIndexes
        .map(
            actualIndex => {
                const state =
                    quizState[
                        actualIndex
                    ];


                let statusClass =
                    "";

                if (
                    state.status ===
                    "correct"
                ) {
                    statusClass =
                        "correct";
                }

                if (
                    state.status ===
                    "incorrect"
                ) {
                    statusClass =
                        "incorrect";
                }


                const currentClass =
                    actualIndex ===
                    currentActualIndex
                        ? "current"
                        : "";


                return `
                    <button
                        class="overview-button ${statusClass} ${currentClass}"
                        type="button"
                        data-question-index="${actualIndex}">
                        Q${actualIndex + 1}
                    </button>
                `;
            }
        )
        .join("");


    quizOverview
        .querySelectorAll(
            ".overview-button"
        )
        .forEach(button => {
            button.addEventListener(
                "click",
                () => {
                    jumpToQuestion(
                        Number(
                            button.dataset
                            .questionIndex
                        )
                    );
                }
            );
        });
}


/* =====================================================
   学習記録リセット
===================================================== */

function resetMobileQuiz() {
    const confirmed =
        window.confirm(
            "全170問の回答・正解記録をリセットしますか？"
        );


    if (!confirmed) {
        return;
    }


    quizState =
        createInitialQuizState();


    currentQuizIndex =
        0;


    localStorage.removeItem(
        QUIZ_STORAGE_KEY
    );


    document.getElementById(
        "quizMode"
    ).value =
        "all";


    updateFilteredIndexes();

    renderSingleQuiz();
}


/* =====================================================
   クイズ操作イベント
===================================================== */

document
    .getElementById(
        "quizMode"
    )
    .addEventListener(
        "change",
        changeQuizMode
    );


document
    .getElementById(
        "previousButton"
    )
    .addEventListener(
        "click",
        previousQuestion
    );


document
    .getElementById(
        "nextButton"
    )
    .addEventListener(
        "click",
        nextQuestion
    );


document
    .getElementById(
        "overviewButton"
    )
    .addEventListener(
        "click",
        toggleQuizOverview
    );


document
    .getElementById(
        "resetButton"
    )
    .addEventListener(
        "click",
        resetMobileQuiz
    );


/* =====================================================
   ページ内ナビゲーション

   スマートフォンでリンクを押したとき、
   対象セクションへスクロールする。
===================================================== */

document
    .querySelectorAll(
        ".nav-inner a"
    )
    .forEach(link => {
        link.addEventListener(
            "click",
            event => {
                const targetId =
                    link.getAttribute(
                        "href"
                    );

                if (
                    !targetId ||
                    !targetId.startsWith(
                        "#"
                    )
                ) {
                    return;
                }


                const targetElement =
                    document.querySelector(
                        targetId
                    );


                if (!targetElement) {
                    return;
                }


                event.preventDefault();


                targetElement.scrollIntoView(
                    {
                        behavior:
                            "smooth",

                        block:
                            "start"
                    }
                );
            }
        );
    });


/* =====================================================
   初期表示
===================================================== */

setupCategoryFilter();

renderTerms();

displayQuestionCounts();

updateFilteredIndexes();

renderSingleQuiz();


/* =====================================================
   最終確認
===================================================== */

console.log(
    "用語集：" +
    terms.length +
    "語"
);

console.log(
    "穴埋め：" +
    fillQuizzes.length +
    "問"
);

console.log(
    "選択問題：" +
    selectionQuizzes.length +
    "問"
);

console.log(
    "○×問題：" +
    trueFalseQuizzes.length +
    "問"
);

console.log(
    "コード読解：" +
    codeQuizzes.length +
    "問"
);

console.log(
    "全問題：" +
    mobileQuizzes.length +
    "問"
);
