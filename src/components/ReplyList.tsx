import React from 'react';
import { ReplyListEntity } from '../app/components/reply-list/reply-list.entity';
import { ReplyCard } from './ReplyCard';

export function ReplyList({ items }: ReplyListEntity) {
    return (
        <div>
            <h2 className='test'> testo</h2>
            <div style={{ maxWidth: '300px' }}>
                {items?.map((card, index) => <ReplyCard key={index} title={card.title} image={card.image}></ReplyCard>)}
            </div>
        </div>
    );
}
