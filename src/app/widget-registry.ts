import { WidgetRegistry, initRegistry, defaultWidgetRegistry } from '@progress/sitefinity-nextjs-sdk';
import { HelloWorld } from './components/hello-world/hello-world';
import { HelloWorldEntity } from './components/hello-world/hello-world.entity';
import { ReplyComp } from './components/reply-comp/reply-comp';
import { ReplyCompEntity } from './components/reply-comp/reply-comp.entity';
import { ReplyList } from './components/reply-list/reply-list';
import { ReplyListEntity } from './components/reply-list/reply-list.entity';
import { ReplyCardEntity } from './components/reply-card/reply-card.entity';
import { ReplyCard } from './components/reply-card/reply-card';

const customWidgetRegistry: WidgetRegistry = {
    widgets: {
        HelloWorld: {
            componentType: HelloWorld, // registration of the widget
            entity: HelloWorldEntity, // registration of the designer
            ssr: true, // whether this is a server rendered or client rendered component
            editorMetadata: {
                Title: 'Hello World',
            },
        },
        ReplyComp: {
            componentType: ReplyComp, // registration of the widget
            entity: ReplyCompEntity, // registration of the designer
            ssr: true, // whether this is a server rendered or client rendered component
            editorMetadata: {
                Title: 'Reply first Component',
            },
        },
        ReplyList: {
            componentType: ReplyList, // registration of the widget
            entity: ReplyListEntity, // registration of the designer
            ssr: true, // whether this is a server rendered or client rendered component
            editorMetadata: {
                Title: 'Reply List',
            },
        },
        ReplyCard: {
            componentType: ReplyCard, // registration of the widget
            entity: ReplyCardEntity, // registration of the designer
            ssr: true, // whether this is a server rendered or client rendered component
            editorMetadata: {
                Title: 'Reply Card',
                Name: 'ReplyCard',
            },
        },
    },
};

Object.keys(defaultWidgetRegistry.widgets).forEach((key) => {
    customWidgetRegistry.widgets[key] = defaultWidgetRegistry.widgets[key];
});

export const widgetRegistry: WidgetRegistry = initRegistry(customWidgetRegistry);
