import React, { Component } from 'react';
import { Chip } from '@material-ui/core';
import { Preset } from '../registration.model';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import { isEmpty } from 'lodash';
import './PresetsSelector.scss';
import { CreatePresetDialog } from '../createPresetDialog/CreatePresetDialog';

interface PresetsSelectorProps {
  presets: Preset[];
  tags: string[];
  onClick: (preset: Preset) => void;
  onRemove: (preset: Preset) => void;
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
          {isEmpty(presets) ? this.renderPlaceholder() : this.renderPresets()}
          <Fab onClick={this.onCreatePreset}
               color='primary'
               className='presets-selector__add-button add-button'
               data-create-preset-button>
            <AddIcon/>
          </Fab>
        </div>
    );
  }

  private renderPlaceholder() {
    return (
        <div className='presets-selector__placeholder' data-presets-selector-placeholder>
          <p>You don't have any presets yet</p>
          <p>Click the button below to create one</p>
        </div>
    );
  }

  private renderPresets() {
    const {presets} = this.props;
    return (
        <div className='presets-selector__list' data-presets-selector-list>
          {
            presets.map(this.renderPreset)
          }
        </div>
    );
  }

  private renderPreset = (preset: Preset) => {
    const {onRemove, onClick} = this.props;
    const text = preset.tags.join(', ');
    return (
        <Chip key={preset.id}
              label={text}
              onClick={() => onClick(preset)}
              onDelete={() => onRemove(preset)}
              className='presets-selector__chip chip'
              data-preset/>
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
