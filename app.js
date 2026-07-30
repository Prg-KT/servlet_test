"use strict";

/* =====================================================
   基本設定
===================================================== */

const STORAGE_KEY = "serverJavaMobileQuizVersion170";
const STORAGE_VERSION = 2;

const EXPECTED_QUESTION_COUNTS = {
    fill: 30,
    choice: 100,
    trueFalse: 30,
    code: 10,
    total: 170
};

const CATEGORY_LABELS = {
    session: "セッション管理",
    auth: "ログイン・認証・ログアウト",
    lifecycle: "ライフサイクル・リスナー",
    filter: "フィルタ",
    jsp: "アクションタグ・EL・JSTL",
    jdbc: "JDBC・DAO・DB操作"
};

const CATEGORY_ORDER = [
    "session",
    "auth",
    "lifecycle",
    "filter",
    "jsp",
    "jdbc"
];

const TYPE_LABELS = {
    fill: "穴埋め",
    choice: "選択問題",
    trueFalse: "○×問題",
    code: "コード読解"
};


/* =====================================================
   HTML特殊文字の変換
===================================================== */

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =====================================================
   DOM取得補助
===================================================== */

function getElement(...ids) {
    for (const id of ids) {
        const element = document.getElementById(id);

        if (element) {
            return element;
        }
    }

    return null;
}

function queryFirst(...selectors) {
    for (const selector of selectors) {
        const element = document.querySelector(selector);

        if (element) {
            return element;
        }
    }

    return null;
}


/* =====================================================
   問題データ取得
===================================================== */

function getAllQuizzes() {
    if (
        typeof mobileQuizzes !== "undefined" &&
        Array.isArray(mobileQuizzes)
    ) {
        return mobileQuizzes;
    }

    return [];
}

function getAllTerms() {
    if (
        typeof terms !== "undefined" &&
        Array.isArray(terms)
    ) {
        return terms;
    }

    return [];
}


/* =====================================================
   問題形式の正規化
===================================================== */

function normalizeQuizType(type) {
    const value = String(type ?? "").toLowerCase();

    if (
        value === "fill" ||
        value === "blank" ||
        value === "fillin" ||
        value === "fill-in"
    ) {
        return "fill";
    }

    if (
        value === "choice" ||
        value === "selection" ||
        value === "select" ||
        value === "multiplechoice" ||
        value === "multiple-choice"
    ) {
        return "choice";
    }

    if (
        value === "truefalse" ||
        value === "true-false" ||
        value === "tf" ||
        value === "boolean"
    ) {
        return "trueFalse";
    }

    if (
        value === "code" ||
        value === "codereading" ||
        value === "code-reading"
    ) {
        return "code";
    }

    return String(type ?? "");
}


/* =====================================================
   カテゴリの正規化
===================================================== */

function normalizeCategory(category) {
    const value = String(category ?? "").trim().toLowerCase();

    const aliases = {
        session: "session",
        "セッション": "session",
        "セッション管理": "session",

        auth: "auth",
        authentication: "auth",
        login: "auth",
        "認証": "auth",
        "ログイン": "auth",
        "ログイン・認証": "auth",
        "ログイン・認証・ログアウト": "auth",

        lifecycle: "lifecycle",
        listener: "lifecycle",
        "ライフサイクル": "lifecycle",
        "リスナー": "lifecycle",
        "ライフサイクル・リスナー": "lifecycle",

        filter: "filter",
        "フィルタ": "filter",
        "フィルター": "filter",

        jsp: "jsp",
        el: "jsp",
        jstl: "jsp",
        "jsp": "jsp",
        "el・jstl": "jsp",
        "アクションタグ・el・jstl": "jsp",

        jdbc: "jdbc",
        dao: "jdbc",
        database: "jdbc",
        "jdbc・dao": "jdbc",
        "jdbc・dao・db操作": "jdbc"
    };

    return aliases[value] ?? value;
}

function getCategoryLabel(category) {
    const normalized = normalizeCategory(category);
    return CATEGORY_LABELS[normalized] ?? String(category ?? "未分類");
}


/* =====================================================
   問題データ検証
===================================================== */

function validateQuestionData() {
    const quizzes = getAllQuizzes();

    if (quizzes.length === 0) {
        console.error(
            "問題データを取得できません。questions.jsを先に読み込んでください。"
        );

        return false;
    }

    const counts = {
        fill: 0,
        choice: 0,
        trueFalse: 0,
        code: 0
    };

    quizzes.forEach((quiz, index) => {
        const type = normalizeQuizType(quiz.type);

        if (Object.hasOwn(counts, type)) {
            counts[type] += 1;
        } else {
            console.warn(
                `問題${index + 1}のtypeが不明です。`,
                quiz.type
            );
        }

        if (!quiz.question && !quiz.text) {
            console.warn(
                `問題${index + 1}に問題文がありません。`
            );
        }
    });

    console.log("穴埋め問題:", counts.fill);
    console.log("選択問題:", counts.choice);
    console.log("○×問題:", counts.trueFalse);
    console.log("コード読解:", counts.code);
    console.log("全問題:", quizzes.length);

    if (counts.fill !== EXPECTED_QUESTION_COUNTS.fill) {
        console.warn(
            `穴埋め問題は${EXPECTED_QUESTION_COUNTS.fill}問必要です。現在: ${counts.fill}問`
        );
    }

    if (counts.choice !== EXPECTED_QUESTION_COUNTS.choice) {
        console.warn(
            `選択問題は${EXPECTED_QUESTION_COUNTS.choice}問必要です。現在: ${counts.choice}問`
        );
    }

    if (counts.trueFalse !== EXPECTED_QUESTION_COUNTS.trueFalse) {
        console.warn(
            `○×問題は${EXPECTED_QUESTION_COUNTS.trueFalse}問必要です。現在: ${counts.trueFalse}問`
        );
    }

    if (counts.code !== EXPECTED_QUESTION_COUNTS.code) {
        console.warn(
            `コード読解は${EXPECTED_QUESTION_COUNTS.code}問必要です。現在: ${counts.code}問`
        );
    }

    if (quizzes.length !== EXPECTED_QUESTION_COUNTS.total) {
        console.warn(
            `全問題は${EXPECTED_QUESTION_COUNTS.total}問必要です。現在: ${quizzes.length}問`
        );
    }

    return true;
}


/* =====================================================
   用語集
===================================================== */

let selectedTermCategory = "all";

