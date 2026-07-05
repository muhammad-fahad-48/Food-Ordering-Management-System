const pool = require('./db');

module.exports = function(app){
app.get('/addresses', async (req, res) => {

    try {

        const result = await pool.query('SELECT * FROM Customer_Address');

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Database connection failed"
        });

    }

});
};