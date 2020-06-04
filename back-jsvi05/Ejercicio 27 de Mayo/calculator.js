const express = require('express');

const app = express()

app.get('/calculate', function (req, res) {
    const operation = req.query['type'];
    const op1 = parseInt(req.query['op1']);
    const op2 = parseInt(req.query['op2']);

    const operations = {
        'sum': (a, b) => a + b,
        'substract': (a, b) => a - b,
        'multiply': (a, b) => a * b,
        'divide': (a, b) => a / b,
        'pow': (a, b) => a ** b
    }

    if (isNaN(op1) || isNaN(op2)) {
        res.status(400).send();
        return;
    }

    if (operations[operation] === undefined) {
        res.status(404).send();
        return;
    }

    const result = operations[operation](op1, op2);

    res.json({
        operation: operation,
        op1: op1, 
        op2: op2,
        resultado: result
    });

})

app.listen(8000);

