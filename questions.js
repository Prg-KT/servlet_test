"use strict";

/* =====================================================
   サーバーサイドJava 後期テスト対策
   questions.js 1/3

   このファイルは次の順番で結合する。
   1/3：共通設定・用語集・穴埋め30問
   2/3：選択問題100問
   3/3：○×30問・コード読解10問・全問題結合
===================================================== */


/* =====================================================
   考査6分野の共通設定
===================================================== */

const QUIZ_CATEGORIES = Object.freeze({
    session: {
        key: "session",
        label: "セッション管理"
    },

    auth: {
        key: "auth",
        label: "ログイン認証・ログアウト"
    },

    lifecycle: {
        key: "lifecycle",
        label: "ライフサイクル・リスナー"
    },

    filter: {
        key: "filter",
        label: "フィルタ"
    },

    jsp: {
        key: "jsp",
        label: "JSP・EL・JSTL"
    },

    jdbc: {
        key: "jdbc",
        label: "JDBC・DAO"
    }
});


const QUIZ_CATEGORY_ORDER = [
    "session",
    "auth",
    "lifecycle",
    "filter",
    "jsp",
    "jdbc"
];


function getQuizCategoryLabel(categoryKey) {
    return QUIZ_CATEGORIES[categoryKey]?.label ??
        categoryKey;
}


/* =====================================================
   重要用語集

   既存の用語を残し、今回の考査範囲に必要な用語を追加。
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
        term: "service()",
        category: "Lifecycle",
        level: "最重要",
        meaning:
            "HTTPリクエストを受け取り、HTTPメソッドに応じてdoGet()やdoPost()などへ処理を振り分けるメソッド。",
        point:
            "通常はサーブレットコンテナによってリクエストごとに呼び出される。",
        trap:
            "初期化時に1回だけ呼ばれるメソッドではない。"
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
        category: "Session",
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
        term: "HttpSession",
        category: "Session",
        level: "最重要",
        meaning:
            "利用者ごとのセッション情報をサーバー側で管理するためのオブジェクト。",
        point:
            "request.getSession()などで取得する。",
        trap:
            "全利用者が同じHttpSessionを共有するわけではない。"
    },
    {
        term: "getSession()",
        category: "Session",
        level: "最重要",
        meaning:
            "既存のHttpSessionを取得し、存在しない場合は新しく生成するメソッド。",
        point:
            "HttpSession session = request.getSession();のように使用する。",
        trap:
            "セッションが存在しないときに必ずnullを返すメソッドではない。"
    },
    {
        term: "getSession(false)",
        category: "Session",
        level: "最重要",
        meaning:
            "既存のHttpSessionだけを取得し、存在しない場合はnullを返す呼び出し。",
        point:
            "新しいセッションを作成せずにログイン状態を確認したい場合などに利用できる。",
        trap:
            "セッションがない場合に新しいセッションを生成しない。"
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
        term: "JSESSIONID",
        category: "Session",
        level: "最重要",
        meaning:
            "Servlet環境でセッションIDの受け渡しに一般的に使用されるCookie名。",
        point:
            "ブラウザが送信するJSESSIONIDを利用して、サーバー側のHttpSessionを識別する。",
        trap:
            "JSESSIONIDの値はログインパスワードではない。"
    },
    {
        term: "setMaxInactiveInterval()",
        category: "Session",
        level: "重要",
        meaning:
            "セッションの最大無操作時間を秒単位で設定するメソッド。",
        point:
            "指定時間を超えて操作がない場合、セッションがタイムアウトする。",
        trap:
            "引数の単位は通常ミリ秒ではなく秒。"
    },
    {
        term: "セッションタイムアウト",
        category: "Session",
        level: "重要",
        meaning:
            "一定時間アクセスがないセッションを無効化する仕組み。",
        point:
            "不要なセッションをサーバー上へ残し続けないために使用される。",
        trap:
            "ブラウザを閉じた瞬間に必ずサーバー側セッションが削除されるという意味ではない。"
    },
    {
        term: "ログイン認証",
        category: "Authentication",
        level: "最重要",
        meaning:
            "入力されたIDやパスワードなどを確認し、利用者本人であるかを判定する処理。",
        point:
            "認証成功後は、必要なユーザー情報をセッションへ保存することが多い。",
        trap:
            "パスワードそのものをセッションへ保存する必要はない。"
    },
    {
        term: "ログアウト",
        category: "Authentication",
        level: "最重要",
        meaning:
            "ログイン状態を終了させ、保護された機能を利用できない状態へ戻す処理。",
        point:
            "session.invalidate()でセッション全体を無効化する方法が代表的。",
        trap:
            "画面をログインページへ移動するだけでは、セッション上のログイン情報が残る場合がある。"
    },
    {
        term: "認証フィルタ",
        category: "Authentication",
        level: "最重要",
        meaning:
            "保護されたURLへのアクセス時に、ログイン状態を共通確認するフィルタ。",
        point:
            "未ログインならログイン画面へリダイレクトし、ログイン済みならchain.doFilter()を呼ぶ。",
        trap:
            "ログインページやCSSまで一律に遮断すると、リダイレクトループや表示崩れの原因になる。"
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
        term: "PRGパターン",
        category: "Transition",
        level: "重要",
        meaning:
            "POST処理後にリダイレクトし、GETで結果画面を表示するPost/Redirect/Getの流れ。",
        point:
            "画面更新によるフォームの二重送信を防ぎやすくする。",
        trap:
            "リダイレクト後は別リクエストになる。"
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
            "urlPatternsなどで対象URLを指定する。",
        trap:
            "対象URLの指定を誤ると、必要なリソースにフィルタが適用されない。"
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
        level: "最重要",
        meaning:
            "Webアプリケーションの開始・終了イベントを受け取るリスナー。",
        point:
            "contextInitialized()とcontextDestroyed()を使用する。",
        trap:
            "セッションの生成と破棄を監視するリスナーではない。"
    },
    {
        term: "HttpSessionListener",
        category: "Listener",
        level: "最重要",
        meaning:
            "HttpSessionの生成と破棄を監視するリスナー。",
        point:
            "sessionCreated()とsessionDestroyed()を使用する。",
        trap:
            "セッション属性の追加や削除を監視するインターフェースとは異なる。"
    },
    {
        term: "ServletRequestListener",
        category: "Listener",
        level: "重要",
        meaning:
            "リクエストの生成と破棄を監視するリスナー。",
        point:
            "requestInitialized()とrequestDestroyed()を使用する。",
        trap:
            "Webアプリケーション全体の開始・終了を監視するものではない。"
    },
    {
        term: "HttpSessionAttributeListener",
        category: "Listener",
        level: "重要",
        meaning:
            "セッション属性の追加、削除、置換を監視するリスナー。",
        point:
            "attributeAdded()、attributeRemoved()、attributeReplaced()を使用する。",
        trap:
            "HttpSessionそのものの生成・破棄だけを監視するリスナーではない。"
    },
    {
        term: "@WebListener",
        category: "Listener",
        level: "重要",
        meaning:
            "リスナークラスをWebアプリケーションへ登録するアノテーション。",
        point:
            "対象となるListenerインターフェースを実装したクラスへ付ける。",
        trap:
            "フィルタを登録するアノテーションではない。"
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
        term: "jsp:include",
        category: "JSP",
        level: "最重要",
        meaning:
            "リクエスト処理時に別のリソースを実行し、その結果を動的に取り込む標準アクションタグ。",
        point:
            "<jsp:include page=\"header.jsp\" />のように記述する。",
        trap:
            "includeディレクティブとは取り込みのタイミングが異なる。"
    },
    {
        term: "includeディレクティブ",
        category: "JSP",
        level: "最重要",
        meaning:
            "JSPの変換時に別ファイルの内容を静的に取り込むディレクティブ。",
        point:
            "<%@ include file=\"header.jsp\" %>のように記述する。",
        trap:
            "リクエストのたびに対象JSPを独立して実行する仕組みではない。"
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
        term: "EL暗黙オブジェクト",
        category: "JSP",
        level: "最重要",
        meaning:
            "EL式からスコープ、パラメータ、Cookieなどへアクセスするために用意されたオブジェクト。",
        point:
            "requestScope、sessionScope、applicationScope、param、cookieなどがある。",
        trap:
            "すべての暗黙オブジェクトが同じ種類の値を返すわけではない。"
    },
    {
        term: "empty演算子",
        category: "JSP",
        level: "重要",
        meaning:
            "EL式で値がnullまたは空であるかを確認する演算子。",
        point:
            "${empty loginUser}のように使用する。",
        trap:
            "Javaの文字列だけを対象とする演算子ではない。"
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
        term: "taglibディレクティブ",
        category: "JSP",
        level: "最重要",
        meaning:
            "JSPで使用するタグライブラリの接頭辞とURIを宣言するディレクティブ。",
        point:
            "JSTLのcoreタグをcという接頭辞で利用する場合などに記述する。",
        trap:
            "Javaクラスを継承するための記述ではない。"
    },
    {
        term: "c:if",
        category: "JSP",
        level: "重要",
        meaning:
            "指定した条件がtrueの場合に本体を実行するJSTLタグ。",
        point:
            "test属性にEL式で条件を記述する。",
        trap:
            "単独ではelse部分を持たない。"
    },
    {
        term: "c:choose",
        category: "JSP",
        level: "重要",
        meaning:
            "c:whenとc:otherwiseを組み合わせて複数条件分岐を行うJSTLタグ。",
        point:
            "Javaのif、else if、elseに近い分岐を表現できる。",
        trap:
            "繰り返し処理を行うタグではない。"
    },
    {
        term: "c:forEach",
        category: "JSP",
        level: "最重要",
        meaning:
            "コレクションや配列などを繰り返し処理するJSTLタグ。",
        point:
            "items属性に繰り返す対象、var属性に各要素を受け取る名前を指定する。",
        trap:
            "データベースから自動的にデータを取得するタグではない。"
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
        term: "Connection",
        category: "JDBC",
        level: "最重要",
        meaning:
            "Javaプログラムとデータベースとの接続を表すJDBCオブジェクト。",
        point:
            "SQLを実行するPreparedStatementなどを生成する。",
        trap:
            "SELECTの検索結果そのものを保持するオブジェクトではない。"
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
        term: "executeQuery()",
        category: "JDBC",
        level: "最重要",
        meaning:
            "主にSELECT文を実行し、ResultSetを取得するメソッド。",
        point:
            "検索結果を1行ずつ処理するときに使用する。",
        trap:
            "通常、INSERTやUPDATEの更新件数を取得するメソッドではない。"
    },
    {
        term: "executeUpdate()",
        category: "JDBC",
        level: "最重要",
        meaning:
            "主にINSERT、UPDATE、DELETEを実行し、更新された行数を返すメソッド。",
        point:
            "戻り値が1なら、1行が登録・更新・削除されたと判断できる。",
        trap:
            "SELECTの検索結果としてResultSetを返すメソッドではない。"
    },
    {
        term: "try-with-resources",
        category: "JDBC",
        level: "重要",
        meaning:
            "使用後に閉じる必要があるリソースを自動的にcloseするJavaの構文。",
        point:
            "Connection、PreparedStatement、ResultSetなどの管理に利用できる。",
        trap:
            "例外が発生しないことを保証する構文ではない。"
    },
    {
        term: "トランザクション",
        category: "JDBC",
        level: "重要",
        meaning:
            "複数のデータベース操作を、まとめて成功または失敗させる処理単位。",
        point:
            "commit()で確定し、rollback()で取り消す。",
        trap:
            "途中の処理だけを確定すると、データ不整合につながる場合がある。"
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
    },
    {
        term: "CRUD",
        category: "JDBC",
        level: "最重要",
        meaning:
            "データの登録、参照、更新、削除という4つの基本操作。",
        point:
            "Create、Read、Update、Deleteの頭文字。",
        trap:
            "SELECTだけを表す言葉ではない。"
    }
];


/* =====================================================
   穴埋め問題生成用関数
===================================================== */

