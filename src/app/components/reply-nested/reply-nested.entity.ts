import { ContentSection, WidgetEntity, DataType, KnownFieldTypes } from '@progress/sitefinity-widget-designers-sdk';
import { ReplyCardEntity } from '../reply-card/reply-card.entity';

@WidgetEntity('ReplyNested', 'Reply first Component')
export class ReplyNestedEntity {
    @ContentSection('content', 0)
    @DataType(KnownFieldTypes.Complex)
    content: ReplyCardEntity[] = [];
}
