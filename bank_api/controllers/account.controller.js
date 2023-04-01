import status_code from 'http-status';
import account_model from '../models/account.model.js';
import error from '../errors_handler/index.js';

async function get_all_acct(req, res) {
    const accounts = await account_model.find({});
    res.status(status_code.OK).json({data: accounts});
}

async function get_balance(req, res) {
    const { userId } = req.user;
    const account = await account_model.findOne({userId});
    if (!account) {
        res.status(status_code.NOT_FOUND).json({message: error.YouDontHaveAcct});
        return;
    }
    res.status(status_code.OK).json({data: { balance: account.curraMount }});
}

const accountController = {
    get_all_acct,
    get_balance
};

export default accountController;