function normalizeFillAnswer(answer) {
    return String(answer)
        .normalize("NFKC")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[（）]/g, "()")
        .replace(/；/g, ";");
}


function createFillQuiz({
    category,
    question,
    answer,
    aliases = [],
    explanation
}) {
    const allAnswers = [
        answer,
        ...aliases
    ];

    const uniqueAnswers = [
        ...new Set(
            allAnswers.map(normalizeFillAnswer)
        )
    ];

    return {
        type: "fill",
        label: "穴埋め",
        category,
        categoryLabel:
            getQuizCategoryLabel(category),
        q: question,
        answers: uniqueAnswers,
        displayAnswer: answer,
        explanation
    };
}


/* =====================================================
   穴埋め問題30問

   各分野5問
===================================================== */

const fillQuizzes = [
    /* ------------------------------
       セッション管理：5問
    ------------------------------ */

    createFillQuiz({
        category: "session",

        question:
            "既存のセッションを取得し、存在しない場合は新しく生成するメソッドは【　】です。",

        answer:
            "getSession()",

        aliases: [
            "getSession",
            "request.getSession()",
            "request.getSession"
        ],

        explanation:
            "request.getSession()は既存のHttpSessionを取得し、存在しない場合は新しく生成します。"
    }),

    createFillQuiz({
        category: "session",

        question:
            "新しいセッションを生成せず、既存のセッションがない場合にnullを返す呼び出しは【　】です。",

        answer:
            "getSession(false)",

        aliases: [
            "request.getSession(false)"
        ],

        explanation:
            "request.getSession(false)は既存のセッションだけを取得し、存在しなければnullを返します。"
    }),

    createFillQuiz({
        category: "session",

        question:
            "Servlet環境でセッションIDの受け渡しに一般的に利用されるCookie名は【　】です。",

        answer:
            "JSESSIONID",

        aliases: [
            "jsessionid"
        ],

        explanation:
            "一般的なServlet環境では、JSESSIONIDというCookieでセッションIDを受け渡します。"
    }),

    createFillQuiz({
        category: "session",

        question:
            "セッションの最大無操作時間を秒単位で設定するメソッドは【　】です。",

        answer:
            "setMaxInactiveInterval()",

        aliases: [
            "setMaxInactiveInterval"
        ],

        explanation:
            "setMaxInactiveInterval()の引数には、最大無操作時間を秒単位で指定します。"
    }),

    createFillQuiz({
        category: "session",

        question:
            "セッションから指定した属性だけを削除するメソッドは【　】です。",

        answer:
            "removeAttribute()",

        aliases: [
            "removeAttribute"
        ],

        explanation:
            "removeAttribute()は指定した属性だけを削除します。セッション全体の破棄にはinvalidate()を使用します。"
    }),

    /* ------------------------------
       ログイン認証・ログアウト：5問
    ------------------------------ */

    createFillQuiz({
        category: "auth",

        question:
            "認証成功後のユーザー情報を、複数リクエストにまたがって保持する代表的な保存先は【　】です。",

        answer:
            "セッションスコープ",

        aliases: [
            "セッション",
            "HttpSession"
        ],

        explanation:
            "ログインユーザー情報は、利用者ごとの複数リクエストで使用するため、セッションスコープへ保存するのが代表的です。"
    }),

    createFillQuiz({
        category: "auth",

        question:
            "ログアウト時にHttpSession全体を無効化するメソッドは【　】です。",

        answer:
            "invalidate()",

        aliases: [
            "invalidate",
            "session.invalidate()"
        ],

        explanation:
            "session.invalidate()を呼び出すとセッション全体が無効化され、保存されていた属性も利用できなくなります。"
    }),

    createFillQuiz({
        category: "auth",

        question:
            "ブラウザへ別URLへの再リクエストを指示するメソッドは【　】です。",

        answer:
            "sendRedirect()",

        aliases: [
            "sendRedirect",
            "response.sendRedirect()"
        ],

        explanation:
            "response.sendRedirect()はブラウザへ再アクセスを指示するため、遷移先では新しいリクエストになります。"
    }),

    createFillQuiz({
        category: "auth",

        question:
            "認証成功後の二重送信を防ぎやすくする、POST→リダイレクト→GETの流れを【　】といいます。",

        answer:
            "PRGパターン",

        aliases: [
            "PRG",
            "Post/Redirect/Get",
            "Post Redirect Get"
        ],

        explanation:
            "PRGはPost/Redirect/Getの略で、POST完了後にリダイレクトしてGET画面を表示する流れです。"
    }),

    createFillQuiz({
        category: "auth",

        question:
            "複数の保護ページへ共通のログイン確認を適用するために利用できる仕組みは【　】です。",

        answer:
            "認証フィルタ",

        aliases: [
            "Filter",
            "フィルタ"
        ],

        explanation:
            "認証フィルタを利用すると、複数のURLに対してログイン状態の確認を共通化できます。"
    }),

    /* ------------------------------
       ライフサイクル・リスナー：5問
    ------------------------------ */

    createFillQuiz({
        category: "lifecycle",

        question:
            "サーブレットの初期化時に原則一度呼び出されるメソッドは【　】です。",

        answer:
            "init()",

        aliases: [
            "init"
        ],

        explanation:
            "init()はサーブレットのインスタンス生成後、初期化時に原則一度呼び出されます。"
    }),

    createFillQuiz({
        category: "lifecycle",

        question:
            "リクエストを受け取り、HTTPメソッドに応じてdoGet()やdoPost()へ振り分けるメソッドは【　】です。",

        answer:
            "service()",

        aliases: [
            "service"
        ],

        explanation:
            "HttpServletのservice()は、リクエストのHTTPメソッドに応じてdoGet()やdoPost()などを呼び分けます。"
    }),

    createFillQuiz({
        category: "lifecycle",

        question:
            "サーブレットが破棄される前に呼び出されるメソッドは【　】です。",

        answer:
            "destroy()",

        aliases: [
            "destroy"
        ],

        explanation:
            "destroy()はサーブレットが破棄される前に呼び出され、共有資源の解放などに利用できます。"
    }),

    createFillQuiz({
        category: "lifecycle",

        question:
            "Webアプリケーションの開始と終了を監視するリスナーは【　】です。",

        answer:
            "ServletContextListener",

        explanation:
            "ServletContextListenerはcontextInitialized()とcontextDestroyed()でWebアプリケーションの開始と終了を監視します。"
    }),

    createFillQuiz({
        category: "lifecycle",

        question:
            "リスナークラスを登録するためのアノテーションは【　】です。",

        answer:
            "@WebListener",

        aliases: [
            "WebListener"
        ],

        explanation:
            "@WebListenerを、対象のListenerインターフェースを実装したクラスへ付けます。"
    }),

    /* ------------------------------
       フィルタ：5問
    ------------------------------ */

    createFillQuiz({
        category: "filter",

        question:
            "フィルタの中心となる処理を記述するメソッドは【　】です。",

        answer:
            "doFilter()",

        aliases: [
            "doFilter"
        ],

        explanation:
            "FilterインターフェースのdoFilter()へ、前処理、後続処理の呼び出し、後処理を記述します。"
    }),

    createFillQuiz({
        category: "filter",

        question:
            "次のフィルタまたは対象リソースへ処理を進める呼び出しは【　】です。",

        answer:
            "chain.doFilter()",

        aliases: [
            "chain.doFilter",
            "FilterChain.doFilter()"
        ],

        explanation:
            "chain.doFilter(request, response)を呼び出すことで、後続のフィルタまたは対象リソースへ処理が進みます。"
    }),

    createFillQuiz({
        category: "filter",

        question:
            "chain.doFilter()より前に記述する処理を【　】といいます。",

        answer:
            "前処理",

        explanation:
            "chain.doFilter()より前が前処理で、文字コード設定や認証確認などを実行できます。"
    }),

    createFillQuiz({
        category: "filter",

        question:
            "chain.doFilter()から戻った後に記述する処理を【　】といいます。",

        answer:
            "後処理",

        explanation:
            "対象リソースや後続フィルタの処理が終了して戻った後に、後処理が実行されます。"
    }),

    createFillQuiz({
        category: "filter",

        question:
            "フィルタと対象URLを登録するアノテーションは【　】です。",

        answer:
            "@WebFilter",

        aliases: [
            "WebFilter"
        ],

        explanation:
            "@WebFilterのvalueやurlPatternsなどを利用して、フィルタの対象URLを指定します。"
    }),

    /* ------------------------------
       JSP・EL・JSTL：5問
    ------------------------------ */

    createFillQuiz({
        category: "jsp",

        question:
            "リクエスト処理時に別リソースの実行結果を動的に取り込む標準アクションタグは【　】です。",

        answer:
            "<jsp:include>",

        aliases: [
            "jsp:include",
            "<jsp:include />"
        ],

        explanation:
            "<jsp:include>はリクエスト処理時に対象リソースを実行し、その結果を動的に取り込みます。"
    }),

    createFillQuiz({
        category: "jsp",

        question:
            "JSPの変換時に別ファイルの内容を静的に取り込むものは【　】です。",

        answer:
            "includeディレクティブ",

        aliases: [
            "<%@ include %>",
            "include directive"
        ],

        explanation:
            "includeディレクティブは、JSPがサーブレットへ変換される段階で別ファイルの内容を取り込みます。"
    }),

    createFillQuiz({
        category: "jsp",

        question:
            "EL式でリクエストパラメータを参照する暗黙オブジェクトは【　】です。",

        answer:
            "param",

        explanation:
            "${param.id}のように記述すると、idという名前のリクエストパラメータを参照できます。"
    }),

    createFillQuiz({
        category: "jsp",

        question:
            "JSTLでコレクションや配列を繰り返し処理するタグは【　】です。",

        answer:
            "<c:forEach>",

        aliases: [
            "c:forEach",
            "<c:forEach>"
        ],

        explanation:
            "<c:forEach>のitems属性に繰り返す対象、var属性に各要素を受け取る変数名を指定します。"
    }),

    createFillQuiz({
        category: "jsp",

        question:
            "JSPで使用するタグライブラリの接頭辞とURIを宣言するものは【　】です。",

        answer:
            "taglibディレクティブ",

        aliases: [
            "taglib",
            "<%@ taglib %>"
        ],

        explanation:
            "JSTLなどのタグライブラリを利用するには、環境に応じたtaglibディレクティブを記述します。"
    }),

    /* ------------------------------
       JDBC・DAO：5問
    ------------------------------ */

    createFillQuiz({
        category: "jdbc",

        question:
            "SQLのプレースホルダへ値を設定して実行できるJDBCオブジェクトは【　】です。",

        answer:
            "PreparedStatement",

        explanation:
            "PreparedStatementではSQL中の?へsetString()やsetInt()で値を設定できます。"
    }),

    createFillQuiz({
        category: "jdbc",

        question:
            "SELECT文の検索結果を保持するJDBCオブジェクトは【　】です。",

        answer:
            "ResultSet",

        explanation:
            "ResultSetはSELECT文の検索結果を保持し、next()でカーソルを次の行へ進めます。"
    }),

    createFillQuiz({
        category: "jdbc",

        question:
            "主にSELECT文を実行してResultSetを取得するメソッドは【　】です。",

        answer:
            "executeQuery()",

        aliases: [
            "executeQuery"
        ],

        explanation:
            "executeQuery()は主にSELECT文に利用し、検索結果としてResultSetを返します。"
    }),

    createFillQuiz({
        category: "jdbc",

        question:
            "主にINSERT、UPDATE、DELETEを実行し、更新行数を返すメソッドは【　】です。",

        answer:
            "executeUpdate()",

        aliases: [
            "executeUpdate"
        ],

        explanation:
            "executeUpdate()は主に更新系SQLへ使用し、登録・更新・削除された行数を返します。"
    }),

    createFillQuiz({
        category: "jdbc",

        question:
            "データベースアクセス処理をほかの処理から分離する設計パターンは【　】です。",

        answer:
            "DAO",

        aliases: [
            "DAOパターン",
            "Data Access Object"
        ],

        explanation:
            "DAOは接続、SQL実行、検索結果の変換など、データベースアクセスに関する処理をまとめます。"
    })
];


