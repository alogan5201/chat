import React, { useState, useEffect } from "react";
import {
  Page,
  Navbar,
  List,
  ListItem,
  Block,
  Button,
  useStore,
} from "framework7-react";
import store from "../js/store";
import { useLocalStorage } from "../hooks/useLocalStorage";
const Test = () => {
  const products = useStore("products");
  const [name, setName] = useLocalStorage("name", "");

  const addProduct = () => {
    store.dispatch("addProduct", {
      id: "4",
      title: "Apple iPhone 12",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi tempora similique reiciendis, error nesciunt vero, blanditiis pariatur dolor, minima sed sapiente rerum, dolorem corrupti hic modi praesentium unde saepe perspiciatis.",
    });
  };

  /* return {
      count,
      increment: () => setCount(currentCount => currentCount + 1),
      decrement: () => setCount(currentCount => currentCount - 1),
    };
    
    */

  useEffect(() => {
    // storing input name
    localStorage.setItem("name", JSON.stringify(name));
  }, [name]);

  return (
    <Page name="test">
      <Navbar title="Catalog" backLink="Back" />
      <form>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          aria-label="fullname"
        />
        <input type="submit" value="Submit"></input>
      </form>
      <List>
        {products.map((product) => (
          <ListItem
            key={product.id}
            title={product.title}
            link={`/product/${product.id}/`}
          />
        ))}
      </List>
      {products.length === 3 && (
        <Block>
          <Button fill onClick={addProduct}>
            Add Product
          </Button>
        </Block>
      )}
    </Page>
  );
};

export default Test;
