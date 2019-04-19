import React, {Component} from 'react';
import {Chip} from '@material-ui/core';
import {Preset} from '../registration.model';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import './PresetsSelector.scss';
import {CreatePresetDialog} from '../createPresetDialog/CreatePresetDialog';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';

interface PresetsSelectorProps {
  presets: Preset[];
  tags: string[];
  onClick: (preset: Preset) => void;
  onCreate: (preset: Preset) => void;
}

interface PresetsSelectorState {
  dialogOpen: boolean;
}

export class PresetsSelector extends Component<PresetsSelectorProps, PresetsSelectorState> {
  state = {
    dialogOpen: false
  };

  render() {
    const {presets, tags} = this.props;
    const {dialogOpen} = this.state;
    return (
      <div className='presets-selector'>
        <CreatePresetDialog onClose={this.onCloseDialog} open={dialogOpen} tags={tags} />
        {this.renderPresets()}
        <Fab onClick={this.onCreatePreset}
             color='secondary'
             className='presets-selector__add-button add-button'
             data-create-preset-button>
          <AddIcon />
        </Fab>
      </div>
    );
  }

  private renderPresets() {
    const {presets} = this.props;
    return (
      <List className='presets-selector__list' data-presets-selector-list>
        <ListSubheader>Suggested projects</ListSubheader>
        {
          presets.map(this.renderPreset)
        }
      </List>
    );
  }

  private renderPreset = (preset: Preset, idx: number) => {
    const {onClick} = this.props;
    const text = preset.tags.join(', ');
    return (
      <Chip key={idx}
            label={text}
            onClick={() => onClick(preset)}
            className='presets-selector__chip chip'
            color={'primary'}
            data-preset />
    )
  };

  private onCreatePreset = () => this.setState({
    dialogOpen: true
  });

  private onCloseDialog = (preset?: Preset) => {
    if (preset) {
      const {onCreate} = this.props;
      onCreate(preset);
    }
    this.setState({
      dialogOpen: false
    });
  }
}
