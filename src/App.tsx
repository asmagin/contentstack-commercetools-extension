import React from 'react';

import { CategoryField } from './FieldExtensions/CategoryField';
import { ProductField } from './FieldExtensions/ProductField';

class App extends React.Component<any, any> {
  extensionField: any;

  constructor(props: any) {
    super(props);

    this.state = { config: null };

    // {
    //   project_key: 'wooli',
    //   domain: 'commercetools.co',
    //   client_id: 'ay_7F-C7I3nBaIq5uy99-eeb',
    //   client_secret: 'PCIa5p8RatgQ4v2RN-Rhn0FdN02xczdH',
    // };

    this.getFieldValue = this.getFieldValue.bind(this);
    this.setFieldValue = this.setFieldValue.bind(this);
    this.resize = this.resize.bind(this);
  }

  async componentDidMount() {
    const self = this;

    // connect to ContentStack
    const ContentstackUIExtension = (window as any).ContentstackUIExtension;

    ContentstackUIExtension.init().then(function(ex: any) {
      // make extension object globally available
      self.extensionField = ex;
      self.setState({ config: self.extensionField.config });
    });
  }

  private getFieldValue(): any {
    return this?.extensionField?.field?.getData();
  }

  private setFieldValue(data: any) {
    this?.extensionField?.field?.setData(data);
  }

  private resize() {
    this?.extensionField?.window?.updateHeight();
  }

  render() {
    const { config } = this.state;

    if (!config) {
      return null;
    }

    const fieldProps = {
      getFieldValue: this.getFieldValue,
      setFieldValue: this.setFieldValue,
      resize: this.resize,
    };

    switch (config.type) {
      case 'category':
        return <CategoryField config={config} {...fieldProps} />;
      default:
        return <ProductField config={config} {...fieldProps} />;
    }
  }
}

export default App;
