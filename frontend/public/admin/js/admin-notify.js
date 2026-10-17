(function () {
    const SOUND_URL = "/admin/sound/kaching.mp3";
    let audio = null;

    function getAudio() {
        if (!audio) {
            audio = new Audio(SOUND_URL);
            audio.preload = "auto";
        }
        return audio;
    }

    function playNotifySound() {
        try {
            const el = getAudio();
            el.currentTime = 0;
            const p = el.play();
            if (p && p.catch) p.catch(function () {});
        } catch (err) {}
    }

    document.addEventListener(
        "click",
        function () {
            const el = getAudio();
            el.muted = true;
            el.play()
                .then(function () {
                    el.pause();
                    el.currentTime = 0;
                    el.muted = false;
                })
                .catch(function () {});
        },
        { once: true }
    );

    const src = new EventSource("/api/pesanan/events");
    src.addEventListener("pesanan", function (ev) {
        let data = {};
        try {
            data = JSON.parse(ev.data || "{}");
        } catch (err) {
            data = {};
        }
        const kode = data.kode_pesanan || "baru";
        const wrap = document.getElementById("admin-toast");
        if (wrap) {
            wrap.textContent = "Pesanan baru: " + kode;
            wrap.classList.add("show");
            window.setTimeout(function () {
                wrap.classList.remove("show");
            }, 4000);
        }
        playNotifySound();
        if (typeof window.reloadPesananList === "function") {
            window.reloadPesananList();
        }
    });
    src.onerror = function () {};

    window.addEventListener("pagehide", function () {
        src.close();
    });
})();
