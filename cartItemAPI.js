const pool = require('./db');

module.exports = function(app) {

app.get('/cartitems', async (req, res) => {

    try {

        const result = await pool.query('SELECT * FROM Cart_Item');

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Database connection failed"
        });

    }

});
};