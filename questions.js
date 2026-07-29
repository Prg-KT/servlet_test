"use strict";

/* =====================================================
   元の重要用語集
===================================================== */

const terms = [
    {
        term: "サーブレット",
        category: "Servlet",
        level: "最重要",
        meaning:
            "サーバー側でHTTPリクエストを処理し、レスポンスを生成するJavaプログラム。",
        point:
            "一般にHttpServletを継承し、doGet()やdoPost()をオーバーライドする。",
        trap:
            "通常はリクエストごとに新しいインスタンスが作られるのではなく、同じインスタンスが再利用される。"
    },
    {
        term: "サーブレットコンテナ",
        category: "Servlet",
        level: "重要",
        meaning:
            "サーブレットの生成、初期化、実行、破棄などを管理する実行環境。",
        point:
            "Apache Tomcatが代表例。",
        trap:
            "インスタンスの生成やライフサイクル管理を開発者が直接行うわけではない。"
    },
    {
        term: "init()",
        category: "Lifecycle",
        level: "最重要",
        meaning:
            "サーブレットのインスタンス生成後、初期化時に原則一度呼ばれるメソッド。",
        point:
            "初期化パラメータの取得や、共有資源の準備などに使用する。",
        trap:
            "init(ServletConfig config)をオーバーライドする場合はsuper.init(config)の呼び出しに注意する。"
    },
    {
        term: "destroy()",
        category: "Lifecycle",
        level: "最重要",
        meaning:
            "サーブレットが破棄される前に呼ばれるメソッド。",
        point:
            "ファイルやデータベース接続など、共有資源の終了処理に利用できる。",
        trap:
            "リクエストのたびに呼ばれるメソッドではない。"
    },
    {
        term: "ServletConfig",
        category: "Servlet",
        level: "重要",
        meaning:
            "サーブレットごとの設定情報や初期化パラメータを扱うオブジェクト。",
        point:
            "getInitParameter(name)、getInitParameterNames()を使用する。",
        trap:
            "ServletContextとは利用範囲が異なる。"
    },
    {
        term: "初期化パラメータ",
        category: "Servlet",
        level: "重要",
        meaning:
            "サーブレットの初期化時に利用する設定値。",
        point:
            "web.xmlのinit-param、または@WebInitParamで設定できる。",
        trap:
            "リクエストパラメータとは別物。"
    },
    {
        term: "リクエストスコープ",
        category: "Scope",
        level: "最重要",
        meaning:
            "1回のリクエスト処理中だけデータを共有する範囲。",
        point:
            "request.setAttribute()、request.getAttribute()を使う。",
        trap:
            "リダイレクトすると別リクエストになるため、属性は引き継がれない。"
    },
    {
        term: "セッションスコープ",
        category: "Scope",
        level: "最重要",
        meaning:
            "同じ利用者の複数リクエストにまたがってデータを共有する範囲。",
        point:
            "request.getSession()でHttpSessionを取得する。",
        trap:
            "全ユーザーで共有する領域ではない。"
    },
    {
        term: "アプリケーションスコープ",
        category: "Scope",
        level: "最重要",
        meaning:
            "Webアプリケーション全体でデータを共有する範囲。",
        point:
            "getServletContext()でServletContextを取得する。",
        trap:
            "全ユーザー・複数スレッドで共有されるので競合に注意する。"
    },
    {
        term: "setAttribute()",
        category: "Scope",
        level: "重要",
        meaning:
            "指定した属性名でオブジェクトをスコープに保存するメソッド。",
        point:
            "同じ属性名ですでに保存されている場合は上書きされる。",
        trap:
            "初期化パラメータを設定するメソッドではない。"
    },
    {
        term: "getAttribute()",
        category: "Scope",
        level: "重要",
        meaning:
            "指定した属性名のオブジェクトをスコープから取得するメソッド。",
        point:
            "戻り値はObject型なので、Java側では必要に応じてキャストする。",
        trap:
            "存在しない属性名の場合は通常nullになる。"
    },
    {
        term: "removeAttribute()",
        category: "Scope",
        level: "重要",
        meaning:
            "スコープから指定した属性を1個削除するメソッド。",
        point:
            "不要になったエラーメッセージなどの削除に使える。",
        trap:
            "セッション全体の破棄ではない。"
    },
    {
        term: "invalidate()",
        category: "Session",
        level: "最重要",
        meaning:
            "HttpSessionを無効化し、セッション全体を破棄するメソッド。",
        point:
            "ログアウト処理でよく使用する。",
        trap:
            "属性1個だけを削除するメソッドではない。"
    },
    {
        term: "セッションID",
        category: "Session",
        level: "重要",
        meaning:
            "ブラウザとサーバー側のHttpSessionを対応付けるための識別情報。",
        point:
            "一般にCookieを利用してブラウザとサーバー間で送受信される。",
        trap:
            "ユーザーのパスワードそのものではない。"
    },
    {
        term: "フィルタ",
        category: "Filter",
        level: "最重要",
        meaning:
            "サーブレットやJSPの前後に共通処理を適用する仕組み。",
        point:
            "文字コード設定、ログ、認証確認などに利用できる。",
        trap:
            "chain.doFilter()を呼ばない場合、通常は次の処理へ進まない。"
    },
    {
        term: "FilterChain",
        category: "Filter",
        level: "最重要",
        meaning:
            "複数のフィルタと対象リソースを連鎖的に呼び出す仕組み。",
        point:
            "chain.doFilter(request, response)で次の処理を呼び出す。",
        trap:
            "戻り処理は呼び出し順の逆順になる。"
    },
    {
        term: "doFilter()",
        category: "Filter",
        level: "最重要",
        meaning:
            "フィルタの主処理を記述するメソッド。",
        point:
            "chain.doFilter()より前が前処理、後ろが後処理。",
        trap:
            "後処理はサーブレットより前に実行されるわけではない。"
    },
    {
        term: "@WebFilter",
        category: "Filter",
        level: "重要",
        meaning:
            "フィルタと対象URLを登録するアノテーション。",
        point:
            "単数のURLならvalueを省略した記述も可能。",
        trap:
            "複数URLを指定する場合は配列形式で記述する。"
    },
    {
        term: "リスナー",
        category: "Listener",
        level: "重要",
        meaning:
            "Webアプリケーション内で発生するイベントを監視し、イベント発生時に処理する仕組み。",
        point:
            "@WebListenerまたはweb.xmlで登録できる。",
        trap:
            "すべてのイベントを1種類のインターフェースで処理するわけではない。"
    },
    {
        term: "ServletContextListener",
        category: "Listener",
        level: "重要",
        meaning:
            "Webアプリケーションの開始・終了イベントを受け取るリスナー。",
        point:
            "contextInitialized()とcontextDestroyed()を使用する。",
        trap:
            "サーブレットのdoGet()を監視するためのインターフェースではない。"
    },
    {
        term: "スレッドセーフ",
        category: "Thread",
        level: "最重要",
        meaning:
            "複数スレッドから同時に利用されても、データ不整合などが起きない設計。",
        point:
            "共有する可変データを減らし、必要に応じて同期処理を行う。",
        trap:
            "ローカル変数とフィールドでは共有範囲が異なる。"
    },
    {
        term: "synchronized",
        category: "Thread",
        level: "重要",
        meaning:
            "指定した対象のロックを取得し、同時実行を制御するJavaの仕組み。",
        point:
            "同じロックに対する同期ブロックを一度に実行できるスレッドは1つ。",
        trap:
            "広い範囲を同期すると性能低下や待ち時間増加の原因になる。"
    },
    {
        term: "フォワード",
        category: "Transition",
        level: "最重要",
        meaning:
            "サーバー内部で別のサーブレットやJSPへ処理を引き渡す。",
        point:
            "同じリクエストを引き継ぐため、リクエスト属性を利用できる。",
        trap:
            "ブラウザのURLは原則変化しない。"
    },
    {
        term: "リダイレクト",
        category: "Transition",
        level: "最重要",
        meaning:
            "ブラウザに別URLへの再リクエストを行わせる画面遷移。",
        point:
            "response.sendRedirect()を使用する。",
        trap:
            "別リクエストなので、リクエスト属性は引き継がれない。"
    },
    {
        term: "JavaBeans",
        category: "MVC",
        level: "重要",
        meaning:
            "部品として再利用しやすくするための規約に従ったJavaクラス。",
        point:
            "データをまとめてスコープに保存し、JSPで利用できる。",
        trap:
            "すべてのデータを1個の巨大なBeanにまとめる設計ではない。"
    },
    {
        term: "MVC",
        category: "MVC",
        level: "最重要",
        meaning:
            "Model、View、Controllerに役割を分離する設計。",
        point:
            "ServletがController、JSPがView、LogicやDAOがModel側になる。",
        trap:
            "JSPにデータベース処理を大量に記述すると役割分担が崩れる。"
    },
    {
        term: "EL",
        category: "JSP",
        level: "最重要",
        meaning:
            "JSPでスコープの属性やJavaBeansのプロパティを簡潔に参照する式言語。",
        point:
            "例：${user.name}",
        trap:
            "Javaの任意のコードをそのまま実行する仕組みではない。"
    },
    {
        term: "JSTL",
        category: "JSP",
        level: "最重要",
        meaning:
            "条件分岐や繰り返しなどをJSPのタグとして記述するライブラリ。",
        point:
            "c:if、c:choose、c:forEach、c:outなどが代表的。",
        trap:
            "利用には環境に応じた依存関係とtaglib宣言が必要。"
    },
    {
        term: "PreparedStatement",
        category: "JDBC",
        level: "最重要",
        meaning:
            "プレースホルダを使ってSQLと入力値を分離できるJDBCの仕組み。",
        point:
            "setString()やsetInt()で?に値を設定する。",
        trap:
            "SQL文に入力値を文字列連結するとSQLインジェクションの危険がある。"
    },
    {
        term: "ResultSet",
        category: "JDBC",
        level: "最重要",
        meaning:
            "SELECT文の検索結果を保持するオブジェクト。",
        point:
            "next()で行を進め、getString()やgetInt()で列値を取得する。",
        trap:
            "next()を呼ぶ前は最初のデータ行を指していない。"
    },
    {
        term: "DAO",
        category: "JDBC",
        level: "最重要",
        meaning:
            "データベースアクセス処理をほかの処理から分離する設計パターン。",
        point:
            "接続、SQL実行、ResultSetからの変換などをまとめる。",
        trap:
            "画面表示やHTTPリクエスト処理までDAOに担当させない。"
    }
];


