import React from 'react';
import { WidgetContext, htmlAttributes } from '@progress/sitefinity-nextjs-sdk';
import { ReplyListEntity } from './reply-list.entity';


export function ReplyList(props: WidgetContext<ReplyListEntity>) {

    // attributes are needed for the widget to be visible in edit mode
    const dataAttributes = htmlAttributes(props);
    //const list = props.model.Properties.ObjectCollection;


    return (
      <div  {...dataAttributes}>
        <h2 className="test"> testo</h2>
      </div>
    );
}
