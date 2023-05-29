import React from 'react';
import clsx from 'clsx';

import { usePagination, DOTS } from './usePagination';

import styles from './Pagination.module.scss';

interface Props {
  onPageChange: (page: number) => void;
  totalCount: number;
  siblingCount?: number;
  currentPage: number;
  pageSize: number;
  className?: any;
}

const Pagination: React.FC<Props> = ({ onPageChange, totalCount, siblingCount = 1, currentPage = 1, pageSize, className }) => {
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  const len = paginationRange && paginationRange.length || 1;

  if (currentPage === 0 || (len < 2)) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange[len - 1];

  return (
    <ul
      className={clsx({
        [styles.pagination_container]: true,
        [className]: typeof className !== 'undefined',
      })}
    >
      <li
        className={clsx({
          [styles.pagination_item]: true,
          [styles.pagination_item__arrow]: true,
          [styles.pagination_item__disabled]: currentPage === 1,
        })}
        onClick={onPrevious}
      >
        <i className='fa fa-angle-left' aria-hidden='true' />
      </li>
      {paginationRange.map((pageNumber: any, index: number) => {
        if (pageNumber === DOTS) {
          return (
            <li key={index} className='pagination-item dots'>
              &#8230;
            </li>
          );
        }

        return (
          <li
            key={index}
            className={clsx({
              [styles.pagination_item]: true,
              [styles.pagination_item__selected]: pageNumber === currentPage,
            })}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </li>
        );
      })}
      <li
        className={clsx({
          [styles.pagination_item]: true,
          [styles.pagination_item__arrow]: true,
          [styles.pagination_item__disabled]: currentPage === lastPage,
        })}
        onClick={onNext}
      >
        <i className='fa fa-angle-right' aria-hidden='true' />
      </li>
    </ul>
  );
};

export default Pagination;