function setupCategoryFilter() {
    const filterContainer = getElement(
        "categoryFilter",
        "termCategoryFilter",
        "glossaryCategoryFilter"
    );

    if (!filterContainer) {
        return;
    }

    filterContainer.addEventListener("click", event => {
        const button = event.target.closest(
            "[data-category], [data-term-category]"
        );

        if (!button) {
            return;
        }

        selectedTermCategory =
            button.dataset.termCategory ??
            button.dataset.category ??
            "all";

        filterContainer
            .querySelectorAll("[data-category], [data-term-category]")
            .forEach(item => {
                item.classList.toggle("active", item === button);
                item.setAttribute(
                    "aria-pressed",
                    item === button ? "true" : "false"
                );
            });

        renderTerms(selectedTermCategory);
    });

    const select = getElement(
        "termCategorySelect",
        "glossaryCategorySelect"
    );

    if (select) {
        select.addEventListener("change", () => {
            selectedTermCategory = select.value;
            renderTerms(selectedTermCategory);
        });
    }
}

function getLevelLabel(level) {
    const normalized = String(level ?? "").toLowerCase();

    if (
        normalized === "important" ||
        normalized === "最重要"
    ) {
        return "最重要";
    }

    if (
        normalized === "high" ||
        normalized === "重要"
    ) {
        return "重要";
    }

    return "基本";
}

function getLevelClass(level) {
    const normalized = String(level ?? "").toLowerCase();

    if (
        normalized === "important" ||
        normalized === "最重要"
    ) {
        return "important";
    }

    if (
        normalized === "high" ||
        normalized === "重要"
    ) {
        return "high";
    }

    return "normal";
}

function renderTerms(category = "all") {
    const termList = getElement(
        "termList",
        "glossaryList"
    );

    if (!termList) {
        return;
    }

    const allTerms = getAllTerms();

    if (allTerms.length === 0) {
        termList.innerHTML = `
            <div class="info-box">
                用語データを取得できませんでした。
            </div>
        `;

        return;
    }

    const normalizedCategory =
        category === "all"
            ? "all"
            : normalizeCategory(category);

    const filteredTerms = allTerms.filter(term => {
        if (normalizedCategory === "all") {
            return true;
        }

        return (
            normalizeCategory(term.category) === normalizedCategory ||
            String(term.category) === String(category)
        );
    });

    if (filteredTerms.length === 0) {
        termList.innerHTML = `
            <div class="info-box">
                このカテゴリに該当する用語はありません。
            </div>
        `;

        return;
    }

    termList.innerHTML = filteredTerms.map(term => {
        const levelClass = getLevelClass(term.level);
        const levelLabel = getLevelLabel(term.level);

        return `
            <article class="term-card">
                <div class="term-card-header">
                    <h3>${escapeHtml(term.term)}</h3>
                    <span class="term-level ${escapeHtml(levelClass)}">
                        ${escapeHtml(levelLabel)}
                    </span>
                </div>

                <p class="term-category">
                    ${escapeHtml(getCategoryLabel(term.category))}
                </p>

                <dl>
                    <div>
                        <dt>意味</dt>
                        <dd>${escapeHtml(term.meaning)}</dd>
                    </div>

                    ${
                        term.point
                            ? `
                                <div>
                                    <dt>ポイント</dt>
                                    <dd>${escapeHtml(term.point)}</dd>
                                </div>
                            `
                            : ""
                    }

                    ${
                        term.trap
                            ? `
                                <div>
                                    <dt>注意点</dt>
                                    <dd>${escapeHtml(term.trap)}</dd>
                                </div>
                            `
                            : ""
                    }
                </dl>
            </article>
        `;
    }).join("");
}


/* =====================================================
   問題数の表示
===================================================== */

function displayQuestionCounts() {
    const quizzes = getAllQuizzes();

    const counts = quizzes.reduce(
        (result, quiz) => {
            const type = normalizeQuizType(quiz.type);

            if (Object.hasOwn(result, type)) {
                result[type] += 1;
            }

            result.total += 1;

            return result;
        },
        {
            fill: 0,
            choice: 0,
            trueFalse: 0,
            code: 0,
            total: 0
        }
    );

    const fillCount = getElement("fillCount");
    const selectionCount = getElement(
        "selectionCount",
        "choiceCount"
    );
    const trueFalseCount = getElement("trueFalseCount");
    const codeCount = getElement("codeCount");
    const totalCount = getElement("totalCount");

    if (fillCount) {
        fillCount.textContent = String(counts.fill);
    }

    if (selectionCount) {
        selectionCount.textContent = String(counts.choice);
    }

    if (trueFalseCount) {
        trueFalseCount.textContent = String(counts.trueFalse);
    }

    if (codeCount) {
        codeCount.textContent = String(counts.code);
    }

    if (totalCount) {
        totalCount.textContent = String(counts.total);
    }
}


/* =====================================================
   学習状態
===================================================== */

function createInitialQuestionState() {
    return {
        status: "unanswered",
        userAnswer: "",
        revealed: false
    };
}

function createInitialQuizState() {
    const quizzes = getAllQuizzes();

    return {
        version: STORAGE_VERSION,
        currentQuestionIndex: 0,
        filters: {
            type: "all",
            category: "all",
            status: "all"
        },
        overviewVisible: false,
        questionStates: quizzes.map(() => createInitialQuestionState())
    };
}

function normalizeQuestionState(value) {
    const statusValues = [
        "unanswered",
        "correct",
        "incorrect"
    ];

    const status = statusValues.includes(value?.status)
        ? value.status
        : "unanswered";

    return {
        status,
        userAnswer:
            typeof value?.userAnswer === "string" ||
            typeof value?.userAnswer === "number" ||
            typeof value?.userAnswer === "boolean"
                ? String(value.userAnswer)
                : "",
        revealed:
            typeof value?.revealed === "boolean"
                ? value.revealed
                : status !== "unanswered"
    };
}

