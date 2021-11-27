import React, { useContext } from "react";
import {
  Page,
  Navbar,
  Toolbar,
  Link,
  Tabs,
  Tab,
  Block,
  Fab,
  Icon,
  FabBackdrop,
  FabButton,
} from "framework7-react";
import CatalogPage from "./catalog.jsx";
import MyChat from "./myChat.jsx";
import { UserContext } from "../components/UserContext";
export default () => {
  const { userContext } = useContext(UserContext);

  return (
    <Page pageContent={false}>
      <Navbar title="GeoChat" backLink="Back"></Navbar>
      <Toolbar labels bottom className="fab-morph-target">
        <Link
          tabLinkActive
          tabLink="#tab-1"
          iconIos="f7:map"
          iconAurora="f7:map"
          iconMd="material:map"
        ></Link>
        <Link
          tabLinkActive
          tabLink="#tab-2"
          iconIos="f7:chat_bubble"
          iconAurora="f7:chat_bubble"
          iconMd="material:chat_bubble_outline"
        ></Link>
        <Link
          tabLinkActive
          tabLink="#tab-3"
          iconIos="f7:gear"
          iconAurora="f7:gear"
          iconMd="material:settings"
        ></Link>
      </Toolbar>

      <Fab
        position="right-bottom"
        slot="fixed"
        morphTo=".toolbar.fab-morph-target"
      >
        <Icon ios="f7:plus" aurora="f7:plus" md="material:add"></Icon>
        <Icon ios="f7:xmark" aurora="f7:xmark" md="material:close"></Icon>
      </Fab>

      <Tabs animated>
        <Tab id="tab-1" className="page-content">
          <Block>
            <Link backLink="Back">Tab 1</Link>

            <Link tabLink="#tab-3">Tab 3</Link>

            <p>Tab 2 content</p>

            <CatalogPage />
            <p>
              Saepe explicabo voluptas ducimus provident, doloremque quo totam
              molestias! Suscipit blanditiis eaque exercitationem praesentium
              reprehenderit, fuga accusamus possimus sed, sint facilis ratione
              quod, qui dignissimos voluptas! Aliquam rerum consequuntur
              deleniti.
            </p>
            <p>
              Totam reprehenderit amet commodi ipsum nam provident doloremque
              possimus odio itaque, est animi culpa modi consequatur reiciendis
              corporis libero laudantium sed eveniet unde delectus a maiores
              nihil dolores? Natus, perferendis.
            </p>
            <p>
              Atque quis totam repellendus omnis alias magnam corrupti, possimus
              aspernatur perspiciatis quae provident consequatur minima
              doloremque blanditiis nihil maxime ducimus earum autem. Magni
              animi blanditiis similique iusto, repellat sed quisquam!
            </p>
            <p>
              Suscipit, facere quasi atque totam. Repudiandae facilis at optio
              atque, rem nam, natus ratione cum enim voluptatem suscipit veniam!
              Repellat, est debitis. Modi nam mollitia explicabo, unde aliquid
              impedit! Adipisci!
            </p>
            <p>
              Deserunt adipisci tempora asperiores, quo, nisi ex delectus vitae
              consectetur iste fugiat iusto dolorem autem. Itaque, ipsa
              voluptas, a assumenda rem, dolorum porro accusantium, officiis
              veniam nostrum cum cumque impedit.
            </p>
            <p>
              Laborum illum ipsa voluptatibus possimus nesciunt ex consequatur
              rem, natus ad praesentium rerum libero consectetur temporibus
              cupiditate atque aspernatur, eaque provident eligendi quaerat ea
              soluta doloremque. Iure fugit, minima facere.
            </p>
          </Block>
        </Tab>
        <Tab id="tab-2" className="page-content" tabActive>
          <Block>
          
          
            <MyChat />
          </Block>
        </Tab>
        <Tab id="tab-3" className="page-content">
          <Block>
            <Link tabLink="#tab-1">Tab 1</Link>
            <p>Tab 3 content</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam
              enim quia molestiae facilis laudantium voluptates obcaecati
              officia cum, sit libero commodi. Ratione illo suscipit temporibus
              sequi iure ad laboriosam accusamus?
            </p>
            <p>
              Saepe explicabo voluptas ducimus provident, doloremque quo totam
              molestias! Suscipit blanditiis eaque exercitationem praesentium
              reprehenderit, fuga accusamus possimus sed, sint facilis ratione
              quod, qui dignissimos voluptas! Aliquam rerum consequuntur
              deleniti.
            </p>
            <p>
              Totam reprehenderit amet commodi ipsum nam provident doloremque
              possimus odio itaque, est animi culpa modi consequatur reiciendis
              corporis libero laudantium sed eveniet unde delectus a maiores
              nihil dolores? Natus, perferendis.
            </p>
            <p>
              Atque quis totam repellendus omnis alias magnam corrupti, possimus
              aspernatur perspiciatis quae provident consequatur minima
              doloremque blanditiis nihil maxime ducimus earum autem. Magni
              animi blanditiis similique iusto, repellat sed quisquam!
            </p>
            <p>
              Suscipit, facere quasi atque totam. Repudiandae facilis at optio
              atque, rem nam, natus ratione cum enim voluptatem suscipit veniam!
              Repellat, est debitis. Modi nam mollitia explicabo, unde aliquid
              impedit! Adipisci!
            </p>
            <p>
              Deserunt adipisci tempora asperiores, quo, nisi ex delectus vitae
              consectetur iste fugiat iusto dolorem autem. Itaque, ipsa
              voluptas, a assumenda rem, dolorum porro accusantium, officiis
              veniam nostrum cum cumque impedit.
            </p>
            <p>
              Laborum illum ipsa voluptatibus possimus nesciunt ex consequatur
              rem, natus ad praesentium rerum libero consectetur temporibus
              cupiditate atque aspernatur, eaque provident eligendi quaerat ea
              soluta doloremque. Iure fugit, minima facere.
            </p>
          </Block>
        </Tab>
      </Tabs>
    </Page>
  );
};
