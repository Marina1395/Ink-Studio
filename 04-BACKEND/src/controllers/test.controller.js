
const test = (req, res) => {
    res.json({
        mensaje: "Respuesta desde el controller"
    });
};

module.exports = {
    test
};