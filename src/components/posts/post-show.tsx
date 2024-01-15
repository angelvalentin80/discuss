import { db } from "@/db";
import { notFound } from "next/navigation";

interface PostShowProps {
  postId: string;
}

// This is an example of just fetching data inside of a component. This is
// helpful in the event that you don't think that this component is going to be re-used
// in the future. You don't have to make every component reusable, especially if there
// is no need to use a component somewhere else. So this is a more simpler approach
export default async function PostShow({ postId }: PostShowProps) {
  await new Promise((resolve) => setTimeout(resolve, 2500)); // testing streaming

  const post = await db.post.findFirst({
    where: { id: postId },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="m-4">
      <h1 className="text-2xl font-bold my-2">{post.title}</h1>
      <p className="p-4 border rounded">{post.content}</p>
    </div>
  );
}