function loadQuizState() {
    const initialState = createInitialQuizState();

    try {
        const savedText = localStorage.getItem(STORAGE_KEY);

        if (!savedText) {
            return initialState;
        }

        const saved = JSON.parse(savedText);

        const savedQuestionStates =
            saved.questionStates ??
            saved.quizStates ??
            saved.answers ??
            saved.progress;

        if (
            !Array.isArray(savedQuestionStates) ||
            savedQuestionStates.length !== initialState.questionStates.length
        ) {
            console.warn(
                "保存データと問題数が一致しないため、学習状態を初期化しました。"
            );

            return initialState;
        }

        const loadedState = {
            version: STORAGE_VERSION,
            currentQuestionIndex:
                Number.isInteger(saved.currentQuestionIndex)
                    ? saved.currentQuestionIndex
                    : Number.isInteger(saved.currentQuizIndex)
                        ? saved.currentQuizIndex
                        : 0,
            filters: {
                type:
                    typeof saved.filters?.type === "string"
                        ? saved.filters.type
                        : typeof saved.quizMode === "string"
                            ? convertLegacyModeToType(saved.quizMode)
                            : "all",
                category:
                    typeof saved.filters?.category === "string"
                        ? saved.filters.category
                        : "all",
                status:
                    typeof saved.filters?.status === "string"
                        ? saved.filters.status
                        : convertLegacyModeToStatus(saved.quizMode)
            },
            overviewVisible:
                typeof saved.overviewVisible === "boolean"
                    ? saved.overviewVisible
                    : false,
            questionStates: savedQuestionStates.map(
                normalizeQuestionState
            )
        };

        const maxIndex = Math.max(
            0,
            initialState.questionStates.length - 1
        );

        loadedState.currentQuestionIndex = Math.min(
            Math.max(loadedState.currentQuestionIndex, 0),
            maxIndex
        );

        return loadedState;
    } catch (error) {
        console.warn(
            "保存データの読み込みに失敗しました。",
            error
        );

        return initialState;
    }
}

function convertLegacyModeToType(mode) {
    const normalized = normalizeQuizType(mode);

    if (Object.hasOwn(TYPE_LABELS, normalized)) {
        return normalized;
    }

    return "all";
}

function convertLegacyModeToStatus(mode) {
    if (mode === "unanswered") {
        return "unanswered";
    }

    if (
        mode === "incorrect" ||
        mode === "wrong"
    ) {
        return "incorrect";
    }

    return "all";
}

function saveQuizState() {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(quizState)
        );
    } catch (error) {
        console.warn(
            "学習状態を保存できませんでした。",
            error
        );
    }
}


/* =====================================================
   クイズの絞り込み
===================================================== */

let quizState = createInitialQuizState();
let filteredQuizIndexes = [];
let displayedQuestionIndex = 0;

function questionMatchesFilters(quiz, state) {
    const quizType = normalizeQuizType(quiz.type);
    const quizCategory = normalizeCategory(quiz.category);

    const typeMatches =
        quizState.filters.type === "all" ||
        quizType === normalizeQuizType(quizState.filters.type);

    const categoryMatches =
        quizState.filters.category === "all" ||
        quizCategory === normalizeCategory(
            quizState.filters.category
        );

    const statusMatches =
        quizState.filters.status === "all" ||
        state.status === quizState.filters.status;

    return typeMatches && categoryMatches && statusMatches;
}

function updateFilteredIndexes(options = {}) {
    const {
        preferredQuestionIndex = null,
        direction = 0
    } = options;

    const quizzes = getAllQuizzes();

    filteredQuizIndexes = quizzes
        .map((quiz, index) => ({
            quiz,
            index,
            state: quizState.questionStates[index]
        }))
        .filter(item => questionMatchesFilters(item.quiz, item.state))
        .map(item => item.index);

    if (filteredQuizIndexes.length === 0) {
        displayedQuestionIndex = -1;
        return;
    }

    if (
        preferredQuestionIndex !== null &&
        filteredQuizIndexes.includes(preferredQuestionIndex)
    ) {
        displayedQuestionIndex =
            filteredQuizIndexes.indexOf(preferredQuestionIndex);

        return;
    }

    if (preferredQuestionIndex !== null && direction > 0) {
        const nextPosition = filteredQuizIndexes.findIndex(
            index => index > preferredQuestionIndex
        );

        displayedQuestionIndex =
            nextPosition >= 0
                ? nextPosition
                : filteredQuizIndexes.length - 1;

        return;
    }

    if (preferredQuestionIndex !== null && direction < 0) {
        let previousPosition = -1;

        filteredQuizIndexes.forEach((index, position) => {
            if (index < preferredQuestionIndex) {
                previousPosition = position;
            }
        });

        displayedQuestionIndex =
            previousPosition >= 0
                ? previousPosition
                : 0;

        return;
    }

    const savedPosition = filteredQuizIndexes.indexOf(
        quizState.currentQuestionIndex
    );

    displayedQuestionIndex =
        savedPosition >= 0 ? savedPosition : 0;

    quizState.currentQuestionIndex =
        filteredQuizIndexes[displayedQuestionIndex];
}


/* =====================================================
   フィルター変更
===================================================== */

function changeQuizMode(mode) {
    const currentQuestionIndex = getCurrentQuestionIndex();

    if (mode === "all") {
        quizState.filters.type = "all";
        quizState.filters.status = "all";
    } else if (mode === "unanswered") {
        quizState.filters.status = "unanswered";
    } else if (
        mode === "incorrect" ||
        mode === "wrong"
    ) {
        quizState.filters.status = "incorrect";
    } else {
        const normalizedType = normalizeQuizType(mode);

        if (Object.hasOwn(TYPE_LABELS, normalizedType)) {
            quizState.filters.type = normalizedType;
        }
    }

    updateFilteredIndexes({
        preferredQuestionIndex: currentQuestionIndex
    });

    saveQuizState();
    synchronizeFilterControls();
    renderQuiz();
}

function changeQuizType(type) {
    const currentQuestionIndex = getCurrentQuestionIndex();

    quizState.filters.type =
        type === "all"
            ? "all"
            : normalizeQuizType(type);

    updateFilteredIndexes({
        preferredQuestionIndex: currentQuestionIndex
    });

    saveQuizState();
    synchronizeFilterControls();
    renderQuiz();
}

function changeQuizCategory(category) {
    const currentQuestionIndex = getCurrentQuestionIndex();

    quizState.filters.category =
        category === "all"
            ? "all"
            : normalizeCategory(category);

    updateFilteredIndexes({
        preferredQuestionIndex: currentQuestionIndex
    });

    saveQuizState();
    synchronizeFilterControls();
    renderQuiz();
}

function changeQuizStatus(status) {
    const currentQuestionIndex = getCurrentQuestionIndex();

    if (
        status !== "all" &&
        status !== "unanswered" &&
        status !== "incorrect" &&
        status !== "correct"
    ) {
        status = "all";
    }

    quizState.filters.status = status;

    updateFilteredIndexes({
        preferredQuestionIndex: currentQuestionIndex
    });

    saveQuizState();
    synchronizeFilterControls();
    renderQuiz();
}

