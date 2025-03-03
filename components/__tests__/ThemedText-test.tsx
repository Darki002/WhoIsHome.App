import * as React from 'react';
import renderer from 'react-test-renderer';

import {WihText} from '../WihComponents/display/WihText';

it(`renders correctly`, () => {
    const tree = renderer.create(<WihText style={{fontSize: 12}}>Snapshot test!</WihText>).toJSON();

    expect(tree).toMatchSnapshot();
});
