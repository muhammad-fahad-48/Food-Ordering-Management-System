const pool = require('./db');

module.exports = function(app){

app.get('/categories',async(req,res)=>{
    try{
            const result = await pool.query('select * from category');
            res.json(result.rows);

    }catch(error){
        console.error(error);

        res.status(500).json({
            message: "database connection failed"
        });

    }
});


app.post('/categories',async(req,res) => {
    try{
        const {category_name} = req.body;
        const query = `INSERT INTO category(category_name) 
        VALUES($1)`;
        await pool.query(query,[category_name]);

        res.json({
            message: "Category added succusfully"
        });

    }catch(error){
        console.error(error);
        res.status(500).json({
            message : "Unable to add record"
        });
    }
});

app.delete('/categories/:id', async (req, res) => {

    try {

        const id = req.params.id;

        const query = `
            DELETE FROM Category
            WHERE category_id = $1
        `;

        await pool.query(query, [id]);

        res.json({
            message: "Category deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Unable to delete category"
        });

    }

});
};