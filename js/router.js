/*****************
    スニャイヴ
    router.js
    2025/11/25
*****************/

//アプリを開く
window.openApp = async function(app_name){
    const app = window.apps[app_name];
    const window_element = document.getElementById("window");
    const title_element = document.getElementById("window_titlebar_title");
    const content_element = document.getElementById("window_content");
    const tabbar_element = document.getElementById("window_tabbar"); 
    const dock_item = document.getElementById(`dock_item_${app_name}`);

    //ドックランプの更新
    document.querySelectorAll('#dock .item .lamp').forEach(lamp => {lamp.classList.remove('active');});
    dock_item.querySelector('.lamp').classList.add('active');

    //描画更新
    title_element.innerText = app.title;
    window_element.style.display = 'flex';
    
    //ハッシュ更新
    if(location.hash !== `#${app_name}`){
        history.pushState({app: app_name}, app.title, `#${app_name}`);
    }

    //タブ生成
    let tabs_html = "";
    app.tabs.forEach((tab, index) => {
        const tab_id = tab.name.toLowerCase().replace(/[^a-z0-9]/g, "_"); 
        const is_active = index === 0 ? "active" : "";
        
        tabs_html += `
            <div 
                class="tab ${is_active}" 
                data_tab_id="${tab_id}" 
                data_tab_file="${tab.file}"
                onclick="window.switchTab('${tab_id}')"
            >
                ${tab.name}
            </div>
        `;
    });
    
    tabbar_element.innerHTML = tabs_html;
    window.switchTab(app.tabs[0].name.toLowerCase().replace(/[^a-z0-9]/g, "_"));

    return;
};

//アプリを閉じる
window.closeApp = function(){
    const window_element = document.getElementById("window");
    window_element.style.display = "none";
    document.querySelectorAll("#dock .item .lamp").forEach(lamp => {lamp.classList.remove('active');});
    history.pushState({app: "closed"}, "Desktop", "#");
}

//タブの切り替え
window.switchTab = async function(tab_id){
    const app = window.apps[location.hash.replace("#", "")];
    const content_element = document.getElementById("window_content");
    const tabbar_element = document.getElementById("window_tabbar");

    let tab_file = "index";
    tabbar_element.querySelectorAll(".tab").forEach(tab => {
        const id = tab.getAttribute("data_tab_id");

        if(id != tab_id){
            tab.classList.remove("active");
            return;
        }

        tab.classList.add("active");
        tab_file = tab.getAttribute("data_tab_file");

        return;
    });

    const tab_file_url = `/apps/${app.directory}/${tab_file}.html`;
    content_element.innerHTML = (await fetch(tab_file_url)).text();

    return;
};

//初回ロード
window.addEventListener("load", () => {
    const app = location.hash.replace("#", "");
    
    if(window.apps[app]){
        openApp(app);
        return;
    }

    closeApp();
    return;
});

//戻る, 進む処理
window.addEventListener("popstate", () => {
    const app = location.hash.replace("#", "");

    if(window.apps[app]){
        openApp(app);
        return;
    }
    
    closeApp();
    return;
});