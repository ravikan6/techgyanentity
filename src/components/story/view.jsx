import React from 'react';
import { VariantPersistent } from "@/components/header";
import { StoryImage, StorySidebar, StoryTopbar } from '.';
import styles from '@/styles/post.module.css';

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
                    <VariantPersistent />
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

export const dynamic = 'force-dynamic';

export default View;