/* =====================================================
   穴埋め問題数の確認
===================================================== */

if (fillQuizzes.length !== 30) {
    console.error(
        "穴埋め問題が30問ではありません。",
        fillQuizzes.length
    );
   /* =====================================================
   questions.js 2/3
   選択問題100問
===================================================== */


/* =====================================================
   選択問題生成用関数
===================================================== */

function createSelectionSource(
    category,
    question,
    correct,
    wrongAnswers,
    explanation
) {
    return {
        category,
        question,
        correct,
        wrongAnswers,
        explanation
    };
}


/* =====================================================
   選択問題の元データ100問

   配分：
   セッション管理　　　　　　16問
   ログイン認証・ログアウト　16問
   ライフサイクル・リスナー　17問
   フィルタ　　　　　　　　17問
   JSP・EL・JSTL　　　　　 17問
   JDBC・DAO　　　　　　　 17問
   合計　　　　　　　　　 100問
===================================================== */

const selectionQuestionSources = [
    /* =================================================
       セッション管理：16問
    ================================================= */

    createSelectionSource(
        "session",
        "既存のセッションを取得し、存在しない場合は新しく生成する呼び出しはどれですか。",
        "request.getSession()",
        [
            "request.getSession(false)",
            "request.getAttribute(\"session\")",
            "request.getServletContext()"
        ],
        "request.getSession()は既存のHttpSessionを取得し、存在しない場合は新しく生成します。"
    ),

    createSelectionSource(
        "session",
        "新しいセッションを生成せず、既存のセッションがない場合にnullを返す呼び出しはどれですか。",
        "request.getSession(false)",
        [
            "request.getSession()",
            "session.invalidate()",
            "session.isNew()"
        ],
        "request.getSession(false)はセッションが存在しない場合にnullを返し、新しいセッションは生成しません。"
    ),

    createSelectionSource(
        "session",
        "利用者ごとのセッション情報をサーバー側で管理するオブジェクトはどれですか。",
        "HttpSession",
        [
            "ServletContext",
            "HttpServletResponse",
            "ResultSet"
        ],
        "HttpSessionは、同じ利用者の複数リクエストにまたがる情報を管理します。"
    ),

    createSelectionSource(
        "session",
        "セッションへloginUserという名前でuserオブジェクトを保存する正しいコードはどれですか。",
        "session.setAttribute(\"loginUser\", user);",
        [
            "session.getAttribute(\"loginUser\", user);",
            "session.removeAttribute(\"loginUser\", user);",
            "session.setParameter(\"loginUser\", user);"
        ],
        "セッション属性の保存にはsetAttribute(属性名, オブジェクト)を使用します。"
    ),

    createSelectionSource(
        "session",
        "セッションからloginUser属性を取得する正しい呼び出しはどれですか。",
        "session.getAttribute(\"loginUser\")",
        [
            "session.getParameter(\"loginUser\")",
            "session.setAttribute(\"loginUser\")",
            "session.invalidate(\"loginUser\")"
        ],
        "属性の取得にはgetAttribute()を使用します。戻り値は基本的にObject型です。"
    ),

    createSelectionSource(
        "session",
        "セッションからmessage属性だけを削除したい場合に使用するメソッドはどれですか。",
        "removeAttribute()",
        [
            "invalidate()",
            "destroy()",
            "removeSession()"
        ],
        "removeAttribute()は指定した属性だけを削除します。"
    ),

    createSelectionSource(
        "session",
        "セッション全体を無効化するメソッドはどれですか。",
        "invalidate()",
        [
            "removeAttribute()",
            "close()",
            "destroy()"
        ],
        "invalidate()を呼ぶと、HttpSession全体が無効になります。"
    ),

    createSelectionSource(
        "session",
        "Servlet環境でセッションIDの受け渡しに一般的に使用されるCookie名はどれですか。",
        "JSESSIONID",
        [
            "SESSION_PASSWORD",
            "SERVLETID",
            "LOGIN_TOKEN_NAME"
        ],
        "一般的なServlet環境ではJSESSIONIDというCookie名が使用されます。"
    ),

    createSelectionSource(
        "session",
        "セッションIDの主な役割として正しいものはどれですか。",
        "ブラウザとサーバー側のHttpSessionを対応付ける",
        [
            "利用者のパスワードを暗号化する",
            "SQL文を自動生成する",
            "JSPをServletへ変換する"
        ],
        "セッションIDは、ブラウザからのアクセスとサーバー側のHttpSessionを対応付けます。"
    ),

    createSelectionSource(
        "session",
        "セッションの最大無操作時間を設定するメソッドはどれですか。",
        "setMaxInactiveInterval()",
        [
            "setContentLength()",
            "setSessionName()",
            "setRequestTimeout()"
        ],
        "setMaxInactiveInterval()には最大無操作時間を秒単位で指定します。"
    ),

    createSelectionSource(
        "session",
        "setMaxInactiveInterval(600)の意味として適切なものはどれですか。",
        "最大無操作時間を600秒に設定する",
        [
            "セッションIDを600に設定する",
            "最大無操作時間を600ミリ秒に設定する",
            "セッション属性を600個までに制限する"
        ],
        "setMaxInactiveInterval()の引数は秒単位です。600秒は10分です。"
    ),

    createSelectionSource(
        "session",
        "セッションが新しく作成されたものか確認するメソッドはどれですか。",
        "isNew()",
        [
            "isValid()",
            "isSession()",
            "isCreatedByUser()"
        ],
        "HttpSessionのisNew()は、クライアントがまだそのセッションへ参加していない新しい状態かを確認します。"
    ),

    createSelectionSource(
        "session",
        "現在のセッションIDを取得するメソッドはどれですか。",
        "getId()",
        [
            "getName()",
            "getSessionNumber()",
            "getCookieValue()"
        ],
        "HttpSessionのgetId()で、そのセッションの識別子を取得できます。"
    ),

    createSelectionSource(
        "session",
        "Cookieを利用できない環境で、URLにセッションIDを付加する方式に関係するメソッドはどれですか。",
        "response.encodeURL()",
        [
            "request.getParameter()",
            "session.removeAttribute()",
            "response.setContentType()"
        ],
        "encodeURL()は必要に応じてURLへセッションIDを付加するURLリライティングに利用されます。"
    ),

    createSelectionSource(
        "session",
        "ログインユーザー情報の保存先として最も適切なものはどれですか。",
        "セッションスコープ",
        [
            "すべての利用者で共有するアプリケーションスコープ",
            "一度の処理だけに限定されるローカル変数",
            "HTMLのコメント"
        ],
        "ログインユーザー情報は利用者ごとに複数リクエストで使用するため、セッションスコープが適しています。"
    ),

    createSelectionSource(
        "session",
        "ブラウザを閉じた場合のサーバー側HttpSessionについて正しい説明はどれですか。",
        "タイムアウトまでサーバー側に残る場合がある",
        [
            "必ずその瞬間にdestroy()が実行される",
            "必ずデータベースへ保存される",
            "すべての利用者のセッションが破棄される"
        ],
        "ブラウザを閉じても、サーバー側のHttpSessionはタイムアウトまで残る場合があります。"
    ),

    /* =================================================
       ログイン認証・ログアウト：16問
    ================================================= */

    createSelectionSource(
        "auth",
        "ログイン処理で最初に行う代表的な処理はどれですか。",
        "リクエストからIDやパスワードを取得する",
        [
            "必ずセッションを破棄する",
            "JSPから直接データベースを削除する",
            "ResultSetを作成せずにnext()を呼ぶ"
        ],
        "ログイン処理では、まずフォームから送信されたIDやパスワードをリクエストパラメータとして取得します。"
    ),

    createSelectionSource(
        "auth",
        "入力されたIDとパスワードを使って利用者を検索する処理を分離する場合、適切な担当はどれですか。",
        "ロジッククラスやDAO",
        [
            "CSSファイル",
            "HTMLコメント",
            "JSESSIONIDそのもの"
        ],
        "認証判定はロジッククラス、データベース検索はDAOなどへ分離できます。"
    ),

    createSelectionSource(
        "auth",
        "認証成功後にセッションへ保存する情報として最も適切なものはどれですか。",
        "必要なログインユーザー情報",
        [
            "入力された平文パスワードそのもの",
            "すべての利用者のパスワード一覧",
            "データベース接続オブジェクトを必ず保存する"
        ],
        "セッションにはユーザーIDや表示名など必要な情報を保存し、平文パスワードの保存は避けます。"
    ),

    createSelectionSource(
        "auth",
        "認証に失敗した場合の処理として適切なものはどれですか。",
        "エラーメッセージを設定してログイン画面を再表示する",
        [
            "必ずログイン済みとして扱う",
            "無条件で管理者画面を表示する",
            "入力されたパスワードを画面にそのまま表示する"
        ],
        "認証失敗時はログイン済み状態にせず、利用者へ適切なエラーを表示します。"
    ),

    createSelectionSource(
        "auth",
        "認証が必要なページでログイン状態を判定するとき、代表的に確認するものはどれですか。",
        "セッション内のログインユーザー属性",
        [
            "レスポンスのContent-Typeだけ",
            "JSPファイルの更新日時",
            "SQLの列数だけ"
        ],
        "セッション内にログインユーザー情報が存在するかを確認する方法が代表的です。"
    ),

    createSelectionSource(
        "auth",
        "未ログイン利用者が保護ページへアクセスした場合の処理として適切なものはどれですか。",
        "ログイン画面へリダイレクトする",
        [
            "必ず管理者権限を与える",
            "認証確認を行わず表示する",
            "データベース全体を削除する"
        ],
        "未ログインの場合は保護リソースへ進めず、ログイン画面などへ遷移させます。"
    ),

    createSelectionSource(
        "auth",
        "ログイン済みの場合に認証フィルタが行う処理として適切なものはどれですか。",
        "chain.doFilter()を呼び後続処理へ進める",
        [
            "必ずsession.invalidate()を呼ぶ",
            "必ず同じログイン画面へリダイレクトする",
            "サーブレットコンテナを停止する"
        ],
        "認証済みならchain.doFilter()を呼び、後続のフィルタや保護リソースへ処理を進めます。"
    ),

    createSelectionSource(
        "auth",
        "認証フィルタの対象からログイン画面を適切に除外しない場合、起こり得る問題はどれですか。",
        "リダイレクトループ",
        [
            "PreparedStatementが自動生成される",
            "ResultSetが必ず空になる",
            "JSTLがJavaへ変換されなくなる"
        ],
        "ログイン画面自体も未ログインとしてリダイレクトすると、同じ遷移が繰り返される可能性があります。"
    ),

    createSelectionSource(
        "auth",
        "ログアウト処理として最も適切なものはどれですか。",
        "セッションを無効化してからログイン画面などへ遷移する",
        [
            "画面だけ移動し、セッションは必ず残す",
            "パスワードをURLへ追加する",
            "アプリケーションスコープをすべて削除する"
        ],
        "ログアウトではセッションを無効化し、ログイン状態を確実に終了させます。"
    ),

    createSelectionSource(
        "auth",
        "ログアウトでsession.removeAttribute(\"loginUser\")を使った場合の説明として正しいものはどれですか。",
        "loginUser属性だけが削除され、ほかの属性は残る",
        [
            "セッション全体が必ず破棄される",
            "データベースのユーザーが削除される",
            "すべての利用者のログイン情報が削除される"
        ],
        "removeAttribute()は指定した属性だけを削除します。セッション全体の破棄はinvalidate()です。"
    ),

    createSelectionSource(
        "auth",
        "フォワードとリダイレクトの違いとして正しいものはどれですか。",
        "リダイレクトはブラウザから新しいリクエストが送られる",
        [
            "フォワードは必ず外部サイトだけに遷移する",
            "リダイレクトは同じリクエスト属性を必ず引き継ぐ",
            "フォワードではサーバー側処理を行えない"
        ],
        "リダイレクトではブラウザが指定URLへ新しいリクエストを送信します。"
    ),

    createSelectionSource(
        "auth",
        "認証失敗メッセージを同じリクエストでJSPへ渡したい場合に適した遷移はどれですか。",
        "フォワード",
        [
            "外部サイトへのリダイレクトだけ",
            "セッションの強制タイムアウト",
            "データベースのロールバックだけ"
        ],
        "フォワードは同じリクエストを引き継ぐため、設定したリクエスト属性をJSPで参照できます。"
    ),

    createSelectionSource(
        "auth",
        "POSTによるログイン成功後にリダイレクトする利点として適切なものはどれですか。",
        "画面更新によるPOSTの再送信を防ぎやすい",
        [
            "パスワードが自動的に暗号化される",
            "セッションが絶対にタイムアウトしなくなる",
            "SQLが不要になる"
        ],
        "POST後にリダイレクトするPRGパターンは、画面更新時の二重送信を防ぎやすくします。"
    ),

    createSelectionSource(
        "auth",
        "セッション固定攻撃への対策として、認証成功時に検討できる処理はどれですか。",
        "セッションIDを変更する",
        [
            "パスワードをURLへ付加する",
            "SQLへ入力値を直接連結する",
            "すべての認証確認を削除する"
        ],
        "認証成功時にセッションIDを変更することで、認証前のIDを固定される危険を減らせます。"
    ),

    createSelectionSource(
        "auth",
        "パスワードの取り扱いとして適切なものはどれですか。",
        "平文のまま保存せず、適切なハッシュ化を行う",
        [
            "誰でも読めるCookieへ保存する",
            "URLのクエリ文字列へ常に含める",
            "ログへ必ずそのまま出力する"
        ],
        "実際のシステムでは、パスワードを平文保存せず、ソルト付きの適切なパスワードハッシュを利用します。"
    ),

    createSelectionSource(
        "auth",
        "認証と認可の説明として正しいものはどれですか。",
        "認証は本人確認、認可は操作権限の確認",
        [
            "認証と認可は必ず同じ意味である",
            "認証はSQLの実行、認可はJSPの変換である",
            "認証はログアウトだけ、認可はログインだけである"
        ],
        "認証は利用者が誰かを確認する処理で、認可はその利用者が操作できるかを確認する処理です。"
    ),

    /* =================================================
       ライフサイクル・リスナー：17問
    ================================================= */

    createSelectionSource(
        "lifecycle",
        "サーブレットのインスタンス生成後、初期化時に原則一度呼ばれるメソッドはどれですか。",
        "init()",
        [
            "service()",
            "doGet()",
            "destroy()"
        ],
        "init()はサーブレットの初期化時に原則一度呼び出されます。"
    ),

    createSelectionSource(
        "lifecycle",
        "リクエストごとに呼ばれ、HTTPメソッドに応じて処理を振り分けるメソッドはどれですか。",
        "service()",
        [
            "init()",
            "destroy()",
            "contextDestroyed()"
        ],
        "service()はHTTPメソッドを確認し、doGet()やdoPost()などへ処理を振り分けます。"
    ),

    createSelectionSource(
        "lifecycle",
        "GETリクエストを処理する代表的なメソッドはどれですか。",
        "doGet()",
        [
            "doPost()",
            "destroy()",
            "sessionCreated()"
        ],
        "GETリクエストは通常doGet()で処理します。"
    ),

    createSelectionSource(
        "lifecycle",
        "POSTリクエストを処理する代表的なメソッドはどれですか。",
        "doPost()",
        [
            "doGet()",
            "init()",
            "contextInitialized()"
        ],
        "POSTリクエストは通常doPost()で処理します。"
    ),

    createSelectionSource(
        "lifecycle",
        "サーブレットが破棄される前に呼ばれるメソッドはどれですか。",
        "destroy()",
        [
            "doFilter()",
            "doPost()",
            "getSession()"
        ],
        "destroy()はサーブレットが破棄される前に呼ばれ、資源の解放などに利用できます。"
    ),

    createSelectionSource(
        "lifecycle",
        "サーブレットの生成、初期化、実行、破棄を管理するものはどれですか。",
        "サーブレットコンテナ",
        [
            "JSTL",
            "ResultSet",
            "Cookieだけ"
        ],
        "Tomcatなどのサーブレットコンテナがライフサイクルを管理します。"
    ),

    createSelectionSource(
        "lifecycle",
        "通常のサーブレットインスタンスについて正しい説明はどれですか。",
        "同じインスタンスが複数リクエストで再利用されることがある",
        [
            "必ずリクエストごとに新しいインスタンスが作られる",
            "1回のリクエスト後に必ずdestroy()される",
            "JSPから手動生成しなければ実行できない"
        ],
        "通常は同じサーブレットインスタンスが複数のリクエスト処理に利用されます。"
    ),

    createSelectionSource(
        "lifecycle",
        "リクエスト固有の入力値を保存する場所として、サーブレットのインスタンスフィールドを避ける主な理由はどれですか。",
        "複数スレッドから共有され、値が混ざる可能性があるため",
        [
            "フィールドにはStringを保存できないため",
            "フィールドは必ずデータベースへ保存されるため",
            "doGet()からフィールドを参照できないため"
        ],
        "サーブレットのフィールドは複数のリクエスト処理から共有される可能性があります。"
    ),

    createSelectionSource(
        "lifecycle",
        "Webアプリケーションの開始と終了を監視するリスナーはどれですか。",
        "ServletContextListener",
        [
            "HttpSessionListener",
            "ServletRequestListener",
            "FilterChain"
        ],
        "ServletContextListenerはWebアプリケーション全体の開始と終了を監視します。"
    ),

    createSelectionSource(
        "lifecycle",
        "Webアプリケーション開始時に呼ばれるメソッドはどれですか。",
        "contextInitialized()",
        [
            "contextDestroyed()",
            "sessionDestroyed()",
            "requestDestroyed()"
        ],
        "ServletContextListenerのcontextInitialized()はWebアプリケーション開始時に呼ばれます。"
    ),

    createSelectionSource(
        "lifecycle",
        "Webアプリケーション終了時に呼ばれるメソッドはどれですか。",
        "contextDestroyed()",
        [
            "contextInitialized()",
            "sessionCreated()",
            "attributeAdded()"
        ],
        "ServletContextListenerのcontextDestroyed()はWebアプリケーション終了時に呼ばれます。"
    ),

    createSelectionSource(
        "lifecycle",
        "HttpSessionの生成と破棄を監視するリスナーはどれですか。",
        "HttpSessionListener",
        [
            "ServletContextListener",
            "ServletRequestListener",
            "HttpServlet"
        ],
        "HttpSessionListenerはsessionCreated()とsessionDestroyed()を利用します。"
    ),

    createSelectionSource(
        "lifecycle",
        "新しいHttpSessionが生成されたときに呼ばれるメソッドはどれですか。",
        "sessionCreated()",
        [
            "sessionDestroyed()",
            "requestInitialized()",
            "contextDestroyed()"
        ],
        "HttpSessionListenerのsessionCreated()はセッション生成時に呼ばれます。"
    ),

    createSelectionSource(
        "lifecycle",
        "HttpSessionが破棄されたときに呼ばれるメソッドはどれですか。",
        "sessionDestroyed()",
        [
            "sessionCreated()",
            "contextInitialized()",
            "doPost()"
        ],
        "HttpSessionListenerのsessionDestroyed()はセッション破棄時に呼ばれます。"
    ),

    createSelectionSource(
        "lifecycle",
        "リクエストの生成と破棄を監視するリスナーはどれですか。",
        "ServletRequestListener",
        [
            "HttpSessionAttributeListener",
            "ServletContextListener",
            "PreparedStatement"
        ],
        "ServletRequestListenerはrequestInitialized()とrequestDestroyed()を利用します。"
    ),

    createSelectionSource(
        "lifecycle",
        "セッション属性の追加、削除、置換を監視するリスナーはどれですか。",
        "HttpSessionAttributeListener",
        [
            "HttpSessionListener",
            "ServletRequestListener",
            "ServletConfig"
        ],
        "HttpSessionAttributeListenerは属性の追加、削除、置換を監視します。"
    ),

    createSelectionSource(
        "lifecycle",
        "リスナークラスをアノテーションで登録する場合に使用するものはどれですか。",
        "@WebListener",
        [
            "@WebServlet",
            "@WebFilter",
            "@Overrideだけ"
        ],
        "@WebListenerをListenerインターフェースの実装クラスへ付けます。"
    ),

    /* =================================================
       フィルタ：17問
    ================================================= */

    createSelectionSource(
        "filter",
        "サーブレットやJSPの前後に共通処理を適用する仕組みはどれですか。",
        "Filter",
        [
            "ResultSet",
            "JavaBeans",
            "ServletConfigだけ"
        ],
        "Filterは文字コード設定、ログ、認証確認などの共通処理に利用できます。"
    ),

    createSelectionSource(
        "filter",
        "フィルタの中心となる処理を記述するメソッドはどれですか。",
        "doFilter()",
        [
            "doGet()",
            "executeQuery()",
            "sessionCreated()"
        ],
        "Filterインターフェースの中心となるメソッドはdoFilter()です。"
    ),

    createSelectionSource(
        "filter",
        "次のフィルタまたは対象リソースへ処理を進める呼び出しはどれですか。",
        "chain.doFilter(request, response)",
        [
            "filter.destroy(request, response)",
            "request.forward(chain)",
            "response.executeFilter()"
        ],
        "FilterChainのdoFilter()を呼ぶことで、後続の処理へ進みます。"
    ),

    createSelectionSource(
        "filter",
        "chain.doFilter()を呼ばなかった場合の一般的な結果はどれですか。",
        "後続のフィルタや対象サーブレットへ進まない",
        [
            "必ず対象サーブレットが2回実行される",
            "自動的にデータベースへ接続される",
            "セッションが必ず新規作成される"
        ],
        "chain.doFilter()を呼ばなければ、通常はそのフィルタで処理が止まります。"
    ),

    createSelectionSource(
        "filter",
        "chain.doFilter()より前に記述する処理を何といいますか。",
        "前処理",
        [
            "後処理",
            "破棄処理だけ",
            "トランザクション確定"
        ],
        "chain.doFilter()より前に実行する部分が前処理です。"
    ),

    createSelectionSource(
        "filter",
        "chain.doFilter()から戻った後に実行する処理を何といいますか。",
        "後処理",
        [
            "前処理",
            "初期化パラメータ",
            "JSP変換処理だけ"
        ],
        "後続処理が完了して戻った後に実行する部分が後処理です。"
    ),

    createSelectionSource(
        "filter",
        "FilterA、FilterB、Servletの順に進む場合の正しい実行順はどれですか。",
        "A前→B前→Servlet→B後→A後",
        [
            "A前→B前→Servlet→A後→B後",
            "Servlet→A前→A後→B前→B後",
            "A後→B後→Servlet→B前→A前"
        ],
        "フィルタは入れ子状に呼び出されるため、戻りの後処理は逆順です。"
    ),

    createSelectionSource(
        "filter",
        "フィルタをアノテーションで登録するときに使用するものはどれですか。",
        "@WebFilter",
        [
            "@WebServlet",
            "@WebListener",
            "@WebJDBC"
        ],
        "@WebFilterでフィルタと対象URLを登録できます。"
    ),

    createSelectionSource(
        "filter",
        "@WebFilterで対象URLを指定する属性として適切なものはどれですか。",
        "urlPatterns",
        [
            "sqlPatterns",
            "sessionNames",
            "jspVariables"
        ],
        "urlPatternsやvalueを利用して対象となるURLパターンを指定します。"
    ),

    createSelectionSource(
        "filter",
        "すべてのURLを対象にする代表的なURLパターンはどれですか。",
        "/*",
        [
            "/?",
            "*.*.*",
            "/WEB-INFだけ"
        ],
        "/*はWebアプリケーション内の広い範囲を対象にする代表的なパターンです。"
    ),

    createSelectionSource(
        "filter",
        "POSTパラメータの文字化けを防ぐ文字コードフィルタで、setCharacterEncoding()を実行する適切な位置はどれですか。",
        "getParameter()を呼ぶ前",
        [
            "getParameter()を呼んだ後だけ",
            "レスポンス完了後",
            "destroy()の実行後"
        ],
        "リクエスト本文を読み取る前に文字コードを設定する必要があります。"
    ),

    createSelectionSource(
        "filter",
        "未ログインの利用者を認証フィルタで止める場合の処理として適切なものはどれですか。",
        "ログイン画面へリダイレクトし、後続処理へ進めない",
        [
            "無条件でchain.doFilter()を呼ぶ",
            "管理者権限を自動的に付与する",
            "SQL文をURLへ表示する"
        ],
        "未ログインの場合はログイン画面へ遷移し、保護リソースを実行しないようにします。"
    ),

    createSelectionSource(
        "filter",
        "ログイン済みの利用者に対する認証フィルタの処理として適切なものはどれですか。",
        "chain.doFilter()を呼ぶ",
        [
            "必ずinvalidate()を呼ぶ",
            "必ず403だけを返す",
            "必ず新しいセッションを作り直す"
        ],
        "認証済みの場合はchain.doFilter()で後続処理へ進めます。"
    ),

    createSelectionSource(
        "filter",
        "フィルタの初期化時に呼ばれるメソッドはどれですか。",
        "init()",
        [
            "executeUpdate()",
            "sessionCreated()",
            "doPost()"
        ],
        "Filterにもinit()、doFilter()、destroy()というライフサイクルがあります。"
    ),

    createSelectionSource(
        "filter",
        "フィルタが破棄されるときに呼ばれるメソッドはどれですか。",
        "destroy()",
        [
            "getParameter()",
            "forward()",
            "next()"
        ],
        "フィルタのdestroy()は、フィルタが破棄される際に呼ばれます。"
    ),

    createSelectionSource(
        "filter",
        "ログ出力を複数サーブレットへ共通適用したい場合に適しているものはどれですか。",
        "ログ出力フィルタ",
        [
            "各JSPへ同じSQLを直接記述する",
            "セッションIDを固定する",
            "すべての処理をJavaBeansへ移す"
        ],
        "横断的な共通処理はフィルタへまとめると重複を減らせます。"
    ),

    createSelectionSource(
        "filter",
        "フィルタからレスポンスを確定し、後続処理を実行しない設計が適切な例はどれですか。",
        "未認証アクセスをログイン画面へリダイレクトする場合",
        [
            "認証済み利用者を保護ページへ進める場合",
            "DAOで検索結果をJavaBeansへ変換する場合",
            "JSTLで一覧を繰り返し表示する場合"
        ],
        "未認証アクセスを遮断する場合はリダイレクト後にchain.doFilter()を呼ばず、処理を終了できます。"
    ),

    /* =================================================
       JSP・EL・JSTL：17問
    ================================================= */

    createSelectionSource(
        "jsp",
        "リクエスト処理時に別リソースを実行し、結果を動的に取り込むものはどれですか。",
        "<jsp:include>",
        [
            "<%@ include %>",
            "<c:remove>",
            "<jsp:destroy>"
        ],
        "<jsp:include>はリクエスト処理時に対象リソースを実行して結果を取り込みます。"
    ),

    createSelectionSource(
        "jsp",
        "JSPの変換時に別ファイルの内容を静的に取り込むものはどれですか。",
        "includeディレクティブ",
        [
            "jsp:includeアクション",
            "c:forEach",
            "sendRedirect()"
        ],
        "includeディレクティブはJSPがサーブレットへ変換される段階で内容を取り込みます。"
    ),

    createSelectionSource(
        "jsp",
        "${user.name}が表すものとして適切なものはどれですか。",
        "userオブジェクトのnameプロパティ",
        [
            "usersテーブルを削除するSQL",
            "セッション全体の破棄",
            "nameというServletの初期化"
        ],
        "ELのプロパティアクセスでは、JavaBeansのgetterなどを通して値を参照します。"
    ),

    createSelectionSource(
        "jsp",
        "EL式でセッションスコープのloginUserを明示的に参照する記述はどれですか。",
        "${sessionScope.loginUser}",
        [
            "${requestScope.loginUser}",
            "${applicationScope.loginUser}",
            "${param.loginUser}"
        ],
        "sessionScopeを使用すると、セッションスコープの属性を明示的に参照できます。"
    ),

    createSelectionSource(
        "jsp",
        "EL式でリクエストスコープのmessageを明示的に参照する記述はどれですか。",
        "${requestScope.message}",
        [
            "${sessionScope.message}",
            "${cookie.message}",
            "${initParam.message}"
        ],
        "requestScopeはリクエスト属性を参照するEL暗黙オブジェクトです。"
    ),

    createSelectionSource(
        "jsp",
        "リクエストパラメータidをEL式で参照する記述はどれですか。",
        "${param.id}",
        [
            "${sessionScope.id}",
            "${cookie.id.value}",
            "${applicationScope.id}"
        ],
        "paramは単一のリクエストパラメータを参照するEL暗黙オブジェクトです。"
    ),

    createSelectionSource(
        "jsp",
        "同じ名前で複数送信されたリクエストパラメータを参照するEL暗黙オブジェクトはどれですか。",
        "paramValues",
        [
            "param",
            "sessionScope",
            "initParam"
        ],
        "paramValuesは、同じ名前の複数パラメータを配列として扱うために使用します。"
    ),

    createSelectionSource(
        "jsp",
        "EL式でCookieを参照する暗黙オブジェクトはどれですか。",
        "cookie",
        [
            "headerValuesだけ",
            "applicationScope",
            "pageContextName"
        ],
        "cookie暗黙オブジェクトを利用してCookieを参照できます。"
    ),

    createSelectionSource(
        "jsp",
        "${empty loginUser}の意味として適切なものはどれですか。",
        "loginUserがnullまたは空か確認する",
        [
            "loginUserを必ず削除する",
            "loginUserをデータベースへ登録する",
            "loginUserを暗号化する"
        ],
        "empty演算子はnull、空文字、空のコレクションなどを確認できます。"
    ),

    createSelectionSource(
        "jsp",
        "JSTLをJSPで利用するために記述するものはどれですか。",
        "taglibディレクティブ",
        [
            "@WebFilter",
            "PreparedStatement",
            "HttpSessionListener"
        ],
        "taglibディレクティブでタグライブラリの接頭辞とURIを宣言します。"
    ),

    createSelectionSource(
        "jsp",
        "単純な条件分岐を行うJSTLタグはどれですか。",
        "<c:if>",
        [
            "<c:forEach>",
            "<c:out>",
            "<c:url>"
        ],
        "<c:if>はtest属性の条件がtrueの場合に本体を実行します。"
    ),

    createSelectionSource(
        "jsp",
        "複数条件分岐の全体を表すJSTLタグはどれですか。",
        "<c:choose>",
        [
            "<c:set>",
            "<c:remove>",
            "<c:forEach>"
        ],
        "<c:choose>の中に<c:when>と<c:otherwise>を記述します。"
    ),

    createSelectionSource(
        "jsp",
        "<c:choose>の中で条件を指定するタグはどれですか。",
        "<c:when>",
        [
            "<c:out>",
            "<c:url>",
            "<c:remove>"
        ],
        "<c:when>のtest属性へ分岐条件を記述します。"
    ),

    createSelectionSource(
        "jsp",
        "どの<c:when>にも該当しない場合を処理するタグはどれですか。",
        "<c:otherwise>",
        [
            "<c:default>",
            "<c:elseIf>",
            "<c:last>"
        ],
        "<c:otherwise>はJavaのelseに近い役割を持ちます。"
    ),

    createSelectionSource(
        "jsp",
        "コレクションを繰り返し処理するJSTLタグはどれですか。",
        "<c:forEach>",
        [
            "<c:if>",
            "<c:redirect>",
            "<c:remove>"
        ],
        "<c:forEach>のitems属性に繰り返し対象を指定します。"
    ),

    createSelectionSource(
        "jsp",
        "値をHTMLへ出力するときに利用できるJSTLタグはどれですか。",
        "<c:out>",
        [
            "<c:set>",
            "<c:choose>",
            "<c:remove>"
        ],
        "<c:out>は値を出力し、環境や設定に応じて特殊文字のエスケープにも利用できます。"
    ),

    createSelectionSource(
        "jsp",
        "URLを適切に組み立てるために利用できるJSTLタグはどれですか。",
        "<c:url>",
        [
            "<c:when>",
            "<c:otherwise>",
            "<c:catchOnly>"
        ],
        "<c:url>はコンテキストパスやURLエンコーディングを考慮したURL生成に利用できます。"
    ),

    /* =================================================
       JDBC・DAO：17問
    ================================================= */

    createSelectionSource(
        "jdbc",
        "Javaからデータベースを操作するための標準APIはどれですか。",
        "JDBC",
        [
            "JSTL",
            "EL",
            "FilterChain"
        ],
        "JDBCはJava Database Connectivityの略で、JavaからデータベースへアクセスするためのAPIです。"
    ),

    createSelectionSource(
        "jdbc",
        "データベースとの接続を表すJDBCオブジェクトはどれですか。",
        "Connection",
        [
            "ResultSet",
            "HttpSession",
            "ServletContextListener"
        ],
        "Connectionはデータベースとの接続を表します。"
    ),

    createSelectionSource(
        "jdbc",
        "SQLの?へ値を設定して実行できるオブジェクトはどれですか。",
        "PreparedStatement",
        [
            "HttpServletRequest",
            "FilterConfig",
            "JspWriterだけ"
        ],
        "PreparedStatementはプレースホルダを利用してSQLと値を分離できます。"
    ),

    createSelectionSource(
        "jdbc",
        "SELECT文を実行するときに主に使用するメソッドはどれですか。",
        "executeQuery()",
        [
            "executeUpdate()",
            "invalidate()",
            "doFilter()"
        ],
        "executeQuery()は主にSELECT文に利用し、ResultSetを返します。"
    ),

    createSelectionSource(
        "jdbc",
        "INSERT、UPDATE、DELETEを実行するときに主に使用するメソッドはどれですか。",
        "executeUpdate()",
        [
            "executeQuery()",
            "getAttribute()",
            "contextInitialized()"
        ],
        "executeUpdate()は更新系SQLを実行し、更新された行数を返します。"
    ),

    createSelectionSource(
        "jdbc",
        "SELECT文の検索結果を保持するオブジェクトはどれですか。",
        "ResultSet",
        [
            "Connection",
            "HttpSession",
            "RequestDispatcher"
        ],
        "ResultSetはSELECT文の検索結果を保持します。"
    ),

    createSelectionSource(
        "jdbc",
        "ResultSetのカーソルを次の行へ進めるメソッドはどれですか。",
        "next()",
        [
            "forward()",
            "commit()",
            "doPost()"
        ],
        "ResultSet取得直後のカーソルは先頭行の前にあるため、next()で進めます。"
    ),

    createSelectionSource(
        "jdbc",
        "ResultSetから文字列の列値を取得するメソッドはどれですか。",
        "getString()",
        [
            "setString()",
            "getSession()",
            "getServletContext()"
        ],
        "ResultSetのgetString()は文字列として列値を取得します。"
    ),

    createSelectionSource(
        "jdbc",
        "pstmt.setString(1, name)の意味として正しいものはどれですか。",
        "1番目のプレースホルダへnameを設定する",
        [
            "ResultSetの1行目へ移動する",
            "name列を削除する",
            "セッションIDをnameへ変更する"
        ],
        "PreparedStatementのパラメータ番号は1から始まります。"
    ),

    createSelectionSource(
        "jdbc",
        "SQLインジェクション対策として適切なものはどれですか。",
        "PreparedStatementのプレースホルダを使用する",
        [
            "入力値をSQLへ直接連結する",
            "パスワードをURLへ表示する",
            "例外処理をすべて削除する"
        ],
        "SQLと入力値を分離することで、入力値がSQL構文として解釈される危険を減らします。"
    ),

    createSelectionSource(
        "jdbc",
        "CRUDのCが表す操作はどれですか。",
        "Create・登録",
        [
            "Close・接続終了だけ",
            "Cookie・Cookie保存",
            "Choose・条件分岐"
        ],
        "CRUDはCreate、Read、Update、Deleteの4操作です。"
    ),

    createSelectionSource(
        "jdbc",
        "CRUDのRが表す操作はどれですか。",
        "Read・参照",
        [
            "Redirect・画面遷移",
            "Remove・属性削除だけ",
            "Rollback・取り消しだけ"
        ],
        "Readはデータの参照で、SQLでは主にSELECTに対応します。"
    ),

    createSelectionSource(
        "jdbc",
        "DAOの主な役割として適切なものはどれですか。",
        "データベースアクセス処理をまとめる",
        [
            "HTMLの見た目だけを定義する",
            "ブラウザのCookieを直接描画する",
            "すべての画面遷移をJSP内だけで行う"
        ],
        "DAOは接続、SQL実行、検索結果の変換などをまとめます。"
    ),

    createSelectionSource(
        "jdbc",
        "try-with-resourcesを使用する主な利点はどれですか。",
        "使用後のリソースを自動的にcloseできる",
        [
            "SQL文が自動的に正しくなる",
            "例外が絶対に発生しなくなる",
            "すべての処理が自動的に高速化する"
        ],
        "AutoCloseableを実装するリソースは、ブロック終了時に自動的にcloseされます。"
    ),

    createSelectionSource(
        "jdbc",
        "複数のデータベース更新をまとめて確定するメソッドはどれですか。",
        "commit()",
        [
            "rollback()",
            "next()",
            "invalidate()"
        ],
        "commit()はトランザクション内の変更を確定します。"
    ),

    createSelectionSource(
        "jdbc",
        "トランザクション内の変更を取り消すメソッドはどれですか。",
        "rollback()",
        [
            "commit()",
            "executeQuery()",
            "sendRedirect()"
        ],
        "rollback()はトランザクション内で行った未確定の変更を取り消します。"
    ),

    createSelectionSource(
        "jdbc",
        "DAOがResultSetから取得したデータを呼び出し元へ返す方法として適切なものはどれですか。",
        "JavaBeansやDTOへ詰め替えて返す",
        [
            "必ずResultSetをJSPへ直接渡し続ける",
            "SQL文字列だけを画面へ表示する",
            "Connectionをセッションへ必ず保存する"
        ],
        "検索結果をJavaBeansやDTOへ変換すると、データベース処理とほかの処理を分離しやすくなります。"
    )
];


/* =====================================================
   選択問題の元データ検証
===================================================== */

if (selectionQuestionSources.length !== 100) {
    console.error(
        "選択問題用データが100問ではありません。",
        selectionQuestionSources.length
    );
}


/* =====================================================
   選択肢を作成

   正解位置を問題番号に応じて移動し、
   正解が常に同じ位置にならないようにする。
===================================================== */

const selectionQuizzes =
    selectionQuestionSources.map(
        (item, index) => {
            if (
                !Array.isArray(item.wrongAnswers) ||
                item.wrongAnswers.length !== 3
            ) {
                console.error(
                    "誤答選択肢が3個ではありません。",
                    index + 1,
                    item
                );
            }

            const correctPosition =
                index % 4;

            const options = [
                ...item.wrongAnswers
            ];

            options.splice(
                correctPosition,
                0,
                item.correct
            );

            return {
                type: "mc",
                label: "選択",
                category: item.category,
                categoryLabel:
                    getQuizCategoryLabel(
                        item.category
                    ),
                q: item.question,
                options,
                answer: correctPosition,
                displayAnswer: item.correct,
                explanation: item.explanation
            };
        }
    );


/* =====================================================
   選択問題数・分野別問題数の確認
===================================================== */

if (selectionQuizzes.length !== 100) {
    console.error(
        "選択問題が100問ではありません。",
        selectionQuizzes.length
    );
}


const selectionCategoryCounts =
    selectionQuizzes.reduce(
        (counts, quiz) => {
            counts[quiz.category] =
                (counts[quiz.category] ?? 0) + 1;

            return counts;
        },
        {}
    );


const expectedSelectionCategoryCounts = {
    session: 16,
    auth: 16,
    lifecycle: 17,
    filter: 17,
    jsp: 17,
    jdbc: 17
};


for (
    const categoryKey
    of QUIZ_CATEGORY_ORDER
) {
    const actualCount =
        selectionCategoryCounts[categoryKey] ?? 0;

    const expectedCount =
        expectedSelectionCategoryCounts[
            categoryKey
        ];

    if (actualCount !== expectedCount) {
        console.error(
            "選択問題の分野別問題数が一致しません。",
            {
                category:
                    categoryKey,
                expected:
                    expectedCount,
                actual:
                    actualCount
            }
        );
    }
}
/* =====================================================
   questions.js 3/3
   ○×30問・コード読解10問・全170問の結合
===================================================== */


/* =====================================================
   ○×問題生成用関数
===================================================== */

function createTrueFalseQuiz(
    category,
    question,
    correct,
    explanation
) {
    return {
        type: "tf",
        label: "○×",
        category,
        categoryLabel:
            getQuizCategoryLabel(category),
        q: question,
        options: [
            "○",
            "×"
        ],
        answer:
            correct
                ? 0
                : 1,
        displayAnswer:
            correct
                ? "○"
                : "×",
        explanation
    };
}


/* =====================================================
   ○×問題30問

   各分野5問
===================================================== */

const trueFalseQuizzes = [
    /* =================================================
       セッション管理：5問
    ================================================= */

    createTrueFalseQuiz(
        "session",
        "request.getSession(false)は、既存のセッションがない場合に新しいセッションを生成する。",
        false,
        "request.getSession(false)は新しいセッションを生成せず、既存のセッションがなければnullを返します。"
    ),

    createTrueFalseQuiz(
        "session",
        "session.removeAttribute(\"loginUser\")を実行すると、loginUser属性だけが削除される。",
        true,
        "removeAttribute()は指定した属性だけを削除します。セッション全体を破棄するメソッドではありません。"
    ),

    createTrueFalseQuiz(
        "session",
        "JSESSIONIDは、利用者のパスワードそのものを保存するためのCookieである。",
        false,
        "JSESSIONIDはブラウザとサーバー側のHttpSessionを対応付けるためのセッションIDです。"
    ),

    createTrueFalseQuiz(
        "session",
        "setMaxInactiveInterval()では、セッションの最大無操作時間を秒単位で設定できる。",
        true,
        "setMaxInactiveInterval()の引数には、最大無操作時間を秒単位で指定します。"
    ),

    createTrueFalseQuiz(
        "session",
        "ブラウザを閉じると、サーバー側のHttpSessionも必ずその瞬間に削除される。",
        false,
        "ブラウザを閉じても、サーバー側のHttpSessionはタイムアウトまで残る場合があります。"
    ),

    /* =================================================
       ログイン認証・ログアウト：5問
    ================================================= */

    createTrueFalseQuiz(
        "auth",
        "認証成功後のログインユーザー情報は、セッションスコープへ保存できる。",
        true,
        "利用者ごとの複数リクエストで使用するログインユーザー情報は、セッションスコープへ保存できます。"
    ),

    createTrueFalseQuiz(
        "auth",
        "ログアウト時にsession.invalidate()を呼ぶと、セッション全体が無効化される。",
        true,
        "invalidate()はセッション全体を無効化するため、ログアウト処理でよく使用されます。"
    ),

    createTrueFalseQuiz(
        "auth",
        "認証失敗メッセージをリクエスト属性へ保存してフォワードすれば、遷移先のJSPで参照できる。",
        true,
        "フォワードでは同じリクエストが引き継がれるため、リクエスト属性を参照できます。"
    ),

    createTrueFalseQuiz(
        "auth",
        "ログイン成功後は、入力された平文パスワードを必ずセッションへ保存しなければならない。",
        false,
        "平文パスワードをセッションへ保存する必要はありません。必要なユーザー情報だけを保存します。"
    ),

    createTrueFalseQuiz(
        "auth",
        "認証は利用者が誰かを確認する処理であり、認可はその利用者に操作権限があるかを確認する処理である。",
        true,
        "認証は本人確認、認可は権限確認です。"
    ),

    /* =================================================
       ライフサイクル・リスナー：5問
    ================================================= */

    createTrueFalseQuiz(
        "lifecycle",
        "init()は、サーブレットの初期化時に原則一度呼び出される。",
        true,
        "init()はサーブレットのインスタンス生成後、初期化時に原則一度呼び出されます。"
    ),

    createTrueFalseQuiz(
        "lifecycle",
        "service()は、HTTPメソッドに応じてdoGet()やdoPost()などへ処理を振り分ける。",
        true,
        "HttpServletのservice()はリクエストのHTTPメソッドを確認して、対応する処理メソッドを呼び出します。"
    ),

    createTrueFalseQuiz(
        "lifecycle",
        "destroy()は、HTTPリクエストを受信するたびに呼び出される。",
        false,
        "destroy()はリクエストのたびではなく、サーブレットが破棄される前に呼び出されます。"
    ),

    createTrueFalseQuiz(
        "lifecycle",
        "ServletContextListenerは、Webアプリケーションの開始と終了を監視できる。",
        true,
        "contextInitialized()とcontextDestroyed()で、Webアプリケーションの開始と終了を監視できます。"
    ),

    createTrueFalseQuiz(
        "lifecycle",
        "HttpSessionListenerは、セッション属性の追加・削除・置換だけを監視するリスナーである。",
        false,
        "HttpSessionListenerはセッションそのものの生成と破棄を監視します。属性の変化はHttpSessionAttributeListenerで監視します。"
    ),

    /* =================================================
       フィルタ：5問
    ================================================= */

    createTrueFalseQuiz(
        "filter",
        "chain.doFilter()を呼ばなくても、後続のサーブレットは必ず実行される。",
        false,
        "通常はchain.doFilter()を呼ばなければ、後続のフィルタや対象サーブレットへ処理が進みません。"
    ),

    createTrueFalseQuiz(
        "filter",
        "chain.doFilter()より前に記述された処理は、前処理になる。",
        true,
        "chain.doFilter()より前が前処理で、後ろが後処理です。"
    ),

    createTrueFalseQuiz(
        "filter",
        "複数フィルタの後処理は、前処理と逆の順番で実行される。",
        true,
        "フィルタは入れ子状に呼び出されるため、戻りの後処理は逆順です。"
    ),

    createTrueFalseQuiz(
        "filter",
        "POSTパラメータの文字コードを設定する場合、getParameter()を呼び出した後だけ設定すればよい。",
        false,
        "リクエスト本文を読み取る前、つまりgetParameter()より前に文字コードを設定します。"
    ),

    createTrueFalseQuiz(
        "filter",
        "@WebFilterを使用すると、フィルタと対象URLを登録できる。",
        true,
        "@WebFilterのvalueやurlPatternsなどで対象URLを指定できます。"
    ),

    /* =================================================
       JSP・EL・JSTL：5問
    ================================================= */

    createTrueFalseQuiz(
        "jsp",
        "<jsp:include>は、リクエスト処理時に対象リソースを実行して結果を取り込む。",
        true,
        "<jsp:include>は動的インクルードであり、リクエスト処理時に対象リソースを実行します。"
    ),

    createTrueFalseQuiz(
        "jsp",
        "includeディレクティブは、JSPの変換時に別ファイルの内容を取り込む。",
        true,
        "includeディレクティブは静的インクルードであり、JSPの変換時に内容を取り込みます。"
    ),

    createTrueFalseQuiz(
        "jsp",
        "${param.id}は、idという名前のリクエストパラメータを参照するEL式である。",
        true,
        "paramはリクエストパラメータを参照するEL暗黙オブジェクトです。"
    ),

    createTrueFalseQuiz(
        "jsp",
        "${empty loginUser}は、loginUserがnullまたは空であるかを確認する式である。",
        true,
        "empty演算子はnull、空文字、空の配列やコレクションなどを確認できます。"
    ),

    createTrueFalseQuiz(
        "jsp",
        "<c:forEach>は、データベースへSQLを直接送信するためのJSTLタグである。",
        false,
        "<c:forEach>はコレクションや配列などを繰り返し処理するタグです。SQLを送信するタグではありません。"
    ),

    /* =================================================
       JDBC・DAO：5問
    ================================================= */

    createTrueFalseQuiz(
        "jdbc",
        "executeQuery()は、主にSELECT文を実行してResultSetを取得するために使用する。",
        true,
        "executeQuery()は主に検索系SQLに利用し、ResultSetを返します。"
    ),

    createTrueFalseQuiz(
        "jdbc",
        "executeUpdate()は、SELECT文を実行してResultSetを返すためだけのメソッドである。",
        false,
        "executeUpdate()は主にINSERT、UPDATE、DELETEを実行し、更新行数を返します。"
    ),

    createTrueFalseQuiz(
        "jdbc",
        "ResultSetを取得した直後は先頭行の前にカーソルがあるため、通常はnext()を呼んでから値を取得する。",
        true,
        "ResultSet取得直後のカーソルは先頭行の前にあります。next()で次の行へ進めます。"
    ),

    createTrueFalseQuiz(
        "jdbc",
        "PreparedStatementのプレースホルダを使用すると、SQLと入力値を分離できる。",
        true,
        "SQLと値を分離することで、SQLインジェクションの危険を減らせます。"
    ),

    createTrueFalseQuiz(
        "jdbc",
        "DAOは、HTMLの画面表示とCSSの装飾だけを担当するクラスである。",
        false,
        "DAOはデータベースへの接続、SQL実行、検索結果の変換などを担当します。"
    )
];


/* =====================================================
   ○×問題数・分野別問題数の確認
===================================================== */

if (trueFalseQuizzes.length !== 30) {
    console.error(
        "○×問題が30問ではありません。",
        trueFalseQuizzes.length
    );
}


const trueFalseCategoryCounts =
    trueFalseQuizzes.reduce(
        (counts, quiz) => {
            counts[quiz.category] =
                (counts[quiz.category] ?? 0) + 1;

            return counts;
        },
        {}
    );


for (
    const categoryKey
    of QUIZ_CATEGORY_ORDER
) {
    const actualCount =
        trueFalseCategoryCounts[
            categoryKey
        ] ?? 0;

    if (actualCount !== 5) {
        console.error(
            "○×問題の分野別問題数が5問ではありません。",
            {
                category:
                    categoryKey,
                actual:
                    actualCount
            }
        );
    }
}


/* =====================================================
   コード読解問題10問

   配分：
   セッション管理　　　　　　2問
   ログイン認証・ログアウト　2問
   ライフサイクル・リスナー　2問
   フィルタ　　　　　　　　2問
   JSP・EL・JSTL　　　　　 1問
   JDBC・DAO　　　　　　　 1問
===================================================== */

const codeQuizzes = [
    /* =================================================
       セッション管理：2問
    ================================================= */

    {
        type: "code",
        label: "コード読解",
        category: "session",
        categoryLabel:
            getQuizCategoryLabel("session"),

        q:
            "セッションが存在しない状態で次のコードを実行した場合、変数sessionには何が入りますか。",

        code:
`HttpSession session =
    request.getSession(false);`,

        options: [
            "新しく生成されたHttpSession",
            "null",
            "ServletContext",
            "空のString"
        ],

        answer: 1,

        displayAnswer:
            "null",

        explanation:
            "getSession(false)は新しいセッションを生成しません。既存のセッションがなければnullを返します。"
    },

    {
        type: "code",
        label: "コード読解",
        category: "session",
        categoryLabel:
            getQuizCategoryLabel("session"),

        q:
            "次のコードが設定しているものはどれですか。",

        code:
`HttpSession session =
    request.getSession();

session.setMaxInactiveInterval(
    900
);`,

        options: [
            "セッションIDを900へ変更する",
            "セッション属性を900個に制限する",
}
