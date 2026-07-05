const pool = require('./db');

module.exports = function(app){

    app.get('/fooditem',async(req,res) =>{
        try{
            const result = await pool.query('select * from Food_Item');
            res.json(result.rows);

        }catch (error){
            console.error(error);

            res.status(500).json({
                message: "Database connection failed"
            });

        }
        
    });

app.post('/fooditem', async (req, res) => {

    try {

        const {  restaurant_id, category_id, food_name, price, available } = req.body;

        const query = `
            INSERT INTO Food_Item
            (restaurant_id, category_id, food_name, price, available)
            VALUES($1, $2, $3, $4, $5)
        `;

        await pool.query(query, [
            restaurant_id,
            category_id,
            food_name,
            price,
            available
        ]);

        res.json({
            message: "Food item added successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Unable to add food item"
        });

    }

});

app.put('/fooditem/:id',async(req,res) =>{
    try{
        const id = req.params.id;
        const {restaurant_id,
            category_id,
            food_name,
            price,
            available
        } = req.body;

        const query = `
            UPDATE Food_Item
            SET restaurant_id = $1,
                category_id = $2,
                food_name = $3,
                price = $4,
                available = $5
            WHERE food_id = $6
        `;

        await pool.query(query, [
            restaurant_id,
            category_id,
            food_name,
            price,
            available,
            id
        ]);

        res.json({
            message: "Food item updated successfully"
        });


    }catch(error){
        console.error(error);
        res.status(500).json({
            message: "Unable to update food item"
        });
    }
});

app.delete('/fooditem/:id', async (req, res) => {

    try {

        const id = req.params.id;

        const query = `
            DELETE FROM Food_Item
            WHERE food_id = $1
        `;

        await pool.query(query, [id]);

        res.json({
            message: "Food item deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Unable to delete food item"
        });

    }

});

};