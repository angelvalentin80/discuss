"use server";
import type { Topic } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/db";
import paths from "@/paths";

// Schema to determine the validations on our inputs
const createTopicSchema = z.object({
  name: z
    .string()
    .min(3)
    .regex(/^[a-z-]+$/, {
      message: "Must be lowercase letters or dashes without spaces",
    }),
  description: z.string().min(10),
});

// Interface to make sure that our form state understands what possibilities there are
// for the error object to be
interface CreateTopicFormState {
  errors: {
    name?: string[];
    description?: string[];
    // We created this _form property in case there were other errors that weren't related to the
    // users inputs, but perhaps errors that were related to the DB failing, or the user not being signed in.
    // Just other types of errors that could occur
    _form?: string[]; // Make it _ incase in the future we want a property that says "form". JIC
  };
}

export async function createTopic(
  formState: CreateTopicFormState, // formState that gets sent back if something went wrong
  formData: FormData // data from the form that gets submitted
): Promise<CreateTopicFormState> {
  // Must return the right type. Checkout the formData and useFormState hook with the three types that must match
  const result = createTopicSchema.safeParse({
    // safeParse function
    name: formData.get("name"), // Using formData to get our inputs
    description: formData.get("description"),
  });

  if (!result.success) {
    // If we have some kind of failure, success will be false
    // Then we can return the proper errors
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  // Verifying if the user is even logged in? If not we don't want to create
  // a topic
  const session = await auth();
  if (!session || !session.user) {
    return {
      errors: {
        _form: ["You must be signed in to do this."],
      },
    };
  }

  // We are going to create our topic now assuming all the error
  // handling goes smoothly, BUT we have it around a try catch block
  // because remember, something could go wrong in our database if we
  // get to this point
  let topic: Topic;
  try {
    topic = await db.topic.create({
      data: {
        slug: result.data.name,
        description: result.data.description,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      // We catch an Error if one is thrown
      return {
        errors: {
          _form: [err.message], // and return the proper error to the user
        },
      };
    } else {
      return {
        errors: {
          _form: ["Something went wrong"], // Or if there is some other error, we will tell the user that something went wrong
        },
      };
    }
  }
  // We ensure to revalidatePath (which must come before our redirect.
  //We don't want to redirect, then revalidate because then the user will probably see old data)
  revalidatePath("/");
  redirect(paths.topicShow(topic.slug)); // And then redirect to our home page
}
