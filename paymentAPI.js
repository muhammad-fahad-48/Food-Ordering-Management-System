const pool = require('./db');
module.exports = function(app){

app.get('/payment',async(req,res) =>{
    try{
        const result = await pool.query('select * from payment');
        res.json(result.rows);
        
    }catch(error){
        console.error(error);
        res.status(500).json({
            message : "Database connection failed"
        });
    }

});

app.post('/payment', async (req, res) => {

    try {

        const {
            order_id,
            payment_method,
            amount,
            payment_status
        } = req.body;

        const query = `
            INSERT INTO Payment
            (order_id, payment_method, amount, payment_status)
            VALUES($1, $2, $3, $4)
        `;

        await pool.query(query, [
            order_id,
            payment_method,
            amount,
            payment_status
        ]);

        res.json({
            message: "Payment added successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Unable to add payment"
        });

    }

});

app.put('/payment/:id', async (req, res) => {

    try {

        const id = req.params.id;

        const {
            order_id,
            payment_method,
            amount,
            payment_status
        } = req.body;

        const query = `
            UPDATE Payment
            SET order_id = $1,
                payment_method = $2,
                amount = $3,
                payment_status = $4
            WHERE payment_id = $5
        `;

        await pool.query(query, [
            order_id,
            payment_method,
            amount,
            payment_status,
            id
        ]);

        res.json({
            message: "Payment updated successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Unable to update payment"
        });

    }

});
    
};