/* =====================================================
   100問の選択問題を作るための問題データ

   形式：
   分類 | 正解用語 | 問題文
===================================================== */

const QUESTION_BANK_TEXT = `
Servlet|Servlet|サーバー側でHTTPリクエストを処理し、レスポンスを生成するJavaプログラムはどれですか。
Servlet|HttpServlet|一般的なHTTPサーブレットを作成するときに継承するクラスはどれですか。
Servlet|doGet()|GETリクエストを処理する代表的なメソッドはどれですか。
Servlet|doPost()|POSTリクエストを処理する代表的なメソッドはどれですか。
Servlet|getParameter()|フォームなどから送信されたリクエストパラメータを取得するメソッドはどれですか。
Servlet|String|getParameter()が基本的に返すデータ型はどれですか。
Servlet|@WebServlet|サーブレットとURLパターンを対応付けるアノテーションはどれですか。
Servlet|setContentType()|レスポンスの種類や文字コードを設定するメソッドはどれですか。
Servlet|Apache Tomcat|代表的なServletコンテナはどれですか。
Servlet|Servletコンテナ|サーブレットの生成・初期化・実行・破棄を管理する実行環境はどれですか。
Servlet|ServletConfig|サーブレットごとの設定情報を扱うオブジェクトはどれですか。
Servlet|getInitParameter()|初期化パラメータを取得するメソッドはどれですか。
Servlet|PrintWriter|レスポンス本文へ文字列を出力するために利用するオブジェクトはどれですか。
Servlet|getContextPath()|Webアプリケーションのコンテキストパスを取得するメソッドはどれですか。
Servlet|HttpServletRequest|HTTPリクエスト情報を表すオブジェクトはどれですか。
Lifecycle|init()|サーブレットの初期化時に原則一度呼ばれるメソッドはどれですか。
Lifecycle|destroy()|サーブレットが破棄される直前に呼ばれるメソッドはどれですか。
Lifecycle|サーブレットライフサイクル|インスタンス生成・初期化・リクエスト処理・破棄という一連の流れを何といいますか。
Lifecycle|リクエスト処理メソッド|doGetやdoPostのように、アクセスごとに呼ばれる可能性があるメソッドを何といいますか。
Lifecycle|コンストラクタ|サーブレットのインスタンス生成時に実行されるものはどれですか。
Lifecycle|loadOnStartup|サーブレットをWebアプリケーション起動時に読み込ませる設定はどれですか。
Lifecycle|super.init(config)|init(ServletConfig config)をオーバーライドしたとき、親クラスへ設定情報を渡す呼び出しはどれですか。
Scope|リクエストスコープ|1回のリクエスト処理中だけデータを共有する範囲はどれですか。
Scope|セッションスコープ|同じ利用者の複数リクエストにまたがってデータを共有する範囲はどれですか。
Scope|アプリケーションスコープ|Webアプリケーション全体でデータを共有する範囲はどれですか。
Scope|setAttribute()|スコープへ属性を保存するメソッドはどれですか。
Scope|getAttribute()|スコープから属性を取得するメソッドはどれですか。
Scope|removeAttribute()|スコープから指定した属性だけを削除するメソッドはどれですか。
Session|invalidate()|セッション全体を無効化するメソッドはどれですか。
Session|getSession()|HttpServletRequestからHttpSessionを取得するメソッドはどれですか。
Session|HttpSession|利用者ごとのセッション情報を表すオブジェクトはどれですか。
Session|セッションID|ブラウザとサーバー側のセッションを対応付ける識別情報はどれですか。
Session|Cookie|セッションIDの送受信に一般的に使われる仕組みはどれですか。
Scope|ServletContext|Webアプリケーション全体に関する情報を扱うオブジェクトはどれですか。
Scope|リクエスト属性|リダイレクトすると基本的に引き継がれないデータはどれですか。
Scope|Object型|getAttribute()が基本的に返すデータ型はどれですか。
Session|セッションタイムアウト|一定時間操作がないセッションを無効化する仕組みはどれですか。
Session|isNew()|新しく作成されたセッションかどうかを確認するメソッドはどれですか。
Session|setMaxInactiveInterval()|セッションの最大無操作時間を秒単位で設定するメソッドはどれですか。
Scope|永続化|再起動後もデータを残すため、ファイルやデータベースへ保存することを何といいますか。
Filter|Filter|サーブレットやJSPの前後に共通処理を適用する仕組みはどれですか。
Filter|doFilter()|フィルタの中心となる処理を記述するメソッドはどれですか。
Filter|FilterChain|複数のフィルタと対象リソースの呼び出し連鎖を表すオブジェクトはどれですか。
Filter|chain.doFilter()|次のフィルタまたは対象リソースを呼び出す処理はどれですか。
Filter|前処理|chain.doFilterより前に記述する処理を何といいますか。
Filter|後処理|chain.doFilterから戻った後に実行する処理を何といいますか。
Filter|@WebFilter|フィルタを登録するアノテーションはどれですか。
Filter|文字コードフィルタ|複数のサーブレットへ共通の文字コード設定を適用するフィルタはどれですか。
Filter|認証確認フィルタ|ログイン状態を確認してアクセスを制御するフィルタはどれですか。
Filter|逆順処理|複数フィルタの戻り処理が、行きと逆の順番になることを何といいますか。
Listener|Listener|Webアプリケーション内で発生するイベントを監視する仕組みはどれですか。
Listener|ServletContextListener|Webアプリケーションの開始と終了を監視するリスナーはどれですか。
Listener|contextInitialized()|Webアプリケーション開始時に呼ばれるメソッドはどれですか。
Listener|contextDestroyed()|Webアプリケーション終了時に呼ばれるメソッドはどれですか。
Listener|@WebListener|リスナーを登録するアノテーションはどれですか。
Thread|スレッドセーフ|複数スレッドから同時利用されてもデータ不整合が起きない性質を何といいますか。
Thread|synchronized|Javaで排他制御を行う代表的なキーワードはどれですか。
Thread|ローカル変数|メソッド内で宣言され、通常は処理ごとに分かれる変数はどれですか。
Thread|インスタンスフィールド|同じサーブレットインスタンスを利用する処理間で共有される可能性がある変数はどれですか。
Thread|競合状態|複数処理の実行順によって結果が変化する状態を何といいますか。
Thread|排他制御|共有データへ複数処理が同時にアクセスしないよう制御することを何といいますか。
Thread|ロック|同期処理で一度に1つのスレッドだけが取得できる権利を何といいますか。
Transition|フォワード|サーバー内部で同じリクエストを引き継ぐ画面遷移はどれですか。
Transition|リダイレクト|ブラウザへ新しいリクエストを送らせる画面遷移はどれですか。
Transition|RequestDispatcher|フォワードやインクルードに利用するオブジェクトはどれですか。
Transition|forward()|RequestDispatcherでフォワードを実行するメソッドはどれですか。
Transition|sendRedirect()|ブラウザへリダイレクトを指示するメソッドはどれですか。
MVC|MVC|Model・View・Controllerに役割を分離する設計はどれですか。
MVC|Model|MVCでデータや業務処理を担当する部分はどれですか。
MVC|View|MVCで画面表示を担当する部分はどれですか。
MVC|Controller|MVCで入力受付・モデル呼び出し・画面遷移を担当する部分はどれですか。
MVC|JavaBeans|関連するデータをまとめて扱うために利用できるJavaクラスはどれですか。
MVC|ロジックモデル|ログイン判定など、アプリケーション固有の処理を担当するクラスはどれですか。
MVC|カプセル化|フィールドを外部から隠し、メソッド経由で操作する考え方はどれですか。
MVC|getter・setter|JavaBeansのプロパティを取得・設定するメソッドはどれですか。
JSP|JSP|Javaを利用して動的なHTMLを生成する表示技術はどれですか。
JSP|EL|JSPで属性やJavaBeansのプロパティを簡潔に参照する式言語はどれですか。
JSP|JSTL|JSPで条件分岐や繰り返しをタグとして記述するライブラリはどれですか。
JSP|c:if|JSTLで単純な条件分岐を行うタグはどれですか。
JSP|c:choose|JSTLで複数条件分岐の全体を表すタグはどれですか。
JSP|c:when|c:chooseの中で条件を指定するタグはどれですか。
JSP|c:otherwise|どのc:whenにも該当しない場合を処理するタグはどれですか。
JSP|c:forEach|JSTLで繰り返し処理を行うタグはどれですか。
JSP|c:out|JSTLで値を出力するタグはどれですか。
JSP|c:set|JSTLで属性や変数を設定するタグはどれですか。
JSP|c:remove|JSTLで属性を削除するタグはどれですか。
JSP|jsp:include|リクエスト時に別リソースの結果を動的に取り込むタグはどれですか。
JDBC|JDBC|Javaからデータベースを操作するためのAPIはどれですか。
JDBC|Connection|データベースとの接続を表すオブジェクトはどれですか。
JDBC|DriverManager|データベース接続を取得するためのクラスはどれですか。
JDBC|PreparedStatement|プレースホルダを利用してSQLを実行するオブジェクトはどれですか。
JDBC|ResultSet|SELECT文の検索結果を保持するオブジェクトはどれですか。
JDBC|next()|ResultSetのカーソルを次の行へ進めるメソッドはどれですか。
JDBC|getString()|ResultSetから文字列値を取得するメソッドはどれですか。
JDBC|getInt()|ResultSetから整数値を取得するメソッドはどれですか。
JDBC|executeUpdate()|INSERT・UPDATE・DELETEなどの更新系SQLを実行するメソッドはどれですか。
JDBC|executeQuery()|SELECT文を実行してResultSetを取得するメソッドはどれですか。
JDBC|SQLインジェクション|入力値によって開発者が意図しないSQLを実行される攻撃はどれですか。
DAO|DAO|データベースアクセス処理をほかの処理から分離する設計パターンはどれですか。
Maven|pom.xml|Mavenの依存関係やビルド設定を記述するファイルはどれですか。
`.trim();


