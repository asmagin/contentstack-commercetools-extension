import React from 'react';

import { FieldState } from '../../FieldExtensions/models';
import { CategoryViewModel } from '../../integration/ct/models';
import { Loader } from '../loader';

import styles from './styles.module.css';

export interface CategoryProps {
  state: FieldState;
  data: CategoryViewModel;
  clearSelection: () => void;
}

export const Category = (props: CategoryProps) => {
  const { state, data, clearSelection } = props;

  switch (state) {
    case FieldState.NotInitialized:
    case FieldState.ValueLoading:
      return (
        <div className={styles.field}>
          <div className={styles.content}>
            <Loader />
          </div>
        </div>
      );
    default:
      if (!data) {
        return null;
      }

      const path = data.ancestors
        ? data.ancestors.reduce(
            (acc, val) => `/${val.name}${acc}`,
            `/${data.name}`
          )
        : `/${data.name}`;

      return (
        <div className={styles.field}>
          <div className={styles.content}>
            <div className={styles.name} title={data.name}>
              {data.name}
            </div>
            <div className={styles.key} title={data.key}>
              Key: <span>{data.key}</span>
            </div>
            <div className={styles.path} title={path}>
              Path: <span>{path}</span>
            </div>
            <img
              className={styles.iconRemove}
              onClick={clearSelection}
              alt="Clear"
              src="https://app.contentstack.com/static/images/remove-entry.svg"
            ></img>
          </div>
        </div>
      );
  }
};
