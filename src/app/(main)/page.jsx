import { auth } from "@/lib/auth";
import { ImageBlock, TheImageBlock } from "@/components/Home/HomeBlocks";

export default async function Home() {
  const session = await auth();

  const blogPosts = [
    {
      id: 1,
      title: "Blog Post 1",
      content: "This is the content of Blog Post 1",
      author: "John Doe",
      date: "2022-01-01",
    },
    {
      id: 2,
      title: "Blog Post 2",
      content: "This is the content of Blog Post 2",
      author: "Jane Smith",
      date: "2022-01-02",
    },
    {
      id: 3,
      title: "Blog Post 3",
      content: "This is the content of Blog Post 3",
      author: "Alex Johnson",
      date: "2022-01-03",
    },
  ];

  return (
    <>
      <ImageBlock />
      <TheImageBlock />


      {/* <div className="container mx-auto">
        <h1 className="text-3xl font-bold mt-8">Welcome to the Blog</h1>
        <div className="grid grid-cols-3 gap-4 mt-8">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-white p-4 shadow">
              <h2 className="text-xl font-bold">{post.title}</h2>
              <p className="text-gray-500 mt-2">
                By {post.author} on {post.date}
              </p>
              <p className="mt-4">{post.content}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4 mt-8">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-white p-4 shadow">
              <h2 className="text-xl font-bold">{post.title}</h2>
              <p className="text-gray-500 mt-2">
                By {post.author} on {post.date}
              </p>
              <p className="mt-4">{post.content}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4 mt-8">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-white p-4 shadow">
              <h2 className="text-xl font-bold">{post.title}</h2>
              <p className="text-gray-500 mt-2">
                By {post.author} on {post.date}
              </p>
              <p className="mt-4">{post.content}</p>
            </div>
          ))}
        </div>
      </div> */}
    </>
  );
}
