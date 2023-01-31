import React, { Component } from 'react';
import { Table, TableData } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import { DataManipulator } from './DataManipulator';
import './Graph.css';

interface IProps {
  data: ServerRespond[],
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}
class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    // Get element from the DOM.
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    const schema = {
      price_first_stock: 'float',
      price_second_stock: 'float',
      ratio: 'float',
      upper_bound: 'float',
      lower_bound: 'float',
      timestamp: 'date',
      ratio_line: 'float',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      elem.setAttribute('theme', "Material Dark");
      //'view' is type of graph we want to visualize the data with, here I chose y_line graph.
      elem.setAttribute('view', 'y_line');
      //allows us to map each datapoint based on its timestamp.
      elem.setAttribute('row-pivots', '["timestamp"]');
      // 'columns' allows us to focus on a particular part of a datapoint’s data
      // along the y-axis. We want to track ratio, lower_bound, upper_bound and trigger_alert.
      elem.setAttribute('columns', '["ratio", "upper_bound", "lower_bound", "ratio_line"]');
      // allows us to handle the duplicate and consolidate them into one data point.
      elem.setAttribute('aggregates', JSON.stringify({
        price_first_stock: 'avg',
        price_second_stock: 'avg',
        ratio: 'avg',
        timestamp: 'distinct count',
        upper_bound: 'avg',
        lower_bound: 'avg',
        ratio_line: 'avg',

      }));
      // Load the `table` in the `<perspective-viewer>` DOM reference.
      elem.load(this.table);
    }
  }

  componentDidUpdate() {
    if (this.table) {
      this.table.update([
        DataManipulator.generateRow(this.props.data),
      ] as unknown as TableData);
    }
  }
}

export default Graph;
