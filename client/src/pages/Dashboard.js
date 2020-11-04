import React from 'react';
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';

export default function Dashboard() {
    const layout = [
        {i: 'a', x: 0, y: 0, w: 1, h: 2, static: true},
        {i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4},
        {i: 'c', x: 4, y: 0, w: 1, h: 2}
      ];
      return (
        <GridLayout compactType='horizontal'  className="layout" layout={layout} cols={12} rowHeight={30} width={1200}>
            <div key="a">
                <Card key="a">
                    <CardContent>
                        HELLOOO
                    </CardContent>
                </Card>
            </div>
            <Card key="b">
                    <CardContent>
                        HELLOOO
                    </CardContent>
                </Card>
          <div key="c">
          <Card>
                    <CardContent>
                        HELLOOO
                    </CardContent>
                </Card>
          </div>
        </GridLayout>
      );
}