const pool = require('./db');

module.exports = function(app){

    app.get('/customerOrders',async(req,res) =>{
        try{
            const result = await pool.query('select * from customer_order');
            res.json(result.rows);

        }catch (error){
            console.error(error);

            res.status(500).json({
                message: "Database connection failed"
            });

        }
        
    });

app.post('/customerOrders', async (req, res) => {

    try {

        const { customer_id, total_amount, status } = req.body;

        const query = `
            INSERT INTO Customer_Order
            (customer_id, total_amount, status)
            VALUES($1, $2, $3)
        `;

        await pool.query(query, [
            customer_id,
            total_amount,
            status
        ]);

        res.json({
            message: "Order added successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Unable to add order"
        });

    }

});

app.put('/customerOrders/:id', async (req, res) => {

    try {

        const id = req.params.id;

        const {
            customer_id,
            total_amount,
            status
        } = req.body;

        const query = `
            UPDATE Customer_Order
            SET customer_id = $1,
                total_amount = $2,
                status = $3
            WHERE order_id = $4
        `;

        await pool.query(query, [
            customer_id,
            total_amount,
            status,
            id
        ]);

        res.json({
            message: "Order updated successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Unable to update order"
        });

    }

});

app.delete('/customerOrders/:id', async (req, res) => {

    try {

        const id = req.params.id;

        const query = `
            DELETE FROM Customer_Order
            WHERE order_id = $1
        `;

        await pool.query(query, [id]);

        res.json({
            message: "Order deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Unable to delete order"
        });

    }

});


};