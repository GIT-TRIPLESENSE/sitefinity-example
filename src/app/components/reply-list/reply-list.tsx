import React from 'react';
import { WidgetContext, htmlAttributes } from '@progress/sitefinity-nextjs-sdk';
import { ReplyListEntity } from './reply-list.entity';

export function ReplyList(context: WidgetContext<ReplyListEntity>) {
    // attributes are needed for the widget to be visible in edit mode
    const dataAttributes = htmlAttributes(context);
    //const list = props.model.Properties.ObjectCollection;
    const props = context.model.Properties;

    return (
        <div {...dataAttributes}>
            <h2 className='test'> testo</h2>
            {props.Cards2?.map((card, index) => (
                <div key={index}>
                    <h1>{card.Title}</h1>
                    <img src={card.Image?.Url ?? undefined} />
                </div>
            ))}
        </div>
    );
}
