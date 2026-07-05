const pool = require('./db');

module.exports = function(app) {

    app.get('/admin', async (req, res) => {

        try {

            const result = await pool.query('SELECT * FROM admin');

            res.json(result.rows);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Database connection failed"
            });

        }

    });

app.post('/admin/login', async (req, res) => {

    try {

        const { email, password } = req.body;

        const result = await pool.query(
            'SELECT admin_id, admin_name, email FROM admin WHERE email = $1 AND password = $2',
            [email, password]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        res.json({
            message: "Login successful",
            admin: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Login failed"
        });

    }

});


};