const questionBank = QUESTION_BANK_TEXT
    .split("\n")
    .map(line => {
        const [
            category,
            answer,
            question
        ] = line.split("|");

        return {
            category,
            answer,
            question
        };
    });


/* =====================================================
   問題データ数確認

   questionBankは100項目でなければならない。
===================================================== */

if (questionBank.length !== 100) {
    console.error(
        "選択問題用データが100項目ではありません。",
        questionBank.length
    );
}


/* =====================================================
   穴埋め問題30問
===================================================== */

const fillQuestionIndexes = [
    0,
    2,
    3,
    4,
    6,
    10,
    11,
    15,
    16,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    33,
    40,
    41,
    42,
    43,
    50,
    51,
    55,
    56,
    63,
    78,
    90,
    92
];


function createAnswerAliases(answer) {
    const aliases = [answer];

    const withoutParentheses = answer
        .replaceAll("()", "")
        .trim();

    if (
        withoutParentheses &&
        !aliases.includes(withoutParentheses)
    ) {
        aliases.push(withoutParentheses);
    }

    if (answer.startsWith("@")) {
        const withoutAt = answer.slice(1);

        if (!aliases.includes(withoutAt)) {
            aliases.push(withoutAt);
        }
    }

    if (answer.includes("スコープ")) {
        const shortAnswer = answer.replace(
            "スコープ",
            ""
        );

        if (!aliases.includes(shortAnswer)) {
            aliases.push(shortAnswer);
        }
    }

    return aliases;
}


