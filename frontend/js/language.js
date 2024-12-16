
const dictionary = {
    en: {
    singlePlayer: "Single Player",
    multiPlayer: "Multi Player",
    isFourPlayer: "2 vs 2",
    start: "Start",
    restart: "Restart",
    offcanvasBtn: "Menu",
    settingsBtn: "Settings",
    offcanvasHeader: "Menu",
    statisticsBtn: "Statistics",
    tournamentBtn: "Tournament",
    historyBtn: "History",
    modalSettings: "Settings",
    ballHeader: "Ball",
    "speed-ball": "Speed",
    "acceleration-ball": "Acceleration",
    AI: "AI",
    "speed-ai": "Speed",
    "acceleration-ai": "Acceleration",
    language: "Language",
    "language-choice": "Choose Language",
    "validate-btn-Stgs": "Save changes",
    "input-Username": "Choose Name For Player",
    "input-Username-Finish": "All The Players Are Named",
    "title-tournament": "Create Tournament",
    "input-username-btn": "Save",
    "start-tournament": "Start Tournament",
    loginModal: "Login",
    loginHeader: "Login",
    password: "Password",
    login: "Login",        
    "validate-btn-login": "Save Choices",
    "nbr-player-tournament": "Choose Number of Players",
    "defaultValue-nbrPlayer": "Default Value is 4",
    "create-Tournament1": "Tournament",
    "2modal-BackBtn": "Back",
    "tournament-panel": "Tournament",
    "round-display": "Round",
    "order-playing": "Match Order",
    "winnerTournament": "The Champion is ",
    "finishTournament" : "Finish",
    "registerHeader": "Register",
    "password-register": "Password",
    "confpassword": "Confirm Password",
    "login-register": "Username",
    "validate-btn-register": "Save Choices",
    "registerModalBtn": "Register"
},
fr: {
    singlePlayer: "Joueur Unique",
    multiPlayer: "Multi Joueur",
    isFourPlayer: "2 contre 2",
    start: "Commencer",
    restart: "Recommencer",
    offcanvasBtn: "Menu",
    settingsBtn: "Paramètres",
    offcanvasHeader: "Menu",
    statisticsBtn: "Statistiques",
    tournamentBtn: "Tournoi",
    historyBtn: "Historique",
    modalSettings: "Paramètres",
    ballHeader: "Balle",
    "speed-ball": "Vitesse",
    "acceleration-ball": "Accélération",
    AI: "IA",
    "speed-ai": "Vitesse",
    "acceleration-ai": "Accélération",
    language: "Langue",
    "language-choice": "Choix de la langue",
    "validate-btn-Stgs": "Enregistre les choix",
    "input-Username": "Choisit Les Noms Pour Les Joueurs",
    "input-Username-Finish": "Tous Les Joueurs Ont Été Nommés",
    "title-tournament": "Créer Un Tournoi",
    "input-username-btn": "Enregistrer le choix",
    "start-tournament": "Commencer le tournoi",
    loginModal: "Connecter",
    loginHeader: "Connecter",
    password: "Mot de Passe",
    login: "Nom D'utilisateur",
    "validate-btn-login": "Enregistre les choix",
    "nbr-player-tournament": "Choisit Combien De Joueurs",
    "defaultValue-nbrPlayer": "Valeur Par Défaut Est 4",
    "create-Tournament1": "Tournoi",
    "2modal-BackBtn" : "Retour",
    "tournament-panel": "Tournoi",
    "round-display": "Tour",
    "order-playing": "Ordre Des Matchs",
    "winnerTournament" : "Le Champion Est ",
    "finishTournament" : "Terminer",
    "registerHeader": "Inscription",
    "password-register": "Mot De Passe",
    "confpassword": "Confirmation",
    "login-register" : "Nom D'utilisateur",
    "validate-btn-register" : "Enregistre les choix",
    "registerModalBtn" : "Inscription"
},
jp: {
    singlePlayer: "シングルプレイヤー",
    multiPlayer: "マルチプレイヤー",
    isFourPlayer: "2対2",
    start: "スタート",
    restart: "リスタート",
    offcanvasBtn: "メニュー",
    settingsBtn: "設定",
    offcanvasHeader: "メニュー",
    statisticsBtn: "統計",
    tournamentBtn: "トーナメント",
    historyBtn: "履歴",
    modalSettings: "設定",
    ballHeader: "ボール",
    "speed-ball": "速度",
    "acceleration-ball": "加速度",
    AI: "AI",
    "speed-ai": "速度",
    "acceleration-ai": "加速度",
    language: "言語",
    "language-choice": "言語を選択",
    "validate-btn-Stgs": "変更を保存",
    "input-Username": "プレイヤーの名前を選んでください",
    "input-Username-Finish": "すべてのプレイヤーに名前が付けられました",
    "title-tournament": "トーナメントを作成",
    "input-username-btn": "選択を保存",
    "start-tournament": "トーナメントを開始",
    loginModal: "ログイン",
    loginHeader: "ログイン",
    password: "パスワード",
    login: "ログイン",
    "validate-btn-login": "選択を保存",
    "nbr-player-tournament": "プレイヤー数を選択",
    "defaultValue-nbrPlayer": "デフォルト値は4です",
    "create-Tournament1": "トーナメント",
    "2modal-BackBtn": "戻る",
    "tournament-panel": "トーナメント",
    "round-display": "ラウンド",
    "order-playing": "試合順",
    "winnerTournament": "チャンピオンは ",
    "finishTournament" : "フィニッシュ",
    "registerHeader": "登録",
    "password-register": "パスワード",
    "confpassword": "パスワード確認",
    "login-register": "ユーザー名",
    "validate-btn-register": "選択を保存",
    "registerModalBtn": "登録"
}
};

function changeLanguageProcess(language) {
    const select = dictionary[language];

    Object.keys(select).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = select[id];
        }
    });
}

export function changeLanguage() {
    document.getElementById('validate-btn-Stgs').addEventListener('click', () => {
    const iLanguage = document.getElementById('languageSelection').value
        switch (iLanguage) {
            case "1":
                changeLanguageProcess('en');
                break;
            case "2":
                changeLanguageProcess('fr');
                break;
            case "3":
                changeLanguageProcess('jp');
                break;
        }
    });
}

