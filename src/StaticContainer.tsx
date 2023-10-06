import { Component, Children, ReactNode } from 'react';

interface Props {
  shouldUpdate: boolean;
  children: ReactNode;
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