const fillQuizzes = fillQuestionIndexes.map(index => {
    const item = questionBank[index];

    return {
        type: "fill",
        label: "穴埋め",
        category: item.category,

        q:
            "次の説明に当てはまる用語を答えてください。" +
            "【　】＝" +
            item.question
                .replace(
                    "はどれですか。",
                    ""
                )
                .replace(
                    "を何といいますか。",
                    ""
                ),

        answers:
            createAnswerAliases(item.answer),

        displayAnswer:
            item.answer,

        explanation:
            item.question
    };
});


/* =====================================================
   選択問題100問
===================================================== */

function getDifferentAnswers(
    currentItem,
    currentIndex
) {
    const sameCategory = questionBank.filter(
        (item, index) =>
            item.category === currentItem.category &&
            index !== currentIndex &&
            item.answer !== currentItem.answer
    );

    const allOtherItems = questionBank.filter(
        (item, index) =>
            index !== currentIndex &&
            item.answer !== currentItem.answer
    );

    const source =
        sameCategory.length >= 3
            ? sameCategory
            : allOtherItems;

    const answers = [];

    let offset = 0;

    while (
        answers.length < 3 &&
        offset < source.length * 2
    ) {
        const sourceIndex =
            (
                currentIndex * 3 +
                offset
            ) % source.length;

        const candidate =
            source[sourceIndex].answer;

        if (
            candidate !== currentItem.answer &&
            !answers.includes(candidate)
        ) {
            answers.push(candidate);
        }

        offset++;
    }

    if (answers.length < 3) {
        for (const item of allOtherItems) {
            if (
                answers.length >= 3
            ) {
                break;
            }

            if (
                item.answer !== currentItem.answer &&
                !answers.includes(item.answer)
            ) {
                answers.push(item.answer);
            }
        }
    }

    return answers;
}