function synchronizeFilterControls() {
    const typeSelect = getElement(
        "quizTypeFilter",
        "quizTypeSelect"
    );

    const categorySelect = getElement(
        "quizCategoryFilter",
        "quizCategorySelect"
    );

    const statusSelect = getElement(
        "quizStatusFilter",
        "quizStatusSelect"
    );

    if (typeSelect) {
        typeSelect.value = quizState.filters.type;
    }

    if (categorySelect) {
        categorySelect.value = quizState.filters.category;
    }

    if (statusSelect) {
        statusSelect.value = quizState.filters.status;
    }

    document
        .querySelectorAll("[data-quiz-mode]")
        .forEach(button => {
            const mode = button.dataset.quizMode;

            let active = false;

            if (mode === "all") {
                active =
                    quizState.filters.type === "all" &&
                    quizState.filters.status === "all";
            } else if (
                mode === "unanswered" ||
                mode === "incorrect"
            ) {
                active = quizState.filters.status === mode;
            } else {
                active =
                    quizState.filters.type ===
                    normalizeQuizType(mode);
            }

            button.classList.toggle("active", active);
            button.setAttribute(
                "aria-pressed",
                active ? "true" : "false"
            );
        });

    document
        .querySelectorAll("[data-quiz-category]")
        .forEach(button => {
            const category = button.dataset.quizCategory;

            const active =
                category === "all"
                    ? quizState.filters.category === "all"
                    : normalizeCategory(category) ===
                        quizState.filters.category;

            button.classList.toggle("active", active);
            button.setAttribute(
                "aria-pressed",
                active ? "true" : "false"
            );
        });

    document
        .querySelectorAll("[data-quiz-status]")
        .forEach(button => {
            const active =
                button.dataset.quizStatus ===
                quizState.filters.status;

            button.classList.toggle("active", active);
            button.setAttribute(
                "aria-pressed",
                active ? "true" : "false"
            );
        });
}


/* =====================================================
   問題情報の取得
===================================================== */

function getQuestionText(quiz) {
    return (
        quiz.question ??
        quiz.text ??
        quiz.prompt ??
        ""
    );
}

function getQuestionOptions(quiz) {
    if (Array.isArray(quiz.options)) {
        return quiz.options;
    }

    if (Array.isArray(quiz.choices)) {
        return quiz.choices;
    }

    if (normalizeQuizType(quiz.type) === "trueFalse") {
        return ["○", "×"];
    }

    return [];
}

function getCorrectOptionIndex(quiz) {
    const candidates = [
        quiz.correctIndex,
        quiz.answerIndex,
        quiz.correct
    ];

    for (const candidate of candidates) {
        if (Number.isInteger(candidate)) {
            return candidate;
        }

        if (
            typeof candidate === "string" &&
            /^\d+$/.test(candidate)
        ) {
            const number = Number(candidate);

            if (
                number >= 0 &&
                number < getQuestionOptions(quiz).length
            ) {
                return number;
            }
        }
    }

    return -1;
}

function getCorrectAnswer(quiz) {
    const type = normalizeQuizType(quiz.type);
    const options = getQuestionOptions(quiz);
    const correctIndex = getCorrectOptionIndex(quiz);

    if (
        (type === "choice" ||
            type === "trueFalse" ||
            type === "code") &&
        correctIndex >= 0 &&
        correctIndex < options.length
    ) {
        return String(options[correctIndex]);
    }

    const answer =
        quiz.answer ??
        quiz.correctAnswer ??
        quiz.correct ??
        "";

    if (typeof answer === "boolean") {
        return answer ? "○" : "×";
    }

    if (
        type === "trueFalse" &&
        typeof answer === "string"
    ) {
        const normalized = answer.toLowerCase();

        if (
            normalized === "true" ||
            normalized === "o" ||
            normalized === "yes"
        ) {
            return "○";
        }

        if (
            normalized === "false" ||
            normalized === "x" ||
            normalized === "no"
        ) {
            return "×";
        }
    }

    return String(answer);
}

function getAnswerAliases(quiz) {
    const aliases =
        quiz.aliases ??
        quiz.answerAliases ??
        quiz.acceptedAnswers ??
        [];

    return Array.isArray(aliases)
        ? aliases.map(String)
        : [];
}

function getExplanation(quiz) {
    return (
        quiz.explanation ??
        quiz.description ??
        quiz.point ??
        ""
    );
}


/* =====================================================
   回答の正規化・判定
===================================================== */

function normalizeAnswer(value) {
    return String(value ?? "")
        .normalize("NFKC")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[。．.]+$/g, "");
}

function isCorrectAnswer(quiz, userAnswer) {
    const correctAnswer = getCorrectAnswer(quiz);

    const acceptedAnswers = [
        correctAnswer,
        ...getAnswerAliases(quiz)
    ];

    const normalizedUserAnswer = normalizeAnswer(userAnswer);

    return acceptedAnswers.some(answer => {
        return normalizeAnswer(answer) === normalizedUserAnswer;
    });
}


/* =====================================================
   問題文の整形
===================================================== */

function formatQuestion(question) {
    return escapeHtml(question)
        .replaceAll("\n", "<br>")
        .replace(
            /_{3,}/g,
            '<span class="blank-mark">　　　</span>'
        )
        .replace(
            /（\s*）/g,
            '（<span class="blank-mark">　　　</span>）'
        );
}


/* =====================================================
   現在問題の取得
===================================================== */

function getCurrentQuestionIndex() {
    if (
        displayedQuestionIndex < 0 ||
        displayedQuestionIndex >= filteredQuizIndexes.length
    ) {
        return null;
    }

    return filteredQuizIndexes[displayedQuestionIndex];
}

function getCurrentQuiz() {
    const index = getCurrentQuestionIndex();

    if (index === null) {
        return null;
    }

    return getAllQuizzes()[index] ?? null;
}

function getCurrentQuestionState() {
    const index = getCurrentQuestionIndex();

    if (index === null) {
        return null;
    }

    return quizState.questionStates[index] ?? null;
}


/* =====================================================
   回答欄の作成
===================================================== */

