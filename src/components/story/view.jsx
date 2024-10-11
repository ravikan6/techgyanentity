import React from 'react';
import { StoryCardMeta, StoryImage, StorySidebar, StoryTopbar } from '.';
import styles from '@/styles/post.module.css';
import { ServerVariantPersistent } from '@/components/common/helpers';
import { Card, ListItem } from '@mui/material';
import Link from 'next/link';
import { AuthorAvatar } from '../creator/_client';

function jsonToObject(json) {
    try {
        return JSON.parse(json);
    } catch (error) {
        return [];
    }
}

const View = async ({ story }) => {
    if (story?.key) {
        if (story?.privacy === 'PRIVATE') {
            return (
                <main className="container m-auto">
                    <div className="bg-red-100 mt-20 border w-4/6 m-auto text-center border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Sorry, this story is private!</strong>
                        <br></br>
                        <span className="block sm:inline">Please check back later.</span>
                    </div>
                </main>
            );
        } else if (story?.privacy === 'PUBLIC' || story?.privacy === 'UNLISTED') {
            return (
                <main className="overflow-clip max-w-[2400px] mx-auto">
                    <ServerVariantPersistent />
                    <section className={`flex flex-col lg:flex-row lg:space-x-18 justify-between md:px-0 `}>
                        <div className={`lg:w-[calc(100%-475px)] w-full py-3`}>
                            <div className="max-w-xl w-full mx-auto">
                                <div className='mb-2'>
                                    {story?.image && (
                                        <figure
                                            key={story.key}
                                            className="block mb-5 text-center break-inside-avoid-column"
                                        >
                                            <StoryImage image={story.image} />
                                            <figcaption className="mt-2 text-sm italic text-black/40 dark:text-white/40">
                                                {story?.image?.caption}
                                            </figcaption>
                                        </figure>
                                    )}
                                </div>
                                <div id="article_topMeta" className="mb-6 pb-4 border-b block lg:hidden border-y-gray-400 pt-4">
                                    <StoryTopbar storyKey={story.key} />
                                </div>
                                <div className={`pb-7 ${styles.container}`}>
                                    {story?.content && <RenderBlock blocks={jsonToObject(story?.content)} />}
                                </div>
                                <div className="mt-8 flex items-center flex-wrap justify-evenly">
                                    {
                                        story.tags && story.tags.map((tag) => <div className="bg-lightHead mt-2 dark:bg-darkHead w-auto px-6 py-1.5 rounded-full text-sm font-semibold shadow hover:bg-accentLight dark:hover:bg-accentDark hover:text-white cursor-pointer" key={tag?.id}>{tag.name}</div>)
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="lg:block hidden" id="article_sidebar_dr" >
                            <StorySidebar storyKey={story.key} />
                        </div>
                    </section>
                </main>
            );
        }
    } else {
        notFound();
    }
};

const CardView = ({ story }) => {
    return (
        <>
            <Card
                elevation={0}
                sx={{
                    borderRadius: '0px',
                    overflow: 'hidden',
                    backgroundColor: 'transparent',
                }}
            >
                <div className="relative group/g_pst transition-opacity h-full duration-300">
                    <Link href={`/@${story?.author?.handle}/${story.slug}`}>
                        <StoryImage className="rounded-md" image={story?.image} />
                    </Link>
                    <div className="mt-2 flex flex-nowrap h-full items-start justify-between">
                        <div className="grow">
                            <Link href={`/@${story?.author?.handle}/${story.slug}`} className="w-full">
                                <h2 className="text-xl md:text-base font-bold karnak line-clamp-2 text-ellipsis">{story.title}</h2>
                                <p className="text-sm text-gray-500 line-clamp-2 text-ellipsis">{story?.description}</p>
                            </Link>
                            <div className="flex items-center justify-between gap-2 mt-2">
                                <StoryCardMeta story={story} />
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </>
    );
}

const ListItemView = ({ story }) => {

    return (
        <ListItem>
            <div className="relative group/g_pst transition-opacity duration-300 flex items-start w-full gap-5">
                <div className='self-start h-28 aspect-video'>
                    <Link href={`/@${story?.author?.handle}/${story.slug}`}>
                        <StoryImage className="rounded-md" image={story?.image} />
                    </Link>
                </div>
                <div className="flex flex-col items-start justify-between">
                    <Link href={`/@${story?.author?.handle}/${story.slug}`} className="w-full">
                        <h2 className="text-xl md:text-base font-bold karnak line-clamp-2 text-ellipsis">{story.title}</h2>
                        <p className="text-sm text-gray-500 line-clamp-2 text-ellipsis">{story?.description}</p>
                    </Link>
                    <div className="w-full mt-2">
                        <StoryCardMeta story={story} />
                    </div>
                </div>
            </div>
        </ListItem>
    );
}


const RenderBlock = ({ blocks }) => {
    const renderContent = (content) => {
        return content.map((contentItem, index) => {
            if (contentItem.type === 'text') {
                if (contentItem.styles?.code) {
                    return <code key={index} className={styles.code}>{contentItem.text}</code>;
                }
                return contentItem.text;
            }
            if (contentItem.type === 'link') {
                return <a key={index} href={contentItem.href} className={styles.link}>{contentItem.content.map((linkContent, linkIndex) => renderContent([linkContent]))}</a>;
            }
            return null;
        });
    };

    const renderBlock = (block) => {
        switch (block.type) {
            case 'heading':
                if (block.props.level === 1) {
                    return <h1 key={block.id} className={`${styles.heading} ${styles.h1}`}>{renderContent(block.content)}</h1>;
                }
                if (block.props.level === 2) {
                    return <h2 key={block.id} className={`${styles.heading} ${styles.h2}`}>{renderContent(block.content)}</h2>;
                }
                if (block.props.level === 3) {
                    return <h3 key={block.id} className={`${styles.heading} ${styles.h3}`}>{renderContent(block.content)}</h3>;
                }
                break;
            case 'paragraph':
                return <p key={block.id} className={styles.paragraph}>{renderContent(block.content)}</p>;
            default:
                return null;
        }
    };

    return <>{blocks.map(renderBlock)}</>;
};


export default View;
export { CardView, ListItemView };