const selectionQuizzes = questionBank.map(
    (item, index) => {
        const wrongAnswers =
            getDifferentAnswers(item, index);

        const correctPosition =
            index % 4;

        const options =
            [...wrongAnswers];

        options.splice(
            correctPosition,
            0,
            item.answer
        );

        return {
            type: "mc",
            label: "選択",
            category: item.category,
            q: item.question,
            options,
            answer: correctPosition,
            displayAnswer: item.answer,
            explanation:
                "正解は「" +
                item.answer +
                "」です。"
        };
    }
);


/* =====================================================
   前半時点の問題数確認
===================================================== */

if (fillQuizzes.length !== 30) {
    console.error(
        "穴埋め問題が30問ではありません。",
        fillQuizzes.length
    );
}

if (selectionQuizzes.length !== 100) {
    console.error(
        "選択問題が100問ではありません。",
        selectionQuizzes.length
    );
}
/* =====================================================
   ○×問題30問

   形式：
   分類 | 問題文 | 正誤 | 解説

   正誤：
   true ＝ ○
   false ＝ ×
===================================================== */

const trueFalseRows = [
    {
        category: "Servlet",
        question:
            "HttpServletを継承してサーブレットを作成できる。",
        correct: true,
        explanation:
            "一般的なHTTPサーブレットはHttpServletを継承して作成します。"
    },
    {
        category: "Servlet",
        question:
            "doGet()はPOSTリクエストだけを処理するメソッドである。",
        correct: false,
        explanation:
            "doGet()は主にGETリクエストを処理します。POSTリクエストは主にdoPost()で処理します。"
    },
    {
        category: "Servlet",
        question:
            "getParameter()の戻り値は基本的にString型である。",
        correct: true,
        explanation:
            "リクエストパラメータは基本的にString型で取得します。数値として使用する場合は型変換が必要です。"
    },
    {
        category: "Lifecycle",
        question:
            "init()はサーブレットの初期化時に原則一度呼ばれる。",
        correct: true,
        explanation:
            "init()はサーブレットのインスタンス生成後、初期化時に原則一度呼ばれます。"
    },
    {
        category: "Lifecycle",
        question:
            "destroy()はリクエストを受信するたびに呼ばれる。",
        correct: false,
        explanation:
            "destroy()はリクエストのたびではなく、サーブレットが破棄される直前に呼ばれます。"
    },
    {
        category: "Lifecycle",
        question:
            "doGet()やdoPost()は複数回呼ばれる可能性がある。",
        correct: true,
        explanation:
            "doGet()やdoPost()はリクエストを受け取るたびに呼び出される可能性があります。"
    },
    {
        category: "Scope",
        question:
            "リクエストスコープの属性は、リダイレクト後もそのまま保持される。",
        correct: false,
        explanation:
            "リダイレクトではブラウザから新しいリクエストが送られるため、元のリクエスト属性は基本的に引き継がれません。"
    },
    {
        category: "Scope",
        question:
            "セッションスコープは、利用者ごとの情報保存に利用できる。",
        correct: true,
        explanation:
            "ログインユーザー情報など、同じ利用者の複数リクエストで使うデータに適しています。"
    },
    {
        category: "Scope",
        question:
            "アプリケーションスコープは、すべての利用者から共有される可能性がある。",
        correct: true,
        explanation:
            "アプリケーションスコープはWebアプリケーション全体で共有されます。"
    },
    {
        category: "Scope",
        question:
            "setAttribute()は、スコープへ属性を保存するメソッドである。",
        correct: true,
        explanation:
            "setAttribute(属性名, オブジェクト)の形式でスコープへデータを保存します。"
    },
    {
        category: "Scope",
        question:
            "getAttribute()の戻り値は常にString型である。",
        correct: false,
        explanation:
            "getAttribute()の戻り値は基本的にObject型です。Java側では必要に応じてキャストします。"
    },
    {
        category: "Session",
        question:
            "removeAttribute()を呼ぶと、セッション全体が破棄される。",
        correct: false,
        explanation:
            "removeAttribute()は指定した属性だけを削除します。セッション全体を破棄するメソッドはinvalidate()です。"
    },
    {
        category: "Session",
        question:
            "invalidate()は、セッション全体を無効化するメソッドである。",
        correct: true,
        explanation:
            "invalidate()はセッション全体を無効化します。ログアウト処理でよく使用します。"
    },
    {
        category: "Session",
        question:
            "ブラウザを閉じると、サーバー側のHttpSessionも必ず直ちに削除される。",
        correct: false,
        explanation:
            "ブラウザを閉じても、サーバー側のHttpSessionはタイムアウトまで残る場合があります。"
    },
    {
        category: "Filter",
        question:
            "Filterは、文字コード設定などの共通処理に利用できる。",
        correct: true,
        explanation:
            "Filterを使うと、複数のサーブレットやJSPへ共通処理を適用できます。"
    },
    {
        category: "Filter",
        question:
            "chain.doFilter()を呼ばなくても、必ず次のサーブレットが実行される。",
        correct: false,
        explanation:
            "通常はchain.doFilter()を呼ばなければ、次のフィルタやサーブレットへ処理が進みません。"
    },
    {
        category: "Filter",
        question:
            "chain.doFilter()より前に記述した処理は前処理になる。",
        correct: true,
        explanation:
            "chain.doFilter()より前が前処理、後ろが後処理になります。"
    },
    {
        category: "Filter",
        question:
            "複数フィルタの戻り処理は、行きの処理と逆の順番になる。",
        correct: true,
        explanation:
            "フィルタの呼び出しが入れ子になるため、戻り処理は行きと逆順になります。"
    },
    {
        category: "Listener",
        question:
            "ServletContextListenerは、Webアプリケーションの開始と終了を監視できる。",
        correct: true,
        explanation:
            "contextInitialized()とcontextDestroyed()を使って開始・終了時の処理を行えます。"
    },
    {
        category: "Thread",
        question:
            "サーブレットのインスタンスフィールドは、複数スレッドから共有される可能性がある。",
        correct: true,
        explanation:
            "通常、同じサーブレットインスタンスが複数のリクエスト処理で再利用されます。"
    },
    {
        category: "Thread",
        question:
            "リクエスト固有の入力値は、必ずサーブレットのインスタンスフィールドへ保存する。",
        correct: false,
        explanation:
            "リクエスト固有の入力値は、原則としてメソッド内のローカル変数などで扱います。"
    },
    {
        category: "Thread",
        question:
            "synchronizedは、複数スレッドによる同時実行の制御に利用できる。",
        correct: true,
        explanation:
            "synchronizedは同じロックに対する複数スレッドの同時実行を制御します。"
    },
    {
        category: "Transition",
        question:
            "フォワードでは、同じリクエストを遷移先へ引き継ぐことができる。",
        correct: true,
        explanation:
            "フォワードでは同じリクエストが引き継がれるため、リクエスト属性も利用できます。"
    },
    {
        category: "Transition",
        question:
            "リダイレクトでは、ブラウザから新しいリクエストが送信される。",
        correct: true,
        explanation:
            "sendRedirect()はブラウザに別URLへの再リクエストを行わせます。"
    },
    {
        category: "MVC",
        question:
            "MVCにおいて、JSPは主にControllerを担当する。",
        correct: false,
        explanation:
            "JSPは主にViewを担当します。Controllerは主にServletが担当します。"
    },
    {
        category: "JSP",
        question:
            "ELを使うと、JavaBeansのプロパティを簡潔に参照できる。",
        correct: true,
        explanation:
            "ELでは、たとえば${user.name}のような形式でプロパティを参照できます。"
    },
    {
        category: "JSP",
        question:
            "c:forEachは、JSTLの繰り返し処理用タグである。",
        correct: true,
        explanation:
            "c:forEachはコレクションなどを繰り返し処理するときに使用します。"
    },
    {
        category: "JDBC",
        question:
            "ResultSetを取得した直後は、すでに最初のデータ行を指している。",
        correct: false,
        explanation:
            "ResultSetを取得した直後のカーソルは、最初のデータ行より前にあります。next()で進める必要があります。"
    },
    {
        category: "JDBC",
        question:
            "入力値をSQL文字列へ直接連結することは、SQLインジェクション対策になる。",
        correct: false,
        explanation:
            "入力値の直接連結は危険です。PreparedStatementのプレースホルダを使用します。"
    },
    {
        category: "DAO",
        question:
            "DAOは、データベースアクセス処理をほかの処理から分離するために利用される。",
        correct: true,
        explanation:
            "DAOにはデータベース接続、SQL実行、検索結果の変換などをまとめます。"
    }
];


