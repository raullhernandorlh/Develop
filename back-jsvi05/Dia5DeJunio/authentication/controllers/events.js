let events = [];

const list = (req, res) => {
    res.json(events);
}

const add = (req, res) => {
    // TODO: validar los valores recibidos

    events.push({
        name: req.body.name,
        artist: req.body.artist,
        type: req.body.type
    })

    res.send();
}

module.exports = {
    add,
    list
}