import { WidgetRegistry, initRegistry, defaultWidgetRegistry } from '@progress/sitefinity-nextjs-sdk';
import { HelloWorld } from './components/hello-world/hello-world';
import { HelloWorldEntity } from './components/hello-world/hello-world.entity';
import { ReplyComp } from './components/reply-comp/reply-comp';
import { ReplyCompEntity } from './components/reply-comp/reply-comp.entity';
import { ReplyList } from '../components/ReplyList';
import { ReplyListEntity } from './components/reply-list/reply-list.entity';
import { SitefinityComponent } from '../components/Sitefinity';
import { ReplyCard } from '../components/ReplyCard';
import { ReplyCardEntity } from './components/reply-card/reply-card.entity';
import { ReplyNestedEntity } from './components/reply-nested/reply-nested.entity';
import { ReplyNestedComponent } from './components/reply-nested/reply-nested';

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
            componentType: SitefinityComponent(ReplyList), // registration of the widget
            entity: ReplyListEntity, // registration of the designer
            ssr: true, // whether this is a server rendered or client rendered component
            editorMetadata: {
                Title: 'Reply List',
            },
        },
        ReplyCard: {
            componentType: SitefinityComponent(ReplyCard), // registration of the widget
            entity: ReplyCardEntity, // registration of the designer
            ssr: true, // whether this is a server rendered or client rendered component
            editorMetadata: {
                Title: 'Reply Card',
                Name: 'ReplyCard',
            },
        },
        ReplyNested: {
            componentType: ReplyNestedComponent, // registration of the widget
            entity: ReplyNestedEntity, // registration of the designer
            ssr: true, // whether this is a server rendered or client rendered component
            editorMetadata: {
                Title: 'Reply Nested Component',
            },
        },
    },
};

Object.keys(defaultWidgetRegistry.widgets).forEach((key) => {
    customWidgetRegistry.widgets[key] = defaultWidgetRegistry.widgets[key];
});

export const widgetRegistry: WidgetRegistry = initRegistry(customWidgetRegistry);