const trueFalseQuizzes = trueFalseRows.map(
    item => {
        return {
            type: "tf",
            label: "○×",
            category: item.category,
            q: item.question,
            options: [
                "○",
                "×"
            ],
            answer:
                item.correct
                    ? 0
                    : 1,
            displayAnswer:
                item.correct
                    ? "○"
                    : "×",
            explanation:
                item.explanation
        };
    }
);


/* =====================================================
   ○×問題数確認
===================================================== */

if (trueFalseQuizzes.length !== 30) {
    console.error(
        "○×問題が30問ではありません。",
        trueFalseQuizzes.length
    );
}


/* =====================================================
   コード読解問題10問
===================================================== */

const codeQuizzes = [
    {
        type: "code",
        label: "コード読解",
        category: "Servlet",

        q:
            "次のコードで取得しているものはどれですか。",

        code:
`String name =
    request.getParameter("name");`,

        options: [
            "リクエストパラメータnameの文字列",
            "セッション属性name",
            "初期化パラメータname",
            "データベースのname列"
        ],

        answer: 0,

        displayAnswer:
            "リクエストパラメータnameの文字列",

        explanation:
            "request.getParameter()は、フォームなどから送信されたリクエストパラメータを取得します。"
    },
    {
        type: "code",
        label: "コード読解",
        category: "Scope",

        q:
            "次のコードでデータが保存されるスコープはどれですか。",

        code:
`request.setAttribute(
    "message",
    "エラーです"
);`,

        options: [
            "セッションスコープ",
            "リクエストスコープ",
            "アプリケーションスコープ",
            "データベース"
        ],

        answer: 1,

        displayAnswer:
            "リクエストスコープ",

        explanation:
            "requestに対してsetAttribute()を呼んでいるため、リクエストスコープに保存されます。"
    },
    {
        type: "code",
        label: "コード読解",
        category: "Session",

        q:
            "次のコードの実行結果として正しいものはどれですか。",

        code:
`HttpSession session =
    request.getSession();

session.setAttribute(
    "loginUser",
    user
);`,

        options: [
            "ログインユーザーがデータベースへ自動保存される",
            "ログインユーザーがリクエストスコープへ保存される",
            "ログインユーザーがセッションスコープへ保存される",
            "セッション全体が破棄される"
        ],

        answer: 2,

        displayAnswer:
            "ログインユーザーがセッションスコープへ保存される",

        explanation:
            "session.setAttribute()によって、ログインユーザーがセッションスコープへ保存されます。"
    },
    {
        type: "code",
        label: "コード読解",
        category: "Session",

        q:
            "次のコードが行う処理はどれですか。",

        code:
`HttpSession session =
    request.getSession();

session.invalidate();`,

        options: [
            "指定した属性を1個だけ削除する",
            "ResultSetを閉じる",
            "新しい投稿を保存する",
            "セッション全体を無効化する"
        ],

        answer: 3,

        displayAnswer:
            "セッション全体を無効化する",

        explanation:
            "invalidate()はセッション全体を無効化します。ログアウト処理でよく使用します。"
    },
    {
        type: "code",
        label: "コード読解",
        category: "Filter",

        q:
            "次のコードの実行順として正しいものはどれですか。",

        code:
`System.out.println("A");

chain.doFilter(
    request,
    response
);

System.out.println("B");`,

        options: [
            "A → 後続処理 → B",
            "B → 後続処理 → A",
            "A → B → 後続処理",
            "後続処理だけが実行される"
        ],

        answer: 0,

        displayAnswer:
            "A → 後続処理 → B",

        explanation:
            "chain.doFilter()より前が前処理、後ろが後処理です。後続処理が終了して戻った後にBが出力されます。"
    },
    {
        type: "code",
        label: "コード読解",
        category: "Transition",

        q:
            "次のコードが行う画面遷移はどれですか。",

        code:
`RequestDispatcher dispatcher =
    request.getRequestDispatcher(
        "/WEB-INF/jsp/main.jsp"
    );

dispatcher.forward(
    request,
    response
);`,

        options: [
            "main.jspへリダイレクトする",
            "main.jspへフォワードする",
            "セッションを破棄する",
            "データベースへ接続する"
        ],

        answer: 1,

        displayAnswer:
            "main.jspへフォワードする",

        explanation:
            "RequestDispatcherのforward()を呼んでいるため、同じリクエストを引き継いでフォワードします。"
    },
    {
        type: "code",
        label: "コード読解",
        category: "Transition",

        q:
            "次のコードを実行した場合、ブラウザはどうなりますか。",

        code:
`response.sendRedirect(
    request.getContextPath()
        + "/Login"
);`,

        options: [
            "同じリクエストのままJSPを表示する",
            "セッションを必ず破棄する",
            "Loginへ新しいリクエストを送信する",
            "ResultSetを生成する"
        ],

        answer: 2,

        displayAnswer:
            "Loginへ新しいリクエストを送信する",

        explanation:
            "sendRedirect()によって、ブラウザが指定されたURLへ新しいリクエストを送信します。"
    },
    {
        type: "code",
        label: "コード読解",
        category: "JDBC",

        q:
            "次のコードのsetString(1, name)が行う処理はどれですか。",

        code:
`String sql =
    "SELECT * FROM users "
    + "WHERE name = ?";

PreparedStatement pstmt =
    conn.prepareStatement(sql);

pstmt.setString(
    1,
    name
);`,

        options: [
            "ResultSetの1行目へカーソルを移動する",
            "セッションへnameを保存する",
            "SQL文字列へnameを直接連結する",
            "1番目のプレースホルダへnameを設定する"
        ],

        answer: 3,

        displayAnswer:
            "1番目のプレースホルダへnameを設定する",

        explanation:
            "PreparedStatementのパラメータ番号は1から始まります。setString(1, name)は1番目の?へnameを設定します。"
    },
    {
        type: "code",
        label: "コード読解",
        category: "JDBC",

        q:
            "次のwhile文が繰り返される条件はどれですか。",

        code:
`ResultSet rs =
    pstmt.executeQuery();

while (rs.next()) {
    String name =
        rs.getString("name");
}`,

        options: [
            "次の検索結果行が存在する間",
            "セッションが存在する間",
            "SQL文に?が存在する間",
            "サーブレットが破棄されるまで"
        ],

        answer: 0,

        displayAnswer:
            "次の検索結果行が存在する間",

        explanation:
            "rs.next()は次の行が存在するとtrueを返します。trueの間、検索結果を1行ずつ処理します。"
    },
    {
        type: "code",
        label: "コード読解",
        category: "JSP",

        q:
            "次のJSTLコードが行う処理はどれですか。",

        code:
`<c:forEach
    var="item"
    items="\${itemList}">

    <c:out
        value="\${item.name}" />

</c:forEach>`,

        options: [
            "itemListをデータベースから削除する",
            "itemListの各要素のnameを順番に出力する",
            "セッション全体を破棄する",
            "サーブレットを初期化する"
        ],

        answer: 1,

        displayAnswer:
            "itemListの各要素のnameを順番に出力する",

        explanation:
            "c:forEachでitemListを繰り返し、c:outで各itemのnameを出力しています。"
    }
];


