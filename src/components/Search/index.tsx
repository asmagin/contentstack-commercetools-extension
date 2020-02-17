import React, { useState } from 'react';

import { FieldState } from '../../FieldExtensions/models';

import styles from './styles.module.css';

export interface SearchProps {
  state: FieldState;
  searchHandler: (query: string) => void;
}

export const Search = (props: SearchProps) => {
  const [query, setQuery] = useState('');

  const keyPressed = (event: any) => {
    setQuery(event.target.value);

    if (event.key === 'Enter' && event.target?.value?.length >= 3) {
      props.searchHandler(event.target.value);
    }
  };

  return (
    <>
      <div className="cs-form-group">
        <input
          type="search"
          className={`cs-text-box ${styles.searchInput}`}
          title="No categories selected. Enter category name and click 'Search' button."
          placeholder="Enter category name and click 'Search' button..."
          value={query}
          onKeyPress={keyPressed}
          onChange={keyPressed}
        ></input>
        <button
          className={styles.button + ' btn cs-btn-circle'}
          onClick={() => props.searchHandler(query)}
          disabled={query.length < 3}
        >
          Search
        </button>
      </div>
    </>
  );
};
