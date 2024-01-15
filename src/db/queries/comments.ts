import type { Comment } from "@prisma/client";
import { db } from "@/db";
import { cache } from "react"; // This is the import for request memoization

export type CommentWithAuthor = Comment & {
  user: { name: string | null; image: string | null };
};

// We are going to memoize this function, since we are using a query inside of
// every component inside of our comments list. Which means for every comment
// we are making a request to the database. So request memoization can come to the rescue
// to de-duplicate requests
// If we are making a db query, we have to use the 'cache' function
// If we are using 'fetch' functions, this request memoization is automatically
// built in

// as you can see we have to basically have to wrap our query inside of the cache function.
// Now all duplicate queries will be de-duplicated!
export const fetchCommentsByPostId = cache(
  (postId: string): Promise<CommentWithAuthor[]> => {
    return db.comment.findMany({
      where: { postId: postId },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });
  }
);