/* =====================================================
   コード読解問題数確認
===================================================== */

if (codeQuizzes.length !== 10) {
    console.error(
        "コード読解問題が10問ではありません。",
        codeQuizzes.length
    );
}


/* =====================================================
   全170問を結合

   1～30：
   穴埋め問題

   31～130：
   選択問題

   131～160：
   ○×問題

   161～170：
   コード読解問題
===================================================== */

const mobileQuizzes = [
    ...fillQuizzes,
    ...selectionQuizzes,
    ...trueFalseQuizzes,
    ...codeQuizzes
];


/* =====================================================
   最終的な問題数の検証
===================================================== */

const questionCounts = {
    fill:
        fillQuizzes.length,

    selection:
        selectionQuizzes.length,

    trueFalse:
        trueFalseQuizzes.length,

    code:
        codeQuizzes.length,

    total:
        mobileQuizzes.length
};


console.log(
    "穴埋め問題：" +
    questionCounts.fill +
    "問"
);

console.log(
    "選択問題：" +
    questionCounts.selection +
    "問"
);

console.log(
    "○×問題：" +
    questionCounts.trueFalse +
    "問"
);

console.log(
    "コード読解問題：" +
    questionCounts.code +
    "問"
);

console.log(
    "合計：" +
    questionCounts.total +
    "問"
);


if (
    questionCounts.fill !== 30 ||
    questionCounts.selection !== 100 ||
    questionCounts.trueFalse !== 30 ||
    questionCounts.code !== 10 ||
    questionCounts.total !== 170
) {
    console.error(
        "問題数が指定された数と一致していません。",
        questionCounts
    );
} else {
    console.log(
        "問題数の確認が完了しました。合計170問です。",
        questionCounts
    );
}

