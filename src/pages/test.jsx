import React from "react";
import { Page, Navbar, Block, Link, BlockTitle } from "framework7-react";

const Test = (props) => {
  const { f7route, f7router } = props;

  console.log(typeof f7route.query.geohash);
  return (
    <Page>
      <Navbar title="test" backLink="Back" />
      <BlockTitle>Your Current GeoHash is {f7route.query.geohash}</BlockTitle>
      <Block strong>
        <ul>
          <li>
            <b>Url:</b> {f7route.url}
          </li>
          <li>
            <b>Path:</b> {f7route.path}
          </li>

          <li>
            <b>Params:</b>
            <ul>
              {Object.keys(f7route.params).map((key) => (
                <li key={key}>
                  <b>{key}:</b> {f7route.params[key]}
                </li>
              ))}
            </ul>
          </li>
          <li>
            <b>Query:</b>
            <ul>
              {Object.keys(f7route.query).map((key) => (
                <li key={key}>
                  <b>{key}:</b> {f7route.query[key]}
                </li>
              ))}
            </ul>
          </li>
          <li>
            <b>Route:</b> {f7route.route.path}
          </li>
        </ul>
      </Block>
      <Block strong>
        <Link onClick={() => f7router.back()}>Go back via Router API</Link>
      </Block>
    </Page>
  );
};

export default Test;
