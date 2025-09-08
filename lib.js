window.lib = (function () {
    /**
     * 解析时长字符串为秒数
     * @param durationStr
     * @returns {number}
     */
    function parseDuration(durationStr) {
        const parts = durationStr.split(':').map(Number);
        let seconds = 0;
        if (parts.length === 3) { // HH:MM:SS
            seconds += parts[0] * 3600; // hours to seconds
            seconds += parts[1] * 60;   // minutes to seconds
            seconds += parts[2];        // seconds
        } else if (parts.length === 2) { // MM:SS
            seconds += parts[0] * 60;   // minutes to seconds
            seconds += parts[1];        // seconds
        } else if (parts.length === 1) { // SS
            seconds += parts[0];        // seconds
        }
        return seconds;
    }
    /**
     * 查找所有课程的ID和时长
     * @returns {{duration: null, id: string | null}[]}
     */
    function findAllClasses() {
        const activities = document.querySelectorAll('.learning-activity.sortable.ng-scope');

        const results = Array.from(activities).map(activity => {
            // 提取 ID 中的数字
            const idMatch = activity.id.match(/\d+/);
            const id = idMatch ? idMatch[0] : null;

            // 查找视频时长 span
            const durationSpan = activity.querySelector(
                'span.attribute-value.number.ng-binding[ng-bind*="uploads[0].videos[0].duration"]'
            );

            const duration = durationSpan ? durationSpan.textContent.trim() : null;
            const durationInSeconds = duration ? parseDuration(duration) : null;
            return {id, durationInSeconds};
        });

        console.log(results);
        return results
    }


    /**
     * 分批刷时间，因为接口有单次请求时长限制，为了让课程进度到达100%，需要分批请求
     * @param id
     * @param durationSec
     * @returns {Promise<void>}
     */
    async function fetchActivityBatches(id, durationSec) {
        const batchSize = 100;
        const batchCount = Math.ceil(durationSec / batchSize);

        for (let i = 0; i < batchCount; i++) {
            const start = i * batchSize + 1;
            const end = Math.min((i + 1) * batchSize, durationSec);

            try {
                const res = await fetch(`https://lms.nju.edu.cn/api/course/activities-read/${id}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ start, end })
                });

                if (!res.ok) {
                    console.warn(`Request [${start}–${end}] failed:`, res.status);
                    continue;
                }
                const data = await res.json();
                console.log(`[${start}–${end}]`, data);
            } catch (err) {
                console.error(`Error in batch [${start}–${end}]:`, err);
            }
        }
    }


    return {
        findAllClasses,
        fetchActivityBatches
    };
})();