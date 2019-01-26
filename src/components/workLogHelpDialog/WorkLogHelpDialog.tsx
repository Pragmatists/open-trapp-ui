import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import './WorkLogHelpDialog.css'

interface WorkLogHelpDialogProps {
    open: boolean;
    onClose: () => void;
}

export const WorkLogHelpDialog = ({open, onClose}: WorkLogHelpDialogProps) => (
    <Dialog open={open}>
        <DialogTitle id='simple-dialog-title'>Examples of usage</DialogTitle>
        <DialogContent>
            <div className='example'>
                <code>1d #my-project</code>
                <p>Report <strong>8 hours</strong> to <strong>my-project</strong> for <strong>today</strong>.</p>
            </div>
            <div className='example'>
                <code>1d #my-project @yesterday</code>
                <code>1d #my-project @t-1</code>
                <p>Report <strong>8 hours</strong> to <strong>my-project</strong> for <strong>yesterday</strong>. </p>
            </div>
            <div className='example'>
                <code>1d 2h 15m #my-project</code>
                <p>Report <strong>10 hours and 15
                    minutes</strong> to <strong>my-project</strong> for <strong>today</strong>. </p>
            </div>
            <div className='example'>
                <code>1d #my-project @1966/02/26</code>
                <p>Report <strong>8 hours</strong> to <strong>my-project</strong> on <strong>Feburary 26, 1966</strong>.
                </p>
            </div>
            <div className='example'>
                <code>1d #my-project @monday</code>
                <code>1d #my-project @last-monday</code>
                <p>Report <strong>8 hours </strong> to <strong>my project</strong> for <strong>last monday</strong>.</p>
            </div>
            <div className='example'>
                <code>1d #my-project @next-monday</code>
                <p>Report <strong>8 hours </strong> to <strong>my project</strong> for <strong>next monday</strong>.</p>
            </div>
            <div className='example'>
                <code>1d #main-project #sub-project @today</code>
                <p>Report <strong>8 hours </strong> to <strong>main-project</strong>,
                    precisely <strong>sub-project</strong> for <strong>today</strong> (8 hours total, not 16).</p>
            </div>
            <div className='example'>
                <code>1d #vacations @2018/07/01~@2018/07/31</code>
                <p>Report <strong>month </strong> of <strong>vacations</strong> for working days
                    in <strong>July</strong>.</p>
            </div>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color='secondary'>
                Close
            </Button>
        </DialogActions>
    </Dialog>
);
