const pool = require('./db');

module.exports = function(app){

app.get('/restaurant',async (req,res) =>{
    try{
        const result = await pool.query('select * from restaurant');
        res.json(result.rows);

    }catch(error){
        console.error(error);
        res.status(500).json({
            message: "Database connection failed"
        })

    }

});

app.post('/restaurants',async(req,res) =>{
    try{
      const  {restaurant_name,location,contact_no} = req.body;
      const query = `
            INSERT INTO restaurant(restaurant_name,location,contact_no)
            VALUES($1, $2, $3)
        `;

        await pool.query(query,[restaurant_name,location,contact_no]);

        res.json({
            message : "Restaurant added sucessfully"
        });


    }catch(error){
        console.error(error);
        res.status(500).json({
            message: "Unable to add record"
        });
    }

});

app.delete('/restaurants/:id', async (req, res) => {

    try {

        const id = req.params.id;

        const query = `
            DELETE FROM Restaurant
            WHERE restaurant_id = $1
        `;

        await pool.query(query, [id]);

        res.json({
            message: "Restaurant deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Unable to delete restaurant"
        });

    }

});
};