import { useEffect, useState } from "react";
import { OrderObject, useOrderByHook } from "../interfaces/useOrderByTypes";
import { AggregatePostObject } from "../interfaces/ForumPosts";

export default function useOrderBy(): useOrderByHook {
  const [order, setOrderValue] = useState<OrderObject>({
    field: "date",
    order: "desc",
  });
  const [posts, setPosts] = useState<null | AggregatePostObject[]>(null);
  function setOrder(value: string): void {
    switch (value) {
      case "authorAsc":
        setOrderValue({
          field: "author",
          order: "asc",
        });
        break;
      case "authorDesc":
        setOrderValue({
          field: "author",
          order: "desc",
        });
        break;
      case "dateAsc":
        setOrderValue({
          field: "date",
          order: "asc",
        });
        break;
      case "dateDesc":
        setOrderValue({
          field: "date",
          order: "desc",
        });
        break;
      default:
        setOrderValue({
          field: "date",
          order: "desc",
        });
        break;
    }
  }
  useEffect((): void => {
    switch (order.field) {
      case "author":
        if (posts) {
          const newPosts: AggregatePostObject[] = posts.sort((a, b) => {
            if (order.order === "asc") {
              return a.author
                .replace(/\D/g, "")
                .localeCompare(b.author.replace(/\D/g, ""));
            } else {
              return b.author
                .replace(/\D/g, "")
                .localeCompare(a.author.replace(/\D/g, ""));
            }
          });
          setPosts(newPosts);
        }
        break;
      case "date":
        if (posts) {
          const newPosts: AggregatePostObject[] = posts.sort((a, b) => {
            if (order.order === "asc") {
              if (new Date(a.date) < new Date(b.date)) return -1;
              if (new Date(a.date) > new Date(b.date)) return 1;
              return 0;
            } else {
              if (new Date(a.date) < new Date(b.date)) return 1;
              if (new Date(a.date) > new Date(b.date)) return -1;
              return 0;
            }
          });
          setPosts(newPosts);
        }
        break;
      default:
        if (posts) {
          const newPosts: AggregatePostObject[] = posts.sort((a, b) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          });
          setPosts(newPosts);
        }
        break;
    }
    setPosts(posts);
  }, [order, posts, setPosts]);

  return { order, setOrder, posts, setPosts };
}
