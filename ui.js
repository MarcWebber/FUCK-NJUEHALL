(function () {
    const BUTTON_ID = "刷课按钮";
    const CONFIRM_KEY = "lib-confirmed-auto-learn";
    const STATUS_ID = "刷课进度条";

    /**
     * 创建右下角悬浮按钮
     */
    function createFloatingButton() {
        if (document.getElementById(BUTTON_ID)) return;
        // 进度显示
        const status = document.createElement("div");
        status.id = STATUS_ID;
        Object.assign(status.style, {
            position: "fixed",
            right: "20px",
            bottom: "120px",
            zIndex: "9999",
            backgroundColor: "#ffffffcc",
            color: "#333",
            padding: "6px 12px",
            borderRadius: "6px",
            fontSize: "13px",
            fontWeight: "normal",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            display: "none"
        });
        document.body.appendChild(status);

        // 按钮
        const btn = document.createElement("div");
        btn.id = BUTTON_ID;
        btn.innerText = "一键刷课";
        Object.assign(btn.style, {
            position: "fixed",
            right: "20px",
            bottom: "80px",
            zIndex: "9999",
            backgroundColor: "#1976d2",
            color: "#fff",
            padding: "10px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "bold",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            cursor: "pointer",
            userSelect: "none"
        });

        btn.addEventListener("click", handleClick);
        document.body.appendChild(btn);
    }

    /**
     * 显示或更新进度文本
     */
    function updateProgress(text) {
        const el = document.getElementById(STATUS_ID);
        if (el) {
            el.textContent = text;
            el.style.display = "block";
        }
    }

    /**
     * 隐藏进度显示
     */
    function hideProgress() {
        const el = document.getElementById(STATUS_ID);
        if (el) el.style.display = "none";
    }

    /**
     * 处理点击事件逻辑
     */
    async function handleClick() {
        const confirmed = localStorage.getItem(CONFIRM_KEY);

        if (!confirmed) {
            const answer = confirm(
                "是否使用一键刷课？\n\n本插件仅为学习用途，不保证稳定性与合法性，使用一切后果由用户自行承担，插件作者不负任何责任。\n\n点击“确定”继续，点击“取消”放弃。"
            );
            if (!answer) return;
            localStorage.setItem(CONFIRM_KEY, "true");
        }

        if (!window.lib || typeof window.lib.findAllClasses !== "function" || typeof window.lib.fetchActivityBatches !== "function") {
            alert("工具函数未加载，无法执行刷课逻辑！");
            return;
        }

        const classes = window.lib.findAllClasses();
        const validClasses = classes.filter(item => item.id && item.durationInSeconds);
        if (!validClasses.length) {
            alert("未找到有效课程数据，请确认页面是否加载完成。");
            return;
        }

        const total = validClasses.length;

        for (let i = 0; i < total; i++) {
            const {id, durationInSeconds} = validClasses[i];

            updateProgress(`正在刷课：${i + 1} / ${total}（ID=${id}）`);
            console.log(`开始刷课: ID=${id}, 总时长=${durationInSeconds}s`);
            await window.lib.fetchActivityBatches(id, durationInSeconds);
        }

        updateProgress("✅ 刷课完成，请刷新页面查看进度");
        alert("一键刷课已完成！请刷新页面查看进度");

        // 可选：3 秒后自动隐藏提示
        setTimeout(() => {
            hideProgress();
        }, 3000);
    }

    /**
     * 自动挂载按钮
     */
    window.addEventListener("load", createFloatingButton);
})();
