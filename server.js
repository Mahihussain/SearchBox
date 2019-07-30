const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




app.post('/', (req, res)=>{

    //console.log(req.body);
    //return res.json({"success": true});
    axios.get('http://pipilika.com:71/PipilikaProductSearch/Search',{params: {
            query: req.body.query
        }

    }).then((result) => {
        //console.log(result.data.facet[0].domain);
        let obj = {
            results: result.data.results,
            facet: result.data.facet[1].product_category_norm_parent,
            total_result: result.data.total_result
        };
        return res.json(obj);

    }).catch((err) => {
        console.log(err);
    });

});


app.post('/filtered1', (req, res)=>{

    //console.log(req.body);
    //return res.json({"success": true});
    axios.get('http://pipilika.com:71/PipilikaProductSearch/Search',{params: {
        parent_category: req.body.parent_category
        }

    }).then((result) => {
        //console.log(result.data.facet[0].domain);
        let obj = {
            results: result.data.results,
            total_result: result.data.total_result
        };
        return res.json(obj);

    }).catch((err) => {
        console.log(err);
    });

});

app.post('/filtered2', (req, res)=>{

    //console.log(req.body);
    //return res.json({"success": true});
    axios.get('http://pipilika.com:71/PipilikaProductSearch/Search',{params: {
        query: req.body.query,
        parent_category: req.body.parent_category
        }

    }).then((result) => {
        //console.log(result.data.facet[0].domain);
        let obj = {
            results: result.data.results,
            total_result: result.data.total_result
        };
        return res.json(obj);

    }).catch((err) => {
        console.log(err);
    });

});

if(process.env.NODE_ENV === 'production')
{
    app.use(express.static('client/build'));
    app.get('*', (req, res)=>{

        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));

    });
}


const port = process.env.PORT || 5000;

app.listen(port, ()=>{

    console.log("Server running ", port);
});