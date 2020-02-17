import React from 'react';

import { getRestClient } from '../../integration/ct';

import { Search } from '../../components/Search';
import { Group } from '../../components/Group';
import { Product } from '../../components/Product';
import { Error as ErrorComponent } from '../../components/Error';
import { ProductList } from '../../components/ProductList';
import { UseEffectHookWrapper } from '../../components/useEffectHookWrapper';

import { FieldState } from '../models';
import { ProductViewModel, Config } from '../../integration/ct/models';
import { FieldHandlersProps } from '../../integration/cs/models';

export interface ProductFieldProps extends FieldHandlersProps {
  config: Config;
}

export interface ProductFieldState {
  selectedProduct?: any;
  productList?: any;
  query?: string;
  error?: any;
  state: FieldState;
  currentPage: number;
}

export class ProductField extends React.Component<
  ProductFieldProps,
  ProductFieldState
> {
  el: any;
  extensionField: any;
  config: any;
  client: any;

  constructor(props: any) {
    super(props);

    this.state = {
      state: FieldState.NotInitialized,
      currentPage: 0,
    };

    this.loadSelectedValue = this.loadSelectedValue.bind(this);
    this.clearSelectedValue = this.clearSelectedValue.bind(this);
    this.searchHandler = this.searchHandler.bind(this);
    this.selectHandler = this.selectHandler.bind(this);
    this.setCurrentPageHandler = this.setCurrentPageHandler.bind(this);
  }

  async componentDidMount() {
    const { config, getFieldValue } = this.props;

    if (config && config.domain) {
      this.client = this.client || (await getRestClient(config));

      const value = getFieldValue();

      this.loadSelectedValue(value);
    }
  }

  private async loadSelectedValue(value?: string) {
    if (!this.client || !value) {
      this.setState({
        state: FieldState.ValueEmpty,
        selectedProduct: null,
      });
      return;
    }

    const self = this;
    this.setState({
      state: FieldState.ValueLoading,
      selectedProduct: null,
    });

    try {
      var result = await this.client(`product-projections/key=${value}`);

      if (result) {
        self.setState({
          selectedProduct: {
            name: result?.name['en-US'],
            key: result?.key,
            description: result?.description['en-US'],
            assets: result?.masterVariant?.images?.map((x: any) => x.url),
          },
          state: FieldState.ValueLoaded,
        });
      }
    } catch (err) {
      self.setState({
        error: new Error(`Unable to get product with id "${value}"`),
        state: FieldState.FailedToLoad,
      });
    }
  }

  private clearSelectedValue() {
    this.setState({
      state: FieldState.ValueEmpty,
      selectedProduct: null,
    });

    this.props.setFieldValue(null);
  }

  private async searchHandler(query: string) {
    if (!this.client || !query || query === this.state.query) {
      return;
    }
    const self = this;
    const locale = 'en-US';

    this.setState({
      query: query,
      state: FieldState.SearchLoading,
      productList: null,
      currentPage: 0,
    });

    try {
      var result = await this.client(
        `product-projections/search?limit=50&text.${locale}=${query}`
      );

      if (result?.results) {
        const productList = result?.results.map((x: any) => ({
          name: x?.name['en-US'],
          key: x?.key,
          description: x?.description['en-US'],
          assets: x?.masterVariant?.images?.map((x: any) => x.url),
        }));

        self.setState({
          productList: productList,
          state: FieldState.SearchLoaded,
        });
      }
    } catch (err) {
      self.setState({
        error: new Error(`Unable to find products that contain "${query}"`),
        state: FieldState.FailedToLoad,
      });
    }
  }

  private selectHandler(data: ProductViewModel) {
    const { setFieldValue } = this.props;

    if (!data?.key || data.key === this.state.selectedProduct?.key) {
      return;
    }

    this.setState({
      selectedProduct: data,
      state: FieldState.ValueLoaded,
      query: undefined,
    });

    setFieldValue(data.key);
  }

  private setCurrentPageHandler(page: number) {
    this.setState({ currentPage: page });
  }

  render() {
    const {
      selectedProduct,
      state,
      productList,
      currentPage,
      error,
    } = this.state;
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
            <Product
              state={state}
              data={selectedProduct}
              clearSelection={this.clearSelectedValue}
            />
            <UseEffectHookWrapper callback={resize} />
          </Group>
        );
      default:
        return (
          <Group>
            <Search state={state} searchHandler={this.searchHandler} />
            <ProductList
              state={state}
              data={productList}
              selectHandler={this.selectHandler}
              currentPage={currentPage}
              setCurrentPageHandler={this.setCurrentPageHandler}
            />
            <UseEffectHookWrapper callback={resize} />
          </Group>
        );
    }
  }
}
