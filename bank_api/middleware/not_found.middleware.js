import status_code from 'http-status';

function not_found(req, res) {
    res.status(status_code.NOT_FOUND).json({message: 'Route does not exist'});
    return;
}

export default not_found;