const clients = new Set();

function events(req, res) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();
    res.write(":\n\n");
    clients.add(res);
    req.on("close", function () {
        clients.delete(res);
    });
}

function broadcastPesananBaru(payload) {
    const data = "event: pesanan\ndata: " + JSON.stringify(payload) + "\n\n";
    clients.forEach(function (res) {
        try {
            res.write(data);
        } catch (err) {
            clients.delete(res);
        }
    });
}

module.exports = { events, broadcastPesananBaru };
