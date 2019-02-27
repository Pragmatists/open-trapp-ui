import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import './RulesDialog.scss'
import HelpIcon from '@material-ui/icons/Help';
import IconButton from '@material-ui/core/IconButton';

interface RulesDialogState {
  open: boolean;
}

export class RulesDialog extends Component<{}, RulesDialogState> {
  state = {
    open: false
  };

  render() {
    return (
        <span>
          <IconButton className='work-log-input__help' aria-label='Help' onClick={this.onOpen}>
            <HelpIcon color='secondary'/>
          </IconButton>
          <Dialog open={this.state.open} className='rules-dialog'>
            <DialogTitle>Zasady</DialogTitle>
            <DialogContent>
              <div>
                  <p>Rejestrowanie dla <strong>projektu</strong>, np.:</p>
                  <code>#projects #rightmove</code>
                  <code>#projects #talkie</code>
              </div>
              <div>
                  <p>Rejestrowanie <strong>prowadzenia szkolenia</strong>, np:</p>
                  <code>#trainings #open-training</code>
                  <code>#trainings #coaching #orange</code>
              </div>
              <div>
                  <p>Rejestrowanie <strong>przygotowania do szkolenia</strong>, np:</p>
                  <code>#trainings #preparation #nokia</code>
              </div>
              <div>
                  <p>Rejestrowanie <strong>wewnętrznego czasu</strong>:</p>
                  <code>#internal #brown-bag</code>
                  <code>#internal #recruitment</code>
                  <code>#internal #lean-coffee</code>
                  <code>#internal #self-development #conference</code>
                  <code>#internal #JUnitParams</code>
                  <code>#internal #standup</code>
              </div>
              <div>
                  <p>Rejestrowanie <strong>chorób i urlopów:</strong>
                  </p>
                  <code>#sick</code>
                  <code>#vacation</code>
              </div>
              <div>
                  <p>Zasady dla nowych tagów są następujące:</p>
                  <ul>
                      <li>słowa oddzielamy minusami, a nie CamelCase</li>
                      <li>projekty dla jednego klienta prefiksujemy nazwą klienta</li>
                  </ul>
                  <p>Rejestrujemy urlopy i choroby, niezależnie od rodzaju umowy.</p>
                  <p>Efekt oczekiwany jest taki, że na koniec miesiąca każdy ma zarejestrowane tyle samo godzin
                    (w zależności od liczby dni pracujących w miesiącu), z dokładnością do ewentualnych nadgodzin i prac weekendowych.
                  </p>
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onClose} color='secondary'>
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </span>
    );
  }

  private onClose = () => this.setState({open: false});

  private onOpen = () => this.setState({open: true});
}
