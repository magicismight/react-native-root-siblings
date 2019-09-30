import React, { ReactNode } from 'react';

export default function ChildrenWrapper(props: { children?: ReactNode }) {
  return <>{props.children}</>;
}
