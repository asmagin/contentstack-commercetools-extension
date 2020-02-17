import React from 'react';

import { FieldState } from '../../FieldExtensions/models';
import { ProductViewModel } from '../../integration/ct/models';
import { Loader } from '../loader';

import styles from './styles.module.css';

export interface ProductProps {
  state: FieldState;
  data: ProductViewModel;
  clearSelection: () => void;
}

export const Product = (props: ProductProps) => {
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

      return (
        <div className={styles.field}>
          {data?.assets?.length && (
            <div className={`${styles.content} w-20 ${styles['image-wrapper']}`}>
              <img
                src={data.assets[0]}
                alt={data.name}
                className={styles.image}
              ></img>
            </div>
          )}
          <div className={`${styles.content} w-75`}>
            <div className={styles.name} title={data.name}>
              {data.name}
            </div>
            <div className={styles.key} title={data.key}>
              Key: <span>{data.key}</span>
            </div>
            <div className={styles.path} title={data.description}>
              Description: <span>{data.description}</span>
            </div>
          </div>
          <div className={`${styles.content} w-5`}>
            <img
              className={styles.iconRemove}
              onClick={clearSelection}
              alt="Clear"
              src="https://app.contentstack.com/static/images/remove-entry.svg"
            ></img>
          </div>
          <div style={{ clear: 'both' }} />
        </div>
      );
  }
};
