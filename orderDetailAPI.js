const pool = require('./db');

module.exports = function(app) {

    app.get('/orderdetails', async (req, res) => {

        try {

            const result = await pool.query('SELECT * FROM Order_Detail');

            res.json(result.rows);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Database connection failed"
            });

        }

    });

};