import React, { useState } from 'react';

import { FieldState } from '../../FieldExtensions/models';
import { CategoryViewModel } from '../../integration/ct/models';
import { Loader } from '../loader';
import { Paging } from '../Paging';

import styles from './styles.module.css';

export interface CategoryListProps {
  state: FieldState;
  data: CategoryViewModel[];
  selectHandler: (category: CategoryViewModel) => void;
  pageSize?: number;
}

const buildPath = (category: CategoryViewModel) =>
  category.ancestors
    ? category.ancestors.reduce(
        (acc, val) => `/${val.name}${acc}`,
        `/${category.name}`
      )
    : `/${category.name}`;

const renderRows = (
  data: CategoryViewModel[],
  selectHandler: (category: CategoryViewModel) => void
) =>
  data?.map(x => (
    <li className="table-row" key={x.key}>
      <div className="table-cell w-30">
        <div className={styles.name} title={x.name}>
          {x.name}
        </div>
      </div>
      <div className="table-cell w-50">
        <div className={styles.key}>
          Key: <span title={x.key}>{x.key}</span>
          <br />
          Path: <span title={buildPath(x)}>{buildPath(x)}</span>
        </div>
      </div>
      <div className="table-cell w-20">
        <button className="btn cs-btn-circle" onClick={() => selectHandler(x)}>
          Select
        </button>
      </div>
    </li>
  ));

export const CategoryList = (props: CategoryListProps) => {
  const pageSize = props.pageSize || 5;
  const { state, data, selectHandler } = props;
  const [currentPage, setCurrentPage] = useState(0);
  const currentPageData = data?.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  if (!data?.length) {
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
                <div className="table-cell w-30">Name</div>
                <div className="table-cell w-50">Key/Path</div>
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
