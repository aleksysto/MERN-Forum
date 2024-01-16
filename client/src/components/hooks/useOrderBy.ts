import { useEffect, useState } from "react";
import { OrderObject, useOrderByHook } from "../interfaces/useOrderByTypes";
import { AggregatePostObject } from "../interfaces/ForumPosts";

export default function useOrderBy(): useOrderByHook {
  const [order, setOrderValue] = useState<OrderObject>({
    field: null,
    order: null,
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
          field: null,
          order: null,
        });
        break;
    }
  }
  useEffect((): void => {
    console.log(order.field);
    switch (order.field) {
      case "author":
        if (posts) {
          console.log("if posts author, order:", order);
          const newPosts: AggregatePostObject[] = posts.sort((a, b) => {
            if (order.order === "asc") {
              return a.author.localeCompare(b.author);
            } else {
              return b.author.localeCompare(a.author);
            }
          });
          console.log(newPosts);
          setPosts(newPosts);
        }
        break;
      case "date":
        if (posts) {
          console.log("if posts date, order:", order);
          const newPosts: AggregatePostObject[] = posts.sort((a, b) => {
            if (order.order === "asc") {
              return new Date(a.date).getTime() - new Date(b.date).getTime();
            } else {
              return new Date(b.date).getTime() - new Date(a.date).getTime();
            }
          });
          console.log(newPosts);
          setPosts(newPosts);
        }
        break;
      default:
        break;
    }
    setPosts(posts);
  }, [order, posts, setPosts]);

  return { order, setOrder, posts, setPosts };
}
