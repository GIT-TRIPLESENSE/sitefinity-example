import {
    ContentSection,
    WidgetEntity,
    DataType,
    KnownFieldTypes,
    MediaItem,
    Model,
} from '@progress/sitefinity-widget-designers-sdk';
import { ImageItem } from '@progress/sitefinity-nextjs-sdk/rest-sdk';

@Model()
export class ReplyCardModel {
    @ContentSection('Title', 0)
    title?: string;

    @MediaItem('images', false)
    @DataType('media')
    image?: ImageItem;
}

@WidgetEntity('ReplyCard', 'Reply card')
export class ReplyCardEntity extends ReplyCardModel {}
