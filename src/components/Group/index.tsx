import React from 'react';

import styles from './styles.module.css';

export const Group = (props: any) => (
  <div className={styles['single-group']}>{props.children}</div>
);
