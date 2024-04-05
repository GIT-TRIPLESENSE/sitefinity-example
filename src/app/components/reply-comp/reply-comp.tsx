import React from 'react';
import { WidgetContext, htmlAttributes } from '@progress/sitefinity-nextjs-sdk';
import { ReplyCompEntity } from './reply-comp.entity';


export function ReplyComp(props: WidgetContext<ReplyCompEntity>) {

    // attributes are needed for the widget to be visible in edit mode
    const dataAttributes = htmlAttributes(props);
    const testo = props.model.Properties.CodeReplyStart;


    return (
      <div className="pippo" {...dataAttributes} >
        <h1 >{props.model.IsPersonalized+'   '+props.model.Properties.Content}</h1>
        <h2 className="test"> {testo?.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ')}</h2>
      </div>
    );
}
