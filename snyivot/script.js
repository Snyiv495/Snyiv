function selectTab(tab){
    //タブの切り替え
    document.querySelectorAll(".tab").forEach(e => e.classList.remove("active"));
    document.getElementById(`tab_${tab}`).classList.add("active");

    //内容の切り替え
    if(tab === "sammary"){
        document.getElementById("content").innerHTML = `
            <h2>使い方</h2>
            <p>ここに bot の説明を書く</p>
        `;
    }

    if(tab === "dashboard"){
        document.getElementById("content").innerHTML = `
            <h2>Dashboard</h2>
            <label>Prefix</label><br>
            <input id="prefix"><br><br>
            <label>Speed</label><br>
            <input id="speed" type="number" step="0.1"><br><br>
            <button onclick="saveSettings()">保存</button>
        `;
    }
}