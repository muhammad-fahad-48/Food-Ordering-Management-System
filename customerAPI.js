
//this imports database connection from db.js
const pool = require('./db');

module.exports = function(app){
//sample api to check if server is working


app.get('/customers', async (req, res) => {

    try {

        const result = await pool.query('SELECT * FROM Customer');

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Database connection failed"
        });

    }

});



//post customer api
app.post('/customers', async (req, res) => {

    try {

        const { full_name, email, phone, password } = req.body;

        const query = `
        INSERT INTO Customer(full_name,email,phone,password)
        VALUES($1,$2,$3,$4)
        `;

        await pool.query(query, [
            full_name,
            email,
            phone,
            password
        ]);

        res.json({
            message: "Customer added successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Unable to add customer"
        });

    }

});

//PUT API
app.put('/customers/:id', async (req, res) => {

    try {

        const id = req.params.id;

        const { full_name, email, phone, password } = req.body;

        const query = `
            UPDATE Customer
            SET full_name = $1,
                email = $2,
                phone = $3,
                password = $4
            WHERE customer_id = $5
        `;

        await pool.query(query, [
            full_name,
            email,
            phone,
            password,
            id
        ]);

        res.json({
            message: "Customer updated successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Unable to update customer"
        });

    }

});


// DELETE API
app.delete('/customers/:id', async (req, res) => {

    try {

        const id = req.params.id;

        const query = `
            DELETE FROM Customer
            WHERE customer_id = $1
        `;

        await pool.query(query, [id]);

        res.json({
            message: "Customer deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Unable to delete customer"
        });

    }

});
};