import React from 'react';

import { FieldState } from '../../FieldExtensions/models';

import styles from './styles.module.css';

export interface ErrorProps {
  error: Error;
  state: FieldState;
  clearSelection: () => void;
}

export const Error = (props: ErrorProps) => {
  const {
    state,
    clearSelection,
    error: { name, message },
  } = props;

  switch (state) {
    case FieldState.FailedToLoad:
      return (
        <div className={styles.fieldError}>
          <div className={styles.content}>
            <span><b>{name}:</b> {message}</span>
            <img
              className={styles.iconRemove}
              onClick={clearSelection}
              alt="Clear"
              src="https://app.contentstack.com/static/images/remove-entry.svg"
            ></img>
          </div>
        </div>
      );
    default:
      return null;
  }
};
