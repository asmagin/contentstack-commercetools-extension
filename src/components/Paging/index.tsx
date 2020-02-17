import React from 'react';

export interface PagingProps {
  data: any[];
  pageChangeHandler: (page: number) => void;
  pageSize: number;
  currentPage: number;
}

export const Paging = (props: PagingProps) => {
  const { data, pageChangeHandler, pageSize, currentPage } = props;

  if (data?.length > pageSize) {
    const count = data.length;
    const visibleRangeStart = pageSize * currentPage + 1;
    const visibleRangeEnd =
      pageSize * (currentPage + 1) > count ? count : pageSize * (currentPage + 1);
    const visibleRange = `${visibleRangeStart}-${visibleRangeEnd}`;
    const totalPages =
      count % pageSize === 0
        ? count / pageSize
        : (count - (count % pageSize)) / pageSize + 1;

    const isFirst = 0 === currentPage;
    const isLast = totalPages === currentPage + 1;

    return (
      <div className="cs-table-bottom-bar">
        <div className="cs-pagination clearfix">
          <div className={`pagination-prev ${isFirst ? 'disable' : ''}`}>
            <i
              className="icon-chevron-left"
              title="Previous"
              onClick={() => !isFirst && pageChangeHandler(currentPage - 1)}
            ></i>
          </div>
          <div className="result">
            <label className="font-semi-bold">{visibleRange}</label>
            <label>of {count} Entries</label>
          </div>
          <div className={`pagination-next ${isLast ? 'disable' : ''}`}>
            <i
              className="icon-chevron-right"
              title="Next"
              onClick={() => !isLast && pageChangeHandler(currentPage + 1)}
            ></i>
          </div>
        </div>
      </div>
    );
  }
  return null;
};