function createAnswerBox(quiz, state, questionIndex) {
    const type = normalizeQuizType(quiz.type);
    const disabled = state.revealed ? "disabled" : "";

    if (type === "fill") {
        return `
            <div class="mobile-answer-area">
                <label for="mobileAnswerInput">
                    回答を入力
                </label>

                <input
                    type="text"
                    id="mobileAnswerInput"
                    class="mobile-answer-input"
                    autocomplete="off"
                    inputmode="text"
                    value="${escapeHtml(state.userAnswer)}"
                    ${disabled}
                >
            </div>
        `;
    }

    const options = getQuestionOptions(quiz);

    return `
        <fieldset class="mobile-options">
            <legend class="visually-hidden">
                選択肢
            </legend>

            ${options.map((option, optionIndex) => {
                const optionText = String(option);
                const checked =
                    normalizeAnswer(state.userAnswer) ===
                    normalizeAnswer(optionText);

                const optionId =
                    `quiz-${questionIndex}-option-${optionIndex}`;

                return `
                    <label
                        class="mobile-option ${
                            checked ? "selected" : ""
                        }"
                        for="${optionId}"
                    >
                        <input
                            type="radio"
                            id="${optionId}"
                            name="mobileQuizAnswer"
                            value="${escapeHtml(optionText)}"
                            ${checked ? "checked" : ""}
                            ${disabled}
                        >

                        <span class="option-number">
                            ${optionIndex + 1}
                        </span>

                        <span class="option-text">
                            ${escapeHtml(optionText)}
                        </span>
                    </label>
                `;
            }).join("")}
        </fieldset>
    `;
}


/* =====================================================
   判定結果欄
===================================================== */

function createResultBox(quiz, state) {
    if (!state.revealed) {
        return "";
    }

    const correct = state.status === "correct";
    const correctAnswer = getCorrectAnswer(quiz);
    const explanation = getExplanation(quiz);

    return `
        <div
            class="answer-box ${correct ? "correct" : "wrong"}"
            role="status"
            aria-live="polite"
        >
            <h4>
                ${correct ? "正解です" : "不正解です"}
            </h4>

            ${
                !correct
                    ? `
                        <p>
                            <strong>正解：</strong>
                            ${escapeHtml(correctAnswer)}
                        </p>
                    `
                    : ""
            }

            ${
                explanation
                    ? `
                        <p>
                            <strong>解説：</strong>
                            ${escapeHtml(explanation)}
                        </p>
                    `
                    : ""
            }
        </div>
    `;
}


/* =====================================================
   問題の表示
===================================================== */

function renderSingleQuiz() {
    const container = getElement(
        "singleQuiz",
        "mobileQuizCard",
        "quizQuestionContainer",
        "singleQuizContainer"
    );

    if (!container) {
        console.warn(
            "問題表示用の要素が見つかりません。"
        );

        return;
    }

    if (filteredQuizIndexes.length === 0) {
        container.innerHTML = `
            <div class="single-quiz-card empty-quiz-card">
                <h3>該当する問題がありません</h3>
                <p>
                    絞り込み条件を変更してください。
                </p>
            </div>
        `;

        updateNavigationButtons();
        updateQuizProgress();

        return;
    }

    const questionIndex = getCurrentQuestionIndex();
    const quiz = getCurrentQuiz();
    const state = getCurrentQuestionState();

    if (
        questionIndex === null ||
        !quiz ||
        !state
    ) {
        return;
    }

    quizState.currentQuestionIndex = questionIndex;

    const type = normalizeQuizType(quiz.type);
    const category = normalizeCategory(quiz.category);
    const code = quiz.code ?? quiz.snippet ?? "";

    container.innerHTML = `
        <article class="single-quiz-card">
            <div class="quiz-question-meta">
                <span class="quiz-type-label">
                    ${escapeHtml(TYPE_LABELS[type] ?? type)}
                </span>

                <span class="quiz-category-label">
                    ${escapeHtml(getCategoryLabel(category))}
                </span>

                <span class="quiz-number-label">
                    全体 ${questionIndex + 1}問目
                </span>
            </div>

            <h3 class="quiz-question-title">
                問題 ${displayedQuestionIndex + 1}
            </h3>

            <div class="quiz-question-text">
                ${formatQuestion(getQuestionText(quiz))}
            </div>

            ${
                code
                    ? `
                        <pre class="quiz-code"><code>${escapeHtml(code)}</code></pre>
                    `
                    : ""
            }

            ${createAnswerBox(quiz, state, questionIndex)}

            <div class="quiz-action-area">
                <button
                    type="button"
                    id="checkAnswerButton"
                    class="main-button"
                    ${state.revealed ? "disabled" : ""}
                >
                    ${
                        state.revealed
                            ? "答え合わせ済み"
                            : "答え合わせ"
                    }
                </button>
            </div>

            <div id="quizResultArea">
                ${createResultBox(quiz, state)}
            </div>
        </article>
    `;

    setupRenderedQuestionEvents();
    updateNavigationButtons();
    updateQuizProgress();
    renderQuizOverview();
    saveQuizState();
}

function renderQuiz() {
    renderSingleQuiz();
    renderCategoryScores();
}


/* =====================================================
   表示後のイベント
===================================================== */

function setupRenderedQuestionEvents() {
    const checkButton = getElement("checkAnswerButton");

    if (checkButton) {
        checkButton.addEventListener(
            "click",
            checkCurrentQuestion
        );
    }

    const input = getElement("mobileAnswerInput");

    if (input) {
        input.addEventListener("input", saveCurrentDraft);

        input.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                event.preventDefault();
                checkCurrentQuestion();
            }
        });

        if (!input.disabled) {
            input.focus({
                preventScroll: true
            });
        }
    }

    document
        .querySelectorAll(
            'input[name="mobileQuizAnswer"]'
        )
        .forEach(radio => {
            radio.addEventListener("change", () => {
                document
                    .querySelectorAll(".mobile-option")
                    .forEach(label => {
                        label.classList.remove("selected");
                    });

                radio
                    .closest(".mobile-option")
                    ?.classList.add("selected");

                saveCurrentDraft();
            });
        });
}


/* =====================================================
   入力内容の取得・一時保存
===================================================== */

function getUserAnswerText() {
    const input = getElement("mobileAnswerInput");

    if (input) {
        return input.value;
    }

    const selected = document.querySelector(
        'input[name="mobileQuizAnswer"]:checked'
    );

    return selected ? selected.value : "";
}

function saveCurrentDraft() {
    const questionIndex = getCurrentQuestionIndex();

    if (questionIndex === null) {
        return;
    }

    const state = quizState.questionStates[questionIndex];

    if (state.revealed) {
        return;
    }

    state.userAnswer = getUserAnswerText();
    quizState.currentQuestionIndex = questionIndex;

    saveQuizState();
}


