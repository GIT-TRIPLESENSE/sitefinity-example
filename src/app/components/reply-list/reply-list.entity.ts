import {
    ComplexType,
    Content,
    ContentContainer,
    ContentSection,
    DataModel,
    DataType,
    KnownFieldTypes,
    MediaItem,
    Model,
    TaxonomyContent,
    WidgetEntity,
} from '@progress/sitefinity-widget-designers-sdk';
import { ReplyCardModel } from '../reply-card/reply-card.entity';

@WidgetEntity('ReplyList', 'Reply list')
export class ReplyListEntity {
    @DataModel(ReplyCardModel)
    @DataType(ComplexType.Enumerable)
    items: ReplyCardModel[] | null = null;
}
