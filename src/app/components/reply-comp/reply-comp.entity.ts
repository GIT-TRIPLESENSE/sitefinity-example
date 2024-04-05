import { ContentSection, WidgetEntity, DataType, KnownFieldTypes} from '@progress/sitefinity-widget-designers-sdk';

@WidgetEntity('ReplyComp', 'Reply first Component')
export class ReplyCompEntity {
    @ContentSection('', 0)
    Content: string | null = null;

    @ContentSection('', 1)
    @DataType(KnownFieldTypes.Html)
    CodeReplyStart: string | null= null;

}

