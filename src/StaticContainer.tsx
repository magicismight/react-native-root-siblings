import { Component, Children } from 'react';

interface Props {
  shouldUpdate: boolean;
}
export default class extends Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    return nextProps.shouldUpdate;
  }

  render() {
    const child = this.props.children;
    return child === null || child === false ? null : Children.only(child);
  }
}
