import status_code from 'http-status';
import auth_model from '../models/user.model.js';
import account_model from '../models/account.model.js';
import transfer_model from '../models/transfer.model.js';
import error from '../errors_handler/index.js';

async function transfer_to(req, res) {
    const result = {};

    const user = await auth_model.findOne({username: req.body.username});
    if (!user) {
        res.status(status_code.BAD_REQUEST).json({message: error.UserDoesNotExists});
        return;
    }
    result.receiver_name = `${user.firstName} ${user.lastName}`;
    result.amount_sent = req.body.amount;

    const save_transfer = {
        from: req.user.userId,
        to: user._id,
        amount: req.body.amount
    }

    const transfer_details = await transfer_model.create({...save_transfer})

    if (transfer_details) {
        const to_acct = await account_model.findOne({userId: user._id});
        if (!to_acct) {
            res.status(status_code.BAD_REQUEST).json({message: error.NoUserAccount});
            return;
        }

        const from_acct = await account_model.findOne({userId: req.user.userId});
        if (!from_acct) {
            res.status(status_code.BAD_REQUEST).json({message: error.YouDontHaveAcct});
            return;
        }

        if(from_acct.curraMount < req.body.amount) {
            res.status(status_code.BAD_REQUEST).json({message: error.InsufficientBalance});
            return
        }
        const from_temp_amount = from_acct.curraMount;
        const from_bal = from_acct.curraMount - req.body.amount;
        const to_temp_amount = to_acct.curraMount;
        const to_bal = to_acct.curraMount + req.body.amount;

        from_acct.preAmount = from_temp_amount;
        from_acct.curraMount = from_bal;
        from_acct.save();

        result.account_balance = from_acct.curraMount;

        to_acct.preAmount = to_temp_amount;
        to_acct.curraMount = to_bal;
        to_acct.save();
    }

    res.status(status_code.OK).json({data: result});
}
const transferController = {
    transfer_to
};

export default transferController;