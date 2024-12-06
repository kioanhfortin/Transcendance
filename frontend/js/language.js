function french() {
    document.getElementById('singlePlayer').textContent = "Joueur Unique";
    document.getElementById('multiPlayer').textContent = "Multi Joueur";
    document.getElementById("isFourPlayer").textContent = "2 contre 2";

    document.getElementById("start").textContent = "Commencer";
    document.getElementById("restart").textContent = "Recommencer";

    //OFFCANVAS
    // document.getElementById("").textContent = "";
    document.getElementById("offcanvasBtn").textContent = "Menu";
    document.getElementById("settingsBtn").textContent = "Paramètres";
    document.getElementById("offcanvasHeader").textContent = "Menu";
    document.getElementById("statisticsBtn").textContent = "Statistiques";
    document.getElementById("tournamentBtn").textContent = "Tournoi";
    document.getElementById("historyBtn").textContent = "Historique";
    
    //MODAL-OFFCANVAS
    document.getElementById("modalSettings").textContent = "Paramètres";
    document.getElementById("ballHeader").textContent = "Balle";
    document.getElementById("speed-ball").textContent = "Vitesse";
    document.getElementById("acceleration-ball").textContent = "Accélération";
    document.getElementById("AI").textContent = "IA";
    document.getElementById("speed-ai").textContent = "Vitesse";
    document.getElementById("acceleration-ai").textContent = "Accélération";
    document.getElementById("language").textContent = "Langue";
    document.getElementById("language-choice").textContent = "Choix de la langue";
    document.getElementById("validate-btn").textContent = "Enregistre les choix";
}

function english() {
    document.getElementById('singlePlayer').textContent = "Single Player";
    document.getElementById('multiPlayer').textContent = "Multi Player";
    document.getElementById("isFourPlayer").textContent = "2 vs 2";

    document.getElementById("start").textContent = "Start";
    document.getElementById("restart").textContent = "Restart";

    //OFFCANVAS
    // document.getElementById("").textContent = "";
    document.getElementById("offcanvasBtn").textContent = "Menu";
    document.getElementById("settingsBtn").textContent = "Settings";
    document.getElementById("offcanvasHeader").textContent = "Menu";
    document.getElementById("statisticsBtn").textContent = "Statistics";
    document.getElementById("tournamentBtn").textContent = "Tournament";
    document.getElementById("historyBtn").textContent = "History";
    
    //MODAL-OFFCANVAS
    document.getElementById("modalSettings").textContent = "Settings";
    document.getElementById("ballHeader").textContent = "Ball";
    document.getElementById("speed-ball").textContent = "Speed";
    document.getElementById("acceleration-ball").textContent = "Acceleration";
    document.getElementById("AI").textContent = "AI";
    document.getElementById("speed-ai").textContent = "Speed";
    document.getElementById("acceleration-ai").textContent = "Acceleration";
    document.getElementById("language").textContent = "Language";
    document.getElementById("language-choice").textContent = "Choose Language";
    document.getElementById("validate-btn").textContent = "Save changes";

}

function japanese() {
    document.getElementById('singlePlayer').textContent = "シングルプレイヤー";
    document.getElementById('multiPlayer').textContent = "マルチプレイヤー";
    document.getElementById("isFourPlayer").textContent = "2対2";

    document.getElementById("start").textContent = "スタート";
    document.getElementById("restart").textContent = "リスタート";

    //OFFCANVAS
    document.getElementById("offcanvasBtn").textContent = "メニュー";
    document.getElementById("settingsBtn").textContent = "設定";
    document.getElementById("offcanvasHeader").textContent = "メニュー";
    document.getElementById("statisticsBtn").textContent = "統計";
    document.getElementById("tournamentBtn").textContent = "トーナメント";
    document.getElementById("historyBtn").textContent = "履歴";
    
    //MODAL-OFFCANVAS
    document.getElementById("modalSettings").textContent = "設定";
    document.getElementById("ballHeader").textContent = "ボール";
    document.getElementById("speed-ball").textContent = "速度 ";
    document.getElementById("acceleration-ball").textContent = " 加速度";
    document.getElementById("AI").textContent = "AI";
    document.getElementById("speed-ai").textContent = "速度 ";
    document.getElementById("acceleration-ai").textContent = " 加速度";
    document.getElementById("language").textContent = "言語";
    document.getElementById("language-choice").textContent = "言語を選択";
    document.getElementById("validate-btn").textContent = "変更を保存";
}

export function changeLanguage() {

    document.getElementById('validate-btn').addEventListener('click', () => {
        const iLanguage = document.getElementById('languageSelection').value
            switch (iLanguage) {
                case "1":
                    english();
                    break;
                case "2":
                    french();
                    break;
                case "3":
                    japanese();
                    break;
            }
        });
}