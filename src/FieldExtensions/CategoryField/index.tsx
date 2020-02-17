import React from 'react';
import { loader } from 'graphql.macro';

import { getGQLClient } from '../../integration/ct';

import { Search } from '../../components/Search';
import { Group } from '../../components/Group';
import { Error as ErrorComponent } from '../../components/Error';
import { Category } from '../../components/Category';
import { CategoryList } from '../../components/CategoryList';
import { UseEffectHookWrapper } from '../../components/useEffectHookWrapper';

import { FieldState } from '../models';
import { CategoryViewModel, Config } from '../../integration/ct/models';
import { FieldHandlersProps } from '../../integration/cs/models';

const getCategoryByKeyQuery = loader('./queries/get-category-by-key.graphql');
const getMatchingCategoriesQuery = loader(
  './queries/get-matching-categories.graphql'
);

export interface CategoryFieldProps extends FieldHandlersProps {
  config: Config;
}

export interface CategoryFieldState {
  selectedCategory?: any;
  categoryList?: any;
  error?: any;
  query?: string;
  state: FieldState;
}

export class CategoryField extends React.Component<
  CategoryFieldProps,
  CategoryFieldState
> {
  el: any;
  extensionField: any;
  config: any;
  client: any;

  constructor(props: any) {
    super(props);

    this.state = {
      state: FieldState.NotInitialized,
    };

    this.loadSelectedValue = this.loadSelectedValue.bind(this);
    this.clearSelectedValue = this.clearSelectedValue.bind(this);
    this.searchHandler = this.searchHandler.bind(this);
    this.selectHandler = this.selectHandler.bind(this);
  }

  async componentDidMount() {
    const { config, getFieldValue } = this.props;

    if (config && config.domain) {
      this.client = this.client || (await getGQLClient(config));

      const value = getFieldValue();

      this.loadSelectedValue(value);
    }
  }

  private loadSelectedValue(value?: string) {
    if (!this.client || !value) {
      this.setState({
        state: FieldState.ValueEmpty,
        selectedCategory: null,
      });
      return;
    }

    const self = this;
    this.setState({
      state: FieldState.ValueLoading,
      selectedCategory: null,
    });

    this.client
      .query({
        query: getCategoryByKeyQuery,
        variables: {
          key: value,
          locale: 'en-US',
        },
      })
      .then((result: any): any => {
        if (result && result.data && result.data.category) {
          self.setState({
            selectedCategory: result.data.category,
            state: FieldState.ValueLoaded,
          });
        } else {
          self.setState({
            error: new Error(`Unable to get category with id "${value}"`),
            state: FieldState.FailedToLoad,
          });
        }
      })
      .error(() =>
        self.setState({
          error: new Error(`Unable to get category with id "${value}"`),
          state: FieldState.FailedToLoad,
        })
      );
  }

  private clearSelectedValue() {
    this.setState({
      state: FieldState.ValueEmpty,
      selectedCategory: null,
    });

    this.props.setFieldValue(null);
  }

  private searchHandler(query: string) {
    if (!this.client || !query || query === this.state.query) {
      return;
    }

    const self = this;

    this.setState({
      query: query,
      state: FieldState.SearchLoading,
      categoryList: null,
    });

    this.client
      .query({
        query: getMatchingCategoriesQuery,
        variables: {
          text: query,
          locale: 'en-US',
        },
      })
      .then((result: any): any => {
        if (result && result.data && result.data.categoryAutocomplete) {
          self.setState({
            categoryList: result.data.categoryAutocomplete.results,
            state: FieldState.SearchLoaded,
          });
        }
      })
      .error((err: any) =>
        self.setState({
          error: err,
          state: FieldState.FailedToLoad,
        })
      );
  }
  private selectHandler(data: CategoryViewModel) {
    const { setFieldValue } = this.props;

    if (!data?.key || data.key === this.state.selectedCategory?.key) {
      return;
    }

    this.setState({
      selectedCategory: data,
      state: FieldState.ValueLoaded,
      query: undefined,
    });

    setFieldValue(data.key);
  }

  render() {
    const { selectedCategory, state, categoryList, error } = this.state;
    const { resize } = this.props;

    switch (state) {
      case FieldState.FailedToLoad:
        return (
          <Group>
            <ErrorComponent
              state={state}
              error={error}
              clearSelection={this.clearSelectedValue}
            ></ErrorComponent>
            <UseEffectHookWrapper callback={resize} />
          </Group>
        );
      case FieldState.NotInitialized:
      case FieldState.ValueLoading:
      case FieldState.ValueLoaded:
        return (
          <Group>
            <Category
              state={state}
              data={selectedCategory}
              clearSelection={this.clearSelectedValue}
            />
            <UseEffectHookWrapper callback={resize} />
          </Group>
        );
      default:
        return (
          <Group>
            <Search state={state} searchHandler={this.searchHandler} />
            <CategoryList
              state={state}
              data={categoryList}
              selectHandler={this.selectHandler}
            />
            <UseEffectHookWrapper callback={resize} />
          </Group>
        );
    }
  }
}
