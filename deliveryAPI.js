const pool = require('./db');

module.exports = function(app) {

    app.get('/deliveries', async (req, res) => {

        try {

            const result = await pool.query('SELECT * FROM Delivery');

            res.json(result.rows);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Database connection failed"
            });

        }

    });

};