/* =====================================================
   答え合わせ
===================================================== */

function checkCurrentQuestion() {
    const questionIndex = getCurrentQuestionIndex();
    const quiz = getCurrentQuiz();

    if (
        questionIndex === null ||
        !quiz
    ) {
        return;
    }

    const state = quizState.questionStates[questionIndex];

    if (state.revealed) {
        return;
    }

    const userAnswer = getUserAnswerText();

    if (normalizeAnswer(userAnswer) === "") {
        window.alert("回答を入力または選択してください。");
        return;
    }

    const correct = isCorrectAnswer(
        quiz,
        userAnswer
    );

    state.userAnswer = userAnswer;
    state.status = correct
        ? "correct"
        : "incorrect";
    state.revealed = true;

    quizState.currentQuestionIndex = questionIndex;

    saveQuizState();

    /*
     * 未回答・不正解フィルター中は、
     * 正解した問題が一覧から外れる場合があります。
     * ただし、判定直後は現在の問題と解説を残します。
     */
    const resultArea = getElement("quizResultArea");

    if (resultArea) {
        resultArea.innerHTML =
            createResultBox(quiz, state);
    }

    const checkButton = getElement("checkAnswerButton");

    if (checkButton) {
        checkButton.disabled = true;
        checkButton.textContent = "答え合わせ済み";
    }

    const answerInput = getElement("mobileAnswerInput");

    if (answerInput) {
        answerInput.disabled = true;
    }

    document
        .querySelectorAll(
            'input[name="mobileQuizAnswer"]'
        )
        .forEach(input => {
            input.disabled = true;
        });

    updateQuizProgress();
    renderCategoryScores();

    /*
     * 概要一覧は最新状態に更新するが、
     * 現在表示中の問題位置はここでは変更しない。
     */
    renderQuizOverview();
}


/* =====================================================
   前後移動
===================================================== */

function moveQuestion(direction) {
    saveCurrentDraft();

    const currentQuestionIndex = getCurrentQuestionIndex();

    if (currentQuestionIndex === null) {
        updateFilteredIndexes();
        renderQuiz();
        return;
    }

    /*
     * 判定後に現在問題がフィルター対象から外れる場合を考慮し、
     * 問題番号を基準に移動先を決定する。
     */
    updateFilteredIndexes({
        preferredQuestionIndex: currentQuestionIndex,
        direction
    });

    if (filteredQuizIndexes.length === 0) {
        renderQuiz();
        scrollToQuizTop();
        return;
    }

    const currentPosition = filteredQuizIndexes.indexOf(
        currentQuestionIndex
    );

    if (currentPosition >= 0) {
        displayedQuestionIndex = Math.min(
            Math.max(
                currentPosition + direction,
                0
            ),
            filteredQuizIndexes.length - 1
        );
    } else if (direction > 0) {
        const nextPosition = filteredQuizIndexes.findIndex(
            index => index > currentQuestionIndex
        );

        displayedQuestionIndex =
            nextPosition >= 0
                ? nextPosition
                : filteredQuizIndexes.length - 1;
    } else {
        let previousPosition = -1;

        filteredQuizIndexes.forEach((index, position) => {
            if (index < currentQuestionIndex) {
                previousPosition = position;
            }
        });

        displayedQuestionIndex =
            previousPosition >= 0
                ? previousPosition
                : 0;
    }

    quizState.currentQuestionIndex =
        filteredQuizIndexes[displayedQuestionIndex];

    saveQuizState();
    renderQuiz();
    scrollToQuizTop();
}

function previousQuestion() {
    moveQuestion(-1);
}

function nextQuestion() {
    moveQuestion(1);
}

function jumpToQuestion(questionIndex) {
    saveCurrentDraft();

    const numericIndex = Number(questionIndex);

    if (
        !Number.isInteger(numericIndex) ||
        numericIndex < 0 ||
        numericIndex >= getAllQuizzes().length
    ) {
        return;
    }

    updateFilteredIndexes({
        preferredQuestionIndex: numericIndex
    });

    const position =
        filteredQuizIndexes.indexOf(numericIndex);

    if (position < 0) {
        return;
    }

    displayedQuestionIndex = position;
    quizState.currentQuestionIndex = numericIndex;

    saveQuizState();
    renderQuiz();
    scrollToQuizTop();
}

