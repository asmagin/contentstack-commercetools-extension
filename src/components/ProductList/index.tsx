import React, { useState } from 'react';

import { FieldState } from '../../FieldExtensions/models';
import { ProductViewModel } from '../../integration/ct/models';
import { Loader } from '../loader';
import { Paging } from '../Paging';

import styles from './styles.module.css';

export interface ProductListProps {
  state: FieldState;
  data: ProductViewModel[];
  selectHandler: (category: ProductViewModel) => void;
  pageSize?: number;
  currentPage: number;
  setCurrentPageHandler: (page: number) => void;
}

const renderRows = (
  data: ProductViewModel[],
  selectHandler: (category: ProductViewModel) => void
) =>
  data?.map(x => (
    <li className="table-row" key={x.key}>
      <div className="table-cell w-20">
        {(x?.assets?.length && x.assets[0] && (
          <div className={styles['image-wrapper']}>
            <img src={x.assets[0]} alt={x.name} className={styles.image}></img>
          </div>
        )) ||
          null}
      </div>
      <div className="table-cell w-30">
        <div className={styles.name} title={x.name}>
          {x.name}
        </div>
      </div>
      <div className="table-cell w-30">
        <div className={styles.key}>
          Key: <span title={x.key}>{x.key}</span>
          <br />
          Path: <span title={x.description}>{x.description}</span>
        </div>
      </div>
      <div className="table-cell w-20">
        <button className="btn cs-btn-circle" onClick={() => selectHandler(x)}>
          Select
        </button>
      </div>
    </li>
  ));

export const ProductList = (props: ProductListProps) => {
  const pageSize = props.pageSize || 5;
  const {
    state,
    data,
    selectHandler,
    currentPage,
    setCurrentPageHandler: setCurrentPage,
  } = props;

  const currentPageData = data?.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  if (!data || !data?.length) {
    return <div>No results.</div>;
  }

  switch (state) {
    case FieldState.NotInitialized:
    case FieldState.SearchLoading:
      return <Loader />;
    default:
      return (
        <>
          <div className="cs-table clearfix">
            <ul className="cs-table-head">
              <li className="table-row">
                <div className="table-cell w-20">Image</div>
                <div className="table-cell w-30">Name</div>
                <div className="table-cell w-30">Key/Path</div>
                <div className="table-cell w-20">Actions</div>
              </li>
            </ul>
            <ul className="cs-table-body">
              {renderRows(currentPageData, selectHandler)}
            </ul>
            <Paging
              data={data}
              pageChangeHandler={x => setCurrentPage(x)}
              pageSize={pageSize}
              currentPage={currentPage}
            />
          </div>
        </>
      );
  }
};
