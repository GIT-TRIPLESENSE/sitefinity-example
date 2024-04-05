import React from 'react';
import { WidgetContext, htmlAttributes } from '@progress/sitefinity-nextjs-sdk';
import { ReplyCardEntity } from './reply-card.entity';

export function ReplyCard(props: WidgetContext<ReplyCardEntity>) {
    // attributes are needed for the widget to be visible in edit mode
    const dataAttributes = htmlAttributes(props);
    return (
        <div {...dataAttributes}>
            <h1>{props.model.Properties.Title}</h1>
            <img src={props.model.Properties.Image?.Url ?? undefined} />
        </div>
    );
}