function scrollToQuizTop() {
    const quizSection = getElement(
        "quiz",
        "mobileQuiz",
        "quizTop"
    );

    if (quizSection) {
        quizSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}


/* =====================================================
   ナビゲーションボタン
===================================================== */

function updateNavigationButtons() {
    const previousButton = getElement(
        "previousQuestionButton",
        "prevQuestionButton",
        "prevButton"
    );

    const nextButton = getElement(
        "nextQuestionButton",
        "nextButton"
    );

    const noQuestions =
        filteredQuizIndexes.length === 0;

    if (previousButton) {
        previousButton.disabled =
            noQuestions ||
            displayedQuestionIndex <= 0;
    }

    if (nextButton) {
        nextButton.disabled =
            noQuestions ||
            displayedQuestionIndex >=
                filteredQuizIndexes.length - 1;
    }
}


/* =====================================================
   進捗表示
===================================================== */

function calculateProgress() {
    const questionStates = quizState.questionStates;

    const answered = questionStates.filter(
        state => state.status !== "unanswered"
    ).length;

    const correct = questionStates.filter(
        state => state.status === "correct"
    ).length;

    const incorrect = questionStates.filter(
        state => state.status === "incorrect"
    ).length;

    const total = questionStates.length;

    const answerRate =
        total > 0
            ? Math.round((answered / total) * 100)
            : 0;

    const accuracy =
        answered > 0
            ? Math.round((correct / answered) * 100)
            : 0;

    return {
        answered,
        correct,
        incorrect,
        total,
        answerRate,
        accuracy
    };
}

function updateQuizProgress() {
    const progress = calculateProgress();

    const progressText = getElement(
        "quizProgressText",
        "progressText"
    );

    const progressBar = getElement(
        "quizProgressBar",
        "progressBar"
    );

    const currentNumber = getElement(
        "currentQuestionNumber",
        "currentQuizNumber"
    );

    const filteredTotal = getElement(
        "filteredQuestionCount",
        "filteredQuizCount"
    );

    const answeredCount = getElement(
        "answeredCount",
        "quizAnsweredCount"
    );

    const correctCount = getElement(
        "correctCount",
        "quizCorrectCount"
    );

    const incorrectCount = getElement(
        "incorrectCount",
        "quizIncorrectCount"
    );

    const accuracy = getElement(
        "accuracy",
        "quizAccuracy"
    );

    if (progressText) {
        progressText.textContent =
            `${progress.answered} / ${progress.total}問回答済み ` +
            `（正答率 ${progress.accuracy}%）`;
    }

    if (progressBar) {
        progressBar.style.width =
            `${progress.answerRate}%`;

        progressBar.setAttribute(
            "aria-valuenow",
            String(progress.answerRate)
        );

        progressBar.setAttribute(
            "aria-valuemin",
            "0"
        );

        progressBar.setAttribute(
            "aria-valuemax",
            "100"
        );
    }

    if (currentNumber) {
        currentNumber.textContent =
            displayedQuestionIndex >= 0
                ? String(displayedQuestionIndex + 1)
                : "0";
    }

    if (filteredTotal) {
        filteredTotal.textContent =
            String(filteredQuizIndexes.length);
    }

    if (answeredCount) {
        answeredCount.textContent =
            String(progress.answered);
    }

    if (correctCount) {
        correctCount.textContent =
            String(progress.correct);
    }

    if (incorrectCount) {
        incorrectCount.textContent =
            String(progress.incorrect);
    }

    if (accuracy) {
        accuracy.textContent =
            `${progress.accuracy}%`;
    }
}


/* =====================================================
   カテゴリ別正答率
===================================================== */

function calculateCategoryScores() {
    const quizzes = getAllQuizzes();

    const scores = {};

    CATEGORY_ORDER.forEach(category => {
        scores[category] = {
            category,
            total: 0,
            answered: 0,
            correct: 0,
            incorrect: 0,
            accuracy: 0
        };
    });

    quizzes.forEach((quiz, index) => {
        const category = normalizeCategory(
            quiz.category
        );

        if (!scores[category]) {
            scores[category] = {
                category,
                total: 0,
                answered: 0,
                correct: 0,
                incorrect: 0,
                accuracy: 0
            };
        }

        const state =
            quizState.questionStates[index];

        scores[category].total += 1;

        if (state.status !== "unanswered") {
            scores[category].answered += 1;
        }

        if (state.status === "correct") {
            scores[category].correct += 1;
        }

        if (state.status === "incorrect") {
            scores[category].incorrect += 1;
        }
    });

    Object.values(scores).forEach(score => {
        score.accuracy =
            score.answered > 0
                ? Math.round(
                    (score.correct / score.answered) * 100
                )
                : 0;
    });

    return scores;
}

function getWeakCategory(scores) {
    const answeredScores = Object.values(scores)
        .filter(score => score.answered > 0);

    if (answeredScores.length === 0) {
        return null;
    }

    return answeredScores.reduce(
        (weakest, current) => {
            if (!weakest) {
                return current;
            }

            if (current.accuracy < weakest.accuracy) {
                return current;
            }

            if (
                current.accuracy === weakest.accuracy &&
                current.answered > weakest.answered
            ) {
                return current;
            }

            return weakest;
        },
        null
    );
}

function renderCategoryScores() {
    const container = getElement(
        "categoryScores",
        "quizCategoryScores",
        "categoryScoreBoard"
    );

    const weakPoint = getElement(
        "weakPointDisplay",
        "weakCategoryDisplay",
        "weakPoint"
    );

    const scores = calculateCategoryScores();
    const weakCategory = getWeakCategory(scores);

    if (container) {
        container.innerHTML = CATEGORY_ORDER
            .map(category => {
                const score = scores[category];

                if (!score) {
                    return "";
                }

                let stateClass = "not-started";

                if (score.answered > 0) {
                    if (score.accuracy >= 80) {
                        stateClass = "strong";
                    } else if (score.accuracy < 60) {
                        stateClass = "weak";
                    } else {
                        stateClass = "learning";
                    }
                }

                return `
                    <article class="category-score-card ${stateClass}">
                        <h4>
                            ${escapeHtml(getCategoryLabel(category))}
                        </h4>

                        <p class="category-accuracy">
                            ${
                                score.answered > 0
                                    ? `${score.accuracy}%`
                                    : "未回答"
                            }
                        </p>

                        <p>
                            ${score.correct}問正解 /
                            ${score.answered}問回答
                        </p>

                        <div class="category-score-bar">
                            <span
                                style="width: ${score.accuracy}%"
                            ></span>
                        </div>
                    </article>
                `;
            })
            .join("");
    }

    if (weakPoint) {
        if (!weakCategory) {
            weakPoint.innerHTML = `
                <strong>苦手分野：</strong>
                まだ判定できません。問題に回答してください。
            `;
            weakPoint.classList.remove("has-weak-point");
        } else {
            weakPoint.innerHTML = `
                <strong>現在の苦手分野：</strong>
                ${escapeHtml(
                    getCategoryLabel(weakCategory.category)
                )}
                （正答率 ${weakCategory.accuracy}%）
            `;

            weakPoint.classList.add("has-weak-point");
        }
    }
}


/* =====================================================
   問題一覧
===================================================== */

function toggleQuizOverview() {
    quizState.overviewVisible =
        !quizState.overviewVisible;

    saveQuizState();
    renderQuizOverview();
}

function renderQuizOverview() {
    const container = getElement(
        "quizOverview",
        "mobileQuizOverview",
        "overviewGrid"
    );

    const toggleButton = getElement(
        "toggleOverviewButton",
        "overviewToggleButton"
    );

    if (toggleButton) {
        toggleButton.textContent =
            quizState.overviewVisible
                ? "問題一覧を閉じる"
                : "問題一覧を表示";

        toggleButton.setAttribute(
            "aria-expanded",
            quizState.overviewVisible
                ? "true"
                : "false"
        );
    }

    if (!container) {
        return;
    }

    container.hidden =
        !quizState.overviewVisible;

    if (!quizState.overviewVisible) {
        return;
    }

    if (filteredQuizIndexes.length === 0) {
        container.innerHTML = `
            <p>該当する問題がありません。</p>
        `;

        return;
    }

    const currentQuestionIndex =
        getCurrentQuestionIndex();

    container.innerHTML = `
        <div class="overview-button-grid">
            ${filteredQuizIndexes.map((questionIndex, position) => {
                const state =
                    quizState.questionStates[questionIndex];

                const current =
                    questionIndex === currentQuestionIndex;

                return `
                    <button
                        type="button"
                        class="
                            overview-button
                            ${escapeHtml(state.status)}
                            ${current ? "current" : ""}
                        "
                        data-jump-index="${questionIndex}"
                        title="全体の${questionIndex + 1}問目"
                        aria-label="
                            問題${position + 1}
                            ${
                                state.status === "correct"
                                    ? " 正解"
                                    : state.status === "incorrect"
                                        ? " 不正解"
                                        : " 未回答"
                            }
                        "
                        ${current ? 'aria-current="true"' : ""}
                    >
                        ${position + 1}
                    </button>
                `;
            }).join("")}
        </div>
    `;

    container
        .querySelectorAll("[data-jump-index]")
        .forEach(button => {
            button.addEventListener("click", () => {
                jumpToQuestion(
                    Number(button.dataset.jumpIndex)
                );
            });
        });
}


/* =====================================================
   リセット
===================================================== */

function resetMobileQuiz() {
    const total = getAllQuizzes().length;

    const confirmed = window.confirm(
        `全${total}問の回答履歴を削除して、最初からやり直しますか？`
    );

    if (!confirmed) {
        return;
    }

    localStorage.removeItem(STORAGE_KEY);

    quizState = createInitialQuizState();
    displayedQuestionIndex = 0;

    updateFilteredIndexes();

    synchronizeFilterControls();
    renderQuiz();

    window.alert(
        "回答履歴をリセットしました。"
    );
}


/* =====================================================
   フィルターイベント
===================================================== */

function setupQuizFilters() {
    const typeSelect = getElement(
        "quizTypeFilter",
        "quizTypeSelect"
    );

    const categorySelect = getElement(
        "quizCategoryFilter",
        "quizCategorySelect"
    );

    const statusSelect = getElement(
        "quizStatusFilter",
        "quizStatusSelect"
    );

    if (typeSelect) {
        typeSelect.addEventListener("change", () => {
            changeQuizType(typeSelect.value);
        });
    }

    if (categorySelect) {
        categorySelect.addEventListener("change", () => {
            changeQuizCategory(categorySelect.value);
        });
    }

    if (statusSelect) {
        statusSelect.addEventListener("change", () => {
            changeQuizStatus(statusSelect.value);
        });
    }

    document
        .querySelectorAll("[data-quiz-mode]")
        .forEach(button => {
            button.addEventListener("click", () => {
                changeQuizMode(
                    button.dataset.quizMode
                );
            });
        });

    document
        .querySelectorAll("[data-quiz-category]")
        .forEach(button => {
            button.addEventListener("click", () => {
                changeQuizCategory(
                    button.dataset.quizCategory
                );
            });
        });

    document
        .querySelectorAll("[data-quiz-status]")
        .forEach(button => {
            button.addEventListener("click", () => {
                changeQuizStatus(
                    button.dataset.quizStatus
                );
            });
        });
}


/* =====================================================
   ナビゲーションイベント
===================================================== */

function setupQuizNavigation() {
    const previousButton = getElement(
        "previousQuestionButton",
        "prevQuestionButton",
        "prevButton"
    );

    const nextButton = getElement(
        "nextQuestionButton",
        "nextButton"
    );

    const overviewButton = getElement(
        "toggleOverviewButton",
        "overviewToggleButton"
    );

    const resetButton = getElement(
        "resetMobileQuizButton",
        "resetQuizButton"
    );

    if (previousButton) {
        previousButton.addEventListener(
            "click",
            previousQuestion
        );
    }

    if (nextButton) {
        nextButton.addEventListener(
            "click",
            nextQuestion
        );
    }

    if (overviewButton) {
        overviewButton.addEventListener(
            "click",
            toggleQuizOverview
        );
    }

    if (resetButton) {
        resetButton.addEventListener(
            "click",
            resetMobileQuiz
        );
    }

    document.addEventListener("keydown", event => {
        const activeElement = document.activeElement;
        const tagName =
            activeElement?.tagName?.toLowerCase();

        const typing =
            tagName === "input" ||
            tagName === "textarea" ||
            tagName === "select";

        if (typing) {
            return;
        }

        if (event.key === "ArrowLeft") {
            previousQuestion();
        }

        if (event.key === "ArrowRight") {
            nextQuestion();
        }
    });
}


/* =====================================================
   ページ内ナビゲーション
===================================================== */

function setupPageNavigation() {
    document
        .querySelectorAll('a[href^="#"]')
        .forEach(link => {
            link.addEventListener("click", event => {
                const href = link.getAttribute("href");

                if (
                    !href ||
                    href === "#"
                ) {
                    return;
                }

                const target = document.querySelector(href);

                if (!target) {
                    return;
                }

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            });
        });
}


/* =====================================================
   初期化
===================================================== */

function initializeApplication() {
    if (!validateQuestionData()) {
        const container = getElement(
            "singleQuiz",
            "mobileQuizCard",
            "quizQuestionContainer",
            "singleQuizContainer"
        );

        if (container) {
            container.innerHTML = `
                <div class="warning-box">
                    問題データを読み込めませんでした。
                    questions.jsがapp.jsより先に読み込まれているか
                    確認してください。
                </div>
            `;
        }

        return;
    }

    displayQuestionCounts();

    setupCategoryFilter();
    renderTerms("all");

    quizState = loadQuizState();

    updateFilteredIndexes({
        preferredQuestionIndex:
            quizState.currentQuestionIndex
    });

    setupQuizFilters();
    setupQuizNavigation();
    setupPageNavigation();

    synchronizeFilterControls();
    renderQuiz();
}


/* =====================================================
   グローバル公開
   HTMLのonclick属性からも呼び出せるようにする
===================================================== */

window.changeQuizMode = changeQuizMode;
window.changeQuizType = changeQuizType;
window.changeQuizCategory = changeQuizCategory;
window.changeQuizStatus = changeQuizStatus;
window.checkCurrentQuestion = checkCurrentQuestion;
window.previousQuestion = previousQuestion;
window.nextQuestion = nextQuestion;
window.jumpToQuestion = jumpToQuestion;
window.toggleQuizOverview = toggleQuizOverview;
window.resetMobileQuiz = resetMobileQuiz;


/* =====================================================
   DOM構築完了後に開始
===================================================== */

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initializeApplication
    );
} else {
    initializeApplication();
}
